<?php

namespace App\Http\Controllers\Guru;

use App\Http\Controllers\Controller;
use App\Models\Jadwal;
use App\Models\TahunAjaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;


class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $guru = $user->guru;

        if (!$guru) {
            // Handle jika user tidak memiliki relasi guru, mungkin redirect atau tampilkan error
            // Untuk saat ini, kita kembalikan halaman dengan jadwal kosong
            return Inertia::render('guru/Dashboard', [
                'jadwalHariIni' => [],
            ]);
        }

        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();

        if (!$tahunAjaranAktif) {
            return Inertia::render('guru/Dashboard', [
                'jadwalHariIni' => [],
                'error' => 'Tidak ada tahun ajaran yang aktif.'
            ]);
        }

        // Ambil nama hari dari request untuk testing, jika tidak ada, gunakan hari ini.
        // Pastikan nama hari diawali huruf kapital, contoh: 'Senin', 'Selasa'.
        $namaHari = $request->input('hari', Carbon::now()->locale('id')->dayName);

        $jadwalHariIni = Jadwal::where('guru_id', $guru ? $guru->guru_id : null)
            ->where('tahun_ajaran_id', $tahunAjaranAktif ? $tahunAjaranAktif->id : null)
            ->where('hari', $namaHari)
            ->with(['mapel', 'kelas'])
            ->orderBy('jam_mulai', 'asc')
            ->get()
            ->map(function ($jadwal) {
                // Cek apakah sudah ada jurnal untuk jadwal ini pada hari ini
                $jurnal = \App\Models\JurnalMengajar::where('jadwal_id', $jadwal->jadwal_id)
                    ->whereDate('tanggal', now())
                    ->first();

                $jadwal->sudah_diisi = (bool) $jurnal;
                $jadwal->jurnal_id = $jurnal?->jurnal_id;
                return $jadwal;
            });

        return Inertia::render('guru/Dashboard', [
            'jadwalHariIni' => $jadwalHariIni,
        ]);
    }
}
