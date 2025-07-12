<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileSettingController;

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
