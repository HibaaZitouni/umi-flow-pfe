<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeStage extends Model
{
    protected $table = 'demandes_stages';

    protected $fillable = [
        'etudiant_id', 'offre_id', 'entreprise', 'poste',
        'lettre_motivation', 'statut', 'commentaire_admin', 'traite_par',
    ];

    public function etudiant() { return $this->belongsTo(User::class, 'etudiant_id'); }
    public function offre()    { return $this->belongsTo(OffreStage::class, 'offre_id'); }
    public function traitePar(){ return $this->belongsTo(User::class, 'traite_par'); }
}