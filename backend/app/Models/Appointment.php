<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    protected $fillable = [
        'doctor_id','patient_id','starts_at','ends_at','status','reason','cancel_reason'
    ];
    protected $casts = ['starts_at'=>'datetime','ends_at'=>'datetime'];

   // public function doctor(){ return $this->belongsTo(Doctor::class); }
    public function patient(){ return $this->belongsTo(User::class,'patient_id'); }
    public function doctor()
    {
        return $this->belongsTo(Doctor::class, 'doctor_id');
    }
}
