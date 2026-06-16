import { attestations as attestAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, FileText, CheckCircle, Clock, XCircle,
  Download, Eye, Plus, X, Shield, AlertCircle, Send,
  Sparkles, Hash, Users, Calendar, ChevronRight, Star,
  TrendingUp, BookOpen, FolderOpen, GraduationCap,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette moderne (comme DocumentsPage) ── */
const B = {
  primary: "#3b82f6",
  dark: "#1e3a8a",
  mid: "#2563eb",
  light: "#dbeafe",
  lighter: "#eff6ff",
  muted: "#93c5fd",
  grad: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  gradSoft: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  gradHero: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #0ea5e9 100%)",
};

/* ── mock data ─────────────────────────────────────────────── */
const INIT_REQUESTS = [
  {
    id: "ATT-UMI-2025-001", type: "Attestation de scolarité",
    date: "15/01/2025", statut: "signee", validationDate: "14/01/2025",
    motif: "Dossier bancaire", urgence: "normal",
    pdfUrl: null,
    auditLog: [
      { action: "Demande soumise", date: "10/01/2025 09:30" },
      { action: "Vérification éligibilité", date: "12/01/2025 14:20" },
      { action: "Validation académique", date: "13/01/2025 11:15" },
      { action: "Document signé & généré", date: "14/01/2025 10:00" },
      { action: "Notification envoyée", date: "14/01/2025 10:05" },
    ],
  },
  {
    id: "ATT-UMI-2025-002", type: "Relevé de notes",
    date: "18/01/2025", statut: "en_attente", validationDate: null,
    motif: "Candidature master", urgence: "urgent",
    pdfUrl: null,
    auditLog: [
      { action: "Demande soumise", date: "18/01/2025 11:45" },
      { action: "Vérification éligibilité", date: "19/01/2025 16:30" },
    ],
  },
  {
    id: "ATT-UMI-2025-003", type: "Attestation de réussite",
    date: "05/02/2025", statut: "refusee", validationDate: "04/02/2025",
    motif: "Stage entreprise", urgence: "normal",
    raison: "Solde de frais de scolarité impayé",
    pdfUrl: null,
    auditLog: [
      { action: "Demande soumise", date: "01/02/2025 15:20" },
      { action: "Vérification éligibilité", date: "03/02/2025 09:15" },
      { action: "Refus — Solde impayé", date: "04/02/2025 14:00" },
    ],
  },
];

const TYPES = [
  "Attestation de scolarité",
  "Attestation de réussite",
  "Relevé de notes",
  "Attestation de diplôme",
  "Attestation de stage",
];

const STATUT_CFG = {
  signee: { label: "Signée", color: "#10b981", bg: "#d1fae5", Icon: CheckCircle },
  en_attente: { label: "En attente", color: "#f59e0b", bg: "#fef3c7", Icon: Clock },
  refusee: { label: "Refusée", color: "#ef4444", bg: "#fee2e2", Icon: XCircle },
};

/* ── Statut Badge moderne ── */
function StatutBadge({ statut }) {
  const cfg = STATUT_CFG[statut] || STATUT_CFG.en_attente;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: cfg.bg, borderRadius: 20, padding: "4px 11px",
      border: `1px solid ${cfg.color}30`, fontSize: 12, fontWeight: 700,
      color: cfg.color,
    }}>
      <cfg.Icon size={12} />
      {cfg.label}
    </span>
  );
}

/* ── Stat Card (comme dans DocumentsPage) ── */
function StatCard({ icon: Icon, label, value, color }) {
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
      </div>
    </motion.div>
  );
}

/* ── NavBar moderne ── */
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
        borderBottom: "1px solid rgba(59,130,246,0.1)", display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "0 36px",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 24px rgba(59,130,246,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: B.lighter,
            border: `1px solid ${B.light}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", color: B.primary, fontSize: 13, fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} />Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: B.primary }}>Attestations</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifOpen ? B.lighter : "#f1f5f9",
              border: `1px solid ${notifOpen ? B.light : "transparent"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", position: "relative",
            }}
          >
            <Bell size={16} color={notifOpen ? B.primary : "#64748b"} />
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
              background: B.lighter, border: `1.5px solid ${B.light}`,
              borderRadius: 10, padding: "5px 12px 5px 6px",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: B.grad,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 13, fontWeight: 800,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{name}</div>
              <div style={{ fontSize: 10.5, color: B.primary, fontWeight: 600, marginTop: 1 }}>Étudiant</div>
            </div>
          </div>
          {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function AttestationsPage() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [requests, setRequests] = useState(INIT_REQUESTS);
  useEffect(()=>{ attestAPI.mesAttestations().then(d=>{if(Array.isArray(d)&&d.length)setRequests(d)}).catch(()=>{}); },[]);
  const [form, setForm] = useState({ type: "", urgence: "normal", motif: "" });
  const [detail, setDetail] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; }
  })();

  /* stats */
  const stats = [
    { label: "Total", val: requests.length, color: B.primary, icon: FileText },
    { label: "En attente", val: requests.filter(r => r.statut === "en_attente").length, color: "#f59e0b", icon: Clock },
    { label: "Signées", val: requests.filter(r => r.statut === "signee").length, color: "#10b981", icon: CheckCircle },
    { label: "Refusées", val: requests.filter(r => r.statut === "refusee").length, color: "#ef4444", icon: XCircle },
  ];

  /* submit */
  const handleSubmit = () => {
    if (!form.type || !form.motif) return;
    const id = "ATT-UMI-2025-" + String(Math.floor(Math.random() * 9000) + 1000);
    const newReq = {
      id, type: form.type, date: new Date().toLocaleDateString("fr-FR"),
      statut: "en_attente", validationDate: null,
      motif: form.motif, urgence: form.urgence, pdfUrl: null,
      auditLog: [
        { action: "Demande soumise", date: new Date().toLocaleString("fr-FR") },
        { action: "En attente de traitement", date: new Date().toLocaleString("fr-FR") },
      ],
    };
    setRequests(prev => [newReq, ...prev]);
    // Enregistrer en base via API
    attestAPI.create({
      type: form.type,
      motif: form.motif,
      nom_beneficiaire: (currentUser.prenom || "") + " " + (currentUser.nom || ""),
      cin_beneficiaire: currentUser.cin || undefined,
    }).catch(()=>{});
    setForm({ type: "", urgence: "normal", motif: "" });
    setShowForm(false);
  };

  /* fake PDF download */
  const downloadPDF = (req) => {
    const nom = (currentUser.prenom || "") + " " + (currentUser.nom || "");
    const lines = [
      "UNIVERSITÉ MOULAY ISMAIL — MEKNÈS",
      "ATTESTATION · " + req.type.toUpperCase(),
      "Référence : " + req.id,
      "Bénéficiaire : " + nom,
      "Motif : " + req.motif,
      "Date de signature : " + (req.validationDate || "—"),
      "Document officiel — portail.umi.ac.ma",
    ];
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = req.id + ".txt";
    a.click();
  };

  const IS = {
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a",
    fontFamily: "inherit", outline: "none", background: "#f8fafc",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #f0f7ff 0%, #eff6ff 50%, #f8faff 100%)",
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

      {/* ── HERO BAND (comme DocumentsPage) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          margin: "28px 40px 0", borderRadius: 20, background: B.gradHero,
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
            <FileText size={13} color="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Espace Attestations</span>
          </div>
          <h1 style={{
            fontSize: 26, fontWeight: 800, color: "white",
            letterSpacing: "-0.5px", margin: "0 0 6px",
          }}>
            Mes Attestations 📋
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Soumettez et suivez vos demandes d'attestations universitaires
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(true)}
          style={{
            display: "flex", alignItems: "center", gap: 7, padding: "9px 18px",
            borderRadius: 11, border: "none", background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)", color: "white", fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", position: "relative", zIndex: 1,
          }}
        >
          <Plus size={15} /> Nouvelle demande
        </motion.button>
      </motion.div>

      {/* ── Contenu principal ── */}
      <div style={{ padding: "28px 40px 60px" }}>

        {/* ── Stats Cards modernes ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
          {stats.map((s, i) => (
            <StatCard key={s.label} icon={s.icon} label={s.label} value={s.val} color={s.color} />
          ))}
        </div>

        {/* ── Éligibilité card ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{
            background: "white", borderRadius: 16, border: `1px solid ${B.light}`,
            padding: "16px 22px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 1px 8px rgba(59,130,246,0.06)",
          }}
        >
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: B.lighter,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Shield size={20} color={B.primary} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
              Vérification d'éligibilité
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {["Inscription active", "Solde à jour", "Identité vérifiée"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckCircle size={12} color="#10b981" />
                  <span style={{ fontSize: 12, color: "#64748b" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Liste des demandes ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{
            background: "white", borderRadius: 18, border: "1px solid #e2e8f0",
            overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{
            padding: "18px 24px", borderBottom: "1px solid #f1f5f9",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <FileText size={18} color={B.primary} />
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                Historique des demandes
              </h2>
            </div>
            <span style={{
              fontSize: 12, color: "#94a3b8", fontWeight: 600,
              background: B.lighter, padding: "4px 12px", borderRadius: 20,
            }}>
              {requests.filter(r => r.statut === "en_attente").length} en attente
            </span>
          </div>

          {requests.length === 0 ? (
            <div style={{ padding: 48, textAlign: "center", color: "#94a3b8" }}>
              <FileText size={40} color="#e2e8f0" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, fontWeight: 600 }}>Aucune demande pour le moment</p>
            </div>
          ) : (
            <div>
              <div style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px",
                padding: "12px 24px", background: "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
              }}>
                {["Référence", "Type", "Date", "Statut", "Actions"].map(h => (
                  <div key={h} style={{
                    fontSize: 11, fontWeight: 700, color: "#94a3b8",
                    letterSpacing: "0.5px", textTransform: "uppercase",
                  }}>{h}</div>
                ))}
              </div>
              {requests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ background: "#fafcff" }}
                  onClick={() => setDetail(req)}
                  style={{
                    display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px",
                    padding: "14px 24px", borderBottom: "1px solid #f8fafc",
                    alignItems: "center", cursor: "pointer", transition: "background .2s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, background: B.lighter,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <FileText size={15} color={B.primary} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{req.id}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{req.type}</div>
                    <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{req.motif}</div>
                  </div>
                  <div style={{ fontSize: 12.5, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                    <Calendar size={11} />{req.date}
                  </div>
                  <StatutBadge statut={req.statut} />
                  <div style={{ display: "flex", gap: 6 }} onClick={e => e.stopPropagation()}>
                    {req.statut === "signee" && (
                      <motion.button
                        whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={() => downloadPDF(req)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                          borderRadius: 8, border: "none", background: "#d1fae5", color: "#065f46",
                          fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                        }}
                      >
                        <Download size={12} /> PDF
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                      onClick={() => setDetail(req)}
                      style={{
                        display: "flex", alignItems: "center", gap: 4, padding: "5px 10px",
                        borderRadius: 8, border: "none", background: B.lighter, color: B.primary,
                        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      <Eye size={12} /> Détails
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ════ MODAL Nouvelle demande (redesigné) ════ */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }} transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "white", borderRadius: 22, width: "100%", maxWidth: 500,
                boxShadow: "0 32px 80px rgba(0,0,0,0.2)", overflow: "hidden",
              }}
            >
              <div style={{
                padding: "22px 26px 18px", background: B.gradHero,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 12, background: "rgba(255,255,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Sparkles size={18} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>Nouvelle demande</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Attestation universitaire</div>
                  </div>
                </div>
                <button onClick={() => setShowForm(false)} style={{
                  background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer",
                  color: "white", padding: 8, borderRadius: 10, display: "flex",
                }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: "24px 26px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{
                    display: "block", fontSize: 12, fontWeight: 700, color: "#374151",
                    marginBottom: 6, letterSpacing: "0.3px",
                  }}>TYPE D'ATTESTATION *</label>
                  <select
                    value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                    style={IS}
                  >
                    <option value="">Sélectionnez un type</option>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: "block", fontSize: 12, fontWeight: 700, color: "#374151",
                    marginBottom: 6, letterSpacing: "0.3px",
                  }}>MOTIF *</label>
                  <input
                    value={form.motif} onChange={e => setForm(f => ({ ...f, motif: e.target.value }))}
                    placeholder="Ex: dossier bancaire, candidature master…" style={IS}
                  />
                </div>

                <div>
                  <label style={{
                    display: "block", fontSize: 12, fontWeight: 700, color: "#374151",
                    marginBottom: 8, letterSpacing: "0.3px",
                  }}>NIVEAU D'URGENCE</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    {["normal", "urgent"].map(lvl => (
                      <button
                        key={lvl} onClick={() => setForm(f => ({ ...f, urgence: lvl }))}
                        style={{
                          flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid",
                          cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, fontWeight: 700,
                          background: form.urgence === lvl
                            ? (lvl === "urgent" ? "#fee2e2" : B.lighter)
                            : "white",
                          color: form.urgence === lvl
                            ? (lvl === "urgent" ? "#ef4444" : B.primary)
                            : "#94a3b8",
                          borderColor: form.urgence === lvl
                            ? (lvl === "urgent" ? "#fca5a5" : B.light)
                            : "#e2e8f0",
                        }}
                      >
                        {lvl === "urgent" ? "🔴 Urgent" : "🔵 Normal"}
                      </button>
                    ))}
                  </div>
                </div>

                {form.urgence === "urgent" && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: 7,
                    background: "#fef3c7", borderRadius: 10, padding: "10px 14px",
                    border: "1px solid #fde68a",
                  }}>
                    <AlertCircle size={14} color="#f59e0b" />
                    <span style={{ fontSize: 12, color: "#92400e" }}>
                      Les demandes urgentes sont traitées sous 24h ouvrées.
                    </span>
                  </div>
                )}
              </div>

              <div style={{ padding: "0 26px 26px", display: "flex", gap: 12 }}>
                <button onClick={() => setShowForm(false)} style={{
                  flex: 1, padding: "12px", borderRadius: 12,
                  border: "1.5px solid #e2e8f0", background: "white",
                  color: "#64748b", fontSize: 13.5, fontWeight: 600,
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={!form.type || !form.motif}
                  style={{
                    flex: 2, padding: "12px", borderRadius: 12, border: "none",
                    background: (!form.type || !form.motif) ? "#e2e8f0" : B.grad,
                    color: (!form.type || !form.motif) ? "#94a3b8" : "white",
                    fontSize: 13.5, fontWeight: 700,
                    cursor: (!form.type || !form.motif) ? "not-allowed" : "pointer",
                    fontFamily: "inherit", display: "flex", alignItems: "center",
                    justifyContent: "center", gap: 8,
                    boxShadow: (!form.type || !form.motif) ? "none" : "0 4px 18px rgba(59,130,246,0.32)",
                  }}
                >
                  <Send size={15} /> Soumettre la demande
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ MODAL Détail / Audit (redesigné) ════ */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: "fixed", inset: 0, zIndex: 200,
              background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }} animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }} transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "white", borderRadius: 22, width: "100%", maxWidth: 540,
                boxShadow: "0 32px 80px rgba(0,0,0,0.2)", overflow: "hidden",
                maxHeight: "90vh", display: "flex", flexDirection: "column",
              }}
            >
              <div style={{
                background: B.gradHero, padding: "22px 26px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0,
              }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800, color: "white", marginBottom: 4 }}>
                    {detail.type}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", marginBottom: 8 }}>
                    {detail.id}
                  </div>
                  <StatutBadge statut={detail.statut} />
                </div>
                <button onClick={() => setDetail(null)} style={{
                  background: "rgba(255,255,255,0.2)", border: "none", cursor: "pointer",
                  color: "white", padding: 8, borderRadius: 10, display: "flex",
                }}>
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "22px 26px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {[
                    { label: "Motif", value: detail.motif || "—" },
                    { label: "Urgence", value: detail.urgence === "urgent" ? "🔴 Urgent" : "🔵 Normal" },
                    { label: "Date demande", value: detail.date },
                    { label: "Date validation", value: detail.validationDate || "—" },
                  ].map(({ label, value }) => (
                    <div key={label} style={{
                      background: "#f8fafc", borderRadius: 12, padding: "14px 16px",
                      border: "1px solid #f1f5f9",
                    }}>
                      <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, marginBottom: 4 }}>
                        {label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{value}</div>
                    </div>
                  ))}
                </div>

                {detail.statut === "refusee" && detail.raison && (
                  <div style={{
                    background: "#fee2e2", borderRadius: 12, padding: "14px 16px",
                    border: "1px solid #fca5a5", marginBottom: 20,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                      <XCircle size={14} color="#ef4444" />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#991b1b" }}>Motif du refus</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "#7f1d1d" }}>{detail.raison}</div>
                  </div>
                )}

                <div>
                  <div style={{
                    fontSize: 14, fontWeight: 700, color: "#0f172a",
                    marginBottom: 14, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Clock size={14} color={B.primary} />
                    Historique du traitement
                  </div>
                  <div style={{ position: "relative", paddingLeft: 24 }}>
                    <div style={{
                      position: "absolute", left: 8, top: 8, bottom: 8,
                      width: 2, background: `linear-gradient(to bottom, ${B.primary}, #c7d2fe)`,
                    }} />
                    {detail.auditLog.map((log, i) => (
                      <div key={i} style={{ position: "relative", marginBottom: 16 }}>
                        <div style={{
                          position: "absolute", left: -21, top: 3, width: 14, height: 14,
                          borderRadius: "50%",
                          background: i === detail.auditLog.length - 1 ? B.primary : "white",
                          border: `2.5px solid ${B.primary}`, zIndex: 1,
                        }} />
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{log.action}</div>
                        <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 3 }}>{log.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {detail.statut === "signee" && (
                <div style={{ padding: "16px 26px 22px", borderTop: "1px solid #f1f5f9", flexShrink: 0 }}>
                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => downloadPDF(detail)}
                    style={{
                      width: "100%", padding: "12px", borderRadius: 12, border: "none",
                      background: B.grad, color: "white", fontSize: 13.5, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      boxShadow: "0 4px 16px rgba(59,130,246,0.32)",
                    }}
                  >
                    <Download size={15} /> Télécharger l'attestation (PDF)
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}