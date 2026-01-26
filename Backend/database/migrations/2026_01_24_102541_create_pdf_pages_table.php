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
    Schema::create('pdf_pages', function (Blueprint $table) {
        $table->id();
        $table->string('title');
        $table->text('description')->nullable();
        $table->text('link')->nullable(); // For Google Drive links
        $table->string('pdf_for')->nullable(); // Category (e.g., Students, Staff)
        $table->string('file_path')->nullable(); // For uploaded files
        $table->string('status')->default('active');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pdf_pages');
    }
};
