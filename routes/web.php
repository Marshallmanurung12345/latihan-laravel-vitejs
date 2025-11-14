<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Route;

Route::middleware(['handle.inertia'])->group(function () {
    // Auth Routes
    Route::group(['prefix' => 'auth'], function () {
        Route::get('/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('/login/post', [AuthController::class, 'postLogin'])->name('auth.login.post');

        Route::get('/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('/register/post', [AuthController::class, 'postRegister'])->name('auth.register.post');

        Route::get('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    Route::group(['middleware' => 'check.auth'], function () {
        // Mengganti HomeController dengan PlanController untuk halaman utama
        Route::get('/', [PlanController::class, 'index'])->name('home');

        // Routes untuk Rencana (Plans)
        Route::resource('plans', PlanController::class)->except(['index']);

        // Route khusus untuk update cover
        Route::post('/plans/{plan}/cover', [PlanController::class, 'updateCover'])->name('plans.cover.update');
    });
});