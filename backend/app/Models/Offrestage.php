<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OffreStage extends Model
{
    protected $table = 'offres_stages';

    protected $fillable = [
        'titre', 'entreprise', 'ville', 'pays', 'type',
        'description', 'competences_requises',
        'date_debut', 'date_fin', 'date_limite_candidature',
        'statut', 'contact_email', 'places',
    ];

    protected $casts = [
        'date_debut'               => 'date',
        'date_fin'                 => 'date',
        'date_limite_candidature'  => 'date',
    ];

    public function demandes() { return $this->hasMany(DemandeStage::class, 'offre_id'); }
}