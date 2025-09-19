<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; // ← add this

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable; // ← include here

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'city',
        'blood_group',
        'emergency_contact',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function medicalRecords()
    {
        return $this->hasMany(\App\Models\MedicalData::class);
    }

   public function prescriptions()
{
    return $this->hasMany(\App\Models\Prescription::class, 'user_id');
}
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
