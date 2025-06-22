<?php

namespace App\Http\Controllers\WaliKelas;

use App\Http\Controllers\Controller;
use App\Models\Kelas;
use App\Models\TahunAjaran;
use App\Models\WaliKelas;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Kehadiran;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AbsensiController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $tahunAjaranAktif = TahunAjaran::where('status', 'Aktif')->first();
        $filter = $request->input('filter', 'semester');

        if (!$tahunAjaranAktif) {
            return inertia('WaliKelas/Absensi/Index', [
                'error' => 'Tahun ajaran aktif tidak ditemukan.',
                'kelas' => null,
                'rekapSiswa' => [],
                'filters' => ['filter' => $filter],
            ]);
        }

        $guru = $user->guru;

        if (!$guru) {
            return inertia('WaliKelas/Absensi/Index', [
                'error' => 'Data guru untuk pengguna ini tidak ditemukan. Pastikan akun Anda sudah terhubung dengan data guru.',
                'kelas' => null,
                'rekapSiswa' => [],
                'filters' => ['filter' => $filter],
            ]);
        }

        $waliKelas = WaliKelas::where('guru_id', $guru->guru_id)
            ->where('tahun_ajaran_id', $tahunAjaranAktif->id)
            ->first();

        if (!$waliKelas) {
            return inertia('WaliKelas/Absensi/Index', [
                'error' => 'Anda tidak terdaftar sebagai wali kelas untuk tahun ajaran ini.',
                'kelas' => null,
                'rekapSiswa' => [],
                'filters' => ['filter' => $filter],
            ]);
        }

        $kelas = $waliKelas->kelas;
        $siswaDiKelas = $kelas->siswa()->orderBy('nama_lengkap')->get();

        $now = Carbon::now();



        [$tanggalMulai, $tanggalSelesai] = match ($filter) {
            'harian' => [$now->copy()->startOfDay(), $now->copy()->endOfDay()],
            'mingguan' => [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()],
            'bulanan' => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
            'semester' => (function () use ($tahunAjaranAktif) {
                $tahunParts = explode('/', $tahunAjaranAktif->tahun_ajaran);
                // Fallback jika format tahun ajaran tidak valid
                if (count($tahunParts) < 2) {
                    return [Carbon::now()->subMonths(6), Carbon::now()];
                }

                if ($tahunAjaranAktif->semester === 'Ganjil') {
                    $tahunMulai = (int)$tahunParts[0];
                    return [
                        Carbon::create($tahunMulai, 7, 1)->startOfDay(), // 1 Juli
                        Carbon::create($tahunMulai, 12, 31)->endOfDay(), // 31 Desember
                    ];
                } else { // Genap
                    $tahunSelesai = (int)$tahunParts[1];
                    return [
                        Carbon::create($tahunSelesai, 1, 1)->startOfDay(), // 1 Januari
                        Carbon::create($tahunSelesai, 6, 30)->endOfDay(), // 30 Juni
                    ];
                }
            })(),
            default => [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()],
        };

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

        return inertia('WaliKelas/Absensi/Index', [
            'kelas' => $kelas,
            'rekapSiswa' => $rekapSiswa,
            'filters' => ['filter' => $filter],
        ]);
    }
}
