<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();

            $table->string('title');

            // 🔥 Google Drive PDF / Image URL
            $table->string('link');

            // Poster image shown on site
            $table->longText('photo')->nullable();

            $table->text('description')->nullable();

            $table->date('end_date');

            $table->enum('status', ['upcoming', 'recent', 'past'])
                ->default('upcoming');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
