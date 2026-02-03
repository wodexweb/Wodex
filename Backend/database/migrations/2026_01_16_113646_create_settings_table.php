<?php

// database/migrations/xxxx_xx_xx_create_settings_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('system_name')->nullable();
            $table->string('application_title')->nullable();
            $table->string('website_url')->nullable();
            $table->string('website_title')->nullable();
            $table->text('website_description')->nullable();
            $table->string('website_keywords')->nullable();
            $table->string('site_copyright')->nullable();
            $table->string('website_logo')->nullable();
            $table->string('admin_logo')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
