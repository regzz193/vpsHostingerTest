<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('profile_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value');
            $table->timestamps();
        });

        // Insert default values
        DB::table('profile_settings')->insert([
            ['key' => 'email', 'value' => 'reggie.ambrocio@example.com', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'phone', 'value' => '+1 (415) 555-0123', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'location', 'value' => 'San Francisco, CA', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'about_me_1', 'value' => "Hello! I'm Reggie, a passionate full-stack developer with expertise in building modern web applications. I specialize in creating responsive, user-friendly interfaces and robust backend systems.", 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'about_me_2', 'value' => "With a strong foundation in Laravel, React, and Tailwind CSS, I bring ideas to life through clean, efficient code and thoughtful design. I'm constantly learning and exploring new technologies to enhance my skills and deliver better solutions.", 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'about_me_3', 'value' => "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing my knowledge through writing and mentoring.", 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profile_settings');
    }
};
