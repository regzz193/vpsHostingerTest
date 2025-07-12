<?php

namespace App\Http\Controllers;

use App\Models\ProfileSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProfileSettingController extends Controller
{
    /**
     * Get all profile settings.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $settings = ProfileSetting::getAllSettings();
        return response()->json(['data' => $settings]);
    }

    /**
     * Get a specific profile setting.
     *
     * @param string $key
     * @return \Illuminate\Http\Response
     */
    public function show($key)
    {
        $value = ProfileSetting::getValue($key);

        if ($value === null) {
            return response()->json(['error' => 'Setting not found'], 404);
        }

        return response()->json(['data' => ['key' => $key, 'value' => $value]]);
    }

    /**
     * Update a profile setting.
     *
     * @param \Illuminate\Http\Request $request
     * @param string $key
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $key)
    {
        $validator = Validator::make($request->all(), [
            'value' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $success = ProfileSetting::setValue($key, $request->value);

        if (!$success) {
            return response()->json(['error' => 'Failed to update setting'], 500);
        }

        return response()->json(['message' => 'Setting updated successfully', 'data' => ['key' => $key, 'value' => $request->value]]);
    }

    /**
     * Update multiple profile settings at once.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function updateMultiple(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $updatedSettings = [];
        $errors = [];

        foreach ($request->settings as $setting) {
            $success = ProfileSetting::setValue($setting['key'], $setting['value']);

            if ($success) {
                $updatedSettings[] = $setting;
            } else {
                $errors[] = "Failed to update setting: {$setting['key']}";
            }
        }

        if (count($errors) > 0) {
            return response()->json([
                'message' => 'Some settings failed to update',
                'errors' => $errors,
                'data' => ['updated' => $updatedSettings]
            ], 207); // 207 Multi-Status
        }

        return response()->json(['message' => 'All settings updated successfully', 'data' => ['updated' => $updatedSettings]]);
    }
}
