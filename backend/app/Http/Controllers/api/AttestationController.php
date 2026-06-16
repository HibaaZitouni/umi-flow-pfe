<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Attestation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AttestationController extends Controller
{
    public function index(Request $request) {
        return response()->json(
            Attestation::with(['demandeur','validatedBy'])
                ->when($request->statut, fn($q,$s) => $q->where('statut',$s))
                ->when($request->search, fn($q,$s) => $q->where(fn($q)=>
                    $q->where('nom_beneficiaire','like',"%$s%")->orWhere('reference','like',"%$s%")))
                ->orderBy('created_at','desc')->paginate(20)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type'             => 'required|in:Attestation de scolarité,Attestation de réussite,Relevé de notes,Attestation de diplôme,Attestation de stage,Scolarité,Réussite,Relevé notes,Participation',
            'motif'            => 'required|string',
            'nom_beneficiaire' => 'required|string',
            'cin_beneficiaire' => 'nullable|string',
            'club_id'          => 'nullable|exists:clubs,id',
            'evenement_id'     => 'nullable|exists:evenements,id',
        ]);
        $data['demandeur_id'] = auth()->id();
        $data['reference']    = Attestation::genererReference();
        $att = Attestation::create($data);
        return response()->json($att, 201);
    }

    public function valider(Attestation $attestation) {
        $attestation->update(['statut'=>'validee','validated_by'=>auth()->id(),'validated_at'=>now()]);
        return response()->json($attestation);
    }

    public function generer(Attestation $attestation) {
        $attestation->update([
            'statut' => 'generee',
            'hash'   => $attestation->genererHash(),
        ]);
        return response()->json($attestation);
    }

    public function signer(Request $request, Attestation $attestation)
    {
        $path = null;
        if ($request->hasFile('signature')) {
            $path = $request->file('signature')->store('signatures','public');
        }
        $attestation->update(['statut'=>'signee','signature_path'=>$path]);
        return response()->json(['message'=>'Attestation signée.','attestation'=>$attestation]);
    }

    public function refuser(Attestation $attestation) {
        $attestation->update(['statut'=>'refusee']);
        return response()->json($attestation);
    }

    public function verifier(string $reference) {
        $att = Attestation::where('reference',$reference)->firstOrFail();
        return response()->json(['valid'=>true,'attestation'=>$att->only(['reference','nom_beneficiaire','type','statut','created_at'])]);
    }
    // GET /api/mes-attestations — attestations de l'étudiant connecté
    public function mesAttestations()
    {
        $attests = Attestation::where('demandeur_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($attests);
    }
}