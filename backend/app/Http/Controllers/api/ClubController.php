<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Club;
use Illuminate\Http\Request;

class ClubController extends Controller
{
    public function index(Request $request) {
        return response()->json(
            Club::with(['profReferent','membres'])
                ->when($request->statut,    fn($q,$s) => $q->where('statut',$s))
                ->when($request->categorie, fn($q,$c) => $q->where('categorie',$c))
                ->orderBy('created_at','desc')->get()
        );
    }

    public function show(Club $club) {
        return response()->json($club->load(['profReferent','membres','evenements']));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom'             => 'required|string',
            'categorie'       => 'required|string',
            'description'     => 'required|string',
            'reglement'       => 'nullable|string',
            'president_nom'   => 'required|string',
            'tresorier_nom'   => 'required|string',
            'prof_referent_id'=> 'required|exists:users,id',
            'prof_role'       => 'required|in:Président,Membre,Conseiller',
        ]);
        $club = Club::create($data);
        return response()->json($club, 201);
    }

    public function valider(Club $club) {
        $club->valider(auth()->user());
        return response()->json(['message'=>'Club validé.','club'=>$club]);
    }

    public function suspendre(Club $club) {
        $club->update(['statut'=>'suspendu']);
        return response()->json(['message'=>'Club suspendu.']);
    }
    // POST /api/clubs/{club}/rejoindre
    public function rejoindre(\App\Models\Club $club)
    {
        $club->membres()->syncWithoutDetaching([
            auth()->id() => ['role_club' => 'membre']
        ]);
        return response()->json(['message' => 'Rejoint le club avec succès.']);
    }

    // DELETE /api/clubs/{club}/quitter
    public function quitter(\App\Models\Club $club)
    {
        $club->membres()->detach(auth()->id());
        return response()->json(['message' => 'Vous avez quitté le club.']);
    }
}