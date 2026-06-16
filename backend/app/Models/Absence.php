<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model {
    protected $fillable = ['etudiant_id','seance_id','justifiee','motif'];
    protected $casts = ['justifiee'=>'boolean'];
    public function etudiant() { return $this->belongsTo(User::class,'etudiant_id'); }
    public function seance() { return $this->belongsTo(Seance::class); }
}