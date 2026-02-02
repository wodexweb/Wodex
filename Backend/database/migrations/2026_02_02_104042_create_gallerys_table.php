<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('gallerys', function (Blueprint $table) {
            $table->id();

            // Event OPTIONAL
            $table->foreignId('event_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('title')->nullable();
            $table->string('image');

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('gallerys');
    }
};
