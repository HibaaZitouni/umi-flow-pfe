<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Seance;
use Illuminate\Http\Request;

class SeanceController extends Controller
{
    public function index(Request $request)
    {
        $seances = Seance::with(['enseignant','salle'])
            ->when($request->groupe,      fn($q,$g) => $q->where('groupe',$g))
            ->when($request->enseignant_id,fn($q,$e) => $q->where('enseignant_id',$e))
            ->when($request->salle_id,    fn($q,$s) => $q->where('salle_id',$s))
            ->get();
        return response()->json($seances);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'matiere'      => 'required|string',
            'groupe'       => 'required|string',
            'jour'         => 'required|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'slot'         => 'required|in:S1,S2,S3,S4',
            'type'         => 'required|in:CM,TD,TP',
            'couleur'      => 'nullable|string',
            'enseignant_id'=> 'required|exists:users,id',
            'salle_id'     => 'required|exists:salles,id',
        ]);

        // Vérification des contraintes dures
        $conflicts = Seance::hasConflict(
            $data['jour'], $data['slot'],
            $data['salle_id'], $data['enseignant_id'], $data['groupe']
        );

        if (!empty($conflicts)) {
            return response()->json([
                'message'   => 'Conflits détectés',
                'conflicts' => $conflicts,
            ], 422);
        }

        $seance = Seance::create($data);
        return response()->json($seance->load(['enseignant','salle']), 201);
    }

    public function destroy(Seance $seance) {
        $seance->delete();
        return response()->json(['message'=>'Séance supprimée.']);
    }
}