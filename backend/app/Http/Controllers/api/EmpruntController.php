<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Emprunt;
use App\Models\Document;
use Illuminate\Http\Request;

class EmpruntController extends Controller
{
    public function index(Request $request)
    {
        $emprunts = Emprunt::with(['document','emprunteur'])
            ->when($request->statut, fn($q,$s) => $q->where('statut',$s))
            ->when($request->search, fn($q,$s) => $q->whereHas('emprunteur',
                fn($q) => $q->where('nom','like',"%$s%")->orWhere('prenom','like',"%$s%")))
            ->orderBy('created_at','desc')
            ->paginate(20);
        // Mettre à jour les statuts en retard
        $emprunts->each(fn($e) => $e->updateStatut());
        return response()->json($emprunts);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'document_id'    => 'required|exists:documents,id',
            'emprunteur_id'  => 'required|exists:users,id',
            'emprunteur_type'=> 'required|in:etudiant,prof,staff',
            'date_emprunt'   => 'required|date',
            'date_retour'    => 'required|date|after:date_emprunt',
        ]);

        $doc = Document::findOrFail($data['document_id']);
        if (! $doc->isDisponible()) {
            return response()->json(['message'=>'Document non disponible.'], 422);
        }

        $emprunt = Emprunt::create(array_merge($data, ['statut'=>'en_cours']));
        $doc->decrementerDispo();
        return response()->json($emprunt->load(['document','emprunteur']), 201);
    }

    public function retourner(Emprunt $emprunt)
    {
        if ($emprunt->statut === 'retourne') {
            return response()->json(['message'=>'Déjà retourné.'], 422);
        }
        $emprunt->update(['statut'=>'retourne','date_retour_effective'=>now()]);
        $emprunt->document->incrementerDispo();
        return response()->json($emprunt);
    }

    public function renouveler(Emprunt $emprunt)
    {
        if ($emprunt->statut === 'en_retard') {
            return response()->json(['message'=>'Impossible : emprunt en retard.'], 422);
        }
        if ($emprunt->renouvellements >= 2) {
            return response()->json(['message'=>'Maximum 2 renouvellements atteint.'], 422);
        }
        $emprunt->update([
            'date_retour'    => now()->addDays(14)->toDateString(),
            'renouvellements'=> $emprunt->renouvellements + 1,
            'statut'         => 'en_cours',
        ]);
        return response()->json($emprunt);
    }
    // GET /api/mes-emprunts — emprunts de l'étudiant connecté
    public function mesEmprunts()
    {
        $emprunts = \App\Models\Emprunt::where('emprunteur_id', auth()->id())
            ->with('document')
            ->orderBy('date_emprunt', 'desc')
            ->get();
        return response()->json($emprunts);
    }
}