<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('school_year')->nullable(); // Tambahkan kolom school_year
            $table->timestamps(); // Untuk created_at dan updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
