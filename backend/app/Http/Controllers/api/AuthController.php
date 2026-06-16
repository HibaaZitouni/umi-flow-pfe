<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * REGISTER — Créer un nouveau compte
     * Le compte est créé en statut 'inactif' jusqu'à validation admin.
     * Exception : PROFESSEUR et ETUDIANT sont créés actifs directement.
     */
    public function register(Request $request): JsonResponse
    {
        $request->validate([
            'nom'        => 'required|string|max:100',
            'prenom'     => 'required|string|max:100',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|string|min:8|confirmed',
            'db_role'    => 'required|in:PROFESSEUR,ETUDIANT,ADMIN_ATTEST,ADMIN_BIB,ADMIN_EDT',
            'cin'        => 'nullable|string|unique:users,cin',
            'telephone'  => 'nullable|string',
            'grade'      => 'nullable|string',
            'specialite' => 'nullable|string',
            'departement'=> 'nullable|string',
            'filieres'   => 'nullable|array',    // tableau de codes filières
            'filieres.*' => 'string',
            'cne'        => 'nullable|string|unique:users,cne',
            'filiere'    => 'nullable|string',
        ]);

        // Vérification du domaine email selon le rôle
        $emailDomains = [
            'PROFESSEUR'   => '@umi.ac.ma',
            'ETUDIANT'     => '@edu.umi.ac.ma',
            'ADMIN_ATTEST' => '@admin.ac.ma',
            'ADMIN_BIB'    => '@admin.ac.ma',
            'ADMIN_EDT'    => '@admin.ac.ma',
        ];

        $expectedDomain = $emailDomains[$request->db_role] ?? null;
        if ($expectedDomain && !str_ends_with($request->email, $expectedDomain)) {
            $roleLabel = match($request->db_role) {
                'PROFESSEUR'                          => 'enseignants',
                'ETUDIANT'                            => 'étudiants',
                'ADMIN_ATTEST','ADMIN_BIB','ADMIN_EDT'=> 'administrateurs',
                default                               => 'utilisateurs',
            };
            return response()->json([
                'message' => "Les {$roleLabel} doivent utiliser une adresse {$expectedDomain}",
                'errors'  => ['email' => ["L'email doit se terminer par {$expectedDomain}"]],
            ], 422);
        }

        $user = User::create([
            'nom'        => $request->nom,
            'prenom'     => $request->prenom,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'db_role'    => $request->db_role,
            'cin'        => $request->cin,
            'telephone'  => $request->telephone,
            'grade'      => $request->grade,
            'specialite' => $request->specialite,
            'departement'=> $request->departement,
            'cne'        => $request->cne,
            'filiere'    => $request->filiere
                         ?? ($request->filieres ? $request->filieres[0] : null),
            'filieres'   => $request->filieres ?? [],   // tableau JSON
            'statut'     => 'actif',
            'first_login'=> false,
        ]);

        // Créer les lignes de notes vides pour l'étudiant selon sa filière
        if ($user->db_role === 'ETUDIANT' && $user->filiere) {
            $filiere = \App\Models\Filiere::where('code', $user->filiere)->first();
            if ($filiere) {
                $matieres = \App\Models\Matiere::where('filiere_id', $filiere->id)->get();
                foreach ($matieres as $matiere) {
                    \App\Models\Note::firstOrCreate([
                        'etudiant_id'         => $user->id,
                        'matiere_id'          => $matiere->id,
                        'semestre'            => 'S1',
                        'annee_universitaire' => '2024-2025',
                    ]);
                }
            }
        }

        $filieresArray = $user->filieres ?? [];

        // Générer le token directement (connexion auto après inscription)
        $token = $user->createToken('umi-flow-token', ['*'], now()->addDays(7))->plainTextToken;

        $userData = $this->formatUser($user);
        // Injecter les filières complètes dans la réponse
        $userData['filieres']   = $filieresArray;
        $userData['created_at'] = $user->created_at->toIso8601String();

        return response()->json([
            'token'          => $token,
            'user'           => $userData,
            'redirect_route' => $user->redirect_route,
            'message'        => 'Compte créé avec succès.',
        ], 201);
    }

    /**
     * LOGIN — Option B
     * Le serveur détecte le rôle et renvoie la route de redirection.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'      => 'required|email',
            'password'   => 'required|string',
            'admin_type' => 'nullable|string|in:attest,bib,edt',
        ]);

        // ── Rate limiting (5 tentatives / minute) ──────────────
        $key = 'login:' . $request->ip();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => "Trop de tentatives. Réessayez dans {$seconds} secondes.",
            ], 429);
        }

        // ── Récupérer l'utilisateur ────────────────────────────
        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 60);
            return response()->json([
                'message' => 'Email ou mot de passe incorrect.',
            ], 401);
        }

        // ── Vérifier le statut ────────────────────────────────
        if ($user->statut === 'suspendu') {
            return response()->json([
                'message' => 'Compte suspendu. Contactez l\'administration.',
            ], 403);
        }

        if ($user->statut === 'inactif') {
            return response()->json([
                'message' => 'Compte inactif. Contactez l\'administration.',
            ], 403);
        }

        // ── SÉCURITÉ Option B ─────────────────────────────────
        // Un admin service avec admin_type NE peut PAS accéder au SUPER_ADMIN
        if ($request->admin_type && $user->isSuperAdmin()) {
            RateLimiter::hit($key, 60);
            return response()->json([
                'message' => 'Accès non autorisé. Ce profil ne correspond pas à votre rôle.',
            ], 403);
        }

        // Un ADMIN_* DOIT sélectionner un profil de service
        if (! $request->admin_type && $user->isAdmin() && ! $user->isSuperAdmin()) {
            return response()->json([
                'message' => 'Veuillez sélectionner votre profil de service.',
            ], 422);
        }

        // ── Tout OK ───────────────────────────────────────────
        RateLimiter::clear($key);

        // Révoquer les anciens tokens
        $user->tokens()->delete();

        // Créer le token Sanctum
        $token = $user->createToken('umi-flow-token', ['*'], now()->addDays(7))->plainTextToken;

        $userData = $this->formatUser($user);
        // Priorité au admin_type de la requête (sélection au login)
        if ($request->admin_type) {
            $userData['admin_type'] = $request->admin_type;
        }

        return response()->json([
            'token'          => $token,
            'user'           => $userData,
            'redirect_route' => $user->redirect_route,
            'first_login'    => $user->first_login,
        ]);
    }

    /**
     * ME — Utilisateur connecté
     */
    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès.']);
    }

    /**
     * CHANGE PASSWORD (1ère connexion)
     */
    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|min:8|confirmed',
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => 'Le mot de passe actuel est incorrect.',
            ]);
        }

        $user->update([
            'password'    => Hash::make($request->password),
            'first_login' => false,
        ]);

        return response()->json(['message' => 'Mot de passe modifié avec succès.']);
    }

    /**
     * FORGOT PASSWORD — Envoyer le lien de réinitialisation
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        // Toujours répondre 200 pour éviter l'énumération
        if (! $user) {
            return response()->json([
                'message' => 'Si cet email existe, un lien de réinitialisation a été envoyé.',
            ]);
        }

        $status = Password::sendResetLink(['email' => $request->email]);

        return response()->json([
            'message' => 'Lien de réinitialisation envoyé. Vérifiez votre boîte mail.',
        ]);
    }

    /**
     * RESET PASSWORD
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token'    => 'required',
            'email'    => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->update([
                    'password'    => Hash::make($password),
                    'first_login' => false,
                ]);
                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Lien invalide ou expiré.'], 422);
        }

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès.']);
    }

    /**
     * Format user for response
     */
    private function formatUser(User $user): array
    {
        return [
            'id'           => $user->id,
            'nom'          => $user->nom,
            'prenom'       => $user->prenom,
            'full_name'    => $user->full_name,
            'email'        => $user->email,
            'cin'          => $user->cin,
            'telephone'    => $user->telephone,
            'db_role'      => $user->db_role,
            'grade'        => $user->grade,
            'specialite'   => $user->specialite,
            'departement'  => $user->departement,
            'service'      => $user->service,
            'cne'          => $user->cne,
            'filiere'      => $user->filiere,
            'statut'       => $user->statut,
            'first_login'  => $user->first_login,
            'admin_type'   => $user->admin_type,
            'photo'        => $user->photo ? asset('storage/'.$user->photo) : null,
            'created_at'   => $user->created_at?->toIso8601String(),
            'filieres'     => $user->filieres ?? ($user->filiere ? [$user->filiere] : []),        ];
    }
}