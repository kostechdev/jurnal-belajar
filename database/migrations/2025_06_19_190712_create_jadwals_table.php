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
        Schema::create('jadwal', function (Blueprint $table) {
            $table->id('jadwal_id');
            $table->foreignId('kelas_id')->constrained('kelas', 'kelas_id');
            $table->foreignId('mapel_id')->constrained('mapel', 'mapel_id');
            $table->foreignId('guru_id')->constrained('guru', 'guru_id');
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'])->nullable();
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jadwal');
    }
};
