<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRoleStaffToUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Mengubah kolom role untuk menambahkan opsi "staff" ke enum
            $table->enum('role', ['admin', 'teacher', 'student', 'staff'])->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kembalikan enum ke kondisi semula tanpa opsi "staff"
            $table->enum('role', ['admin', 'teacher', 'student'])->nullable(false)->change();
        });
    }
}
