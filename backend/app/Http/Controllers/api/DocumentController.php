<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $docs = Document::query()
            ->when($request->type,    fn($q,$t) => $q->where('type',$t))
            ->when($request->domaine, fn($q,$d) => $q->where('domaine',$d))
            ->when($request->dispo,   fn($q,$d) => $d === 'dispo' ? $q->where('dispo','>',0) : $q->where('dispo',0))
            ->when($request->search,  fn($q,$s) => $q->where(fn($q) =>
                $q->where('titre','like',"%$s%")->orWhereJsonContains('auteurs',$s)))
            ->where('archive',false)
            ->orderBy('created_at','desc')
            ->paginate(15);
        return response()->json($docs);
    }

    public function show(Document $document) { return response()->json($document->load('emprunts.emprunteur')); }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type'        => 'required|in:livre,these,pfe,article,rapport',
            'titre'       => 'required|string',
            'auteurs'     => 'required|array',
            'annee'       => 'required|integer',
            'domaine'     => 'required|string',
            'isbn'        => 'nullable|string',
            'exemplaires' => 'integer|min:1',
            'description' => 'nullable|string',
        ]);
        $data['dispo'] = $data['exemplaires'] ?? 1;
        $data['created_by'] = auth()->id();

        if ($request->hasFile('fichier')) {
            $data['fichier_path'] = $request->file('fichier')->store('documents','public');
        }
        $doc = Document::create($data);
        return response()->json($doc, 201);
    }

    public function update(Request $request, Document $document)
    {
        $document->update($request->only(['titre','auteurs','annee','domaine','isbn','exemplaires','description']));
        return response()->json($document);
    }

    public function destroy(Document $document) { $document->delete(); return response()->json(['message'=>'Supprimé.']); }
}