<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Guru;
use App\Models\Kurikulum;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::transaction(function () {
            // Kurikulum
            $kurikulumUser = User::firstOrCreate(
                ['email' => 'kurikulum@smkn4cilegon.sch.id'],
                [
                    'password' => Hash::make('123'),
                    'role' => 'kurikulum'
                ]
            );
            if ($kurikulumUser->wasRecentlyCreated) {
                Kurikulum::create([
                    'user_id' => $kurikulumUser->id,
                    'NIP_NIDN' => 'K123456789',
                    'nama_lengkap' => 'Staf Kurikulum'
                ]);
            }

            // Guru
            $guruUser = User::firstOrCreate(
                ['email' => 'guru@smkn4cilegon.sch.id'],
                [
                    'password' => Hash::make('123'),
                    'role' => 'guru'
                ]
            );
            if ($guruUser->wasRecentlyCreated) {
                Guru::create([
                    'user_id' => $guruUser->id, 
                    'nip' => '1234567890',
                    'nama_lengkap' => 'Guru Pengajar'
                ]);
            }

            // Wali Kelas (yang juga seorang Guru)
            $waliKelasUser = User::firstOrCreate(
                ['email' => 'walikelas@smkn4cilegon.sch.id'],
                [
                    'password' => Hash::make('123'),
                    'role' => 'guru'
                ]
            );
            if ($waliKelasUser->wasRecentlyCreated) {
                Guru::create([
                    'user_id' => $waliKelasUser->id, 
                    'NIP' => '0987654321', // Kolom diubah ke NIP
                    'nama_lengkap' => 'Wali Kelas'
                ]);
            }
        });
    }
}
