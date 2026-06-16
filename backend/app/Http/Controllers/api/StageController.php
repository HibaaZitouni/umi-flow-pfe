<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stage;
use App\Models\OffreStage;
use App\Models\DemandeStage;
use Illuminate\Http\Request;

class StageController extends Controller
{
    // GET /api/stages — stages de l'étudiant connecté
    public function index(Request $request)
    {
        $stages = Stage::where('etudiant_id', auth()->id())
            ->orderBy('date_debut', 'desc')
            ->get();
        return response()->json($stages);
    }

    // POST /api/stages — créer un stage
    public function store(Request $request)
    {
        $data = $request->validate([
            'entreprise'   => 'required|string|max:255',
            'poste'        => 'required|string|max:255',
            'ville'        => 'required|string|max:255',
            'pays'         => 'nullable|string|max:255',
            'date_debut'   => 'required|date',
            'date_fin'     => 'required|date|after:date_debut',
            'type'         => 'nullable|in:stage_initiation,stage_fin_etudes,alternance',
            'description'  => 'nullable|string',
            'tuteur_nom'   => 'nullable|string|max:255',
            'tuteur_email' => 'nullable|email|max:255',
        ]);

        $data['etudiant_id'] = auth()->id();
        $data['statut']      = 'en_cours';
        $data['type']        = $data['type'] ?? 'stage_initiation';

        try {
            $stage = Stage::create($data);
            return response()->json($stage, 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la création du stage.',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/stages/{stage} — détail
    public function show(Stage $stage)
    {
        $this->authorize_etudiant($stage);
        return response()->json($stage->load('validateur'));
    }

    // PUT /api/stages/{stage} — modifier
    public function update(Request $request, Stage $stage)
    {
        $this->authorize_etudiant($stage);
        $stage->update($request->only([
            'entreprise', 'poste', 'ville', 'pays',
            'date_debut', 'date_fin', 'description',
            'tuteur_nom', 'tuteur_email',
        ]));
        return response()->json($stage);
    }

    // DELETE /api/stages/{stage}
    public function destroy(Stage $stage)
    {
        $this->authorize_etudiant($stage);
        $stage->delete();
        return response()->json(['message' => 'Stage supprimé.']);
    }

    // GET /api/offres-stages — liste des offres disponibles
    public function offres(Request $request)
    {
        $offres = OffreStage::where('statut', 'ouvert')
            ->where('date_limite_candidature', '>=', now()->toDateString())
            ->orderBy('date_limite_candidature')
            ->get();
        return response()->json($offres);
    }

    // POST /api/offres-stages/{offre}/postuler
    public function postuler(Request $request, OffreStage $offre)
    {
        $data = $request->validate([
            'lettre_motivation' => 'nullable|string',
        ]);
        $demande = DemandeStage::firstOrCreate(
            ['etudiant_id' => auth()->id(), 'offre_id' => $offre->id],
            array_merge($data, [
                'entreprise' => $offre->entreprise,
                'poste'      => $offre->titre,
                'statut'     => 'en_attente',
            ])
        );
        return response()->json($demande, 201);
    }

    // GET /api/mes-demandes — demandes de stage de l'étudiant
    public function mesDemandes()
    {
        $demandes = DemandeStage::where('etudiant_id', auth()->id())
            ->with('offre')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($demandes);
    }

    private function authorize_etudiant(Stage $stage): void
    {
        if ($stage->etudiant_id !== auth()->id()) {
            abort(403, 'Accès non autorisé.');
        }
    }
}