<?php
// ============================================================
// 2024_01_01_000002_create_core_tables.php
// Toutes les tables métier Umi-Flow
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── DOCUMENTS (Bibliothèque) ─────────────────────────────
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['livre', 'these', 'pfe', 'article', 'rapport']);
            $table->string('titre');
            $table->json('auteurs');           // ["Nom1", "Nom2"]
            $table->year('annee');
            $table->string('domaine');
            $table->string('isbn')->nullable();
            $table->integer('exemplaires')->default(1);
            $table->integer('dispo')->default(1);
            $table->text('description')->nullable();
            $table->string('fichier_path')->nullable();
            $table->boolean('archive')->default(false);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // ── EMPRUNTS ─────────────────────────────────────────────
        Schema::create('emprunts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('document_id')->constrained()->cascadeOnDelete();
            $table->foreignId('emprunteur_id')->constrained('users')->cascadeOnDelete();
            $table->enum('emprunteur_type', ['etudiant', 'prof', 'staff']);
            $table->date('date_emprunt');
            $table->date('date_retour');
            $table->date('date_retour_effective')->nullable();
            $table->enum('statut', ['en_cours', 'en_retard', 'retourne'])->default('en_cours');
            $table->integer('renouvellements')->default(0);
            $table->timestamps();
        });

        // ── ARCHIVE POLICIES ─────────────────────────────────────
        Schema::create('archive_policies', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['Livre', 'Thèse', 'PFE', 'Article', 'Rapport']);
            $table->string('libelle');
            $table->string('duree_conservation');   // "5 ans", "Permanent"
            $table->enum('statut', ['actif', 'expire'])->default('actif');
            $table->date('date_debut');
            $table->integer('nb_docs')->default(0);
            $table->enum('action', ['conserver', 'anonymiser', 'supprimer']);
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
        });

        // ── CLUBS ────────────────────────────────────────────────
        Schema::create('clubs', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('categorie');
            $table->enum('statut', ['actif', 'en_attente', 'suspendu'])->default('en_attente');
            $table->text('description')->nullable();
            $table->text('reglement')->nullable();
            $table->string('president_nom');
            $table->string('tresorier_nom');
            $table->foreignId('prof_referent_id')->constrained('users');
            $table->enum('prof_role', ['Président', 'Membre', 'Conseiller'])->default('Membre');
            $table->decimal('budget', 10, 2)->default(0);
            $table->foreignId('validated_by')->nullable()->constrained('users');
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // ── CLUB MEMBRES ─────────────────────────────────────────
        Schema::create('club_membres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('club_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('role_club', ['president', 'tresorier', 'membre'])->default('membre');
            $table->timestamps();
            $table->unique(['club_id', 'user_id']);
        });

        // ── ÉVÉNEMENTS ───────────────────────────────────────────
        Schema::create('evenements', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->enum('type', ['academique', 'institutionnel', 'club']);
            $table->date('date');
            $table->time('heure')->nullable();
            $table->string('lieu');
            $table->enum('statut', ['planifie', 'publie', 'termine', 'annule'])->default('planifie');
            $table->text('description')->nullable();
            $table->integer('capacite')->default(50);
            $table->integer('inscrits')->default(0);
            $table->string('organisateur');
            $table->json('ressources')->nullable();     // ["Micro", "Projecteur"]
            $table->decimal('budget_total', 10, 2)->default(0);
            $table->decimal('budget_depenses', 10, 2)->default(0);
            $table->foreignId('club_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });

        // ── SPONSORS ─────────────────────────────────────────────
        Schema::create('sponsors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evenement_id')->constrained()->cascadeOnDelete();
            $table->string('nom');
            $table->decimal('montant', 10, 2);
            $table->enum('type', ['financier', 'materiel', 'institutionnel']);
            $table->timestamps();
        });

        // ── INSCRIPTIONS ÉVÉNEMENTS ──────────────────────────────
        Schema::create('inscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evenement_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->enum('statut', ['confirme', 'en_attente', 'annule'])->default('confirme');
            $table->timestamps();
            $table->unique(['evenement_id', 'user_id']);
        });

        // ── SALLES ───────────────────────────────────────────────
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();       // A101, B204
            $table->string('nom');
            $table->integer('capacite');
            $table->enum('type', ['CM', 'TD', 'TP']);
            $table->json('equipements')->nullable();
            $table->boolean('disponible')->default(true);
            $table->timestamps();
        });

        // ── EDT SÉANCES ───────────────────────────────────────────
        Schema::create('seances', function (Blueprint $table) {
            $table->id();
            $table->string('matiere');
            $table->string('groupe');
            $table->string('jour');
            $table->string('slot');                 // S1, S2, S3, S4
            $table->enum('type', ['CM', 'TD', 'TP']);
            $table->string('couleur')->default('#10b981');
            $table->boolean('locked')->default(false);
            $table->foreignId('enseignant_id')->constrained('users');
            $table->foreignId('salle_id')->constrained('salles');
            $table->timestamps();

            // Contraintes dures : unicité par créneau
            $table->unique(['salle_id', 'jour', 'slot'], 'unique_salle_creneau');
            $table->unique(['enseignant_id', 'jour', 'slot'], 'unique_prof_creneau');
            $table->unique(['groupe', 'jour', 'slot'], 'unique_groupe_creneau');
        });

        // ── RÉSERVATIONS ─────────────────────────────────────────
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salle_id')->constrained('salles');
            $table->foreignId('demandeur_id')->constrained('users');
            $table->string('jour');
            $table->string('slot');
            $table->string('motif');
            $table->enum('type', ['cours', 'evenement', 'club']);
            $table->integer('priorite');            // 1=cours, 2=événement, 3=club
            $table->enum('statut', ['en_attente', 'confirmee', 'annulee', 'conflit'])
                  ->default('en_attente');
            $table->timestamps();

            // Clé composée : une ressource par créneau
            $table->unique(['salle_id', 'jour', 'slot'], 'unique_resa_creneau');
        });

        // ── ATTESTATIONS ─────────────────────────────────────────
        Schema::create('attestations', function (Blueprint $table) {
            $table->id();
            $table->string('reference')->unique();
            $table->foreignId('demandeur_id')->constrained('users');
            $table->enum('type', ['Scolarité', 'Réussite', 'Relevé notes', 'Participation']);
            $table->string('motif');
            $table->string('cin_beneficiaire')->nullable();
            $table->string('nom_beneficiaire');
            $table->enum('statut', ['en_attente', 'validee', 'generee', 'refusee', 'signee'])
                  ->default('en_attente');
            $table->foreignId('validated_by')->nullable()->constrained('users');
            $table->timestamp('validated_at')->nullable();
            $table->string('signature_path')->nullable();
            $table->foreignId('club_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('evenement_id')->nullable()->constrained()->nullOnDelete();
            $table->string('hash')->nullable();     // SHA256 pour vérification
            $table->timestamps();
        });

        // ── NOTIFICATIONS ─────────────────────────────────────────
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('type');
            $table->morphs('notifiable');
            $table->text('data');
            $table->timestamp('read_at')->nullable();
            $table->timestamps();
        });

        // ── FILIERES & MATIERES (référentiel pédagogique) ────────
        Schema::create('filieres', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();       // GI-L3, AI-M1
            $table->string('label');
            $table->string('departement');
            $table->boolean('actif')->default(true);
            $table->timestamps();
        });

        Schema::create('matieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code')->unique();
            $table->enum('type', ['CM', 'TD', 'TP']);
            $table->float('coefficient')->default(1);
            $table->foreignId('filiere_id')->constrained();
            $table->timestamps();
        });

        // ── NOTES ───────────────────────────────────────────────
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('matiere_id')->constrained()->cascadeOnDelete();
            $table->float('cc')->nullable();
            $table->float('tp')->nullable();
            $table->float('examen')->nullable();
            $table->float('moyenne')->nullable()->storedAs('(cc * 0.30 + tp * 0.20 + examen * 0.50)');
            $table->string('semestre');
            $table->string('annee_universitaire');
            $table->timestamps();
            $table->unique(['etudiant_id', 'matiere_id', 'semestre', 'annee_universitaire']);
        });

        // ── ABSENCES ─────────────────────────────────────────────
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('seance_id')->constrained()->cascadeOnDelete();
            $table->boolean('justifiee')->default(false);
            $table->text('motif')->nullable();
            $table->timestamps();
        });

        // ── AUDIT LOG ─────────────────────────────────────────────
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('action');               // create, update, delete, login
            $table->string('model_type')->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('absences');
        Schema::dropIfExists('notes');
        Schema::dropIfExists('matieres');
        Schema::dropIfExists('filieres');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('attestations');
        Schema::dropIfExists('reservations');
        Schema::dropIfExists('seances');
        Schema::dropIfExists('salles');
        Schema::dropIfExists('inscriptions');
        Schema::dropIfExists('sponsors');
        Schema::dropIfExists('evenements');
        Schema::dropIfExists('club_membres');
        Schema::dropIfExists('clubs');
        Schema::dropIfExists('archive_policies');
        Schema::dropIfExists('emprunts');
        Schema::dropIfExists('documents');
    }
};