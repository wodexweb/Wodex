<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up()
{
    Schema::create('membership_plans', function (Blueprint $table) {
        $table->id();
        $table->string('name'); // e.g., Gold Plan
        $table->decimal('price', 10, 2); // e.g., 99.00
        $table->integer('duration_months'); // e.g., 12
        $table->text('benefits'); // Benefits separated by commas or JSON
        $table->string('status')->default('active');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_plans');
    }
};
