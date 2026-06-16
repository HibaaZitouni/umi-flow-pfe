<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        if ($user->db_role === 'ETUDIANT') {
            return response()->json(
                Note::where('etudiant_id', $user->id)->with('matiere.filiere')->get()
            );
        }
        $query = Note::with(['etudiant', 'matiere']);
        if ($request->filiere) {
            $query->whereHas('matiere', fn($q) =>
                $q->whereHas('filiere', fn($q2) => $q2->where('code', $request->filiere))
            );
        }
        return response()->json($query->get());
    }

    public function mesNotes(Request $request)
    {
        $user  = auth()->user();
        $notes = Note::where('etudiant_id', $user->id)
            ->with(['matiere' => fn($q) => $q->with('filiere')])
            ->get();

        $validNotes = $notes->whereNotNull('moyenne');
        $moyenneGen = $validNotes->count() > 0
            ? round($validNotes->avg('moyenne'), 2) : null;

        $mention = match(true) {
            $moyenneGen === null  => null,
            $moyenneGen >= 16     => 'Très Bien',
            $moyenneGen >= 14     => 'Bien',
            $moyenneGen >= 12     => 'Assez Bien',
            $moyenneGen >= 10     => 'Passable',
            default               => 'Insuffisant',
        };

        return response()->json([
            'notes'          => $notes,
            'moyenne_gen'    => $moyenneGen,
            'mention'        => $mention,
            'total_matieres' => $notes->count(),
            'admis'          => $validNotes->where('moyenne', '>=', 10)->count(),
            'rattrapage'     => $validNotes->where('moyenne', '<', 10)->count(),
        ]);
    }

    public function parEtudiant(User $user)
    {
        return response()->json(
            Note::where('etudiant_id', $user->id)->with('matiere.filiere')->get()
        );
    }

    public function update(Request $request, Note $note)
    {
        $data = $request->validate([
            'cc'     => 'nullable|numeric|min:0|max:20',
            'tp'     => 'nullable|numeric|min:0|max:20',
            'examen' => 'nullable|numeric|min:0|max:20',
        ]);
        $note->update($data);
        return response()->json($note);
    }

    public function bulk(Request $request)
    {
        $data = $request->validate([
            'notes'                       => 'required|array',
            'notes.*.etudiant_id'         => 'required|exists:users,id',
            'notes.*.matiere_id'          => 'required|exists:matieres,id',
            'notes.*.semestre'            => 'required|string',
            'notes.*.annee_universitaire' => 'required|string',
        ]);

        $saved = [];
        foreach ($data['notes'] as $n) {
            // Ne pas utiliser array_filter — garde les 0
            $updateData = [];
            if (isset($n['cc']))     $updateData['cc']     = $n['cc'];
            if (isset($n['tp']))     $updateData['tp']     = $n['tp'];
            if (isset($n['examen'])) $updateData['examen'] = $n['examen'];

            $saved[] = Note::updateOrCreate(
                [
                    'etudiant_id'         => $n['etudiant_id'],
                    'matiere_id'          => $n['matiere_id'],
                    'semestre'            => $n['semestre'],
                    'annee_universitaire' => $n['annee_universitaire'],
                ],
                $updateData
            );
        }
        return response()->json(['saved' => count($saved)]);
    }
}