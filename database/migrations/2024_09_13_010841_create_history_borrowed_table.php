<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoryBorrowedTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('history_borrowed_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
          
            $table->foreignId('item_id')->constrained('items')->onDelete('cascade');

             $table->string('borrowed_user_from')->nullable();
            $table->string('borrowed_level')->nullable(); 
            
      
           $table->string('status'); 
            $table->enum('type', ['automation', 'manual'])->default('manual'); 
            $table->timestamp('borrowed_at')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamp('returned_at')->nullable(); 
           
            
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
        Schema::dropIfExists('history_borrowed_items');
    }
}

