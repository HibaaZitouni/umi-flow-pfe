<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Stage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'etudiant_id', 'entreprise', 'poste', 'ville', 'pays',
        'date_debut', 'date_fin', 'type', 'statut', 'description',
        'tuteur_nom', 'tuteur_email', 'rapport_path',
        'note', 'appreciation', 'validated_by',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin'   => 'date',
    ];

    public function etudiant()  { return $this->belongsTo(User::class, 'etudiant_id'); }
    public function validateur(){ return $this->belongsTo(User::class, 'validated_by'); }
}