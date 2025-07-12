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
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // 'frontend', 'backend', 'devops'
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Seed with default skills
        $this->seedSkills();
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }

    /**
     * Seed the skills table with default values.
     */
    private function seedSkills(): void
    {
        $skills = [
            // Frontend skills
            ['name' => 'React.js & Next.js', 'category' => 'frontend', 'order' => 1],
            ['name' => 'Tailwind CSS', 'category' => 'frontend', 'order' => 2],
            ['name' => 'JavaScript/TypeScript', 'category' => 'frontend', 'order' => 3],
            ['name' => 'Responsive Design', 'category' => 'frontend', 'order' => 4],

            // Backend skills
            ['name' => 'PHP & Laravel', 'category' => 'backend', 'order' => 1],
            ['name' => 'Node.js & Express', 'category' => 'backend', 'order' => 2],
            ['name' => 'RESTful APIs', 'category' => 'backend', 'order' => 3],
            ['name' => 'Database Design', 'category' => 'backend', 'order' => 4],

            // DevOps skills
            ['name' => 'Git & GitHub', 'category' => 'devops', 'order' => 1],
            ['name' => 'Docker', 'category' => 'devops', 'order' => 2],
            ['name' => 'CI/CD Pipelines', 'category' => 'devops', 'order' => 3],
            ['name' => 'Linux Server Administration', 'category' => 'devops', 'order' => 4],
        ];

        foreach ($skills as $skill) {
            DB::table('skills')->insert([
                'name' => $skill['name'],
                'category' => $skill['category'],
                'order' => $skill['order'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
};
