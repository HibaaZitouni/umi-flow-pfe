<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Attestation extends Model {
    protected $fillable = ['reference','demandeur_id','type','motif','cin_beneficiaire','nom_beneficiaire','statut','validated_by','validated_at','signature_path','club_id','evenement_id','hash'];
    protected $casts = ['validated_at'=>'datetime'];

    public function demandeur() { return $this->belongsTo(User::class,'demandeur_id'); }
    public function validatedBy() { return $this->belongsTo(User::class,'validated_by'); }
    public function club() { return $this->belongsTo(Club::class); }
    public function evenement() { return $this->belongsTo(Evenement::class); }

    public static function genererReference(): string {
        return 'ATT-UMI-'.strtoupper(substr(md5(uniqid()),0,8)).'-'.date('Y');
    }
    public function genererHash(): string {
        return hash('sha256', $this->reference.$this->nom_beneficiaire.$this->created_at);
    }
}