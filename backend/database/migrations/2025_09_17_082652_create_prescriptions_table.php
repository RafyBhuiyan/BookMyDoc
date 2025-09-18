<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrescriptionsTable extends Migration
{
    public function up()
    {
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->bigIncrements('p_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->unsignedBigInteger('doctor_id')->nullable();
            $table->foreign('doctor_id')->references('id')->on('doctors')->onDelete('set null');

            $table->date('issued_date')->nullable();
            $table->text('notes')->nullable();
            $table->json('medicines')->nullable();

            $table->unsignedSmallInteger('duration_days')->nullable();
            $table->unsignedSmallInteger('refill_count')->default(0);

            $table->boolean('is_private')->default(true);

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('prescriptions');
    }
}