<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ContactController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('contacts')->group(function () {
    Route::get('/', [ContactController::class, 'list']);
    Route::get('/{id}', [ContactController::class, 'contact']);
    Route::post('/', [ContactController::class, 'create']);
    Route::put('/{id}', [ContactController::class, 'edit']);
    Route::delete('/{id}', [ContactController::class, 'delete']);
});

Route::get('/search/contacts', [ContactController::class, 'search']);
