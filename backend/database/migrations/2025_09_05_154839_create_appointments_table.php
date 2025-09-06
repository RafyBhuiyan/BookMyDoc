<?php
use App\Models\User;
use App\Models\Doctor;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('appointments', function (Blueprint $t) {
            $t->id();

            $t->foreignIdFor(Doctor::class, 'doctor_id')->constrained()->cascadeOnDelete();
            $t->foreignIdFor(User::class,   'patient_id')->constrained()->cascadeOnDelete();

            $t->dateTime('starts_at');
            $t->dateTime('ends_at');
            $t->enum('status', ['pending','accepted','declined','cancelled'])->default('pending')->index();
            $t->text('reason')->nullable();
            $t->text('cancel_reason')->nullable();
            $t->timestamps();

            $t->unique(['doctor_id','starts_at']);
            $t->index(['patient_id','status']);
        });
    }

    public function down(): void {
        Schema::dropIfExists('appointments');
    }
};
