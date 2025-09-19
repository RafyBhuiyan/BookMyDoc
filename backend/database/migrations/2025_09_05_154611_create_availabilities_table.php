<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration {
    public function up(): void {
    Schema::create('availabilities', function (Blueprint $t) {
        $t->id();
         $t->foreignId('doctor_id')->constrained()->cascadeOnDelete();
        $t->date('date')->index();
        $t->time('start_time');
        $t->time('end_time');
        $t->unsignedSmallInteger('slot_minutes')->default(30); // 30‑min slots by default
        $t->timestamps();


        $t->index(['doctor_id','date']);
     });
 }
        public function down(): void { 
            Schema::dropIfExists('availabilities'); 
    }
};