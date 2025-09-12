<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cancelled_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('doctor_id')->constrained()->cascadeOnDelete();
            $table->foreignId('patient_id')->constrained('users')->cascadeOnDelete();
            $table->dateTime('starts_at'); // exact slot start time
            $table->timestamps();

            // A patient cannot cancel the same doctor/slot more than once
            $table->unique(['doctor_id', 'patient_id', 'starts_at'], 'cancelled_unique_slot');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cancelled_slots');
    }
};
