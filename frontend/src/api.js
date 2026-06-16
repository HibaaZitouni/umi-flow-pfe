// src/api.js — Service API centralisé Umi-Flow
const BASE = "http://localhost:8000/api";

// Token lu à chaque requête depuis localStorage
function token() {
  return localStorage.getItem("umi_token") || "";
}

async function req(url, method = "GET", body = null) {
  const t = token();
  if (!t) {
    console.error("❌ Pas de token — connectez-vous d'abord");
    throw { status: 401, message: "Non authentifié" };
  }
  const res = await fetch(BASE + url, {
    method,
    headers: {
      "Content-Type":  "application/json",
      "Accept":        "application/json",
      "Authorization": "Bearer " + t,
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error("❌ API " + method + " " + url + " →", res.status, data);
    throw { status: res.status, ...data };
  }
  return data;
}

// ── AUTH ──────────────────────────────────────────────────────
export const auth = {
  login:    (b) => req("/auth/login",    "POST", b),
  register: (b) => req("/auth/register", "POST", b),
  me:       ()  => req("/auth/me"),
  logout:   ()  => req("/auth/logout",   "POST"),
};

// ── ÉVÉNEMENTS ────────────────────────────────────────────────
export const evenements = {
  getAll:      () => req("/evenements"),
  getOne:      (id) => req("/evenements/" + id),
  create:      (b)  => req("/evenements",              "POST",   b),
  publier:     (id) => req("/evenements/" + id + "/publier",  "POST"),
  annuler:     (id) => req("/evenements/" + id + "/annuler",  "POST"),
  inscrire:    (id) => req("/evenements/" + id + "/inscrire", "POST"),
  desinscrire: (id) => req("/evenements/" + id + "/desinscrire", "DELETE"),
};

// ── CLUBS ─────────────────────────────────────────────────────
export const clubs = {
  getAll:    () => req("/clubs"),
  getOne:    (id) => req("/clubs/" + id),
  create:    (b)  => req("/clubs",                  "POST", b),
  rejoindre: (id) => req("/clubs/" + id + "/rejoindre",  "POST"),
  quitter:   (id) => req("/clubs/" + id + "/quitter",    "DELETE"),
  valider:   (id) => req("/clubs/" + id + "/valider",    "POST"),
  suspendre: (id) => req("/clubs/" + id + "/suspendre",  "POST"),
};

// ── DOCUMENTS ─────────────────────────────────────────────────
export const documents = {
  getAll:  (p) => req("/documents" + (p ? "?" + new URLSearchParams(p) : "")),
  getOne:  (id) => req("/documents/" + id),
  create:  (b)  => req("/documents",       "POST",   b),
  update:  (id, b) => req("/documents/" + id, "PUT",  b),
  delete:  (id) => req("/documents/" + id,    "DELETE"),
};

// ── EMPRUNTS ──────────────────────────────────────────────────
export const emprunts = {
  getAll:      () => req("/emprunts"),
  mesEmprunts: () => req("/mes-emprunts"),
  create:      (b)  => req("/emprunts",                   "POST", b),
  retourner:   (id) => req("/emprunts/" + id + "/retourner",  "POST"),
  renouveler:  (id) => req("/emprunts/" + id + "/renouveler", "POST"),
};

// ── SÉANCES EDT ───────────────────────────────────────────────
export const seances = {
  getAll:  () => req("/seances"),
  create:  (b)    => req("/seances",           "POST",   b),
  update:  (id, b) => req("/seances/" + id,    "PUT",    b),
  delete:  (id)   => req("/seances/" + id,     "DELETE"),
};

// ── RÉSERVATIONS ──────────────────────────────────────────────
export const reservations = {
  getAll:    () => req("/reservations"),
  create:    (b)  => req("/reservations",                       "POST", b),
  confirmer: (id) => req("/reservations/" + id + "/confirmer",  "POST"),
  annuler:   (id) => req("/reservations/" + id + "/annuler",    "POST"),
};

// ── ATTESTATIONS ──────────────────────────────────────────────
export const attestations = {
  getAll:          () => req("/attestations"),
  mesAttestations: () => req("/mes-attestations"),
  create:          (b)  => req("/attestations",                  "POST", b),
  valider:         (id) => req("/attestations/" + id + "/valider", "POST"),
  refuser:         (id) => req("/attestations/" + id + "/refuser", "POST"),
  generer:         (id) => req("/attestations/" + id + "/generer", "POST"),
  signer:          (id, b) => req("/attestations/" + id + "/signer", "POST", b),
};

// ── NOTES ─────────────────────────────────────────────────────
export const notes = {
  getAll:      (p)  => req("/notes" + (p ? "?" + new URLSearchParams(p) : "")),
  mesNotes:    ()   => req("/notes/mes-notes"),
  parEtudiant: (id) => req("/notes/etudiant/" + id),
  update:      (id, b) => req("/notes/" + id, "PUT", b),
  bulk:        (b)  => req("/notes/bulk", "POST", b),
};

// ── STAGES ────────────────────────────────────────────────────
export const stages = {
  getAll:      () => req("/stages"),
  create:      (b)  => req("/stages",                             "POST",   b),
  update:      (id, b) => req("/stages/" + id,                    "PUT",    b),
  delete:      (id) => req("/stages/" + id,                       "DELETE"),
  offres:      () => req("/offres-stages"),
  postuler:    (id, b) => req("/offres-stages/" + id + "/postuler", "POST", b),
  mesDemandes: () => req("/mes-demandes"),
};

// ── UTILISATEURS (Super Admin) ────────────────────────────────
export const users = {
  getAll:        () => req("/admin/users"),
  create:        (b)  => req("/admin/users",                          "POST",   b),
  update:        (id, b) => req("/admin/users/" + id,                 "PUT",    b),
  delete:        (id) => req("/admin/users/" + id,                    "DELETE"),
  toggleStatut:  (id) => req("/admin/users/" + id + "/toggle-statut", "POST"),
  resetPassword: (id) => req("/admin/users/" + id + "/reset-password","POST"),
  import:        (b)  => req("/admin/users/import",                   "POST",   b),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const notifications = {
  getAll:   () => req("/notifications"),
  markRead: (id) => req("/notifications/" + id + "/read", "PATCH"),
  markAll:  ()   => req("/notifications/mark-all-read",   "POST"),
};

export default {
  auth, evenements, clubs, documents, emprunts,
  seances, reservations, attestations, notes,
  stages, users, notifications,
};