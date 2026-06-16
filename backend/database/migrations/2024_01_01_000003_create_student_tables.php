<?php
// ============================================================
// 2024_01_01_000003_create_student_tables.php
// Tables spécifiques au dashboard étudiant
// ============================================================

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ── STAGES ──────────────────────────────────────────────
        Schema::create('stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('users')->cascadeOnDelete();
            $table->string('entreprise');
            $table->string('poste');
            $table->string('ville');
            $table->string('pays')->default('Maroc');
            $table->date('date_debut');
            $table->date('date_fin');
            $table->enum('type', ['stage_initiation', 'stage_fin_etudes', 'alternance'])->default('stage_initiation');
            $table->enum('statut', ['en_cours', 'termine', 'valide', 'refuse'])->default('en_cours');
            $table->text('description')->nullable();
            $table->string('tuteur_nom')->nullable();
            $table->string('tuteur_email')->nullable();
            $table->string('rapport_path')->nullable();
            $table->float('note')->nullable();
            $table->text('appreciation')->nullable();
            $table->foreignId('validated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        // ── CANDIDATURES STAGES ──────────────────────────────────
        Schema::create('offres_stages', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->string('entreprise');
            $table->string('ville');
            $table->string('pays')->default('Maroc');
            $table->enum('type', ['stage_initiation', 'stage_fin_etudes', 'alternance']);
            $table->text('description');
            $table->text('competences_requises')->nullable();
            $table->date('date_debut');
            $table->date('date_fin');
            $table->date('date_limite_candidature');
            $table->enum('statut', ['ouvert', 'ferme'])->default('ouvert');
            $table->string('contact_email')->nullable();
            $table->integer('places')->default(1);
            $table->timestamps();
        });

        // ── DEMANDES DE STAGE ────────────────────────────────────
        Schema::create('demandes_stages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('etudiant_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('offre_id')->nullable()->constrained('offres_stages')->nullOnDelete();
            $table->string('entreprise');           // si offre libre
            $table->string('poste');
            $table->text('lettre_motivation')->nullable();
            $table->enum('statut', ['en_attente', 'accepte', 'refuse'])->default('en_attente');
            $table->text('commentaire_admin')->nullable();
            $table->foreignId('traite_par')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('demandes_stages');
        Schema::dropIfExists('offres_stages');
        Schema::dropIfExists('stages');
    }
};