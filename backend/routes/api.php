<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/checkLogin', [AuthController::class, 'checkLoginStatus']);
    Route::get('/logout', [AuthController::class, 'logout']);

    Route::controller(UserController::class)->group(function () {
        Route::post('/addUser', 'addNew');
        Route::put('/updateUser/{id}', 'updateUser');
        Route::delete('/deleteUser/{id}', 'deleteUser');
        Route::get('/getEditUser/{id}', 'getEditUser');
        Route::get('/get_users', 'getUsers');
        Route::get('/export_csv_users', 'exportUsers');
        Route::get('/export_pdf_users', 'exportUsersPDF');
    });
});