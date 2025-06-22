<?php

namespace App\Http\Controllers\WaliKelas;

use App\Http\Controllers\Controller;
use App\Models\Kehadiran;
use App\Models\TahunAjaran;
use App\Models\WaliKelas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class LaporanController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $guru = $user->guru;

        if (!$guru) {
            return Inertia::render('WaliKelas/Laporan/Index', [
                'error' => 'Data guru tidak ditemukan untuk pengguna ini.',
                'rekapSiswa' => [],
                'kelas' => null,
                'filters' => [],
            ]);
        }

        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();
        if (!$tahunAjaranAktif) {
            return Inertia::render('WaliKelas/Laporan/Index', [
                'error' => 'Tidak ada tahun ajaran yang aktif.',
                'rekapSiswa' => [],
                'kelas' => null,
                'filters' => [],
            ]);
        }

        $waliKelas = WaliKelas::where('guru_id', $guru->guru_id)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->first();

        if (!$waliKelas) {
            return Inertia::render('WaliKelas/Laporan/Index', [
                'error' => 'Anda tidak terdaftar sebagai wali kelas untuk tahun ajaran ini.',
                'rekapSiswa' => [],
                'kelas' => null,
                'filters' => [],
            ]);
        }

        $kelas = $waliKelas->kelas;
        $siswaDiKelas = $kelas->siswa()->orderBy('nama_lengkap')->get();

        $filterBulan = $request->input('bulan', now()->format('Y-m'));
        $tanggal = Carbon::parse($filterBulan);
        $tanggalMulai = $tanggal->copy()->startOfMonth();
        $tanggalSelesai = $tanggal->copy()->endOfMonth();

        $rekapSiswa = $siswaDiKelas->map(function ($siswa) use ($tahunAjaranAktif, $tanggalMulai, $tanggalSelesai) {
            $kehadiran = Kehadiran::query()
                ->join('jurnal_mengajar', 'kehadiran.jurnal_id', '=', 'jurnal_mengajar.jurnal_id')
                ->join('jadwal', 'jurnal_mengajar.jadwal_id', '=', 'jadwal.jadwal_id')
                ->where('kehadiran.siswa_id', $siswa->siswa_id)
                ->where('jadwal.tahun_ajaran_id', $tahunAjaranAktif->id)
                ->whereBetween('kehadiran.tanggal_kehadiran', [$tanggalMulai, $tanggalSelesai])
                ->select('kehadiran.*')
                ->get();

            return [
                'siswa_id' => $siswa->siswa_id,
                'nama_lengkap' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'stats' => [
                    'hadir' => $kehadiran->where('status_kehadiran', 'Hadir')->count(),
                    'sakit' => $kehadiran->where('status_kehadiran', 'Sakit')->count(),
                    'izin' => $kehadiran->where('status_kehadiran', 'Izin')->count(),
                    'alpa' => $kehadiran->where('status_kehadiran', 'Alpa')->count(),
                ],
            ];
        });

        return Inertia::render('WaliKelas/Laporan/Index', [
            'rekapSiswa' => $rekapSiswa,
            'kelas' => $kelas->only('nama_kelas'),
            'filters' => ['bulan' => $filterBulan],
            'error' => null
        ]);
    }

    public function export(Request $request)
    {
        $user = Auth::user();
        $guru = $user->guru;
        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();
        $waliKelas = WaliKelas::where('guru_id', $guru->guru_id)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->first();

        if (!$waliKelas) {
            abort(403, 'Anda tidak memiliki akses sebagai wali kelas.');
        }

        $kelas = $waliKelas->kelas;
        $siswaDiKelas = $kelas->siswa()->orderBy('nama_lengkap')->get();

        $filterBulan = $request->input('bulan', now()->format('Y-m'));
        $tanggal = Carbon::parse($filterBulan);
        $tanggalMulai = $tanggal->copy()->startOfMonth();
        $tanggalSelesai = $tanggal->copy()->endOfMonth();

        $rekapSiswa = $siswaDiKelas->map(function ($siswa) use ($tahunAjaranAktif, $tanggalMulai, $tanggalSelesai) {
            $kehadiran = Kehadiran::query()
                ->join('jurnal_mengajar', 'kehadiran.jurnal_id', '=', 'jurnal_mengajar.jurnal_id')
                ->join('jadwal', 'jurnal_mengajar.jadwal_id', '=', 'jadwal.jadwal_id')
                ->where('kehadiran.siswa_id', $siswa->siswa_id)
                ->where('jadwal.tahun_ajaran_id', $tahunAjaranAktif->id)
                ->whereBetween('kehadiran.tanggal_kehadiran', [$tanggalMulai, $tanggalSelesai])
                ->select('kehadiran.*')
                ->get();

            return [
                'nama_lengkap' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'hadir' => $kehadiran->where('status_kehadiran', 'Hadir')->count(),
                'sakit' => $kehadiran->where('status_kehadiran', 'Sakit')->count(),
                'izin' => $kehadiran->where('status_kehadiran', 'Izin')->count(),
                'alpa' => $kehadiran->where('status_kehadiran', 'Alpa')->count(),
            ];
        });

        $data = [
            'rekapSiswa' => $rekapSiswa,
            'nama_kelas' => $kelas->nama_kelas,
            'bulan' => $tanggal->translatedFormat('F Y'),
            'wali_kelas' => $guru->nama_lengkap,
            'tahun_ajaran' => $tahunAjaranAktif->tahun_ajaran . ' Semester ' . $tahunAjaranAktif->semester,
        ];

        $pdf = Pdf::loadView('pdf.laporan-absensi', $data);
        
        return $pdf->stream('laporan-absensi-' . $kelas->nama_kelas . '-' . $filterBulan . '.pdf');
    }
}
