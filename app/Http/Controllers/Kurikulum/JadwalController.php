<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Jadwal;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use App\Exports\JadwalExport;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class JadwalController extends Controller
{
    public function index()
    {
        return Inertia::render('kurikulum/jadwal/Index', [
            'kelas' => Kelas::orderBy('tingkat')->orderBy('jurusan')->orderBy('rombel')->get(),
        ]);
    }

    public function create()
    {
        // Not used, schedule is managed via edit
        return redirect()->route('kurikulum.jadwal.index');
    }

    public function store(Request $request)
    {
        // Not used, schedule is managed via update
        return redirect()->route('kurikulum.jadwal.index');
    }

    public function edit(Kelas $jadwal) // Route model binding uses 'jadwal' as parameter name
    {
        $kelas = $jadwal;
        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();

        if (!$tahunAjaranAktif) {
            return redirect()->route('kurikulum.jadwal.index')
                ->with('error', 'Tidak ada tahun ajaran yang aktif. Silakan aktifkan terlebih dahulu.');
        }

        $jadwalData = Jadwal::with(['mapel', 'guru'])
            ->where('kelas_id', $kelas->kelas_id)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->orderBy('jam_mulai')
            ->get()
            ->groupBy('hari');

        return Inertia::render('kurikulum/jadwal/Form', [
            'kelas' => $kelas,
            'jadwalData' => $jadwalData,
            'mapel' => Mapel::orderBy('nama_mapel')->get(),
            'guru' => Guru::orderBy('nama_lengkap')->get(),
            'hari' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
            'tahunAjaranAktif' => $tahunAjaranAktif,
        ]);
    }

    public function update(Request $request, Kelas $jadwal) // Route model binding uses 'jadwal' as parameter name
    {
        $kelas = $jadwal;
        $request->validate([
            'jadwal' => 'present|array',
            'jadwal.*' => 'array',
            'jadwal.*.*.mapel_id' => 'required|exists:mapel,mapel_id',
            'jadwal.*.*.guru_id' => 'required|exists:guru,guru_id',
            'jadwal.*.*.jam_mulai' => 'required|date_format:H:i',
            'jadwal.*.*.jam_selesai' => 'required|date_format:H:i|after:jadwal.*.*.jam_mulai',
        ]);

        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->firstOrFail();
        $jadwalData = $request->input('jadwal');

        try {
            DB::beginTransaction();

            Jadwal::where('kelas_id', $kelas->kelas_id)
                ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
                ->delete();

            foreach ($jadwalData as $hari => $entries) {
                if (empty($entries)) continue;

                foreach ($entries as $entry) {
                    $isConflict = Jadwal::where('guru_id', $entry['guru_id'])
                        ->where('hari', $hari)
                        ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
                        ->where(function ($query) use ($entry) {
                            $query->where('jam_mulai', '<', $entry['jam_selesai'])
                                  ->where('jam_selesai', '>', $entry['jam_mulai']);
                        })->exists();

                    if ($isConflict) {
                        $guru = Guru::find($entry['guru_id']);
                        throw new \Exception("Jadwal bentrok untuk guru {$guru->nama_lengkap} pada hari {$hari} jam {$entry['jam_mulai']}-{$entry['jam_selesai']}.");
                    }

                    Jadwal::create([
                        'kelas_id' => $kelas->kelas_id,
                        'mapel_id' => $entry['mapel_id'],
                        'guru_id' => $entry['guru_id'],
                        'hari' => $hari,
                        'jam_mulai' => $entry['jam_mulai'],
                        'jam_selesai' => $entry['jam_selesai'],
                        'tahun_ajaran_id' => $tahunAjaranAktif->id,
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', $e->getMessage());
        }

        return redirect()->route('kurikulum.jadwal.index')->with('success', "Jadwal untuk kelas {$kelas->tingkat} {$kelas->jurusan} {$kelas->rombel} berhasil diperbarui.");
    }

    public function destroy(string $id)
    {
        // Individual schedule entries are deleted via update method
        return redirect()->route('kurikulum.jadwal.index');
    }

    public function exportExcel(Kelas $kelas)
    {
        $filename = 'jadwal-pelajaran-' . str_replace(' ', '-', strtolower("{$kelas->tingkat}-{$kelas->jurusan}-{$kelas->rombel}")) . '.xlsx';

        return Excel::download(new JadwalExport($kelas), $filename);
    }
}
