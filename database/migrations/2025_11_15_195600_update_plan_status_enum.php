<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    public function up(): void
    {
        // Tidak melakukan apa-apa.
        // Kolom status sudah di-handle di migration sebelumnya.
    }

    public function down(): void
    {
        // Tidak melakukan apa-apa saat rollback.
    }
};
