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
        'issued_date',
        'notes',
        'medicines',
        'duration_days',
        'refill_count',
        'is_private',
    ];

    protected $casts = [
        'issued_date' => 'date',
        'medicines' => 'array',
        'is_private' => 'boolean',
        'duration_days' => 'integer',
        'refill_count' => 'integer',
    ];

    public function patient()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function doctor()
    {
        return $this->belongsTo(\App\Models\Doctor::class, 'doctor_id');
    }
    public function getRouteKeyName()
    {
        return $this->getKeyName(); // will use your primary key (p_id)
    }

    public function medicalData()
    {
        return $this->belongsTo(\App\Models\MedicalData::class, 'medical_data_id');
    }
}
