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
        Schema::table('plans', function (Blueprint $table) {
            // Tambahkan baris ini
            $table->string('cover')->nullable()->after('content'); // 'after' opsional, untuk menempatkan kolom setelah 'content'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Tambahkan baris ini untuk rollback
            $table->dropColumn('cover');
        });
    }
};
