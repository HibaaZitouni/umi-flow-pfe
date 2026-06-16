<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenom');
            $table->string('email')->unique();
            $table->string('cin')->nullable()->unique();
            $table->string('telephone')->nullable();
            $table->string('password');
            $table->enum('db_role', [
                'SUPER_ADMIN', 'ADMIN_EDT', 'ADMIN_BIB',
                'ADMIN_ATTEST', 'PROFESSEUR', 'ETUDIANT',
            ])->default('ETUDIANT');
            $table->string('grade')->nullable();
            $table->string('specialite')->nullable();
            $table->string('departement')->nullable();
            $table->string('service')->nullable();
            $table->string('cne')->nullable()->unique();
            $table->string('filiere')->nullable();
            $table->json('filieres')->nullable();    // tableau des filières enseignées (prof)
            $table->enum('statut', ['actif', 'inactif', 'suspendu'])->default('inactif');
            $table->boolean('first_login')->default(true);
            $table->string('photo')->nullable();
            $table->string('admin_type')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
    }
};