<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleToActiveUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up(): void
    {
        Schema::table('active_user', function (Blueprint $table) {
            $table->string('role')->nullable(); // Menambahkan kolom role
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down(): void
    {
        Schema::table('active_user', function (Blueprint $table) {
            $table->dropColumn('role'); // Menghapus kolom role
        });
    }
}
