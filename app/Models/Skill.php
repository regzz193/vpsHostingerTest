<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'category',
        'order',
    ];

    /**
     * Get skills by category.
     *
     * @param string $category
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getByCategory(string $category)
    {
        return self::where('category', $category)
            ->orderBy('order')
            ->get();
    }

    /**
     * Get all skills grouped by category.
     *
     * @return array
     */
    public static function getAllGroupedByCategory()
    {
        $skills = self::orderBy('category')
            ->orderBy('order')
            ->get();

        $grouped = [];
        foreach ($skills as $skill) {
            $grouped[$skill->category][] = $skill;
        }

        return $grouped;
    }
}
