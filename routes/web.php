<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileSettingController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\FeaturedProjectController;
use App\Http\Controllers\VisitorAnalyticsController;

Route::view('/', 'welcome');
Route::view('/me-administrator', 'admin');

// Message routes
Route::post('/api/messages', [MessageController::class, 'store']);
Route::get('/api/messages', [MessageController::class, 'index']);
Route::put('/api/messages/{id}/read', [MessageController::class, 'markAsRead']);
Route::put('/api/messages/{id}/toggle-read', [MessageController::class, 'toggleReadStatus']);
Route::put('/api/messages/mark-all-read', [MessageController::class, 'markAllAsRead']);
Route::delete('/api/messages/{id}', [MessageController::class, 'destroy']);

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

// Featured Project routes
Route::get('/api/featured-projects', [FeaturedProjectController::class, 'index']);
Route::post('/api/featured-projects', [FeaturedProjectController::class, 'store']);
Route::get('/api/featured-projects/{id}', [FeaturedProjectController::class, 'show']);
Route::put('/api/featured-projects/{id}', [FeaturedProjectController::class, 'update']);
Route::delete('/api/featured-projects/{id}', [FeaturedProjectController::class, 'destroy']);
Route::post('/api/featured-projects/reorder', [FeaturedProjectController::class, 'reorder']);

// Visitor Analytics routes
Route::post('/api/analytics/track', [VisitorAnalyticsController::class, 'track']);
Route::get('/api/analytics', [VisitorAnalyticsController::class, 'index']);

//testing asdasd
