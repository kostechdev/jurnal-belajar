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
        Schema::create('kehadiran', function (Blueprint $table) {
            $table->id('kehadiran_id');
            $table->foreignId('jurnal_id')->constrained('jurnal_mengajar', 'jurnal_id');
            $table->foreignId('siswa_id')->constrained('siswa', 'siswa_id');
            $table->date('tanggal_kehadiran');
            $table->enum('status_kehadiran', ['Hadir', 'Izin', 'Sakit', 'Alpa']);
            $table->text('catatan_per_siswa')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kehadiran');
    }
};
