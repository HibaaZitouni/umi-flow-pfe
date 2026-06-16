<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evenement extends Model {
    use SoftDeletes;
    protected $fillable = ['titre','type','date','heure','lieu','statut','description','capacite','inscrits','organisateur','ressources','budget_total','budget_depenses','club_id','created_by'];
    protected $casts = ['date'=>'date','ressources'=>'array','budget_total'=>'float','budget_depenses'=>'float'];

    public function club() { return $this->belongsTo(Club::class); }
    public function sponsors() { return $this->hasMany(Sponsor::class); }
    public function inscriptions() { return $this->hasMany(Inscription::class); }
    public function createdBy() { return $this->belongsTo(User::class,'created_by'); }

    public function hasPlace(): bool { return $this->inscrits < $this->capacite; }
    public function tauxRemplissage(): float { return $this->capacite > 0 ? round($this->inscrits/$this->capacite*100,1) : 0; }
}