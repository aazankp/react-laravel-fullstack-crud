<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;

class ModulesTableSeeder extends Seeder
{
    public function run(): void
    {
        // Clear old data
        Module::truncate();

        // Create top-level modules
        $userModule = Module::create([
            'name' => 'Organization',
            'parent_id' => null,
        ]);

        // Create submodules for Users
        $userSub1 = Module::create([
            'name' => 'Users',
            'parent_id' => $userModule->id,
            'operations' => json_encode(['addNew', 'view', 'edit', 'delete', 'roles']),
        ]);
    }
}