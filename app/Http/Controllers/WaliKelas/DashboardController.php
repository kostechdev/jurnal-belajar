<?php

namespace App\Http\Controllers\WaliKelas;

use App\Http\Controllers\Controller;
use App\Models\Kehadiran;
use App\Models\TahunAjaran;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get the authenticated user's wali_kelas relationship through guru
        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();

        $guru = Auth::user()->guru;
        $waliKelas = null;

        if ($guru) {
            // Find the wali_kelas record for the current user and active academic year
            $waliKelas = $guru->waliKelas()
                ->where('tahun_ajaran_id', $tahunAjaranAktif?->id)
                ->with('kelas.siswa')
                ->first();
        }

        if (!$waliKelas || !$waliKelas->kelas) {
            // Handle case where wali kelas or their class is not found
            return Inertia::render('wali-kelas/Dashboard', [
                'namaKelas' => 'Tidak Ditemukan',
                'totalSiswa' => 0,
                'summary' => ['hadir' => 0, 'sakit' => 0, 'izin' => 0, 'alpa' => 0],
                'filters' => ['filter' => $request->input('filter', 'today')],
            ]);
        }

        $kelas = $waliKelas->kelas;
        $totalSiswa = $kelas->siswa->count();

        $filter = $request->input('filter', 'today');

        $query = Kehadiran::query()
            ->join('jurnal_mengajar', 'kehadiran.jurnal_id', '=', 'jurnal_mengajar.jurnal_id')
            ->join('jadwal', 'jurnal_mengajar.jadwal_id', '=', 'jadwal.jadwal_id')
            ->whereIn('kehadiran.siswa_id', $kelas->siswa->pluck('siswa_id'))
            ->where('jadwal.tahun_ajaran_id', $tahunAjaranAktif->id);

        switch ($filter) {
            case 'week':
                $query->whereBetween('kehadiran.tanggal_kehadiran', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereBetween('kehadiran.tanggal_kehadiran', [Carbon::now()->startOfMonth(), Carbon::now()->endOfMonth()]);
                break;
            case 'today':
            default:
                $query->whereDate('kehadiran.tanggal_kehadiran', Carbon::today());
                break;
        }

        $rekapAbsensi = $query->selectRaw('status_kehadiran, count(*) as total')
            ->groupBy('status_kehadiran')
            ->pluck('total', 'status_kehadiran');

        $summary = [
            'hadir' => $rekapAbsensi->get('Hadir', 0),
            'sakit' => $rekapAbsensi->get('Sakit', 0),
            'izin' => $rekapAbsensi->get('Izin', 0),
            'alpa' => $rekapAbsensi->get('Alpa', 0),
        ];

        return Inertia::render('wali-kelas/Dashboard', [
            'namaKelas' => $kelas->nama,
            'totalSiswa' => $totalSiswa,
            'summary' => $summary,
            'filters' => ['filter' => $filter],
        ]);
    }
}
