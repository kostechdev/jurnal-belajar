<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TahunAjaran;
use App\Models\Kelas;

class KelasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tahunAjaran = TahunAjaran::where('aktif', true)->first();

        if ($tahunAjaran) {
            $jurusans = [
                'Neutika Kapal Niaga',
                'Teknika Kapal Niaga',
                'Teknik Mekanik Industri',
                'Menejemen Perkantoran',
            ];

            foreach ($jurusans as $jurusan) {
                Kelas::firstOrCreate(
                    [
                        'nama_kelas' => 'X ' . $jurusan,
                        'tahun_ajaran_id' => $tahunAjaran->id,
                    ],
                    [
                        'jurusan' => $jurusan,
                    ]
                );
            }
        }
    }
}
