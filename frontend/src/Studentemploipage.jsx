import { seances as seancesAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Calendar, Clock, MapPin, User, BookOpen,
  AlertCircle, ChevronRight, Search,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette verte ── */
const G = {
  primary: "#10b981",
  dark:    "#064e3b",
  mid:     "#059669",
  light:   "#d1fae5",
  lighter: "#ecfdf5",
  border:  "#a7f3d0",
  grad:    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  gradHero:"linear-gradient(135deg, #064e3b 0%, #10b981 55%, #34d399 100%)",
};

const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const SLOTS = [
  { id: "S1", label: "08:30 – 10:00" },
  { id: "S2", label: "10:15 – 11:45" },
  { id: "S3", label: "12:15 – 13:45" },
  { id: "S4", label: "14:00 – 15:30" },
  { id: "S5", label: "15:45 – 17:15" },
];

/* ── Données des cours ── */
const COURS_FALLBACK = [
  { jour: "Lundi",    slot: "S1", matiere: "Algorithmique avancée", salle: "Amphi A",    enseignant: "Prof. Benali",  type: "CM" },
  { jour: "Lundi",    slot: "S3", matiere: "Base de données",       salle: "Salle 102",  enseignant: "Prof. Berrada", type: "TD" },
  { jour: "Mercredi", slot: "S2", matiere: "Réseaux",               salle: "Salle 103",  enseignant: "Prof. Benali",  type: "CM" },
  { jour: "Jeudi",    slot: "S5", matiere: "Algorithmique",         salle: "Amphi A",    enseignant: "Prof. Benali",  type: "CM" },
  { jour: "Vendredi", slot: "S1", matiere: "POO",                   salle: "Labo Info",  enseignant: "Prof. Tazi",    type: "TP" },
];

const EXAMENS = [
  { id: 1, matiere: "Algorithmique", date: "2025-06-15", heure: "09:00", salle: "Amphi A" },
  { id: 2, matiere: "Base de données", date: "2025-06-18", heure: "14:00", salle: "Salle 102" },
  { id: 3, matiere: "Réseaux", date: "2025-06-22", heure: "09:00", salle: "Amphi B" },
];

const TYPE_COLORS = { CM: "#10b981", TD: "#3b82f6", TP: "#8b5cf6" };
const TYPE_LABELS = { CM: "📖 Cours", TD: "📝 TD", TP: "💻 TP" };

function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] || G.primary;
  return (
    <span style={{
      background: color + "18", color: color,
      fontSize: 10, fontWeight: 700, borderRadius: 20,
      padding: "2px 8px", display: "inline-block",
    }}>
      {TYPE_LABELS[type] || type}
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
      transition={{ duration: 0.55 }}
      style={{
        height: 64, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${G.border}`, display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "0 36px",
        position: "sticky", top: 0, zIndex: 100,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: G.lighter,
            border: `1px solid ${G.border}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", color: G.primary, fontSize: 13, fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} /> Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: G.primary }}>Emploi du temps</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={() => setNotifOpen(o => !o)}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: notifOpen ? G.lighter : "#f1f5f9",
            border: `1px solid ${notifOpen ? G.border : "transparent"}`,
            cursor: "pointer", display: "flex", alignItems: "center",
            justifyContent: "center", position: "relative",
          }}
        >
          <Bell size={16} color={notifOpen ? G.primary : "#64748b"} />
        </button>
        {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        
        <div
          onClick={() => setProfileOpen(o => !o)}
          style={{
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            background: G.lighter, border: `1.5px solid ${G.border}`,
            borderRadius: 10, padding: "5px 12px 5px 6px",
          }}
        >
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: G.grad,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 800,
          }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{name}</div>
            <div style={{ fontSize: 10.5, color: G.primary, fontWeight: 600, marginTop: 1 }}>Étudiant</div>
          </div>
        </div>
        {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function StudentEmploiPage() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("emploi");
  const [COURS, setCOURS] = useState(COURS_FALLBACK);

  useEffect(() => {
    const filiere = (() => { try { return JSON.parse(localStorage.getItem("umi_user"))?.filiere || ""; } catch { return ""; } })();
    seancesAPI.getAll(filiere ? { groupe: filiere } : {})
      .then(d => {
        const list = Array.isArray(d) ? d : (d?.data || []);
        if (list.length > 0) {
          setCOURS(list.map(s => ({
            jour: s.jour,
            slot: s.slot,
            matiere: s.matiere,
            salle: s.salle?.code || s.salle || "—",
            enseignant: s.enseignant ? (s.enseignant.prenom + " " + s.enseignant.nom) : "—",
            type: s.type,
          })));
        }
      })
      .catch(() => {});
  }, []);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("tous");

  // Filtrer les cours
  const coursFiltres = COURS.filter(c => {
    const matchSearch = searchTerm === "" ||
      c.matiere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.enseignant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.salle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === "tous" || c.type === filterType;
    return matchSearch && matchType;
  });

  // Créer la grille
  const getCoursAt = (jour, slot) => {
    return coursFiltres.find(c => c.jour === jour && c.slot === slot);
  };

  // Examens de la semaine
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  const examensSemaine = EXAMENS.filter(e => {
    const examDate = new Date(e.date);
    return examDate >= today && examDate <= nextWeek;
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #ecfdf5 0%, #d1fae5 30%, #f0fdf4 100%)",
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

      {/* Hero */}
      <div style={{
        margin: "28px 40px 0", borderRadius: 20, background: G.gradHero,
        padding: "28px 36px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.18)", borderRadius: 20,
            padding: "4px 13px", marginBottom: 12,
          }}>
            <Calendar size={13} color="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Espace Étudiant</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: "0 0 6px" }}>
            Mon Emploi du temps 
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>
            Consultez vos cours et examens
          </p>
        </div>
      </div>

      {/* Contenu principal */}
      <div style={{ padding: "28px 40px 60px" }}>

        {/* Alerte examens */}
        {examensSemaine.length > 0 && (
          <div style={{
            marginBottom: 20, padding: "14px 18px", background: "#fef3c7",
            borderLeft: `4px solid #f59e0b`, borderRadius: 12,
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <AlertCircle size={18} color="#d97706" />
            <span style={{ fontSize: 13, fontWeight: 500, color: "#92400e" }}>
              ⚠️ Vous avez {examensSemaine.length} examen(s) cette semaine !
            </span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          <button
            onClick={() => setActiveTab("emploi")}
            style={{
              padding: "9px 20px", borderRadius: 10, border: "1.5px solid",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              background: activeTab === "emploi" ? G.primary : "white",
              color: activeTab === "emploi" ? "white" : "#64748b",
              borderColor: activeTab === "emploi" ? G.primary : "#e2e8f0",
            }}
          >
            📅 Emploi du temps
          </button>
          <button
            onClick={() => setActiveTab("examens")}
            style={{
              padding: "9px 20px", borderRadius: 10, border: "1.5px solid",
              fontSize: 13, fontWeight: 700, cursor: "pointer",
              background: activeTab === "examens" ? G.primary : "white",
              color: activeTab === "examens" ? "white" : "#64748b",
              borderColor: activeTab === "examens" ? G.primary : "#e2e8f0",
            }}
          >
            📝 Examens
          </button>
        </div>

        {/* TAB EMPLOI DU TEMPS */}
        {activeTab === "emploi" && (
          <div>
            {/* Filtres */}
            <div style={{
              background: "white", borderRadius: 18, padding: "16px 20px",
              marginBottom: 20, border: "1px solid #e2e8f0",
              display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center",
            }}>
              <div style={{ flex: 1, position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: 12, top: 10, color: "#94a3b8" }} />
                <input
                  type="text"
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 12px 8px 36px",
                    border: "1.5px solid #e2e8f0", borderRadius: 10,
                    fontSize: 13, outline: "none", fontFamily: "inherit",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                {["tous", "CM", "TD", "TP"].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilterType(t)}
                    style={{
                      padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      background: filterType === t ? G.primary : "white",
                      color: filterType === t ? "white" : "#64748b",
                      borderColor: filterType === t ? G.primary : "#e2e8f0",
                    }}
                  >
                    {t === "tous" ? "Tous" : t === "CM" ? "📖 Cours" : t === "TD" ? "📝 TD" : "💻 TP"}
                  </button>
                ))}
              </div>
            </div>

            {/* Tableau EDT */}
            <div style={{
              background: "white", borderRadius: 20, border: "1px solid #e2e8f0",
              overflow: "auto", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
            }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                <thead>
                  <tr>
                    <th style={{ padding: "14px 12px", background: G.lighter, fontSize: 13, fontWeight: 700, color: G.dark, borderBottom: `2px solid ${G.border}`, width: 110 }}>Créneau</th>
                    {JOURS.map(j => (
                      <th key={j} style={{ padding: "14px 8px", background: G.lighter, textAlign: "center", fontSize: 13, fontWeight: 700, color: G.dark, borderBottom: `2px solid ${G.border}` }}>{j}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SLOTS.map((slot) => (
                    <tr key={slot.id}>
                      <td style={{ padding: "12px 8px", background: "#f8fafc", fontSize: 12, fontWeight: 600, color: "#64748b", textAlign: "center", borderBottom: "1px solid #e2e8f0" }}>
                        {slot.label}
                      </td>
                      {JOURS.map(jour => {
                        const cours = getCoursAt(jour, slot.id);
                        return (
                          <td key={`${jour}-${slot.id}`} style={{ padding: "8px", borderBottom: "1px solid #e2e8f0", verticalAlign: "top" }}>
                            {cours ? (
                              <div style={{ background: `${TYPE_COLORS[cours.type]}10`, borderLeft: `3px solid ${TYPE_COLORS[cours.type]}`, borderRadius: 8, padding: "8px" }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{cours.matiere}</div>
                                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>👤 {cours.enseignant}</div>
                                <div style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>📍 {cours.salle}</div>
                                <TypeBadge type={cours.type} />
                              </div>
                            ) : (
                              <div style={{ height: 85, background: "#fafcff", border: "1px dashed #e2e8f0", borderRadius: 8 }} />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Légende */}
            <div style={{
              marginTop: 16, display: "flex", gap: 20, justifyContent: "center",
              padding: "10px", background: "white", borderRadius: 12,
              border: "1px solid #e2e8f0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: TYPE_COLORS.CM }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>Cours (CM)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: TYPE_COLORS.TD }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>TD</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: TYPE_COLORS.TP }} />
                <span style={{ fontSize: 12, color: "#64748b" }}>TP</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB EXAMENS */}
        {activeTab === "examens" && (
          <div style={{
            background: "white", borderRadius: 20, border: "1px solid #e2e8f0",
            overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", background: G.lighter }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>Examens à venir</h2>
            </div>
            <div style={{ padding: "20px 24px" }}>
              {EXAMENS.length === 0 ? (
                <p style={{ textAlign: "center", color: "#64748b" }}>Aucun examen programmé</p>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
                  {EXAMENS.map((exam) => (
                    <div key={exam.id} style={{ background: G.lighter, borderRadius: 14, padding: "16px", border: `1px solid ${G.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: G.grad, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <BookOpen size={18} color="white" />
                        </div>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{exam.matiere}</h3>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                          <Calendar size={14} /> {new Date(exam.date).toLocaleDateString("fr-FR")}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                          <Clock size={14} /> {exam.heure}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}>
                          <MapPin size={14} /> {exam.salle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}