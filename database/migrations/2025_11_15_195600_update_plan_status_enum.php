<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private string $enumName = 'plans_status_enum';
    private array $statuses = ['todo', 'pending', 'in_progress', 'completed'];

    public function up(): void
    {
        $enumValues = "'" . implode("','", $this->statuses) . "'";

        DB::statement('ALTER TABLE plans ALTER COLUMN status TYPE TEXT');
        DB::statement('DROP TYPE IF EXISTS ' . $this->enumName);
        DB::statement('CREATE TYPE ' . $this->enumName . ' AS ENUM (' . $enumValues . ')');
        DB::statement("ALTER TABLE plans ALTER COLUMN status TYPE {$this->enumName} USING status::text::{$this->enumName}");
        DB::statement("ALTER TABLE plans ALTER COLUMN status SET DEFAULT 'todo'");
    }

    public function down(): void
    {
        $original = ['pending', 'in_progress', 'completed'];
        $enumValues = "'" . implode("','", $original) . "'";

        DB::statement('ALTER TABLE plans ALTER COLUMN status TYPE TEXT');
        DB::statement('DROP TYPE IF EXISTS ' . $this->enumName);
        DB::statement('CREATE TYPE ' . $this->enumName . ' AS ENUM (' . $enumValues . ')');
        DB::statement("ALTER TABLE plans ALTER COLUMN status TYPE {$this->enumName} USING status::text::{$this->enumName}");
        DB::statement("ALTER TABLE plans ALTER COLUMN status SET DEFAULT 'pending'");
    }
};