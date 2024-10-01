<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\ActiveUser; 

class ActiveUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $admin = User::where('username', 'user zero')->first(); 

        if ($admin) {
            ActiveUser::create([
                'user_id' => $admin->id,
                'user_from' => 'Admin', 
                'user_level' => 'Admin', 
                'school_year' => null, 
            ]);
        }
    }
}
