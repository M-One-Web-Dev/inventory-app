<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTemporaryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('temporary', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('number_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('student_class');
            $table->string('level');
            $table->string('item_name')->nullable();
            $table->string('item_id')->nullable();
            $table->string('item_number_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('temporary');
    }
}
