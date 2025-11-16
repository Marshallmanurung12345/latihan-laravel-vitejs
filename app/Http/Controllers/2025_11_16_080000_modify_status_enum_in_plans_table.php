<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
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
        Schema::table('plans', function (Blueprint $table) {
            // Menggunakan change() untuk memodifikasi kolom.
            // Ini lebih portabel daripada raw SQL statement.
            $table->enum('status', $this->statuses)->default('todo')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->enum('status', $this->old_statuses)->default('pending')->change();
        });
    }
};
