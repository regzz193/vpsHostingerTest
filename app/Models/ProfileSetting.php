<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get a setting by key.
     *
     * @param string $key
     * @return string|null
     */
    public static function getValue(string $key): ?string
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : null;
    }

    /**
     * Set a setting value by key.
     *
     * @param string $key
     * @param string $value
     * @return bool
     */
    public static function setValue(string $key, string $value): bool
    {
        $setting = self::where('key', $key)->first();

        if ($setting) {
            return $setting->update(['value' => $value]);
        }

        return self::create(['key' => $key, 'value' => $value]) ? true : false;
    }

    /**
     * Get all settings as key-value pairs.
     *
     * @return array
     */
    public static function getAllSettings(): array
    {
        $settings = self::all();
        $result = [];

        foreach ($settings as $setting) {
            $result[$setting->key] = $setting->value;
        }

        return $result;
    }
}
