<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->string('profile_picture')->nullable();
            $table->string('medical_school')->nullable();
            $table->json('education_certificates')->nullable(); // store file paths as JSON array
            $table->string('medical_license_number')->unique()->nullable();
            $table->integer('years_of_experience')->nullable();
            $table->text('bio')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn([
                'profile_picture',
                'medical_school',
                'education_certificates',
                'medical_license_number',
                'years_of_experience',
                'bio',
            ]);
        });
    }
};
