<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class NewRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $names = [
            'Zara Ali', 'Ahmed Raza', 'Hira Sheikh', 'Imran Khan',
            'Fatima Noor', 'Usman Ghani', 'Sana Mir', 'Hamza Ali', 'Nida Yasir',
            'Bilal Aslam', 'Ayesha Khan', 'Fahad Mustafa', 'Mehwish Hayat', 'Ali Zafar'
        ];

        foreach ($names as $index => $name) {
            User::create([
                'fullName' => $name,
                'role' => 'Student',
                'email' => 'user' . ($index + rand(1111111, 9999999)) . '@example.com',
                'mobile' => '0311' . str_pad((string)rand(1000000, 9999999), 7, '0', STR_PAD_LEFT),
                'gender' => $index % 2 === 0 ? 'Male' : 'Female',
                'branch' => rand(1, 3),
                'status' => 1,
                'password' => Hash::make('password123'),
                'old_password' => Hash::make('password123'),
            ]);
        }
    }
}