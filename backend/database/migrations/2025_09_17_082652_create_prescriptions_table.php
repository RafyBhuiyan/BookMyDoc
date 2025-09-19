<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->bigIncrements('p_id');

            // Patient (User)
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Issuing Doctor
            $table->foreignId('doctor_id')
                ->nullable()
                ->constrained('doctors')
                ->nullOnDelete();

            // Optional links (uncomment only if you actually add these columns)
            // $table->foreignId('appointment_id')->nullable()
            //       ->constrained('appointments')->nullOnDelete();

            // $table->foreignId('medical_data_id')->nullable()
            //       ->constrained('medical_data')->nullOnDelete();

            $table->date('issued_date')->nullable();
            $table->text('notes')->nullable();
            $table->json('medicines')->nullable();

            $table->unsignedSmallInteger('duration_days')->nullable();
            $table->unsignedSmallInteger('refill_count')->default(0);

            $table->boolean('is_private')->default(true);

            $table->timestamps();
            $table->softDeletes();

            // Helpful indexes
            $table->index('user_id');
            $table->index('doctor_id');
            // $table->index('appointment_id');
            // $table->index('medical_data_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
