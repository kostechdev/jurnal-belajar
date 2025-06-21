<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\WaliKelas;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class WaliKelasController extends Controller
{
    public function index()
    {
        $waliKelas = WaliKelas::with(['guru', 'kelas', 'tahunAjaran'])->latest()->paginate(10);

        return Inertia::render('kurikulum/walikelas/Index', [
            'waliKelas' => $waliKelas,
        ]);
    }

    public function create()
    {
        // Asumsi kita menggunakan tahun ajaran terakhir sebagai yang aktif
        $activeTahunAjaran = TahunAjaran::latest()->first();

        if (!$activeTahunAjaran) {
            // Handle jika tidak ada tahun ajaran sama sekali
            return redirect()->route('kurikulum.walikelas.index')->with('error', 'Tidak ada data Tahun Ajaran. Silakan tambahkan terlebih dahulu.');
        }

        // Ambil ID guru dan kelas yang sudah menjadi wali kelas di tahun ajaran aktif
        $assignedGuruIds = WaliKelas::where('tahun_ajaran_id', $activeTahunAjaran->id)->pluck('guru_id');
        $assignedKelasIds = WaliKelas::where('tahun_ajaran_id', $activeTahunAjaran->id)->pluck('kelas_id');

        return Inertia::render('kurikulum/walikelas/Form', [
            'gurus' => Guru::whereNotIn('guru_id', $assignedGuruIds)->get(),
            'kelas' => Kelas::whereNotIn('kelas_id', $assignedKelasIds)->get(),
            'tahunAjarans' => TahunAjaran::all(),
            'activeTahunAjaranId' => $activeTahunAjaran->id,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'guru_id' => [
                'required',
                'exists:guru,guru_id',
                Rule::unique('wali_kelas')->where(function ($query) use ($request) {
                    return $query->where('tahun_ajaran_id', $request->tahun_ajaran_id);
                }),
            ],
            'kelas_id' => [
                'required',
                'exists:kelas,kelas_id',
                Rule::unique('wali_kelas')->where(function ($query) use ($request) {
                    return $query->where('tahun_ajaran_id', $request->tahun_ajaran_id);
                }),
            ],
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
        ], [
            'guru_id.unique' => 'Guru ini sudah menjadi wali kelas di tahun ajaran yang dipilih.',
            'kelas_id.unique' => 'Kelas ini sudah memiliki wali kelas di tahun ajaran yang dipilih.',
        ]);

        WaliKelas::create($request->all());

        return redirect()->route('kurikulum.walikelas.index')->with('success', 'Wali kelas berhasil ditetapkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    public function edit(WaliKelas $waliKelas)
    {
        return Inertia::render('kurikulum/walikelas/Form', [
            'waliKelas' => $waliKelas->load(['guru', 'kelas', 'tahunAjaran']),
            'gurus' => Guru::orderBy('nama_lengkap')->get(),
            'kelas' => Kelas::orderBy('nama_kelas')->get(),
            'tahunAjarans' => TahunAjaran::orderBy('tahun_ajaran')->get(),
        ]);
    }

    public function update(Request $request, WaliKelas $waliKelas)
    {
        $request->validate([
            'guru_id' => [
                'required',
                'exists:guru,guru_id',
                Rule::unique('wali_kelas')->where(function ($query) use ($request) {
                    return $query->where('tahun_ajaran_id', $request->tahun_ajaran_id);
                })->ignore($waliKelas->wali_kelas_id, 'wali_kelas_id'),
            ],
            'kelas_id' => [
                'required',
                'exists:kelas,kelas_id',
                Rule::unique('wali_kelas')->where(function ($query) use ($request) {
                    return $query->where('tahun_ajaran_id', $request->tahun_ajaran_id);
                })->ignore($waliKelas->wali_kelas_id, 'wali_kelas_id'),
            ],
            'tahun_ajaran_id' => 'required|exists:tahun_ajaran,id',
        ], [
            'guru_id.unique' => 'Guru ini sudah menjadi wali kelas di tahun ajaran yang dipilih.',
            'kelas_id.unique' => 'Kelas ini sudah memiliki wali kelas di tahun ajaran yang dipilih.',
        ]);

        $waliKelas->update($request->all());

        return redirect()->route('kurikulum.walikelas.index')->with('success', 'Penetapan wali kelas berhasil diperbarui.');
    }

    public function destroy(WaliKelas $waliKelas)
    {
        $waliKelas->delete();

        return redirect()->route('kurikulum.walikelas.index')->with('success', 'Penetapan wali kelas berhasil dihapus.');
    }
}
