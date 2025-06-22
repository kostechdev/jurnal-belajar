<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Step 1: Update existing 'wali_kelas' roles to 'guru'
        DB::table('users')->where('role', 'wali_kelas')->update(['role' => 'guru']);

        // Step 2: Modify the enum column to only include 'kurikulum' and 'guru'
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['kurikulum', 'guru'])->default('guru')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert the enum change. Note: This doesn't revert the data change.
            $table->enum('role', ['kurikulum', 'guru', 'wali_kelas'])->default('guru')->change();
        });
    }
};
