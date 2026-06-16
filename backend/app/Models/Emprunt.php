<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Emprunt extends Model {
    protected $fillable = ['document_id','emprunteur_id','emprunteur_type','date_emprunt','date_retour','date_retour_effective','statut','renouvellements'];
    protected $casts = ['date_emprunt'=>'date','date_retour'=>'date','date_retour_effective'=>'date'];

    public function document() { return $this->belongsTo(Document::class); }
    public function emprunteur() { return $this->belongsTo(User::class,'emprunteur_id'); }

    public function isEnRetard(): bool {
        return !$this->date_retour_effective && now()->gt($this->date_retour);
    }

    public function updateStatut(): void {
        if ($this->date_retour_effective) {
            $this->update(['statut'=>'retourne']);
        } elseif ($this->isEnRetard()) {
            $this->update(['statut'=>'en_retard']);
        }
    }
}