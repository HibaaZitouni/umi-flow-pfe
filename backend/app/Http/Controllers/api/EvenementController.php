<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Evenement;
use App\Models\Inscription;
use Illuminate\Http\Request;

class EvenementController extends Controller
{
    public function index(Request $request)
    {
        $query = Evenement::query();
        if ($request->type)   $query->where('type', $request->type);
        if ($request->statut) $query->where('statut', $request->statut);
        return response()->json($query->orderBy('date')->get());
    }

    public function show(Evenement $evenement)
    {
        return response()->json($evenement);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'titre'        => 'required|string|max:255',
            'type'         => 'required|in:academique,institutionnel,club',
            'date'         => 'required|date',
            'heure'        => 'nullable|string',
            'lieu'         => 'required|string|max:255',
            'description'  => 'nullable|string',
            'capacite'     => 'nullable|integer|min:1',
            'organisateur' => 'nullable|string|max:255',
            'budget_total' => 'nullable|numeric',
            'club_id'      => 'nullable|exists:clubs,id',
        ]);

        $data['statut']     = 'planifie';
        $data['inscrits']   = 0;
        $data['created_by'] = auth()->id();
        $data['organisateur'] = $data['organisateur']
            ?? (auth()->user()->prenom . ' ' . auth()->user()->nom);

        $evenement = Evenement::create($data);
        return response()->json($evenement, 201);
    }

    public function publier(Evenement $evenement)
    {
        $evenement->update(['statut' => 'publie']);
        return response()->json($evenement);
    }

    public function annuler(Evenement $evenement)
    {
        $evenement->update(['statut' => 'annule']);
        return response()->json($evenement);
    }

    public function inscrire(Evenement $evenement)
    {
        if ($evenement->inscrits >= $evenement->capacite) {
            return response()->json(['message' => 'Événement complet.'], 422);
        }

        $already = Inscription::where('evenement_id', $evenement->id)
            ->where('user_id', auth()->id())
            ->exists();

        if ($already) {
            return response()->json(['message' => 'Déjà inscrit.'], 422);
        }

        Inscription::create([
            'evenement_id' => $evenement->id,
            'user_id'      => auth()->id(),
            'statut'       => 'confirme',
        ]);

        $evenement->increment('inscrits');

        return response()->json(['message' => 'Inscription confirmée.'], 201);
    }

    public function desinscrire(Evenement $evenement)
    {
        $deleted = Inscription::where('evenement_id', $evenement->id)
            ->where('user_id', auth()->id())
            ->delete();

        if ($deleted) $evenement->decrement('inscrits');

        return response()->json(['message' => 'Désinscription effectuée.']);
    }

    public function addSponsor(Request $request, Evenement $evenement)
    {
        $data = $request->validate([
            'nom'          => 'required|string',
            'montant'      => 'nullable|numeric',
            'type_partenariat' => 'nullable|string',
        ]);
        $sponsor = $evenement->sponsors()->create($data);
        return response()->json($sponsor, 201);
    }
}