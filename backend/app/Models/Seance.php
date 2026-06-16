<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Seance extends Model {
    protected $fillable = ['matiere','groupe','jour','slot','type','couleur','locked','enseignant_id','salle_id'];
    protected $casts = ['locked'=>'boolean'];

    public function enseignant() { return $this->belongsTo(User::class,'enseignant_id'); }
    public function salle() { return $this->belongsTo(Salle::class); }
    public function absences() { return $this->hasMany(Absence::class); }

    public static function hasConflict(string $jour, string $slot, int $salleId, int $enseignantId, string $groupe, ?int $excludeId = null): array {
        $conflicts = [];
        $base = static::where('jour',$jour)->where('slot',$slot);
        if ($excludeId) $base->where('id','!=',$excludeId);

        if ($base->clone()->where('salle_id',$salleId)->exists())
            $conflicts[] = 'salle';
        if ($base->clone()->where('enseignant_id',$enseignantId)->exists())
            $conflicts[] = 'enseignant';
        if ($base->clone()->where('groupe',$groupe)->exists())
            $conflicts[] = 'groupe';

        return $conflicts;
    }
}