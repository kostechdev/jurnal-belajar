<?php

use App\Http\Controllers\Kurikulum\DashboardController;
use App\Http\Controllers\Kurikulum\GuruController;
use App\Http\Controllers\Kurikulum\PenggunaController;
use App\Http\Controllers\Kurikulum\KelasController;
use App\Http\Controllers\Kurikulum\MapelController;
use App\Http\Controllers\Kurikulum\SiswaController;
use App\Http\Controllers\Kurikulum\JadwalController;
use App\Http\Controllers\Kurikulum\TahunAjaranController;
use App\Http\Controllers\Kurikulum\WaliKelasController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Rute ini akan mengarahkan pengguna ke dasbor yang sesuai dengan peran mereka.
    Route::get('dashboard', function () {
        $role = auth()->user()->role;
        $routeName = str_replace('_', '-', $role) . '.dashboard';
        return redirect()->route($routeName);
    })->name('dashboard');

    // Kurikulum Routes
    Route::prefix('kurikulum')->name('kurikulum.')->middleware('role:kurikulum')->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

        // CRUD Pengguna
        Route::resource('pengguna', PenggunaController::class);

        // CRUD Guru
        Route::resource('guru', GuruController::class);

        // CRUD Wali Kelas
        Route::resource('walikelas', WaliKelasController::class)->except(['show']);

        // CRUD Tahun Ajaran
        Route::resource('tahun-ajaran', TahunAjaranController::class)->except(['show']);

        // CRUD Kelas
        Route::resource('kelas', KelasController::class)->except(['show']);

        // CRUD Mapel
        Route::resource('mapel', MapelController::class)->except(['show']);

        // CRUD Siswa
        Route::resource('siswa', SiswaController::class)->except(['show']);

        Route::get('jadwal/export-excel/{kelas}', [JadwalController::class, 'exportExcel'])->name('jadwal.export-excel');
        Route::resource('jadwal', JadwalController::class)->except(['show']);
    });

    // Guru Routes
    Route::prefix('guru')->name('guru.')->middleware('role:guru')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('guru/Dashboard');
        })->name('dashboard');
    });

    // Wali Kelas Routes
    Route::prefix('wali-kelas')->name('wali-kelas.')->middleware('role:wali_kelas')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('wali-kelas/Dashboard');
        })->name('dashboard');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
