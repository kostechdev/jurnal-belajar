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
        Schema::create('kelas', function (Blueprint $table) {
            $table->id('kelas_id');
            $table->enum('tingkat', ['X', 'XI', 'XII']);
            $table->string('jurusan');
            $table->string('rombel');
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['tingkat', 'jurusan', 'rombel']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelas');
    }
};
