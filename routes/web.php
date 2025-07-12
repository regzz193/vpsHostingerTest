<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileSettingController;
use App\Http\Controllers\SkillController;

Route::view('/', 'welcome');
Route::view('/me-administrator', 'admin');

// Message routes
Route::post('/api/messages', [MessageController::class, 'store']);
Route::get('/api/messages', [MessageController::class, 'index']);
Route::put('/api/messages/{id}/read', [MessageController::class, 'markAsRead']);

// Profile Settings routes
Route::get('/api/profile-settings', [ProfileSettingController::class, 'index']);
Route::get('/api/profile-settings/{key}', [ProfileSettingController::class, 'show']);
Route::put('/api/profile-settings/{key}', [ProfileSettingController::class, 'update']);
Route::post('/api/profile-settings/batch', [ProfileSettingController::class, 'updateMultiple']);

// Skill routes
Route::get('/api/skills', [SkillController::class, 'index']);
Route::get('/api/skills/grouped', [SkillController::class, 'grouped']);
Route::post('/api/skills', [SkillController::class, 'store']);
Route::get('/api/skills/{id}', [SkillController::class, 'show']);
Route::put('/api/skills/{id}', [SkillController::class, 'update']);
Route::delete('/api/skills/{id}', [SkillController::class, 'destroy']);
Route::post('/api/skills/reorder', [SkillController::class, 'reorder']);

//testing
