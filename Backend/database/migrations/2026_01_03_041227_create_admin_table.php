<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admin', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();

            // 🔐 ROLE BASED ACCESS
            // 1 = Admin, 2 = Editor, 3 = Secretary
            $table->integer('role_id')
                ->default(1)
                ->comment('1=admin, 2=editor, 3=secretary');

            $table->string('password');
            $table->string('avatar')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('admin');
    }
};
