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
        Schema::table('kurikulum', function (Blueprint $table) {
            $table->string('tempat_lahir')->nullable()->after('nama_lengkap');
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->after('tempat_lahir');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kurikulum', function (Blueprint $table) {
            $table->dropColumn(['tempat_lahir', 'jenis_kelamin']);
        });
    }
};
