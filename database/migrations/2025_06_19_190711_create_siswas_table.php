<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('siswa', function (Blueprint $table) {
            $table->id('siswa_id');
            $table->string('NIS')->unique();
            $table->string('NISN')->unique()->nullable();
            $table->string('nama_lengkap');
            $table->string('tempat_lahir')->nullable();
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['Laki-laki', 'Perempuan']);
            $table->text('alamat')->nullable();
            $table->string('nomor_telepon_siswa')->nullable();
            $table->string('nama_wali_murid')->nullable();
            $table->string('nomor_telepon_wali_murid')->nullable();
            $table->foreignId('kelas_id')->nullable()->constrained('kelas', 'kelas_id');
            $table->enum('status_siswa', ['Aktif', 'Lulus', 'Pindah', 'Keluar'])->default('Aktif');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswa');
    }
};
