<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model {
    protected $fillable = ['code','label','departement','actif'];
    protected $casts = ['actif'=>'boolean'];
    public function matieres() { return $this->hasMany(Matiere::class); }
    public function etudiants() { return $this->hasMany(User::class,'filiere','code'); }
}