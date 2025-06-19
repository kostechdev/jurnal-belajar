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
        Schema::create('kurikulum', function (Blueprint $table) {
            $table->id('kurikulum_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade')->unique();
            $table->string('NIP_NIDN')->unique();
            $table->string('nama_lengkap');
            $table->text('alamat')->nullable();
            $table->string('nomor_telepon')->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kurikulum');
    }
};
