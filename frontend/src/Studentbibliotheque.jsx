import { documents as docAPI, emprunts as empruntAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, BookOpen, Search, Calendar, User,
  BookMarked, Clock, AlertCircle, CheckCircle, XCircle,
  Filter, X, ChevronRight, Hash,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette violette (thème principal #8b5cf6) ── */
const V = {
  primary: "#8b5cf6",
  dark:    "#6d28d9",
  mid:     "#7c3aed",
  light:   "#ede9fe",
  lighter: "#f5f3ff",
  border:  "#c4b5fd",
  grad:    "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
  gradHero:"linear-gradient(135deg, #6d28d9 0%, #8b5cf6 55%, #a78bfa 100%)",
  green:   "#10b981",
  red:     "#ef4444",
  orange:  "#f59e0b",
  blue:    "#3b82f6",
};

/* ── Données des documents ── */
const INIT_DOCUMENTS = [
  {
    id: 1,
    titre: "Introduction à l'intelligence artificielle",
    auteur: "Dr. Ahmed Benali",
    type: "Livre",
    domaine: "Informatique",
    annee: 2022,
    disponible: true,
    exemplaires: 5,
    description: "Ouvrage de référence sur les bases de l'IA, algorithmes et applications.",
  },
  {
    id: 2,
    titre: "Thèse : Optimisation des réseaux de capteurs",
    auteur: "Yassine El Amrani",
    type: "Thèse",
    domaine: "Réseaux",
    annee: 2023,
    disponible: false,
    exemplaires: 1,
    description: "Thèse de doctorat sur les protocoles de communication pour l'IoT.",
  },
  {
    id: 3,
    titre: "PFE : Application de gestion de bibliothèque",
    auteur: "Omar Tazi",
    type: "PFE",
    domaine: "Génie Logiciel",
    annee: 2024,
    disponible: true,
    exemplaires: 2,
    description: "Projet de fin d'études : développement d'une application web avec React et Laravel.",
  },
  {
    id: 4,
    titre: "Mathématiques pour l'ingénieur",
    auteur: "Pr. Fatima Zahra Alaoui",
    type: "Livre",
    domaine: "Mathématiques",
    annee: 2021,
    disponible: false,
    exemplaires: 3,
    description: "Cours et exercices corrigés.",
  },
  {
    id: 5,
    titre: "Thèse : Modélisation climatique",
    auteur: "Khalid Nouri",
    type: "Thèse",
    domaine: "Physique",
    annee: 2020,
    disponible: true,
    exemplaires: 1,
    description: "Étude des variations climatiques dans la région méditerranéenne.",
  },
  {
    id: 6,
    titre: "Data Science pour tous",
    auteur: "Pr. Sofia El Mansouri",
    type: "Livre",
    domaine: "Data Science",
    annee: 2023,
    disponible: true,
    exemplaires: 4,
    description: "Introduction accessible à la data science avec Python.",
  },
  {
    id: 7,
    titre: "PFE : Reconnaissance faciale",
    auteur: "Amine Benjelloun",
    type: "PFE",
    domaine: "Vision par ordinateur",
    annee: 2024,
    disponible: true,
    exemplaires: 1,
    description: "Implémentation d'un système de reconnaissance faciale avec deep learning.",
  },
  {
    id: 8,
    titre: "Réseaux informatiques",
    auteur: "Pr. Rachid El Idrissi",
    type: "Livre",
    domaine: "Réseaux",
    annee: 2020,
    disponible: true,
    exemplaires: 6,
    description: "Cours complet sur les réseaux TCP/IP, routage et sécurité.",
  },
];

const INIT_BORROWINGS = [
  {
    id: 101,
    documentId: 2,
    titre: "Thèse : Optimisation des réseaux de capteurs",
    dateEmprunt: "2025-02-01",
    dateRetourPrevue: "2025-03-01",
    dateRetourEffective: null,
    statut: "en cours",
  },
  {
    id: 102,
    documentId: 4,
    titre: "Mathématiques pour l'ingénieur",
    dateEmprunt: "2025-01-15",
    dateRetourPrevue: "2025-02-15",
    dateRetourEffective: "2025-02-20",
    statut: "retourné",
  },
];

const TYPES = ["tous", "Livre", "Thèse", "PFE"];
const DOMAINES = [
  "tous", "Informatique", "Réseaux", "Mathématiques", "Physique",
  "Génie Logiciel", "Data Science", "Vision par ordinateur",
];

/* ── Type Badge ── */
function TypeBadge({ type }) {
  const styles = {
    Livre: { bg: "#dbeafe", color: "#1d4ed8" },
    Thèse: { bg: "#ede9fe", color: "#7c3aed" },
    PFE: { bg: "#d1fae5", color: "#065f46" },
  };
  const s = styles[type] || styles.Livre;
  return (
    <span style={{
      background: s.bg, color: s.color, fontSize: 11, fontWeight: 700,
      borderRadius: 20, padding: "3px 10px",
    }}>
      {type}
    </span>
  );
}

/* ── NavBar ── */
function NavBar({ navigate, notifOpen, setNotifOpen, profileOpen, setProfileOpen }) {
  const u = (() => { try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; } })();
  const initials = (u.prenom?.[0] || "E").toUpperCase() + (u.nom?.[0] || "").toUpperCase();
  const name = u.prenom && u.nom ? `${u.prenom} ${u.nom}` : "Étudiant";
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: 64, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${V.border}`, display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "0 36px",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 24px rgba(139,92,246,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: V.lighter,
            border: `1px solid ${V.border}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", color: V.primary, fontSize: 13, fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} /> Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: V.primary }}>Bibliothèque</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifOpen ? V.lighter : "#f1f5f9",
              border: `1px solid ${notifOpen ? V.border : "transparent"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", position: "relative",
            }}
          >
            <Bell size={16} color={notifOpen ? V.primary : "#64748b"} />
            <span style={{
              position: "absolute", top: 8, right: 8, width: 7, height: 7,
              borderRadius: "50%", background: "#f97316", border: "1.5px solid white",
            }} />
          </button>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        </div>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setProfileOpen(o => !o)}
            style={{
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              background: V.lighter, border: `1.5px solid ${V.border}`,
              borderRadius: 10, padding: "5px 12px 5px 6px",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: V.grad,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 13, fontWeight: 800,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{name}</div>
              <div style={{ fontSize: 10.5, color: V.primary, fontWeight: 600, marginTop: 1 }}>Étudiant</div>
            </div>
          </div>
          {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function StudentBibliotheque() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("catalogue");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: "tous", domaine: "tous", annee: "" });
  const [documents, setDocuments] = useState(INIT_DOCUMENTS);
  const [borrowings, setBorrowings] = useState(INIT_BORROWINGS);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.auteur.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filters.type === "tous" || doc.type === filters.type;
    const matchesDomaine = filters.domaine === "tous" || doc.domaine === filters.domaine;
    const matchesAnnee = filters.annee === "" || doc.annee.toString() === filters.annee;

    return matchesSearch && matchesType && matchesDomaine && matchesAnnee;
  });

  const handleBorrow = (doc) => {
    if (!doc.disponible) {
      alert("Ce document n'est pas disponible pour le moment.");
      return;
    }
    const today      = new Date().toISOString().split("T")[0];
    const returnDate = new Date(Date.now() + 14*24*60*60*1000).toISOString().split("T")[0];
    const newBorrowing = {
      id: Date.now(), documentId: doc.id, titre: doc.titre,
      dateEmprunt: today, dateRetourPrevue: returnDate,
      dateRetourEffective: null, statut: "en cours",
    };
    setBorrowings([newBorrowing, ...borrowings]);
    setDocuments(docs => docs.map(d =>
      d.id === doc.id ? { ...d, disponible: false, exemplaires: d.exemplaires - 1 } : d
    ));
    // Enregistrer en base
    empruntAPI.create({
      document_id: doc.id, date_emprunt: today,
      date_retour: returnDate, emprunteur_type: "etudiant",
    }).catch(()=>{});
    alert(`✅ Vous avez emprunté "${doc.titre}".\n📅 Date de retour prévue : ${returnDate}`);
  };

  const handleReturn = (borrowing) => {
    const today = new Date().toISOString().split("T")[0];

    setBorrowings(borrowings.map(b =>
      b.id === borrowing.id
        ? {
            ...b,
            dateRetourEffective: today,
            statut: "retourné",
          }
        : b
    ));

    setDocuments(docs =>
      docs.map(d =>
        d.id === borrowing.documentId
          ? { ...d, disponible: true, exemplaires: d.exemplaires + 1 }
          : d
      )
    );

    alert("✅ Document retourné avec succès !");
  };

  const calculateDelay = (dateRetourPrevue) => {
    const today = new Date();
    const due = new Date(dateRetourPrevue);
    const diff = Math.floor((today - due) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 30%, #fef2f2 70%, #f5f3ff 100%)",
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <NavBar
        navigate={navigate}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      {/* ── HERO BAND ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          margin: "28px 40px 0", borderRadius: 20, background: V.gradHero,
          padding: "28px 36px", display: "flex", alignItems: "center",
          justifyContent: "space-between", overflow: "hidden", position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200,
          borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", right: 80, bottom: -60, width: 160, height: 160,
          borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.18)", borderRadius: 20,
            padding: "4px 13px", marginBottom: 12,
          }}>
            <BookOpen size={13} color="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Espace Bibliothèque</span>
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: "white",
            letterSpacing: "-0.5px", margin: "0 0 6px",
          }}>
            Bibliothèque Universitaire
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Consultez, empruntez et gérez vos documents
          </p>
        </div>
      </motion.div>

      {/* ── Contenu principal ── */}
      <div style={{ padding: "28px 40px 60px" }}>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {[
            ["catalogue", "📚 Catalogue"],
            ["mes-emprunts", "📖 Mes emprunts"]
          ].map(([k, l]) => (
            <motion.button
              key={k}
              onClick={() => setActiveTab(k)}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "9px 20px", borderRadius: 10, border: "1.5px solid",
                fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all .2s",
                background: activeTab === k ? V.primary : "white",
                color: activeTab === k ? "white" : "#64748b",
                borderColor: activeTab === k ? V.primary : "#e2e8f0",
              }}
            >
              {l}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── CATALOGUE ── */}
          {activeTab === "catalogue" && (
            <motion.div
              key="catalogue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Barre de recherche et filtres */}
              <div style={{
                background: "white", borderRadius: 18, padding: "20px 24px",
                marginBottom: 24, border: "1px solid #e2e8f0", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", flexDirection: "row", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Search size={18} style={{ position: "absolute", left: 12, top: 12, color: "#94a3b8" }} />
                    <input
                      type="text"
                      placeholder="Rechercher par titre, auteur, description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 12px 10px 38px",
                        border: "1.5px solid #e2e8f0", borderRadius: 10,
                        fontSize: 13, outline: "none", fontFamily: "inherit",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      style={{
                        padding: "10px 14px", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 13, background: "white",
                        fontFamily: "inherit", cursor: "pointer",
                      }}
                    >
                      {TYPES.map(t => <option key={t} value={t}>{t === "tous" ? "Tous types" : t}</option>)}
                    </select>
                    <select
                      value={filters.domaine}
                      onChange={(e) => setFilters({ ...filters, domaine: e.target.value })}
                      style={{
                        padding: "10px 14px", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 13, background: "white",
                        fontFamily: "inherit", cursor: "pointer",
                      }}
                    >
                      {DOMAINES.map(d => <option key={d} value={d}>{d === "tous" ? "Tous domaines" : d}</option>)}
                    </select>
                    <input
                      type="number"
                      placeholder="Année"
                      value={filters.annee}
                      onChange={(e) => setFilters({ ...filters, annee: e.target.value })}
                      style={{
                        width: 90, padding: "10px 12px", border: "1.5px solid #e2e8f0",
                        borderRadius: 10, fontSize: 13, outline: "none", fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Grille des documents */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
                {filteredDocuments.map((doc, idx) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -4, boxShadow: "0 20px 25px -12px rgba(0,0,0,0.15)" }}
                    style={{
                      background: "white", borderRadius: 18, border: "1px solid #e2e8f0",
                      overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ height: 4, background: V.grad }} />
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 42, height: 42, borderRadius: 12, background: V.lighter,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                            <BookOpen size={20} color={V.primary} />
                          </div>
                          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                            {doc.titre}
                          </h3>
                        </div>
                        <TypeBadge type={doc.type} />
                      </div>

                      <div style={{ marginBottom: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#64748b" }}>
                          <User size={14} /> {doc.auteur}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#64748b" }}>
                          <Hash size={14} /> {doc.domaine}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "#64748b" }}>
                          <Calendar size={14} /> {doc.annee}
                        </div>
                      </div>

                      <p style={{ fontSize: 12.5, color: "#94a3b8", marginBottom: 14, lineHeight: 1.5 }}>
                        {doc.description}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          {doc.disponible ? (
                            <>
                              <CheckCircle size={14} color={V.green} />
                              <span style={{ fontSize: 12.5, fontWeight: 600, color: V.green }}>Disponible</span>
                              <span style={{ fontSize: 11, color: "#94a3b8" }}>({doc.exemplaires} ex.)</span>
                            </>
                          ) : (
                            <>
                              <XCircle size={14} color={V.red} />
                              <span style={{ fontSize: 12.5, fontWeight: 600, color: V.red }}>Emprunté</span>
                            </>
                          )}
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: doc.disponible ? 1.02 : 1 }}
                        whileTap={{ scale: doc.disponible ? 0.98 : 1 }}
                        onClick={() => handleBorrow(doc)}
                        disabled={!doc.disponible}
                        style={{
                          width: "100%", padding: "10px", borderRadius: 10, border: "none",
                          background: doc.disponible ? V.grad : "#e2e8f0",
                          color: doc.disponible ? "white" : "#94a3b8",
                          fontSize: 13, fontWeight: 700, cursor: doc.disponible ? "pointer" : "not-allowed",
                          fontFamily: "inherit", transition: "all .2s",
                        }}
                      >
                        {doc.disponible ? "📖 Emprunter" : "❌ Indisponible"}
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredDocuments.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <BookOpen size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                  <p style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>Aucun document trouvé</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── MES EMPRUNTS (sans pénalités) ── */}
          {activeTab === "mes-emprunts" && (
            <motion.div
              key="mes-emprunts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div style={{
                background: "white", borderRadius: 18, border: "1px solid #e2e8f0",
                overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
              }}>
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: V.lighter }}>
                  <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    Mes emprunts
                  </h2>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: "#f8fafc" }}>
                        {["Document", "Date emprunt", "Retour prévu", "Retour effectif", "Statut", "Actions"].map(h => (
                          <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {borrowings.map((borrowing) => {
                        const delay = !borrowing.dateRetourEffective && calculateDelay(borrowing.dateRetourPrevue);
                        const isOverdue = delay > 0;
                        return (
                          <motion.tr
                            key={borrowing.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            whileHover={{ background: "#fafcff" }}
                            style={{ borderBottom: "1px solid #f1f5f9" }}
                          >
                            <td style={{ padding: "14px 16px", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                              {borrowing.titre}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 12.5, color: "#64748b" }}>
                              {borrowing.dateEmprunt}
                            </td>
                            <td style={{ padding: "14px 16px", fontSize: 12.5, color: "#64748b" }}>
                              {borrowing.dateRetourPrevue}
                             </td>
                            <td style={{ padding: "14px 16px", fontSize: 12.5, color: "#64748b" }}>
                              {borrowing.dateRetourEffective || "-"}
                             </td>
                            <td style={{ padding: "14px 16px" }}>
                              <span style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                                background: borrowing.statut === "en cours" && !isOverdue ? "#d1fae5"
                                  : borrowing.statut === "en cours" && isOverdue ? "#fee2e2"
                                  : "#f1f5f9",
                                color: borrowing.statut === "en cours" && !isOverdue ? "#065f46"
                                  : borrowing.statut === "en cours" && isOverdue ? "#991b1b"
                                  : "#64748b",
                              }}>
                                {borrowing.statut === "en cours" && isOverdue ? "⚠️ En retard" : borrowing.statut}
                              </span>
                             </td>
                            <td style={{ padding: "14px 16px" }}>
                              {borrowing.statut === "en cours" && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleReturn(borrowing)}
                                  style={{
                                    padding: "6px 14px", borderRadius: 8, border: "none",
                                    background: V.grad, color: "white", fontSize: 11.5,
                                    fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
                                  }}
                                >
                                  Retourner
                                </motion.button>
                              )}
                             </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {borrowings.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <BookMarked size={48} color="#cbd5e1" style={{ marginBottom: 12 }} />
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#64748b" }}>Aucun emprunt pour le moment</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}