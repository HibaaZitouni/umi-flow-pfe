import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { notes as notesAPI } from "./api.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, TrendingUp, TrendingDown, AlertTriangle,
  Award, BookOpen, BarChart2, CheckCircle, XCircle,
  Calendar, MapPin, Zap, Info, ChevronDown, ChevronUp,
  Star, FileText, Clock, Users, Download, Eye, Plus, X,
  Sparkles, Hash, ChevronRight,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette rose (thème principal #ec4899) ── */
const P = {
  primary: "#ec4899",
  dark:    "#be185d",
  mid:     "#db2777",
  light:   "#fce7f3",
  lighter: "#fdf2f8",
  border:  "#fbcfe8",
  grad:    "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  gradHero:"linear-gradient(135deg, #be185d 0%, #ec4899 55%, #f472b6 100%)",
  green:   "#10b981",
  red:     "#ef4444",
  orange:  "#f59e0b",
  blue:    "#3b82f6",
  yellow:  "#eab308",
};

/* ── génère des modules selon la filière ── */
const genModules = (filiere) => {
  const base = {
    "GI":  [["Algorithmique","Algo"],["Base de données","BD"],["Réseaux","RES"],["POO","POO"],["Mathématiques","MATH"],["Anglais","ANG"]],
    "AI":  [["Machine Learning","ML"],["Deep Learning","DL"],["Python","PY"],["Statistiques","STAT"],["Traitement images","TI"],["Anglais","ANG"]],
    "DWM": [["HTML/CSS","WEB"],["JavaScript","JS"],["React","REACT"],["Node.js","NODE"],["UX/UI","UX"],["Anglais","ANG"]],
  }[filiere] || [["Module 1","M1"],["Module 2","M2"],["Module 3","M3"],["Module 4","M4"],["Module 5","M5"],["Anglais","ANG"]];

  const coeffs = [3,3,2,2,2,1];
  return base.map(([nom, code], i) => {
    const noteCC = +(Math.random() * 7 + 8).toFixed(1);
    const noteSN = +(Math.random() * 9 + 6).toFixed(1);
    const moy = +((noteCC * 0.4 + noteSN * 0.6)).toFixed(2);
    const hasRatt = moy < 10;
    return {
      id: code + "_" + i,
      nom, code,
      coef: coeffs[i] || 1,
      noteCC,
      noteSN,
      moyenne: moy,
      rattrapageAnnonce: hasRatt && Math.random() > 0.5,
      rattrapageDate: hasRatt ? "2026-07-15" : null,
      rattrapageSalle: hasRatt ? ["Amphi A", "Salle B204", "Salle A101"][i % 3] : null,
      rattrapageNote: null,
    };
  });
};

const getMention = (m) => {
  if (m >= 16) return { label: "Très Bien", color: "#10b981", bg: "#ecfdf5" };
  if (m >= 14) return { label: "Bien", color: "#3b82f6", bg: "#eff6ff" };
  if (m >= 12) return { label: "Assez Bien", color: P.primary, bg: P.lighter };
  if (m >= 10) return { label: "Passable", color: "#f59e0b", bg: "#fffbeb" };
  return { label: "Insuffisant", color: "#ef4444", bg: "#fef2f2" };
};

const getBarColor = (note) => {
  if (note >= 14) return P.green;
  if (note >= 10) return P.blue;
  if (note >= 8) return P.orange;
  return P.red;
};

/* ── NoteGauge ── */
function NoteGauge({ note, max = 20 }) {
  const pct = Math.min((note / max) * 100, 100);
  return (
    <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ height: "100%", borderRadius: 99, background: getBarColor(note) }}
      />
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 16px 40px ${color}22` }}
      style={{
        background: "white", borderRadius: 18, padding: "20px 24px",
        border: `1px solid ${color}18`, display: "flex", alignItems: "center", gap: 16,
        flex: 1, minWidth: 150, boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        position: "relative", overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", right: -16, top: -16,
        width: 80, height: 80, borderRadius: "50%", background: color + "0d",
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `linear-gradient(135deg, ${color}22, ${color}10)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, border: `1px solid ${color}20`,
      }}>
        <Icon size={22} color={color} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4, fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: color, marginTop: 3, fontWeight: 600 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ── NavBar (comme les autres pages) ── */
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
        borderBottom: `1px solid ${P.border}`, display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "0 36px",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 24px rgba(236,72,153,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: P.lighter,
            border: `1px solid ${P.border}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", color: P.primary, fontSize: 13, fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} /> Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: P.primary }}>Notes</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifOpen ? P.lighter : "#f1f5f9",
              border: `1px solid ${notifOpen ? P.border : "transparent"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", position: "relative",
            }}
          >
            <Bell size={16} color={notifOpen ? P.primary : "#64748b"} />
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
              background: P.lighter, border: `1.5px solid ${P.border}`,
              borderRadius: 10, padding: "5px 12px 5px 6px",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: P.grad,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 13, fontWeight: 800,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{name}</div>
              <div style={{ fontSize: 10.5, color: P.primary, fontWeight: 600, marginTop: 1 }}>Étudiant</div>
            </div>
          </div>
          {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function NotesPage() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modules, setModules] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [tab, setTab] = useState("notes");

  const u = (() => { try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; } })();
  const filiere = u.filiere || u.filieres?.[0] || "GI";
  const studentId = u.id || u.email || "student";

  useEffect(() => {
    notesAPI.mesNotes()
      .then(d => {
        if (d?.notes && d.notes.length > 0) {
          // Map API notes to the local module format
          const apiMods = d.notes.map(n => ({
            id: n.matiere?.code || String(n.matiere_id),
            nom: n.matiere?.nom || "Matière " + n.matiere_id,
            code: n.matiere?.code || "M" + n.matiere_id,
            coef: n.matiere?.coefficient || 1,
            noteCC:  n.cc    ?? null,
            noteSN:  n.examen ?? null,
            tp:      n.tp    ?? null,
            moyenne: n.moyenne ?? null,
            rattrapageAnnonce: (n.moyenne ?? 0) < 10,
            rattrapageDate: (n.moyenne ?? 0) < 10 ? "2026-07-15" : null,
            rattrapageSalle: null,
            rattrapageNote: null,
          }));
          setModules(apiMods);
        } else {
          // Fallback: données de démo si pas de notes en BDD
          setModules(genModules(filiere));
        }
      })
      .catch(() => {
        setModules(genModules(filiere));
      });
  }, [filiere]);

  const modulesRatt = modules.filter(m => m.moyenne < 10);
  const modulesPassed = modules.filter(m => m.moyenne >= 10);

  const modulesWithNote = modules.filter(m => m.moyenne !== null && m.moyenne !== undefined);
  const totalCoef = modulesWithNote.reduce((s, m) => s + m.coef, 0);
  const moyGen = totalCoef > 0
    ? modulesWithNote.reduce((s, m) => s + m.moyenne * m.coef, 0) / totalCoef
    : 0;
  const mention = getMention(moyGen);
  const rattAnnonces = modulesRatt.filter(m => m.rattrapageAnnonce && m.rattrapageDate);

  const stats = [
    { label: "Moyenne Générale", val: moyGen.toFixed(1), color: P.primary, icon: Star, sub: `/20 ${mention.label}` },
    { label: "Modules validés", val: modulesPassed.length, color: P.green, icon: CheckCircle },
    { label: "Rattrapages", val: modulesRatt.length, color: P.orange, icon: AlertTriangle },
    { label: "Annoncés", val: rattAnnonces.length, color: P.red, icon: Calendar },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fdf2f8 0%, #fce7f3 30%, #fef2f2 70%, #fdf2f8 100%)",
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
          margin: "28px 40px 0", borderRadius: 20, background: P.gradHero,
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
            <BarChart2 size={13} color="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Espace Notes</span>
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: "white",
            letterSpacing: "-0.5px", margin: "0 0 6px",
          }}>
            Mes Notes
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Suivez vos performances académiques et vos rattrapages
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, position: "relative", zIndex: 1 }}>
          <div style={{
            background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.25)", borderRadius: 14,
            padding: "10px 18px", textAlign: "center",
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: "white", lineHeight: 1 }}>{moyGen.toFixed(1)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>Moyenne</div>
          </div>
        </div>
      </motion.div>

      {/* ── Contenu principal ── */}
      <div style={{ padding: "28px 40px 60px" }}>

        {/* ── Stats Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.val} color={s.color} sub={s.sub} />
          ))}
        </div>

        {/* ── Alertes rattrapages ── */}
        <AnimatePresence>
          {rattAnnonces.map(m => (
            <motion.div key={m.id}
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
                border: "1.5px solid #fde68a", borderRadius: 14, padding: "14px 18px",
                marginBottom: 20,
              }}
            >
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <AlertTriangle size={18} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: "#78350f" }}>
                  ⚠️ Rattrapage annoncé — {m.nom}
                </div>
                <div style={{ fontSize: 12.5, color: "#92400e", marginTop: 3 }}>
                  <span>📅 {m.rattrapageDate}</span>
                  <span style={{ marginLeft: 12 }}>📍 {m.rattrapageSalle}</span>
                  <span style={{ marginLeft: 12 }}>Moyenne actuelle : <strong>{m.moyenne}/20</strong></span>
                </div>
              </div>
              <span style={{
                background: "#f59e0b", color: "white", fontSize: 11, fontWeight: 700,
                borderRadius: 20, padding: "3px 10px", flexShrink: 0,
              }}>URGENT</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* ── Tabs ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[
            ["notes", "📊 Toutes les notes"],
            ["rattrapage", "⚠️ Rattrapages"]
          ].map(([k, l]) => (
            <motion.button
              key={k}
              onClick={() => setTab(k)}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "9px 20px", borderRadius: 10, border: "1.5px solid",
                fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                cursor: "pointer", transition: "all .2s",
                background: tab === k ? P.primary : "white",
                color: tab === k ? "white" : "#64748b",
                borderColor: tab === k ? P.primary : "#e2e8f0",
              }}
            >
              {l} {k === "rattrapage" && modulesRatt.length > 0 && (
                <span style={{
                  background: "#ef4444", color: "white", borderRadius: "50%",
                  padding: "1px 6px", fontSize: 11, marginLeft: 5,
                }}>{modulesRatt.length}</span>
              )}
            </motion.button>
          ))}
        </div>

        {/* ── Liste modules ── */}
        {(tab === "notes" ? modules : modulesRatt).map((mod, idx) => {
          const ment = getMention(mod.moyenne);
          const isOpen = expanded === mod.id;
          const needsRatt = mod.moyenne < 10;
          return (
            <motion.div key={mod.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: "white", borderRadius: 16,
                border: `1.5px solid ${needsRatt ? "#fecaca" : "#e2e8f0"}`,
                marginBottom: 10, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              }}
            >
              <div
                onClick={() => setExpanded(isOpen ? null : mod.id)}
                style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", cursor: "pointer" }}
              >
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: needsRatt ? "#fef2f2" : P.lighter,
                  border: `1.5px solid ${needsRatt ? "#fecaca" : P.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: needsRatt ? P.red : P.primary }}>
                    {mod.code}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{mod.nom}</span>
                    {needsRatt && (
                      <span style={{
                        background: "#fef2f2", color: "#ef4444", fontSize: 11,
                        fontWeight: 700, borderRadius: 20, padding: "2px 9px",
                        display: "flex", alignItems: "center", gap: 3,
                      }}>
                        <AlertTriangle size={10} /> Rattrapage
                      </span>
                    )}
                    {mod.rattrapageAnnonce && (
                      <span style={{
                        background: "#fffbeb", color: "#d97706", fontSize: 11,
                        fontWeight: 700, borderRadius: 20, padding: "2px 9px",
                      }}>📅 {mod.rattrapageDate}</span>
                    )}
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <NoteGauge note={mod.moyenne} />
                  </div>
                </div>
                <div style={{ textAlign: "center", minWidth: 64, flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: ment.color }}>{mod.moyenne}</div>
                  <span style={{
                    background: ment.bg, color: ment.color,
                    fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "2px 8px",
                  }}>{ment.label}</span>
                </div>
                <div style={{ textAlign: "center", minWidth: 40, flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>COEF</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{mod.coef}</div>
                </div>
                {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "0 20px 18px", borderTop: "1px solid #f1f5f9" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginTop: 14 }}>
                        {[
                          { label: "Note CC", val: mod.noteCC, icon: "📝", hint: "Contrôle continu" },
                          { label: "Note SN", val: mod.noteSN, icon: "📋", hint: "Session normale" },
                          { label: "Moyenne", val: mod.moyenne, icon: "📊", hint: `Coef ${mod.coef}` },
                        ].map(item => (
                          <div key={item.label} style={{
                            background: "#f8fafc", borderRadius: 12, padding: "12px 14px",
                            border: "1px solid #e2e8f0", textAlign: "center",
                          }}>
                            <div style={{ fontSize: 20, marginBottom: 4 }}>{item.icon}</div>
                            <div style={{ fontSize: 18, fontWeight: 800, color: getBarColor(item.val) }}>{item.val}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>{item.label}</div>
                            <div style={{ fontSize: 10.5, color: "#cbd5e1", marginTop: 2 }}>{item.hint}</div>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        marginTop: 12, background: "#f8fafc", borderRadius: 10,
                        padding: "10px 14px", border: "1px solid #e2e8f0",
                      }}>
                        <div style={{ fontSize: 12, color: "#64748b" }}>
                          <span style={{ fontWeight: 700 }}>Formule :</span> Moyenne = (CC × 0,40) + (SN × 0,60) = ({mod.noteCC} × 0,4) + ({mod.noteSN} × 0,6) = <strong style={{ color: getBarColor(mod.moyenne) }}>{mod.moyenne}</strong>
                        </div>
                      </div>

                      {needsRatt && (
                        <div style={{
                          marginTop: 12, background: "#fef2f2", borderRadius: 12,
                          padding: "12px 16px", border: "1.5px solid #fecaca",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <AlertTriangle size={15} color="#ef4444" />
                            <span style={{ fontSize: 13, fontWeight: 800, color: "#7f1d1d" }}>Module en rattrapage</span>
                          </div>
                          {mod.rattrapageAnnonce ? (
                            <div style={{ fontSize: 12.5, color: "#991b1b" }}>
                              <div style={{ display: "flex", gap: 16 }}>
                                <span>📅 Date : <strong>{mod.rattrapageDate}</strong></span>
                                <span>📍 Salle : <strong>{mod.rattrapageSalle}</strong></span>
                              </div>
                              <div style={{ marginTop: 5, fontSize: 12, color: "#b45309" }}>Note minimale requise : <strong>10/20</strong></div>
                            </div>
                          ) : (
                            <div style={{ fontSize: 12.5, color: "#991b1b" }}>Les dates de rattrapage n'ont pas encore été annoncées.</div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {tab === "rattrapage" && modulesRatt.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>Aucun rattrapage !</div>
            <div style={{ fontSize: 14, color: "#64748b", marginTop: 6 }}>Tous vos modules sont validés. Félicitations !</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}