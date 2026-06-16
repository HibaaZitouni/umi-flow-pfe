import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "./ProfilePanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, Bell,
  BookOpen, Calendar, FlaskConical, Microscope,
  Compass, PenLine, Calculator, BookMarked,
  GraduationCap, ClipboardList, Library, Users,
  Lightbulb, BarChart2, FileText, Atom,
  Globe, Ruler, Pencil, AlarmClock, Award,
  Beaker, Sigma, Paperclip, Bookmark, Cpu,
  TestTube, NotebookPen, Scale, Shapes,
} from "lucide-react";
import FolderStack from "./FolderStack";
import NotifPanel from "./NotifPanel";

const P = {
  gradFull: "linear-gradient(135deg, #f97316 0%, #ea580c 18%, #9333ea 60%, #7c3aed 100%)",
  gradBtn:  "linear-gradient(135deg, #f97316 0%, #9333ea 100%)",
  accent:   "#9333ea",
  orange:   "#f97316",
};

/* ══════════════════════════════════════════════════
   ANIMATED WAVE BLOBS — glassmorphism orbs
══════════════════════════════════════════════════ */
const BLOBS = [
  {
    w: 520, h: 520,
    bg: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, rgba(249,115,22,0.04) 70%)",
    initial: { x: "-10%", y: "5%" },
    animate: { x: ["-10%", "5%", "-8%", "-10%"], y: ["5%", "18%", "2%", "5%"] },
    dur: 18,
  },
  {
    w: 600, h: 600,
    bg: "radial-gradient(circle, rgba(147,51,234,0.16) 0%, rgba(147,51,234,0.03) 70%)",
    initial: { x: "60%", y: "-10%" },
    animate: { x: ["60%", "50%", "65%", "60%"], y: ["-10%", "5%", "-5%", "-10%"] },
    dur: 22,
  },
  {
    w: 440, h: 440,
    bg: "radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0.03) 70%)",
    initial: { x: "30%", y: "55%" },
    animate: { x: ["30%", "22%", "38%", "30%"], y: ["55%", "48%", "60%", "55%"] },
    dur: 16,
  },
  {
    w: 380, h: 380,
    bg: "radial-gradient(circle, rgba(234,88,12,0.13) 0%, rgba(234,88,12,0.02) 70%)",
    initial: { x: "75%", y: "60%" },
    animate: { x: ["75%", "68%", "80%", "75%"], y: ["60%", "52%", "68%", "60%"] },
    dur: 20,
  },
  {
    w: 300, h: 300,
    bg: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, rgba(167,139,250,0.03) 70%)",
    initial: { x: "10%", y: "70%" },
    animate: { x: ["10%", "18%", "6%", "10%"], y: ["70%", "62%", "76%", "70%"] },
    dur: 14,
  },
  {
    w: 260, h: 260,
    bg: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, rgba(251,146,60,0.02) 70%)",
    initial: { x: "48%", y: "15%" },
    animate: { x: ["48%", "42%", "54%", "48%"], y: ["15%", "8%", "20%", "15%"] },
    dur: 12,
  },
];

/* thin glass pill strips */
const STRIPS = [
  { top: "18%", left: "-5%",  w: 420, h: 56,  rot: -12, op: 0.06, dur: 10 },
  { top: "42%", left: "70%",  w: 380, h: 48,  rot: 8,   op: 0.05, dur: 13 },
  { top: "72%", left: "15%",  w: 340, h: 44,  rot: -6,  op: 0.05, dur: 11 },
  { top: "30%", left: "38%",  w: 300, h: 40,  rot: 14,  op: 0.04, dur: 15 },
];

/* ══════════════════════════════════════════════════
   FLOATING ICONS
══════════════════════════════════════════════════ */
const FLOATERS = [
  { Icon: BookOpen,      x: "3%",  y: "10%", size: 32, dur: 6.5, delay: 0,   rot: -15 },
  { Icon: PenLine,       x: "1%",  y: "28%", size: 26, dur: 7,   delay: 0.8, rot: 12  },
  { Icon: Calendar,      x: "8%",  y: "46%", size: 30, dur: 5.5, delay: 1.4, rot: -8  },
  { Icon: Microscope,    x: "2%",  y: "64%", size: 28, dur: 8,   delay: 0.3, rot: 10  },
  { Icon: Compass,       x: "13%", y: "80%", size: 24, dur: 6,   delay: 2,   rot: -20 },
  { Icon: Ruler,         x: "16%", y: "20%", size: 22, dur: 7.5, delay: 1.1, rot: 18  },
  { Icon: Pencil,        x: "20%", y: "60%", size: 26, dur: 6,   delay: 2.5, rot: -12 },
  { Icon: Sigma,         x: "7%",  y: "88%", size: 28, dur: 5,   delay: 3.1, rot: 6   },
  { Icon: BarChart2,     x: "38%", y: "6%",  size: 30, dur: 7,   delay: 0.6, rot: -10 },
  { Icon: GraduationCap, x: "50%", y: "4%",  size: 34, dur: 8,   delay: 1.7, rot: 5   },
  { Icon: Atom,          x: "62%", y: "7%",  size: 28, dur: 6.5, delay: 0.2, rot: -15 },
  { Icon: Globe,         x: "44%", y: "88%", size: 26, dur: 7,   delay: 1.3, rot: 12  },
  { Icon: Shapes,        x: "56%", y: "91%", size: 24, dur: 5.5, delay: 2.2, rot: -8  },
  { Icon: Scale,         x: "32%", y: "14%", size: 22, dur: 6,   delay: 3,   rot: 20  },
  { Icon: AlarmClock,    x: "68%", y: "13%", size: 26, dur: 7.5, delay: 0.9, rot: -5  },
  { Icon: Calculator,    x: "86%", y: "8%",  size: 32, dur: 7,   delay: 0.5, rot: 12  },
  { Icon: BookMarked,    x: "92%", y: "24%", size: 26, dur: 6.5, delay: 1.6, rot: -10 },
  { Icon: Library,       x: "80%", y: "38%", size: 28, dur: 9,   delay: 0.4, rot: 6   },
  { Icon: Users,         x: "94%", y: "52%", size: 24, dur: 6,   delay: 2.1, rot: -14 },
  { Icon: ClipboardList, x: "83%", y: "68%", size: 30, dur: 7.5, delay: 1.2, rot: 8   },
  { Icon: FileText,      x: "89%", y: "84%", size: 26, dur: 6,   delay: 2.8, rot: -18 },
  { Icon: Lightbulb,     x: "74%", y: "18%", size: 28, dur: 5.5, delay: 1.9, rot: 15  },
  { Icon: Award,         x: "76%", y: "54%", size: 24, dur: 7,   delay: 0.7, rot: -6  },
  { Icon: FlaskConical,  x: "25%", y: "35%", size: 24, dur: 6,   delay: 2.4, rot: -18 },
  { Icon: Beaker,        x: "34%", y: "72%", size: 22, dur: 7,   delay: 1.5, rot: 10  },
  { Icon: Cpu,           x: "58%", y: "78%", size: 26, dur: 5.5, delay: 2.9, rot: -12 },
  { Icon: TestTube,      x: "47%", y: "50%", size: 22, dur: 8,   delay: 0.1, rot: 20  },
  { Icon: NotebookPen,   x: "63%", y: "40%", size: 26, dur: 6.5, delay: 1.8, rot: -8  },
  { Icon: Paperclip,     x: "28%", y: "52%", size: 20, dur: 6,   delay: 3.3, rot: 14  },
  { Icon: Bookmark,      x: "70%", y: "75%", size: 24, dur: 7,   delay: 2.6, rot: -16 },
];

const FloatingIcon = ({ Icon, x, y, size, dur, delay, rot }) => (
  <motion.div
    style={{
      position: "absolute", left: x, top: y,
      pointerEvents: "none", userSelect: "none",
      color: "#9333ea", opacity: 0, zIndex: 1,
    }}
    animate={{
      opacity: [0.3, 0.5, 0.3],
      y: [0, -16, 0],
      rotate: [rot, rot + 7, rot],
      scale: [1, 1.08, 1],
    }}
    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <Icon size={size} strokeWidth={1.3} />
  </motion.div>
);

/* ══ DATA ══════════════════════════════════════════════════════ */
// ── Récupérer l'utilisateur connecté ────────────────────────


export default function HomePage() {
  const navigate = useNavigate();
  // ── Guard : rediriger vers login si pas de token ──────────
  useEffect(() => {
    const token = localStorage.getItem("umi_token");
    const user  = localStorage.getItem("umi_user");
    if (!token || !user) navigate("/");
  }, []);

  const [notifOpen, setNotifOpen] = useState(false);

  // ── Lire le vrai utilisateur depuis localStorage ──────────
  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; }
  })();
  const INITIALS     = (currentUser.prenom?.[0] || "U").toUpperCase() + (currentUser.nom?.[0] || "").toUpperCase();
  const DISPLAY_NAME = currentUser.prenom && currentUser.nom
    ? `${currentUser.prenom} ${currentUser.nom}` : "Utilisateur";
  const ROLE_LABEL   = {
    PROFESSEUR:"Enseignant", ETUDIANT:"Étudiant",
    SUPER_ADMIN:"Super Admin", ADMIN_ATTEST:"Admin Scolarité",
    ADMIN_BIB:"Admin Bibliothèque", ADMIN_EDT:"Admin EDT",
  }[currentUser.db_role] || "Utilisateur";
  const IS_PROF = currentUser.db_role === "PROFESSEUR";
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
      background: "linear-gradient(135deg, #fdfaff 0%, #f8f4ff 25%, #f0f7ff 55%, #fef7f0 100%)",
      overflowX: "hidden",
      overflowY: "hidden",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ── Wave blobs ─────────────────────────────────────── */}
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: b.w, height: b.h,
            borderRadius: "50%",
            background: b.bg,
            filter: "blur(55px)",
            pointerEvents: "none",
            zIndex: 0,
            left: b.initial.x,
            top: b.initial.y,
          }}
          animate={{ left: b.animate.x, top: b.animate.y }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
        />
      ))}

      {/* ── Glass pill strips ──────────────────────────────── */}
      {STRIPS.map((s, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: s.top, left: s.left,
            width: s.w, height: s.h,
            borderRadius: 999,
            background: "linear-gradient(90deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))",
            border: "1px solid rgba(255,255,255,0.6)",
            backdropFilter: "blur(6px)",
            transform: `rotate(${s.rot}deg)`,
            opacity: s.op,
            pointerEvents: "none",
            zIndex: 1,
          }}
          animate={{ opacity: [s.op, s.op * 2.2, s.op] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      {/* ── Floating lucide icons ──────────────────────────── */}
      {FLOATERS.map((f, i) => <FloatingIcon key={i} {...f} />)}

      {/* ── Bottom glow ───────────────────────────────────── */}
      <div style={{
        position: "absolute",
        bottom: -80, left: "50%", transform: "translateX(-50%)",
        width: 1000, height: 460,
        background: "radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ══════════ NAVBAR ══════════ */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        style={{
          height: 62, flexShrink: 0,
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.8)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "relative", zIndex: 100,
          boxShadow: "0 2px 24px rgba(147,51,234,0.08), inset 0 -1px 0 rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo — text + bare emoji */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px" }}>
            Umi-Flow
          </span>
          <span style={{ fontSize: 22, lineHeight: 1 }}>👨‍🏫</span>
        </div>



        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position:"relative" }}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: notifOpen ? "#f5f3ff" : "rgba(241,245,249,0.8)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${notifOpen ? "#ddd6fe" : "rgba(255,255,255,0.7)"}`,
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative", transition:"all .2s",
              }}>
              <Bell size={17} color={notifOpen ? "#9333ea" : "#64748b"} />
              <span style={{
                position: "absolute", top: 7, right: 7,
                width: 7, height: 7, borderRadius: "50%",
                background: P.orange, border: "1.5px solid white",
              }} />
            </button>
            {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
          </div>

          <div style={{ position:"relative" }}>
            <div
              onClick={() => setProfileOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                background: "rgba(248,245,255,0.85)",
                border: "1.5px solid rgba(233,213,255,0.8)",
                backdropFilter: "blur(8px)",
                borderRadius: 10, padding: "5px 12px 5px 6px",
                cursor: "pointer", transition: "all .2s",
              }}>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: P.gradFull,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: 14, fontWeight: 800, lineHeight: 1,
              }}>
                {INITIALS}
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>
                  {IS_PROF ? "Prof. " : ""}{DISPLAY_NAME}
                </div>
                <div style={{ fontSize: 10.5, color: P.accent, fontWeight: 600, marginTop: 2 }}>
                  {ROLE_LABEL}
                </div>
              </div>
            </div>
            {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
          </div>

          <motion.button
            onClick={() => {
              localStorage.removeItem("umi_token");
              localStorage.removeItem("umi_user");
              navigate("/");
            }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 10, border: "none",
              background: P.gradBtn, color: "white",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 12px rgba(234,88,12,0.28)",
            }}
          >
            <LogOut size={14} />
            Déconnexion
          </motion.button>
        </div>
      </motion.nav>

      {/* ══════════ GREETING ══════════ */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        style={{ flexShrink: 0, padding: "24px 52px 0", position: "relative", zIndex: 10 }}
      >
        {/* glass badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          background: "rgba(243,232,255,0.75)",
          border: "1px solid rgba(233,213,255,0.8)",
          backdropFilter: "blur(8px)",
          borderRadius: 20, padding: "4px 13px", marginBottom: 12,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: P.accent }} />
          <span style={{ fontSize: 12, color: P.accent, fontWeight: 600 }}>
            Tableau de bord · {ROLE_LABEL}
          </span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 5px" }}>
          Bonjour, {IS_PROF ? `Prof. ${currentUser.nom}` : DISPLAY_NAME} 👋
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
          Que souhaitez-vous consulter aujourd'hui ?
        </p>
      </motion.div>

      {/* ══════════ FOLDER STACK ══════════ */}
      <FolderStack />
    </div>
  );
}