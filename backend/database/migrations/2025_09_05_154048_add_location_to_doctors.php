<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('doctors', function (Blueprint $t) {
            if (!Schema::hasColumn('doctors','city')) $t->string('city')->nullable()->index();
            if (!Schema::hasColumn('doctors','clinic_address')) $t->string('clinic_address')->nullable();
        });
    }
    public function down(): void {
        Schema::table('doctors', function (Blueprint $t) {
            $t->dropColumn(['city','clinic_address']);
        });
    }
};
