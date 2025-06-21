<?php

namespace Database\Seeders;

use App\Models\Mapel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MapelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $mapels = [
            ['kode_mapel' => 'NKN-01', 'nama_mapel' => 'Navigasi Elektronik', 'deskripsi' => 'Mempelajari penggunaan alat navigasi modern di kapal.'],
            ['kode_mapel' => 'NKN-02', 'nama_mapel' => 'Hukum Maritim', 'deskripsi' => 'Dasar-dasar hukum dan peraturan dalam pelayaran niaga.'],
            ['kode_mapel' => 'TKN-01', 'nama_mapel' => 'Mesin Diesel Kapal', 'deskripsi' => 'Perawatan dan perbaikan mesin diesel utama di kapal.'],
            ['kode_mapel' => 'TKN-02', 'nama_mapel' => 'Sistem Kelistrikan Kapal', 'deskripsi' => 'Mempelajari instalasi dan pemeliharaan sistem listrik kapal.'],
            ['kode_mapel' => 'TMI-01', 'nama_mapel' => 'Gambar Teknik Mesin', 'deskripsi' => 'Teknik menggambar dan membaca gambar kerja mesin industri.'],
            ['kode_mapel' => 'TMI-02', 'nama_mapel' => 'Teknik Pengelasan', 'deskripsi' => 'Dasar-dasar dan praktik teknik pengelasan untuk industri.'],
            ['kode_mapel' => 'MP-01', 'nama_mapel' => 'Kearsipan Digital', 'deskripsi' => 'Manajemen arsip dan dokumen secara digital untuk perkantoran.'],
            ['kode_mapel' => 'MP-02', 'nama_mapel' => 'Korespondensi Bisnis', 'deskripsi' => 'Praktik pembuatan surat dan komunikasi bisnis formal.'],
            ['kode_mapel' => 'UMUM-01', 'nama_mapel' => 'Bahasa Inggris Maritim', 'deskripsi' => 'Bahasa Inggris khusus untuk komunikasi di lingkungan maritim.'],
            ['kode_mapel' => 'UMUM-02', 'nama_mapel' => 'Pendidikan Agama', 'deskripsi' => 'Pendidikan keagamaan dan budi pekerti.'],
        ];

        foreach ($mapels as $mapel) {
            Mapel::create($mapel);
        }
    }
}
