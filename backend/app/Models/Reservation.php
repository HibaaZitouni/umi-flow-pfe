<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model {
    protected $fillable = ['salle_id','demandeur_id','jour','slot','motif','type','priorite','statut'];

    public function salle() { return $this->belongsTo(Salle::class); }
    public function demandeur() { return $this->belongsTo(User::class,'demandeur_id'); }

    public static function checkConflict(int $salleId, string $jour, string $slot, ?int $excludeId = null): bool {
        $q = static::where('salle_id',$salleId)->where('jour',$jour)->where('slot',$slot)->whereNotIn('statut',['annulee']);
        if ($excludeId) $q->where('id','!=',$excludeId);

        $edtConflict = Seance::where('salle_id',$salleId)->where('jour',$jour)->where('slot',$slot)->exists();
        return $q->exists() || $edtConflict;
    }
}