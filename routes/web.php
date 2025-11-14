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
        // Gunakan route resource untuk semua aksi CRUD pada Plan.
        // Ini akan secara otomatis membuat route untuk index, create, store, show, edit, update, destroy.
        Route::resource('plans', PlanController::class);
        // Rute untuk menangani upload file dari Trix Editor
        Route::post('/plans/attachments', [PlanController::class, 'storeAttachment'])->name('plans.attachments.store');
        // Jadikan halaman utama (/) mengarah ke daftar rencana (plans.index).
        Route::get('/', [PlanController::class, 'index'])->name('home');
    });
});