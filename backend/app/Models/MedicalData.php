<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalData extends Model
{
    //
     protected $table = 'medical_data';

    protected $fillable = [
        'user_id',
        'doctor_id',
        'visit_date',
        'weight_kg',
        'height_cm',
        'blood_pressure',
        'pulse_bpm',
        'temperature_c',
        'symptoms',
        'diagnosis',
        'tests',
        'notes',
        'is_confidential',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'tests'      => 'array',
        'is_confidential' => 'boolean',
        'weight_kg'  => 'float',
        'height_cm'  => 'float',
        'temperature_c' => 'float',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
