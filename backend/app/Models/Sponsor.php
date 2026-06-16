<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Sponsor extends Model {
    protected $fillable = ['evenement_id','nom','montant','type'];
    protected $casts = ['montant'=>'float'];
    public function evenement() { return $this->belongsTo(Evenement::class); }
}