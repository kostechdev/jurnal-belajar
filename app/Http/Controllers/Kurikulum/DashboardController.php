<?php

namespace App\Http\Controllers\Kurikulum;

use App\Http\Controllers\Controller;
use App\Models\Guru;
use App\Models\Kelas;
use App\Models\Mapel;
use App\Models\Siswa;
use App\Models\JurnalMengajar;
use App\Models\Jadwal;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'jumlah_guru' => Guru::count(),
            'jumlah_siswa' => Siswa::count(),
            'jumlah_kelas' => Kelas::count(),
            'jumlah_mapel' => Mapel::count(),
        ];

        $today = Carbon::now()->locale('id');
        $dayName = $today->dayName;

        $jadwalHariIniCount = Jadwal::where('hari', $dayName)->distinct('guru_id')->count();
        $jurnalTerisiCount = JurnalMengajar::whereDate('tanggal', $today->toDateString())->distinct('guru_id')->count();

        $jurnalStats = [
            'total' => $jadwalHariIniCount,
            'terisi' => $jurnalTerisiCount,
        ];

        $recentActivities = JurnalMengajar::with(['jadwal.guru', 'jadwal.mapel', 'jadwal.kelas'])
            ->whereHas('jadwal.guru') // Memastikan guru masih ada
            ->latest('created_at')
            ->take(5)
            ->get();

        return Inertia::render('kurikulum/Dashboard', [
            'stats' => $stats,
            'jurnalStats' => $jurnalStats,
            'recentActivities' => $recentActivities,
        ]);
    }
}
