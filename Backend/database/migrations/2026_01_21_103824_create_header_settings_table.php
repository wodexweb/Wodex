<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('header_settings', function (Blueprint $table) {
            $table->id();
            $table->string('header_title')->nullable();
            $table->string('drive_link')->nullable();
            $table->string('title_color', 20);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('header_settings');
    }
};
