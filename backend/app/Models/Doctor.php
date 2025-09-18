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
        'city',            // optional: used for filtering
        'clinic_address',
        'is_approved',  // optional: display only

    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'education_certificates' => 'array', //this ensures certificates are arrays
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
        return $this->hasMany(Appointment::class);
    }

    
    public function scopeSearch($query, ?string $term)
    {
        if (!$term) return $query;

        $s = strtolower($term);
        return $query->where(function ($q) use ($s) {
            $q->whereRaw('LOWER(name) LIKE ?', ["%{$s}%"])
              ->orWhereRaw('LOWER(email) LIKE ?', ["%{$s}%"])
              ->orWhereRaw('LOWER(specialization) LIKE ?', ["%{$s}%"])
              ->orWhereRaw('LOWER(city) LIKE ?', ["%{$s}%"]);
        });
    }

    /**
     * Filter by exact specialization.
     */
    public function scopeSpecialization($query, ?string $spec)
    {
        return $spec ? $query->where('specialization', $spec) : $query;
    }

    /**
     * Filter by exact city.
     */
    public function scopeCity($query, ?string $city)
    {
        return $city ? $query->where('city', $city) : $query;
    }

    /**
     * Only doctors that have at least one availability on a given date (YYYY-MM-DD).
     */
    public function scopeHasAvailabilityOn($query, ?string $date)
    {
        if (!$date) return $query;

        return $query->whereHas('availabilities', function ($w) use ($date) {
            $w->where('date', $date);
        });
    }
}
