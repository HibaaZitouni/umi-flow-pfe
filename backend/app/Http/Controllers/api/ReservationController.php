<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index() {
        return response()->json(Reservation::with(['salle','demandeur'])->orderBy('created_at','desc')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'salle_id'   => 'required|exists:salles,id',
            'jour'       => 'required|string',
            'slot'       => 'required|in:S1,S2,S3,S4',
            'motif'      => 'required|string',
            'type'       => 'required|in:cours,evenement,club',
        ]);
        $data['demandeur_id'] = auth()->id();
        $data['priorite'] = match($data['type']) { 'cours'=>1,'evenement'=>2,'club'=>3 };

        // Clé composée : vérifier conflit
        if (Reservation::checkConflict($data['salle_id'],$data['jour'],$data['slot'])) {
            return response()->json(['message'=>'Conflit détecté sur ce créneau.'], 422);
        }

        $resa = Reservation::create(array_merge($data,['statut'=>'en_attente']));
        return response()->json($resa->load(['salle','demandeur']), 201);
    }

    public function confirmer(Reservation $reservation) {
        $reservation->update(['statut'=>'confirmee']);
        return response()->json($reservation);
    }

    public function annuler(Reservation $reservation) {
        $reservation->update(['statut'=>'annulee']);
        return response()->json($reservation);
    }
}