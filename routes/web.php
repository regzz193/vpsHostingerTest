<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MessageController;

Route::view('/', 'welcome');
Route::view('/me-administrator', 'admin');

// Message routes
Route::post('/api/messages', [MessageController::class, 'store']);
Route::get('/api/messages', [MessageController::class, 'index']);
Route::put('/api/messages/{id}/read', [MessageController::class, 'markAsRead']);
