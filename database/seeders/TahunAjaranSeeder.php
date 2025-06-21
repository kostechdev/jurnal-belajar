<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TahunAjaran;

class TahunAjaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        TahunAjaran::firstOrCreate(
            [
                'tahun_ajaran' => '2024/2025',
                'semester' => 'Ganjil'
            ],
            ['status' => 'Aktif']
        );
    }
}
