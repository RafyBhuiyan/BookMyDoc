<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prescription extends Model
{
    use SoftDeletes;

    protected $table = 'prescriptions';

    protected $primaryKey = 'p_id';
    protected $keyType = 'int';
    public $incrementing = true;

    protected $fillable = [
        'user_id',
        'doctor_id',
        'appointment_id',
        'issued_date',
        'notes',
        'medicines',
        'duration_days',
        'refill_count',
        'is_private',
      // 'medical_data_id',   // if you add later
    ];

    protected $casts = [
        'issued_date'   => 'date',
        'medicines'     => 'array',
        'is_private'    => 'boolean',
        'duration_days' => 'integer',
        'refill_count'  => 'integer',
    ];

    // --- Relationships ---
    public function patient()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function doctor()
    {
        return $this->belongsTo(\App\Models\Doctor::class, 'doctor_id');
    }

    public function appointment()
{
    return $this->belongsTo(\App\Models\Appointment::class, 'appointment_id');
}
    public function getRouteKeyName()
    {
        return $this->getKeyName(); // 'p_id'
    }


    public function scopeForPatient($q, int $userId)
    {
        return $q->where('user_id', $userId);
    }

    public function scopeForDoctor($q, int $doctorId)
    {
        return $q->where('doctor_id', $doctorId);
    }
}
