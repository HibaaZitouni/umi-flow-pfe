<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware de vérification des rôles Umi-Flow
 * Usage dans routes: ->middleware('role:SUPER_ADMIN,PROFESSEUR')
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Non authentifié.'], 401);
        }

        if ($user->statut !== 'actif') {
            return response()->json([
                'message' => match($user->statut) {
                    'suspendu' => 'Compte suspendu. Contactez l\'administration.',
                    'inactif'  => 'Compte inactif. Contactez l\'administration.',
                    default    => 'Accès refusé.',
                },
            ], 403);
        }

        if (! in_array($user->db_role, $roles)) {
            return response()->json([
                'message' => 'Accès non autorisé. Rôle insuffisant.',
                'required'=> $roles,
                'yours'   => $user->db_role,
            ], 403);
        }

        return $next($request);
    }
}