<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    protected $fillable = ['doctor_id','date','start_time','end_time','slot_minutes'];
    public function doctor(){ return $this->belongsTo(Doctor::class); }
}
