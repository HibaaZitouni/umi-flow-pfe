<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Club extends Model {
    use SoftDeletes;
    protected $fillable = ['nom','categorie','statut','description','reglement','president_nom','tresorier_nom','prof_referent_id','prof_role','budget','validated_by','validated_at'];
    protected $casts = ['validated_at'=>'datetime','budget'=>'float'];

    public function profReferent() { return $this->belongsTo(User::class,'prof_referent_id'); }
    public function membres() { return $this->belongsToMany(User::class,'club_membres')->withPivot('role_club')->withTimestamps(); }
    public function evenements() { return $this->hasMany(Evenement::class); }
    public function attestations() { return $this->hasMany(Attestation::class); }
    public function validatedBy() { return $this->belongsTo(User::class,'validated_by'); }

    public function valider(User $admin): void {
        $this->update(['statut'=>'actif','validated_by'=>$admin->id,'validated_at'=>now()]);
    }
}