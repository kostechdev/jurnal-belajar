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
        Schema::create('jurnal_mengajar', function (Blueprint $table) {
            $table->id('jurnal_id');
            $table->foreignId('jadwal_id')->constrained('jadwal', 'jadwal_id');
            $table->date('tanggal');
            $table->text('catatan_mengajar')->nullable();
            $table->enum('status', ['Berlangsung', 'Selesai'])->default('Berlangsung');
            $table->foreignId('diinput_oleh_guru_id')->constrained('guru', 'guru_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jurnal_mengajar');
    }
};
