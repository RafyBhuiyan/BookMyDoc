<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{
    //
    protected $fillable = [
        'name',
        'email',
        'user_type',
        'subject',
        'message',
    ];

    protected $casts = [
        'posted_at' => 'datetime',
    ];
}
