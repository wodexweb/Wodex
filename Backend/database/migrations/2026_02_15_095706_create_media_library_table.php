<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('media_library', function (Blueprint $table) {
            $table->id();

            $table->string('page_slug'); // home, about, events
            $table->enum('section', ['hero', 'header']); // hero = home banner, header = other pages

            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();

            $table->string('file_path')->nullable();
            // $table->integer('order')->default(0);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_library');
    }
};
