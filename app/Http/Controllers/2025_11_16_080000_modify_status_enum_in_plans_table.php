<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Daftar status yang valid untuk kolom 'status'
    private $statuses = ['todo', 'pending', 'in_progress', 'completed'];
    private $old_statuses = ['pending', 'in_progress', 'completed'];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Menggunakan raw statement karena change() dengan enum bisa kompleks
        // dan ini adalah cara yang paling andal untuk memodifikasi tipe ENUM.
        // Pastikan Anda sudah mem-backup data sebelum menjalankan ini di production.
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE plans CHANGE COLUMN status status ENUM('todo', 'pending', 'in_progress', 'completed') NOT NULL DEFAULT 'todo'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE plans CHANGE COLUMN status status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending'");
    }
};
