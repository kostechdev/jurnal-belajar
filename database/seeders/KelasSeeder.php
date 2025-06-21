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
        $jurusans = [
            'Nautika Kapal Niaga',
            'Teknika Kapal Niaga',
            'Teknik Mekanik Industri (TEKNIK MESIN)',
            'Menejemen Perkantoran',
        ];

        $tingkats = ['X', 'XI', 'XII'];
        $rombels = ['1', '2', '3'];

        foreach ($tingkats as $tingkat) {
            foreach ($jurusans as $jurusan) {
                foreach ($rombels as $rombel) {
                    Kelas::create([
                        'tingkat' => $tingkat,
                        'jurusan' => $jurusan,
                        'rombel' => $rombel,
                    ]);
                }
            }
        }
    }
}
