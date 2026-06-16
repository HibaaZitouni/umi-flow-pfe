<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Inscription extends Model {
    protected $fillable = ['evenement_id','user_id','statut'];
    public function evenement() { return $this->belongsTo(Evenement::class); }
    public function user() { return $this->belongsTo(User::class); }
}