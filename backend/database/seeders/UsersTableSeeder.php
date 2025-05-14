<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Inserting default data into the users table
        User::create([
            'fullName' => 'Aazan Khan',
            'role' => 'Super Admin',
            'email' => 'aazan@gmail.com',
            'mobile' => '03118679523',
            'gender' => 'Male',
            'branch' => 0, // Example branch ID
            'status' => 1, // Active user
            'password' => Hash::make('aazan'), // You can change this to any default password
            'old_password' => Hash::make('aazan'), // Optional if you are saving the old password
        ]);
    }
}