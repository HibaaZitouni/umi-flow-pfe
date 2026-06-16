<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'nom', 'prenom', 'email', 'cin', 'telephone', 'password',
        'db_role', 'grade', 'specialite', 'departement', 'service',
        'cne', 'filiere', 'filieres', 'statut', 'first_login', 'photo', 'admin_type',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'first_login'       => 'boolean',
        'filieres'          => 'array',
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
    ];

    // ── Helpers de rôle ─────────────────────────────────────────
    public function isSuperAdmin(): bool  { return $this->db_role === 'SUPER_ADMIN'; }
    public function isProf(): bool        { return $this->db_role === 'PROFESSEUR'; }
    public function isEtudiant(): bool    { return $this->db_role === 'ETUDIANT'; }
    public function isAdmin(): bool       { return str_starts_with($this->db_role, 'ADMIN'); }
    public function isAdminAttest(): bool { return $this->db_role === 'ADMIN_ATTEST'; }
    public function isAdminBib(): bool    { return $this->db_role === 'ADMIN_BIB'; }
    public function isAdminEdt(): bool    { return $this->db_role === 'ADMIN_EDT'; }

    public function getFullNameAttribute(): string
    {
        return "{$this->prenom} {$this->nom}";
    }

    public function getRedirectRouteAttribute(): string
    {
        return match($this->db_role) {
            'SUPER_ADMIN'   => '/super-admin',
            'ADMIN_ATTEST',
            'ADMIN_BIB',
            'ADMIN_EDT'     => '/admin',
            'ETUDIANT'      => '/student',
            default         => '/teacher',
        };
    }

    // ── Relations ────────────────────────────────────────────────
    public function emprunts()
    {
        return $this->hasMany(Emprunt::class, 'emprunteur_id');
    }

    // ── Relations Étudiant ────────────────────────────────────────
    public function stages()       { return $this->hasMany(Stage::class, 'etudiant_id'); }
    public function notes()        { return $this->hasMany(Note::class, 'etudiant_id'); }
    public function absences()     { return $this->hasMany(Absence::class, 'etudiant_id'); }
    public function inscriptions() { return $this->hasMany(Inscription::class, 'user_id'); }

    public function seances()
    {
        return $this->hasMany(Seance::class, 'enseignant_id');
    }

    public function clubs()
    {
        return $this->belongsToMany(Club::class, 'club_membres')
                    ->withPivot('role_club')
                    ->withTimestamps();
    }

    public function clubsReferent()
    {
        return $this->hasMany(Club::class, 'prof_referent_id');
    }

    public function attestations()
    {
        return $this->hasMany(Attestation::class, 'demandeur_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'demandeur_id');
    }

    // ── Scopes ───────────────────────────────────────────────────
    public function scopeProfs($query)
    {
        return $query->where('db_role', 'PROFESSEUR');
    }

    public function scopeEtudiants($query)
    {
        return $query->where('db_role', 'ETUDIANT');
    }

    public function scopeActifs($query)
    {
        return $query->where('statut', 'actif');
    }
}