# Umi-Flow — API Reference

Base URL : `http://localhost:8000/api`

Headers requis (routes protégées) :
```
Authorization: Bearer {token}
Accept: application/json
Content-Type: application/json
```

---

## AUTH

### POST /api/auth/login
```json
// Request
{ "email": "ahmed.benali@umi.ac.ma", "password": "Prof@2025!" }

// Response 200
{
  "token": "1|abc...",
  "user": { "id":1, "nom":"Benali", "prenom":"Ahmed", "db_role":"PROFESSEUR", ... },
  "redirect_route": "/home",
  "first_login": false
}

// Response 401 — mauvais credentials
{ "message": "Email ou mot de passe incorrect." }

// Response 403 — compte suspendu
{ "message": "Compte suspendu. Contactez l'administration." }

// Response 429 — rate limit
{ "message": "Trop de tentatives. Réessayez dans 45 secondes." }
```

### POST /api/auth/logout
```json
// Response 200
{ "message": "Déconnecté avec succès." }
```

### GET /api/auth/me
```json
// Response 200
{ "user": { "id":1, "nom":"Benali", ... } }
```

### POST /api/auth/change-password
```json
// Request
{ "current_password": "...", "password": "NewPass@123!", "password_confirmation": "NewPass@123!" }
```

### POST /api/auth/forgot-password
```json
// Request
{ "email": "ahmed.benali@umi.ac.ma" }
// Response 200 (toujours, pour éviter énumération)
{ "message": "Si cet email existe, un lien a été envoyé." }
```

---

## USERS (Super Admin uniquement)

### GET /api/admin/users
```
?search=benali&role=PROFESSEUR&statut=actif
```

### POST /api/admin/users
```json
{
  "nom": "Tazi", "prenom": "Karim",
  "email": "karim.tazi@umi.ac.ma",
  "db_role": "PROFESSEUR",
  "service": "Informatique"
}
// Response 201
{
  "user": { ... },
  "generated_password": "Xk9!mPqR2n#T",
  "message": "Compte créé avec succès."
}
```

### POST /api/admin/users/{id}/toggle-statut
```json
// Response 200
{ "statut": "suspendu", "message": "Statut mis à jour." }
```

### POST /api/admin/users/{id}/reset-password
```json
// Response 200
{ "generated_password": "Yz7@wNvB4k!Q", "message": "MDP réinitialisé." }
```

---

## DOCUMENTS (Bibliothèque)

### GET /api/documents
```
?type=livre&domaine=Informatique&dispo=dispo&search=algorithmique
```

### POST /api/documents (multipart/form-data)
```
type=livre, titre=..., auteurs[]=Cormen, annee=2022,
domaine=Informatique, exemplaires=5, fichier={file}
```

---

## EMPRUNTS

### POST /api/emprunts
```json
{
  "document_id": 1,
  "emprunteur_id": 5,
  "emprunteur_type": "etudiant",
  "date_emprunt": "2025-01-20",
  "date_retour": "2025-02-03"
}
```

### POST /api/emprunts/{id}/retourner
```json
// Response 200
{ "id":1, "statut":"retourne", "date_retour_effective":"2025-01-30" }
```

### POST /api/emprunts/{id}/renouveler
```json
// Response 200
{ "id":1, "date_retour":"2025-02-17", "renouvellements":1 }
// Response 422 — erreur
{ "message": "Impossible : emprunt en retard." }
```

---

## SÉANCES EDT

### GET /api/seances
```
?groupe=GI-L3-G1&enseignant_id=2&salle_id=1
```

### POST /api/seances
```json
{
  "matiere": "Algorithmique",
  "groupe": "GI-L3-G1",
  "jour": "Lundi",
  "slot": "S1",
  "type": "CM",
  "enseignant_id": 2,
  "salle_id": 1
}
// Response 422 — conflit
{ "message": "Conflits détectés", "conflicts": ["salle","enseignant"] }
```

---

## RÉSERVATIONS

### POST /api/reservations
```json
{
  "salle_id": 1,
  "jour": "Lundi",
  "slot": "S3",
  "motif": "TD rattrapé",
  "type": "cours"
}
// Response 422 — conflit
{ "message": "Conflit détecté sur ce créneau." }
```

---

## ATTESTATIONS

### POST /api/attestations
```json
{
  "type": "Participation",
  "motif": "Stage",
  "nom_beneficiaire": "Yassine Amrani",
  "cin_beneficiaire": "AB123456",
  "evenement_id": 1
}
// Response 201
{ "id":1, "reference":"ATT-UMI-3F8A92B1-2025", "statut":"en_attente" }
```

### POST /api/attestations/{id}/signer (multipart)
```
signature={image_file}
```

### GET /api/auth/attestations/verify/{reference}
```json
// Response 200
{ "valid": true, "attestation": { "reference":"...", "statut":"signee", ... } }
```

---

## CLUBS

### POST /api/clubs
```json
{
  "nom": "Club IA & Data",
  "categorie": "ai",
  "description": "...",
  "president_nom": "Rachid Alami",
  "tresorier_nom": "Nour El Houda",
  "prof_referent_id": 2,
  "prof_role": "Membre"
}
```

### POST /api/clubs/{id}/valider
```json
// Response 200
{ "message": "Club validé.", "club": { "statut":"actif", ... } }
```

---

## ÉVÉNEMENTS

### POST /api/evenements/{id}/inscrire
```json
// Response 200
{ "message": "Inscription confirmée.", "inscription": { ... } }
// Response 422
{ "message": "Événement complet." }
```

### POST /api/evenements/{id}/sponsors
```json
{ "nom": "TechMaroc", "montant": 5000, "type": "financier" }
```

---

## NOTES

### PUT /api/notes/{id}
```json
{ "cc": 14.5, "tp": 15.0, "examen": 16.0 }
// Response
{ "note": {...}, "moyenne": 15.4, "mention": "TB" }
```

### POST /api/notes/bulk
```json
{
  "notes": [
    { "etudiant_id":5, "matiere_id":1, "cc":12, "tp":13, "examen":14, "semestre":"S1", "annee_universitaire":"2024-2025" }
  ]
}
```

---

## CODES D'ERREUR

| Code | Description                              |
|------|------------------------------------------|
| 200  | Succès                                   |
| 201  | Créé avec succès                         |
| 401  | Non authentifié                          |
| 403  | Accès refusé (rôle insuffisant)          |
| 404  | Ressource introuvable                    |
| 422  | Données invalides / Conflit métier       |
| 429  | Trop de tentatives (rate limit)          |
| 500  | Erreur serveur                           |