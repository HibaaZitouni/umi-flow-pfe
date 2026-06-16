<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model {
    use SoftDeletes;
    protected $fillable = ['type','titre','auteurs','annee','domaine','isbn','exemplaires','dispo','description','fichier_path','archive','created_by'];
    protected $casts = ['auteurs'=>'array','archive'=>'boolean'];

    public function emprunts() { return $this->hasMany(Emprunt::class); }
    public function createdBy() { return $this->belongsTo(User::class,'created_by'); }

    public function isDisponible(): bool { return $this->dispo > 0; }

    public function decrementerDispo(): void {
        $this->decrement('dispo');
    }
    public function incrementerDispo(): void {
        if ($this->dispo < $this->exemplaires) $this->increment('dispo');
    }
}