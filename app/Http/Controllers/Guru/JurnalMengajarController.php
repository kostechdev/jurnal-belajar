<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\JurnalMengajar;
use App\Models\Kehadiran;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class JurnalMengajarController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guruId = Auth::user()->guru->guru_id;

        $riwayatJurnal = JurnalMengajar::with('jadwal.kelas', 'jadwal.mapel')
            ->whereHas('jadwal', function ($query) use ($guruId) {
                $query->where('guru_id', $guruId);
            })
            ->orderBy('tanggal', 'desc')
            ->paginate(10);

        return Inertia::render('guru/jurnal/Index', [
            'riwayatJurnal' => $riwayatJurnal,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Jadwal $jadwal)
    {
        // Untuk saat ini, kita hanya akan menampilkan data jadwal untuk memastikan
        // rute dan controller berfungsi dengan benar.
        // Kita juga memuat relasi mapel dan kelas untuk data yang lebih lengkap.
        // Muat data jadwal beserta relasi yang diperlukan dan juga daftar siswa di kelas tersebut.
        $jadwal->load(['mapel', 'kelas.siswa']);

        return Inertia::render('guru/jurnal/Form', [
            'jadwal' => $jadwal,
        ]);
    }

    public function store(Request $request, Jadwal $jadwal)
    {
        $request->validate([
            'materi_pembahasan' => 'required|string',
            'absensi' => 'required|array',
            'absensi.*' => 'required|in:hadir,sakit,izin,alpa',
        ]);

        $today = Carbon::today();
        $guru = Auth::user()->guru;

        // Cek apakah jurnal untuk jadwal ini di hari ini sudah ada
        $existingJurnal = JurnalMengajar::where('jadwal_id', $jadwal->jadwal_id)
            ->whereDate('tanggal', $today)
            ->first();

        if ($existingJurnal) {
            return redirect()->route('guru.dashboard')->with('error', 'Jurnal untuk jadwal ini sudah diisi hari ini.');
        }

        try {
            DB::beginTransaction();

            // 1. Simpan Jurnal Mengajar
            $jurnal = JurnalMengajar::create([
                'jadwal_id' => $jadwal->jadwal_id,
                'tanggal' => $today,
                'catatan_mengajar' => $request->materi_pembahasan,
                'status' => 'Selesai', // Langsung tandai selesai
                'diinput_oleh_guru_id' => $guru->guru_id,
            ]);

            // 2. Simpan Kehadiran Siswa
            foreach ($request->absensi as $siswa_id => $status) {
                Kehadiran::create([
                    'jurnal_id' => $jurnal->jurnal_id,
                    'siswa_id' => $siswa_id,
                    'tanggal_kehadiran' => $today,
                    'status_kehadiran' => ucfirst($status), // 'hadir' -> 'Hadir'
                ]);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menyimpan jurnal. Terjadi kesalahan: ' . $e->getMessage());
        }

        return redirect()->route('guru.dashboard')->with('success', 'Jurnal mengajar berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(JurnalMengajar $jurnal)
    {
        // Authorization check
        $this->authorize('view', $jurnal);

        // Eager load necessary relationships
        $jurnal->load(['jadwal.mapel', 'jadwal.kelas', 'kehadiran.siswa']);

        $kehadiran = $jurnal->kehadiran;

        $rekap = [
            'total' => $kehadiran->count(),
            'hadir' => $kehadiran->where('status_kehadiran', 'Hadir')->count(),
            'sakit' => $kehadiran->where('status_kehadiran', 'Sakit')->count(),
            'izin' => $kehadiran->where('status_kehadiran', 'Izin')->count(),
            'alpa' => $kehadiran->where('status_kehadiran', 'Alpa')->count(),
        ];

        return Inertia::render('guru/jurnal/Show', [
            'jurnal' => $jurnal,
            'rekapKehadiran' => $rekap,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(JurnalMengajar $jurnal)
    {
        if (Auth::user()->guru->guru_id !== $jurnal->jadwal->guru_id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah jurnal ini.');
        }

        // Muat semua relasi yang diperlukan untuk form
        $jurnal->load(['jadwal.mapel', 'jadwal.kelas.siswa', 'kehadiran']);

        return Inertia::render('guru/jurnal/Form', [
            'jurnal' => $jurnal,
            'jadwal' => $jurnal->jadwal, // Kirim juga jadwal untuk konsistensi form
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JurnalMengajar $jurnal)
    {
        if (Auth::user()->guru->guru_id !== $jurnal->jadwal->guru_id) {
            abort(403, 'Anda tidak memiliki akses untuk mengubah jurnal ini.');
        }

        $request->validate([
            'materi_pembahasan' => 'required|string',
            'absensi' => 'required|array',
            'absensi.*' => 'required|in:hadir,sakit,izin,alpa',
        ]);

        try {
            DB::beginTransaction();

            // 1. Update Jurnal Mengajar
            $jurnal->update([
                'catatan_mengajar' => $request->materi_pembahasan,
            ]);

            // 2. Update Kehadiran Siswa
            foreach ($request->absensi as $siswa_id => $status) {
                Kehadiran::updateOrCreate(
                    [
                        'jurnal_id' => $jurnal->jurnal_id,
                        'siswa_id' => $siswa_id,
                    ],
                    [
                        'tanggal_kehadiran' => $jurnal->tanggal,
                        'status_kehadiran' => ucfirst($status),
                    ]
                );
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal memperbarui jurnal. Terjadi kesalahan: ' . $e->getMessage());
        }

        return redirect()->route('guru.jurnal.show', $jurnal->jurnal_id)->with('success', 'Jurnal mengajar berhasil diperbarui.');
    }
}
