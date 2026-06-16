import { stages as stagesAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Briefcase,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Eye,
  Plus,
  X,
  MapPin,
  Calendar,
  Send,
  Building,
  Mail,
  User,
  AlertCircle,
  FileText,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Users,
  Hash,
  Star,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette jaune/orange (thème principal) ── */
const Y = {
  primary: "#eab308",
  mid: "#ca8a04",
  light: "#fef9c3",
  lighter: "#fefce8",
  grad: "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
  gradHero: "linear-gradient(135deg, #854d0e 0%, #eab308 55%, #f97316 100%)",
};

/* ── mock data ─────────────────────────────────────────────── */
const INIT_STAGES = [
  {
    id: "STG-2025-001",
    entreprise: "IBM Maroc",
    poste: "Développeur Full Stack",
    dateDebut: "01/06/2025",
    dateFin: "31/08/2025",
    tuteur: "M. Ahmed El Fassi",
    emailTuteur: "a.elfassi@ibm.ma",
    statut: "valide",
    dateValidation: "15/05/2025",
    auditLog: [
      { action: "Demande soumise", date: "10/04/2025 10:30" },
      { action: "Vérification des prérequis", date: "12/04/2025 14:20" },
      { action: "Validation administration", date: "15/05/2025 09:00" },
      { action: "Convention générée", date: "15/05/2025 11:30" },
    ],
  },
  {
    id: "STG-2025-002",
    entreprise: "CGI",
    poste: "Analyste BI",
    dateDebut: "01/07/2025",
    dateFin: "30/09/2025",
    tuteur: "Mme Leila Benjelloun",
    emailTuteur: "l.benjelloun@cgi.com",
    statut: "en_attente",
    dateValidation: null,
    auditLog: [
      { action: "Demande soumise", date: "20/05/2025 15:45" },
      { action: "En attente", date: "20/05/2025 15:46" },
    ],
  },
  {
    id: "STG-2025-003",
    entreprise: "Oracle",
    poste: "Stagiaire Cloud",
    dateDebut: "15/06/2025",
    dateFin: "15/09/2025",
    tuteur: "M. Karim Alaoui",
    emailTuteur: "k.alaoui@oracle.com",
    statut: "refuse",
    dateValidation: "18/05/2025",
    raison: "Poste non lié à la formation (hors domaine)",
    auditLog: [
      { action: "Demande soumise", date: "01/05/2025 09:20" },
      { action: "Vérification des prérequis", date: "03/05/2025 11:10" },
      { action: "Refus — Poste hors domaine", date: "18/05/2025 16:30" },
    ],
  },
];

const OFFRES = [
  {
    id: 1,
    entreprise: "Capgemini",
    logo: null,
    poste: "Consultant Cybersécurité",
    lieu: "Casablanca",
    duree: "4–6 mois",
    description:
      "Missions de sécurité informatique au sein d'une équipe dynamique.",
    limite: "15/04/2026",
  },
  {
    id: 2,
    entreprise: "Attijariwafa Bank",
    logo: null,
    poste: "Data Scientist",
    lieu: "Rabat",
    duree: "3 mois",
    description:
      "Analyse de données bancaires et développement de modèles prédictifs.",
    limite: "20/04/2026",
  },
  {
    id: 3,
    entreprise: "Microsoft",
    logo: null,
    poste: "Cloud Developer",
    lieu: "Télétravail",
    duree: "6 mois",
    description: "Solutions cloud Azure avec une équipe internationale.",
    limite: "01/05/2026",
  },
];

const STATUT_CFG = {
  valide: {
    label: "Validé",
    color: "#eab308",
    bg: "#fef9c3",
    Icon: CheckCircle,
  },
  en_attente: {
    label: "En attente",
    color: "#f59e0b",
    bg: "#fef3c7",
    Icon: Clock,
  },
  refuse: { label: "Refusé", color: "#ef4444", bg: "#fee2e2", Icon: XCircle },
};

/* ── Statut Badge ── */
function StatutBadge({ statut }) {
  const cfg = STATUT_CFG[statut] || STATUT_CFG.en_attente;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: cfg.bg,
        borderRadius: 20,
        padding: "4px 11px",
        border: `1px solid ${cfg.color}30`,
        fontSize: 12,
        fontWeight: 700,
        color: cfg.color,
      }}
    >
      <cfg.Icon size={12} />
      {cfg.label}
    </span>
  );
}

/* ── Stat Card moderne ── */
function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 16px 40px ${color}22` }}
      style={{
        background: "white",
        borderRadius: 18,
        padding: "20px 24px",
        border: `1px solid ${color}18`,
        display: "flex",
        alignItems: "center",
        gap: 16,
        flex: 1,
        minWidth: 150,
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -16,
          top: -16,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: color + "0d",
        }}
      />
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          background: `linear-gradient(135deg, ${color}22, ${color}10)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          border: `1px solid ${color}20`,
        }}
      >
        <Icon size={22} color={color} strokeWidth={2} />
      </div>
      <div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "#64748b",
            marginTop: 4,
            fontWeight: 500,
          }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}

/* ── NavBar moderne (thème jaune) ── */
function NavBar({
  navigate,
  notifOpen,
  setNotifOpen,
  profileOpen,
  setProfileOpen,
}) {
  const u = (() => {
    try {
      return JSON.parse(localStorage.getItem("umi_user")) || {};
    } catch {
      return {};
    }
  })();
  const initials =
    (u.prenom?.[0] || "E").toUpperCase() + (u.nom?.[0] || "").toUpperCase();
  const name = u.prenom && u.nom ? `${u.prenom} ${u.nom}` : "Étudiant";
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: 64,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(234,179,8,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 36px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 24px rgba(234,179,8,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: Y.lighter,
            border: `1px solid ${Y.light}`,
            borderRadius: 10,
            padding: "7px 14px",
            cursor: "pointer",
            color: Y.primary,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} />
          Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: Y.primary }}>
            Stages
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: notifOpen ? Y.lighter : "#f1f5f9",
              border: `1px solid ${notifOpen ? Y.light : "transparent"}`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <Bell size={16} color={notifOpen ? Y.primary : "#64748b"} />
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "#f97316",
                border: "1.5px solid white",
              }}
            />
          </button>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        </div>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setProfileOpen((o) => !o)}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: Y.lighter,
              border: `1.5px solid ${Y.light}`,
              borderRadius: 10,
              padding: "5px 12px 5px 6px",
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: Y.grad,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {initials}
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0f172a",
                  lineHeight: 1,
                }}
              >
                {name}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  color: Y.primary,
                  fontWeight: 600,
                  marginTop: 1,
                }}
              >
                Étudiant
              </div>
            </div>
          </div>
          {profileOpen && (
            <ProfilePanel onClose={() => setProfileOpen(false)} />
          )}
        </div>
      </div>
    </motion.nav>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function StagesPage() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [stages, setStages] = useState(INIT_STAGES);
  useEffect(()=>{ stagesAPI.getAll().then(d=>{if(Array.isArray(d)&&d.length)setStages(d)}).catch(()=>{}); },[]);
  const [detail, setDetail] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [applyOffre, setApplyOffre] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const threeMonths = new Date(Date.now() + 90*24*3600*1000).toISOString().split("T")[0];

  const [newStage, setNewStage] = useState({
    entreprise: "",
    poste: "",
    dateDebut: today,
    dateFin: threeMonths,
    tuteur: "",
    emailTuteur: "",
    ville: "Casablanca",
    description: "",
  });
  const [applyData, setApplyData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    message: "",
    cv: null,
  });

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("umi_user")) || {};
    } catch {
      return {};
    }
  })();

  const stats = [
    { label: "Total", val: stages.length, color: Y.primary, icon: Briefcase },
    {
      label: "En attente",
      val: stages.filter((s) => s.statut === "en_attente").length,
      color: "#f59e0b",
      icon: Clock,
    },
    {
      label: "Validés",
      val: stages.filter((s) => s.statut === "valide").length,
      color: Y.primary,
      icon: CheckCircle,
    },
    {
      label: "Refusés",
      val: stages.filter((s) => s.statut === "refuse").length,
      color: "#ef4444",
      icon: XCircle,
    },
  ];

  const handleSubmitNew = () => {
    if (!newStage.entreprise || !newStage.poste || !newStage.dateDebut || !newStage.dateFin) return;
    const id = "STG-" + new Date().getFullYear() + "-" + String(Math.floor(Math.random()*9000)+1000);
    const stageData = {
      id, ...newStage, statut: "en_attente", dateValidation: null,
      auditLog: [
        { action: "Demande soumise", date: new Date().toLocaleString("fr-FR") },
        { action: "En attente", date: new Date().toLocaleString("fr-FR") },
      ],
    };
    setStages(prev => [stageData, ...prev]);
    // Enregistrer en base
    stagesAPI.create({
      entreprise: newStage.entreprise,
      poste:      newStage.poste,
      ville:      newStage.ville || "Casablanca",
      date_debut: newStage.dateDebut || today,
      date_fin:   newStage.dateFin  || threeMonths,
      type:       "stage_initiation",
      tuteur_nom:   newStage.tuteur      || undefined,
      tuteur_email: newStage.emailTuteur || undefined,
      description:  newStage.description || undefined,
    }).catch(e => console.error("Stage API error:", e));
    setNewStage({
      entreprise: "",
      poste: "",
      dateDebut: "",
      dateFin: "",
      tuteur: "",
      emailTuteur: "",
    });
    setShowNewForm(false);
  };

  const handleApplySubmit = () => {
    if (!applyData.nom || !applyData.email || !applyData.cv) return;
    alert(
      `Candidature envoyée pour ${applyOffre.poste} chez ${applyOffre.entreprise} !`,
    );
    setApplyOffre(null);
    setApplyData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      message: "",
      cv: null,
    });
  };

  const openApply = (offre) => {
    setApplyData({
      nom: currentUser.nom || "",
      prenom: currentUser.prenom || "",
      email: currentUser.email || "",
      telephone: currentUser.telephone || "",
      message: "",
      cv: null,
    });
    setApplyOffre(offre);
  };

  const IS = {
    width: "100%",
    padding: "9px 12px",
    borderRadius: 9,
    border: "1.5px solid #e2e8f0",
    fontSize: 13,
    color: "#0f172a",
    fontFamily: "inherit",
    outline: "none",
    background: "#f8fafc",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #fefce8 0%, #fef9c3 30%, #fffbeb 70%, #fef3c7 100%)",
        fontFamily: "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <NavBar
        navigate={navigate}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      {/* ── HERO BAND (thème jaune) ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          margin: "28px 40px 0",
          borderRadius: 20,
          background: Y.primary,
          padding: "28px 36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -40,
            top: -40,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 80,
            bottom: -60,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 20,
              padding: "4px 13px",
              marginBottom: 12,
            }}
          >
            <Star size={13} color="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>
              Espace Stages
            </span>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.5px",
              margin: "0 0 6px",
            }}
          >
            Mes Stages
          </h1>
          <p
            style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}
          >
            Gérez vos demandes de stage et découvrez les offres disponibles
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowNewForm(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "9px 18px",
            borderRadius: 11,
            border: "none",
            background: "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            color: "white",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Plus size={15} /> Nouvelle demande
        </motion.button>
      </motion.div>

      {/* ── Contenu principal ── */}
      <div style={{ padding: "28px 40px 60px" }}>
        {/* ── Stats Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 28,
          }}
        >
          {stats.map((s, i) => (
            <StatCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.val}
              color={s.color}
            />
          ))}
        </div>

        {/* ── main grid (2 colonnes) ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 24,
            alignItems: "start",
          }}
        >
          {/* ── historique des demandes ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            style={{
              background: "white",
              borderRadius: 18,
              border: "1px solid #e2e8f0",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Briefcase size={18} color={Y.primary} />
                <h2
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  Mes demandes
                </h2>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  fontWeight: 600,
                  background: Y.lighter,
                  padding: "4px 12px",
                  borderRadius: 20,
                }}
              >
                {stages.filter((s) => s.statut === "en_attente").length} en
                attente
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.5fr 2fr 1.5fr 1fr 110px",
                padding: "12px 24px",
                background: "#f8fafc",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              {["Réf.", "Poste / Entreprise", "Dates", "Statut", "Actions"].map(
                (h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </div>
                ),
              )}
            </div>

            {stages.map((s, i) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ background: "#fefce8" }}
                onClick={() => setDetail(s)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 2fr 1.5fr 1fr 110px",
                  padding: "14px 24px",
                  borderBottom: "1px solid #f8fafc",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background .2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: Y.lighter,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Briefcase size={15} color={Y.primary} />
                  </div>
                  <span
                    style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}
                  >
                    {s.id}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "#0f172a",
                    }}
                  >
                    {s.poste}
                  </div>
                  <div
                    style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 1 }}
                  >
                    {s.entreprise}
                  </div>
                </div>
                <div
                  style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}
                >
                  {s.dateDebut}
                  <br />
                  <span style={{ color: "#94a3b8" }}>→ {s.dateFin}</span>
                </div>
                <StatutBadge statut={s.statut} />
                <div
                  style={{ display: "flex", gap: 6 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {s.statut === "valide" && (
                    <motion.button
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => alert("Convention téléchargée !")}
                      style={{
                        padding: "5px 8px",
                        borderRadius: 7,
                        border: "none",
                        background: Y.light,
                        color: Y.dark,
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Download size={11} /> Conv.
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => setDetail(s)}
                    style={{
                      padding: "5px 8px",
                      borderRadius: 7,
                      border: "none",
                      background: Y.lighter,
                      color: Y.primary,
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                    }}
                  >
                    <Eye size={11} /> Voir
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* ── offres de stage ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              style={{
                background: "white",
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  padding: "18px 24px",
                  borderBottom: "1px solid #f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: Y.lighter,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TrendingUp size={18} color={Y.primary} />
                </div>
                <div>
                  <div
                    style={{ fontSize: 15, fontWeight: 800, color: "#0f172a" }}
                  >
                    Offres de stage
                  </div>
                  <div style={{ fontSize: 11.5, color: "#94a3b8" }}>
                    Opportunités récentes
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "16px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                {OFFRES.map((o, i) => (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    whileHover={{
                      y: -3,
                      boxShadow: "0 8px 28px rgba(234,179,8,0.15)",
                    }}
                    style={{
                      background: Y.lighter,
                      borderRadius: 14,
                      padding: "16px",
                      border: `1px solid ${Y.light}`,
                      transition: "box-shadow .2s, transform .2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <img
                        src={o.logo}
                        alt={o.entreprise}
                        onError={(e) => (e.target.style.display = "none")}
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 10,
                          objectFit: "contain",
                          background: "white",
                          padding: 6,
                          border: "1px solid #e2e8f0",
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 800,
                            color: "#0f172a",
                          }}
                        >
                          {o.entreprise}
                        </div>
                        <div
                          style={{
                            fontSize: 12.5,
                            fontWeight: 600,
                            color: Y.primary,
                            marginTop: 2,
                          }}
                        >
                          {o.poste}
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10,
                        marginBottom: 12,
                      }}
                    >
                      {[
                        { Icon: MapPin, txt: o.lieu },
                        { Icon: Calendar, txt: o.duree },
                        { Icon: Clock, txt: "Limite : " + o.limite },
                      ].map(({ Icon, txt }) => (
                        <div
                          key={txt}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            fontSize: 11.5,
                            color: "#64748b",
                          }}
                        >
                          <Icon size={11} color="#94a3b8" />
                          {txt}
                        </div>
                      ))}
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#64748b",
                        margin: "0 0 12px",
                        lineHeight: 1.5,
                      }}
                    >
                      {o.description}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => openApply(o)}
                      style={{
                        width: "100%",
                        padding: "9px",
                        borderRadius: 10,
                        border: "none",
                        background: Y.grad,
                        color: "white",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        boxShadow: "0 2px 10px rgba(234,179,8,0.3)",
                      }}
                    >
                      <Send size={12} /> Postuler
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════ MODAL Nouvelle demande (thème jaune) ════ */}
      <AnimatePresence>
        {showNewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(15,23,42,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            onClick={() => setShowNewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 22,
                width: "100%",
                maxWidth: 540,
                boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  padding: "22px 26px 18px",
                  background: Y.gradHero,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 12,
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={18} color="white" />
                  </div>
                  <div>
                    <div
                      style={{ fontSize: 16, fontWeight: 800, color: "white" }}
                    >
                      Nouvelle demande
                    </div>
                    <div
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}
                    >
                      Convention de stage
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewForm(false)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    padding: 8,
                    borderRadius: 10,
                    display: "flex",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  padding: "24px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      label: "ENTREPRISE *",
                      key: "entreprise",
                      placeholder: "Nom de l'entreprise",
                    },
                    {
                      label: "POSTE / MISSION *",
                      key: "poste",
                      placeholder: "Intitulé du poste",
                    },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#374151",
                          marginBottom: 6,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        value={newStage[key]}
                        onChange={(e) =>
                          setNewStage((n) => ({ ...n, [key]: e.target.value }))
                        }
                        placeholder={placeholder}
                        style={IS}
                      />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {[
                    { label: "DATE DÉBUT *", key: "dateDebut", type: "date" },
                    { label: "DATE FIN *", key: "dateFin", type: "date" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#374151",
                          marginBottom: 6,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        type={type}
                        value={newStage[key]}
                        onChange={(e) =>
                          setNewStage((n) => ({ ...n, [key]: e.target.value }))
                        }
                        style={IS}
                      />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      label: "TUTEUR",
                      key: "tuteur",
                      placeholder: "Nom complet",
                    },
                    {
                      label: "EMAIL TUTEUR",
                      key: "emailTuteur",
                      placeholder: "email@entreprise.com",
                    },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#374151",
                          marginBottom: 6,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        value={newStage[key]}
                        onChange={(e) =>
                          setNewStage((n) => ({ ...n, [key]: e.target.value }))
                        }
                        placeholder={placeholder}
                        style={IS}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "0 26px 26px", display: "flex", gap: 12 }}>
                <button
                  onClick={() => setShowNewForm(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "white",
                    color: "#64748b",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitNew}
                  disabled={
                    !newStage.entreprise ||
                    !newStage.poste ||
                    !newStage.dateDebut ||
                    !newStage.dateFin
                  }
                  style={{
                    flex: 2,
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background:
                      !newStage.entreprise ||
                      !newStage.poste ||
                      !newStage.dateDebut ||
                      !newStage.dateFin
                        ? "#e2e8f0"
                        : Y.grad,
                    color:
                      !newStage.entreprise ||
                      !newStage.poste ||
                      !newStage.dateDebut ||
                      !newStage.dateFin
                        ? "#94a3b8"
                        : "white",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor:
                      !newStage.entreprise ||
                      !newStage.poste ||
                      !newStage.dateDebut ||
                      !newStage.dateFin
                        ? "not-allowed"
                        : "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow:
                      !newStage.entreprise ||
                      !newStage.poste ||
                      !newStage.dateDebut ||
                      !newStage.dateFin
                        ? "none"
                        : "0 4px 18px rgba(234,179,8,0.32)",
                  }}
                >
                  <Send size={15} /> Soumettre
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ MODAL Détail (thème jaune) ════ */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(15,23,42,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 22,
                width: "100%",
                maxWidth: 540,
                boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
                overflow: "hidden",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: Y.gradHero,
                  padding: "22px 26px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexShrink: 0,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 800,
                      color: "white",
                      marginBottom: 4,
                    }}
                  >
                    {detail.poste}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(255,255,255,0.75)",
                      marginBottom: 10,
                    }}
                  >
                    {detail.entreprise} · {detail.id}
                  </div>
                  <StatutBadge statut={detail.statut} />
                </div>
                <button
                  onClick={() => setDetail(null)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    padding: 8,
                    borderRadius: 10,
                    display: "flex",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "22px 26px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 22,
                  }}
                >
                  {[
                    ["Entreprise", detail.entreprise],
                    ["Tuteur", detail.tuteur || "—"],
                    ["Période", `${detail.dateDebut} → ${detail.dateFin}`],
                    ["Email tuteur", detail.emailTuteur || "—"],
                    ["Validation", detail.dateValidation || "—"],
                  ].map(([label, val]) => (
                    <div
                      key={label}
                      style={{
                        background: "#f8fafc",
                        borderRadius: 12,
                        padding: "14px 16px",
                        border: "1px solid #f1f5f9",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          fontWeight: 700,
                          marginBottom: 4,
                        }}
                      >
                        {label.toUpperCase()}
                      </div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "#0f172a",
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                </div>

                {detail.statut === "refuse" && detail.raison && (
                  <div
                    style={{
                      background: "#fee2e2",
                      borderRadius: 12,
                      padding: "14px 16px",
                      border: "1px solid #fca5a5",
                      marginBottom: 20,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 5,
                      }}
                    >
                      <XCircle size={14} color="#ef4444" />
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 700,
                          color: "#991b1b",
                        }}
                      >
                        Motif du refus
                      </span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "#7f1d1d" }}>
                      {detail.raison}
                    </div>
                  </div>
                )}

                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0f172a",
                      marginBottom: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Clock size={14} color={Y.primary} />
                    Historique du traitement
                  </div>
                  <div style={{ position: "relative", paddingLeft: 24 }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 8,
                        top: 8,
                        bottom: 8,
                        width: 2,
                        background: `linear-gradient(to bottom, ${Y.primary}, #fde047)`,
                      }}
                    />
                    {detail.auditLog.map((log, i) => (
                      <div
                        key={i}
                        style={{ position: "relative", marginBottom: 16 }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            left: -21,
                            top: 3,
                            width: 14,
                            height: 14,
                            borderRadius: "50%",
                            background:
                              i === detail.auditLog.length - 1
                                ? Y.primary
                                : "white",
                            border: `2.5px solid ${Y.primary}`,
                            zIndex: 1,
                          }}
                        />
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          {log.action}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: "#94a3b8",
                            marginTop: 3,
                          }}
                        >
                          {log.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {detail.statut === "valide" && (
                <div
                  style={{
                    padding: "16px 26px 22px",
                    borderTop: "1px solid #f1f5f9",
                    flexShrink: 0,
                  }}
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert("Convention téléchargée !")}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: 12,
                      border: "none",
                      background: Y.grad,
                      color: "white",
                      fontSize: 13.5,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 16px rgba(234,179,8,0.32)",
                    }}
                  >
                    <Download size={15} /> Télécharger la convention
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ MODAL Candidature offre (thème jaune) ════ */}
      <AnimatePresence>
        {applyOffre && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 200,
              background: "rgba(15,23,42,0.55)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
            onClick={() => setApplyOffre(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 24 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "white",
                borderRadius: 22,
                width: "100%",
                maxWidth: 540,
                boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
                overflow: "hidden",
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: Y.gradHero,
                  padding: "22px 26px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 16, fontWeight: 800, color: "white" }}
                  >
                    Postuler chez {applyOffre.entreprise}
                  </div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                    {applyOffre.poste}
                  </div>
                </div>
                <button
                  onClick={() => setApplyOffre(null)}
                  style={{
                    background: "rgba(255,255,255,0.2)",
                    border: "none",
                    cursor: "pointer",
                    color: "white",
                    padding: 8,
                    borderRadius: 10,
                    display: "flex",
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ overflowY: "auto", padding: "22px 26px" }}>
                <div
                  style={{
                    background: "#fefce8",
                    borderRadius: 10,
                    padding: "12px 14px",
                    marginBottom: 18,
                    fontSize: 12,
                    color: "#854d0e",
                    border: "1px solid #fde047",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <AlertCircle size={14} />
                  Les champs marqués * sont obligatoires. Votre profil a été
                  pré-rempli.
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                    marginBottom: 14,
                  }}
                >
                  {[
                    { label: "NOM *", key: "nom" },
                    { label: "PRÉNOM *", key: "prenom" },
                    { label: "EMAIL *", key: "email" },
                    { label: "TÉLÉPHONE", key: "telephone" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label
                        style={{
                          display: "block",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#374151",
                          marginBottom: 6,
                          letterSpacing: "0.3px",
                        }}
                      >
                        {label}
                      </label>
                      <input
                        value={applyData[key]}
                        onChange={(e) =>
                          setApplyData((a) => ({ ...a, [key]: e.target.value }))
                        }
                        style={IS}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                      marginBottom: 6,
                      letterSpacing: "0.3px",
                    }}
                  >
                    MOTIVATION *
                  </label>
                  <textarea
                    value={applyData.message}
                    onChange={(e) =>
                      setApplyData((a) => ({ ...a, message: e.target.value }))
                    }
                    rows={3}
                    placeholder="Pourquoi postulez-vous à ce stage ?"
                    style={{ ...IS, resize: "vertical" }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#374151",
                      marginBottom: 6,
                      letterSpacing: "0.3px",
                    }}
                  >
                    CV (PDF) *
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setApplyData((a) => ({ ...a, cv: e.target.files[0] }))
                    }
                    style={{ ...IS, padding: "8px 12px" }}
                  />
                </div>
              </div>

              <div
                style={{
                  padding: "16px 26px 22px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  gap: 12,
                  flexShrink: 0,
                }}
              >
                <button
                  onClick={() => setApplyOffre(null)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "white",
                    color: "#64748b",
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Annuler
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApplySubmit}
                  style={{
                    flex: 2,
                    padding: "12px",
                    borderRadius: 12,
                    border: "none",
                    background: Y.grad,
                    color: "white",
                    fontSize: 13.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: "0 4px 16px rgba(234,179,8,0.32)",
                  }}
                >
                  <Send size={15} /> Envoyer la candidature
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}