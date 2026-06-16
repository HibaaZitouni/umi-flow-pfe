<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Matiere extends Model {
    protected $fillable = ['nom','code','type','coefficient','filiere_id'];
    protected $casts = ['coefficient'=>'float'];
    public function filiere() { return $this->belongsTo(Filiere::class); }
    public function notes() { return $this->hasMany(Note::class); }
}