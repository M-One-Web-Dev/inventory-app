<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryBorrowedItem extends Model
{
    use HasFactory;


    protected $fillable = [
        'user_id',
        'item_id',
        'borrowed_user_from',
        'borrowed_level',
        'status',
        'type',
        'borrowed_at',
        'returned_at'
    ];

    /**
     * Relasi ke tabel users
     * Menghubungkan user yang meminjam barang.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relasi ke tabel items
     * Menghubungkan item yang dipinjam.
     */
    public function item()
    {
        return $this->belongsTo(Items::class);
    }
}
