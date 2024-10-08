<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User; // Sesuaikan dengan model User Anda

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        User::create([
            'username' => 'user zero',
            'email' => 'admin@example.com',
            'password' => Hash::make('hahahihihuhu'),
            'role' => 'admin' 
        ]);
    }
}
