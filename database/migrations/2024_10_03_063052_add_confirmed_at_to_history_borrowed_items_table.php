<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddConfirmedAtToHistoryBorrowedItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('history_borrowed_items', function (Blueprint $table) {
            $table->timestamp('confirmed_at')->nullable()->after('borrowed_at');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('history_borrowed_items', function (Blueprint $table) {
            $table->dropColumn('confirmed_at');
        });
    }
}
