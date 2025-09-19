<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Doctor extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'specialization',
        'password',
        'city',
        'clinic_address',
        'medical_school',
        'medical_license_number',
        'years_of_experience',
        'bio',
        'is_approved',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at'   => 'datetime',
        'is_approved'         => 'boolean',
        'years_of_experience' => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function availabilities()
    {
        return $this->hasMany(\App\Models\Availability::class);
    }

    public function appointments()
    {
        return $this->hasMany(\App\Models\Appointment::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */
    public function scopeApproved($q)
    {
        return $q->where('is_approved', true);
    }

    public function scopeSearch($query, ?string $term)
    {
        if (!$term) return $query;

        $s = mb_strtolower($term, 'UTF-8');

        return $query->where(function ($q) use ($s) {
            $q->whereRaw('LOWER(name) LIKE ?', ["{$s}%"])
              ->orWhereRaw('LOWER(specialization) LIKE ?', ["{$s}%"])
              ->orWhereRaw('LOWER(city) LIKE ?', ["{$s}%"]);
        });
    }

    /** Filter by exact specialization. */
    public function scopeSpecialization($query, ?string $spec)
    {
        return $spec ? $query->where('specialization', $spec) : $query;
    }

    /** Filter by exact city. */
    public function scopeCity($query, ?string $city)
    {
        return $city ? $query->where('city', $city) : $query;
    }

    /** Only doctors that have at least one availability on a given date (YYYY-MM-DD). */
    public function scopeHasAvailabilityOn($query, ?string $date)
    {
        if (!$date) return $query;

        return $query->whereHas('availabilities', function ($w) use ($date) {
            $w->where('date', $date);
        });
    }
}
