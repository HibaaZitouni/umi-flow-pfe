<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model {
    protected $fillable = ['code','nom','capacite','type','equipements','disponible'];
    protected $casts = ['equipements'=>'array','disponible'=>'boolean'];

    public function seances() { return $this->hasMany(Seance::class); }
    public function reservations() { return $this->hasMany(Reservation::class); }
}