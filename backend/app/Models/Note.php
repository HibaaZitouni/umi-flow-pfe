<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Note extends Model {
    protected $fillable = ['etudiant_id','matiere_id','cc','tp','examen','semestre','annee_universitaire'];
    protected $casts = ['cc'=>'float','tp'=>'float','examen'=>'float'];

    public function etudiant() { return $this->belongsTo(User::class,'etudiant_id'); }
    public function matiere() { return $this->belongsTo(Matiere::class); }

    public function getMention(): string {
        $m = $this->moyenne;
        if ($m === null) return '—';
        if ($m >= 16) return 'TB';
        if ($m >= 14) return 'B';
        if ($m >= 12) return 'AB';
        if ($m >= 10) return 'P';
        return 'F';
    }
}