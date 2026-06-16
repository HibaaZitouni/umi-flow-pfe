<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\EmpruntController;
use App\Http\Controllers\Api\SeanceController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\AttestationController;
use App\Http\Controllers\Api\ClubController;
use App\Http\Controllers\Api\EvenementController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\StageController;

// ── PUBLIC ────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('login',           [AuthController::class, 'login']);
    Route::post('register',        [AuthController::class, 'register']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',  [AuthController::class, 'resetPassword']);
});

// ── TOUTES ROUTES PROTÉGÉES ───────────────────────────────────
// Un seul middleware auth:sanctum — le CheckRole gère les droits
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('auth/me',               [AuthController::class, 'me']);
    Route::post('auth/logout',          [AuthController::class, 'logout']);

    // ── SUPER ADMIN ───────────────────────────────────────────
    Route::middleware('role:SUPER_ADMIN')->prefix('admin')->group(function () {
        Route::apiResource('users',     UserController::class);
        Route::post('users/{user}/toggle-statut',  [UserController::class, 'toggleStatut']);
        Route::post('users/{user}/reset-password', [UserController::class, 'resetPassword']);
        Route::post('users/import',                [UserController::class, 'import']);
    });

    // ── ADMIN ATTESTATIONS ────────────────────────────────────
    Route::middleware('role:ADMIN_ATTEST,SUPER_ADMIN')->group(function () {
        Route::get('attestations',                           [AttestationController::class, 'index']);
        Route::post('attestations/{attestation}/valider',    [AttestationController::class, 'valider']);
        Route::post('attestations/{attestation}/generer',    [AttestationController::class, 'generer']);
        Route::post('attestations/{attestation}/signer',     [AttestationController::class, 'signer']);
        Route::post('attestations/{attestation}/refuser',    [AttestationController::class, 'refuser']);
    });

    // ── ADMIN BIB ─────────────────────────────────────────────
    Route::middleware('role:ADMIN_BIB,SUPER_ADMIN')->group(function () {
        Route::post('documents',                              [DocumentController::class, 'store']);
        Route::put('documents/{document}',                   [DocumentController::class, 'update']);
        Route::delete('documents/{document}',                [DocumentController::class, 'destroy']);
        Route::get('emprunts',                               [EmpruntController::class, 'index']);
        Route::post('emprunts/{emprunt}/retourner',          [EmpruntController::class, 'retourner']);
        Route::post('emprunts/{emprunt}/renouveler',         [EmpruntController::class, 'renouveler']);
    });

    // ── ADMIN EDT ─────────────────────────────────────────────
    Route::middleware('role:ADMIN_EDT,SUPER_ADMIN')->group(function () {
        Route::post('seances',                               [SeanceController::class, 'store']);
        Route::put('seances/{seance}',                       [SeanceController::class, 'update']);
        Route::delete('seances/{seance}',                    [SeanceController::class, 'destroy']);
        Route::post('reservations/{reservation}/confirmer',  [ReservationController::class, 'confirmer']);
        Route::post('reservations/{reservation}/annuler',    [ReservationController::class, 'annuler']);
        Route::post('evenements/{evenement}/publier',        [EvenementController::class, 'publier']);
        Route::post('evenements/{evenement}/annuler',        [EvenementController::class, 'annuler']);
    });

    // ── TOUT UTILISATEUR AUTHENTIFIÉ ──────────────────────────
    // Accessible à TOUS les rôles (prof, étudiant, admin...)
    Route::get('documents',                        [DocumentController::class,  'index']);
    Route::get('documents/{document}',             [DocumentController::class,  'show']);
    Route::get('seances',                          [SeanceController::class,    'index']);
    Route::get('salles',                           [\App\Http\Controllers\Api\SalleController::class, 'index']);
    Route::get('reservations',                     [ReservationController::class,'index']);
    Route::post('reservations',                    [ReservationController::class,'store']);
    Route::get('clubs',                            [ClubController::class,      'index']);
    Route::get('clubs/{club}',                     [ClubController::class,      'show']);
    Route::post('clubs',                           [ClubController::class,      'store']);
    Route::post('clubs/{club}/rejoindre',          [ClubController::class,      'rejoindre']);
    Route::delete('clubs/{club}/quitter',          [ClubController::class,      'quitter']);
    Route::get('evenements',                       [EvenementController::class, 'index']);
    Route::get('evenements/{evenement}',           [EvenementController::class, 'show']);
    Route::post('evenements',                      [EvenementController::class, 'store']);
    Route::post('evenements/{evenement}/inscrire', [EvenementController::class, 'inscrire']);
    Route::delete('evenements/{evenement}/desinscrire', [EvenementController::class, 'desinscrire']);
    Route::get('notes',                            [NoteController::class,      'index']);
    Route::get('notes/mes-notes',                  [NoteController::class,      'mesNotes']);
    Route::get('notes/etudiant/{user}',            [NoteController::class,      'parEtudiant']);
    Route::put('notes/{note}',                     [NoteController::class,      'update']);
    Route::post('notes/bulk',                      [NoteController::class,      'bulk']);
    Route::post('attestations',                    [AttestationController::class,'store']);
    Route::get('mes-attestations',                 [AttestationController::class,'mesAttestations']);
    Route::post('emprunts',                        [EmpruntController::class,   'store']);
    Route::get('mes-emprunts',                     [EmpruntController::class,   'mesEmprunts']);
    Route::get('offres-stages',                    [StageController::class,     'offres']);
    Route::apiResource('stages',                   StageController::class);
    Route::post('offres-stages/{offre}/postuler',  [StageController::class,     'postuler']);
    Route::get('mes-demandes',                     [StageController::class,     'mesDemandes']);
    Route::post('clubs/{club}/valider',            [ClubController::class,      'valider']);
    Route::post('clubs/{club}/suspendre',          [ClubController::class,      'suspendre']);

});