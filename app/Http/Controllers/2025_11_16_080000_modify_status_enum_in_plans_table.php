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
        // Mengubah kolom enum untuk menambahkan 'todo'
        // Sintaks ini kompatibel dengan MySQL dan PostgreSQL
        DB::statement("ALTER TABLE plans CHANGE COLUMN status status ENUM('todo', 'pending', 'in_progress', 'completed') NOT NULL DEFAULT 'todo'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Mengembalikan ke definisi enum sebelumnya jika diperlukan
        DB::statement("ALTER TABLE plans CHANGE COLUMN status status ENUM('pending', 'in_progress', 'completed') NOT NULL DEFAULT 'pending'");
    }
};

