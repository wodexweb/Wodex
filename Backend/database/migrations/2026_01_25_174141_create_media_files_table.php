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
    Schema::create('media_files', function (Blueprint $table) {
        $table->id();
        $table->string('media_name');
        $table->string('file_path');
        // Categorize by topic: Banner, Home Gallery, Breadcrumbs, etc.
        $table->string('media_type'); 
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('media_files');
    }
};
