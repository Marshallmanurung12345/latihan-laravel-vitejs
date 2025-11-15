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
            // Menambahkan kolom user_id sebagai foreign key ke tabel users
            // onDelete('cascade') akan menghapus semua rencana pengguna jika pengguna tersebut dihapus
            $table->foreignId('user_id')->nullable()->after('id')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            // Hapus foreign key constraint terlebih dahulu
            $table->dropForeign(['user_id']);
            // Kemudian hapus kolomnya
            $table->dropColumn('user_id');
        });
    }
};
