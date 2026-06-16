import { auth } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight,
  GraduationCap, BookOpen, ShieldCheck,
} from "lucide-react";

const ROLES = [
  {
    key: "student",
    label: "Étudiant",
    domain: "@edu.umi.ac.ma",
    icon: GraduationCap,
    adminTypes: null,
  },
  {
    key: "teacher",
    label: "Enseignant",
    domain: "@umi.ac.ma",
    icon: BookOpen,
    adminTypes: null,
  },
  {
    key: "admin",
    label: "Administration",
    domain: "@admin.ac.ma",
    icon: ShieldCheck,
    adminTypes: [
      { value: "attest", label: "Scolarité",      emoji: "📋" },
      { value: "bib",    label: "Bibliothécaire", emoji: "📚" },
      { value: "edt",    label: "Emploi du temps / EDT", emoji: "🏛️" },
    ],
  },
];

/* ── palette ─────────────────────────────────────────────────── */
const P = {
  gradFull:  "linear-gradient(145deg, #f97316 0%, #ea580c 18%, #9333ea 60%, #7c3aed 100%)",
  gradBtn:   "linear-gradient(135deg, #f97316 0%, #9333ea 100%)",
  accent:    "#9333ea",
  accentLight: "#f3e8ff",
  accentBorder: "#d8b4fe",
  focusRing: "#ede9fe",
  orange:    "#f97316",
  violet:    "#7c3aed",
};

/* ── animated blob for left panel ───────────────────────────── */
const Blob = ({ cx, cy, r, op, dur, delay }) => (
  <motion.circle
    cx={cx} cy={cy} r={r}
    style={{ opacity: op, filter: "blur(45px)" }}
    animate={{ cy: [cy, cy - 20, cy], r: [r, r * 1.07, r] }}
    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

/* ── Email input ─────────────────────────────────────────────── */
function EmailField({ value, onChange, onBlur }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", background: "white",
      border: `1.5px solid ${focused ? P.accent : "#e2e8f0"}`,
      borderRadius: 12,
      boxShadow: focused ? `0 0 0 3px ${P.focusRing}` : "0 1px 3px rgba(0,0,0,0.06)",
      transition: "border-color .2s, box-shadow .2s",
    }}>
      <div style={{ padding: "0 14px", color: focused ? P.accent : "#cbd5e1", transition: "color .2s" }}>
        <Mail size={17} />
      </div>
      <input
        type="email" value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => { setFocused(false); onBlur && onBlur(); }}
        placeholder="Saisir votre email académique"
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#0f172a", padding: "13px 0", fontFamily: "inherit" }}
      />
    </div>
  );
}

/* ── Password input ──────────────────────────────────────────── */
function PassField({ value, onChange, show, toggle }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", background: "white",
      border: `1.5px solid ${focused ? P.accent : "#e2e8f0"}`,
      borderRadius: 12,
      boxShadow: focused ? `0 0 0 3px ${P.focusRing}` : "0 1px 3px rgba(0,0,0,0.06)",
      transition: "border-color .2s, box-shadow .2s",
    }}>
      <div style={{ padding: "0 14px", color: focused ? P.accent : "#cbd5e1", transition: "color .2s" }}>
        <Lock size={17} />
      </div>
      <input
        type={show ? "text" : "password"} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Saisir votre mot de passe"
        required
        style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#0f172a", padding: "13px 0", fontFamily: "inherit" }}
      />
      <button type="button" onClick={toggle} style={{ padding: "0 14px", background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}>
        {show ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════════ */

/* ════════════ FORGOT PASSWORD MODAL ════════════ */
function ForgotPasswordModal({ onClose, role }) {
  const [step, setStep] = useState("form");
  const [resetEmail, setResetEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!resetEmail.includes("@")) { setError("Email invalide."); return; }
    if (!resetEmail.toLowerCase().includes(role.domain.replace("@",""))) {
      setError(`L'email doit se terminer par ${role.domain}`); return;
    }
    setError(""); setSending(true);
    setTimeout(() => { setSending(false); setStep("sent"); }, 1800);
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,zIndex:500,
        background:"rgba(15,23,42,0.5)",backdropFilter:"blur(8px)",
        display:"flex",alignItems:"center",justifyContent:"center",padding:24 }}
      onClick={onClose}>
      <motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}}
        exit={{scale:0.93,y:20}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={e=>e.stopPropagation()}
        style={{ background:"white",borderRadius:22,width:"100%",maxWidth:440,
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)",overflow:"hidden" }}>

        {/* header */}
        <div style={{ padding:"20px 24px 16px",
          background:"linear-gradient(135deg,#f97316,#9333ea)",
          display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:10 }}>
            <div style={{ width:38,height:38,borderRadius:11,
              background:"rgba(255,255,255,0.2)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18 }}>🔑</div>
            <div>
              <div style={{ fontSize:16,fontWeight:800,color:"white" }}>Mot de passe oublié</div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)" }}>Réinitialisation sécurisée</div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)",border:"none",
              cursor:"pointer",color:"white",padding:8,borderRadius:9,
              fontSize:16,lineHeight:1 }}>✕</button>
        </div>

        <div style={{ padding:"22px 24px 26px" }}>
          {step==="form" ? (
            <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
              {/* info */}
              <div style={{ background:"#eff6ff",border:"1px solid #bfdbfe",
                borderRadius:11,padding:"12px 15px",
                display:"flex",alignItems:"flex-start",gap:9 }}>
                <span style={{ fontSize:17,flexShrink:0 }}>ℹ️</span>
                <div style={{ fontSize:13,color:"#1e40af",lineHeight:1.5 }}>
                  Un lien de réinitialisation sera envoyé à votre adresse académique
                  dans les <strong>5 minutes</strong>.
                </div>
              </div>

              {/* email */}
              <div>
                <label style={{ display:"block",fontSize:11.5,fontWeight:700,
                  color:"#374151",marginBottom:6,letterSpacing:"0.3px" }}>
                  EMAIL ACADÉMIQUE
                </label>
                <div style={{ display:"flex",alignItems:"center",
                  background:"#f8fafc",
                  border:`1.5px solid ${error?"#fecaca":"#e2e8f0"}`,
                  borderRadius:11,overflow:"hidden" }}>
                  <span style={{ padding:"0 12px",fontSize:16 }}>✉️</span>
                  <input value={resetEmail}
                    onChange={e=>{setResetEmail(e.target.value);setError("");}}
                    onKeyDown={e=>e.key==="Enter"&&handleSend()}
                    placeholder={`votre.nom${role.domain}`}
                    style={{ flex:1,border:"none",outline:"none",
                      background:"transparent",fontSize:14,color:"#0f172a",
                      padding:"11px 0",fontFamily:"inherit" }}
                    autoFocus/>
                </div>
                {error && <div style={{ fontSize:12.5,color:"#ef4444",marginTop:5 }}>⚠️ {error}</div>}
                <div style={{ fontSize:12,color:"#94a3b8",marginTop:5 }}>
                  Format : <strong style={{ color:"#64748b" }}>prenom.nom{role.domain}</strong>
                </div>
              </div>

              {/* domain hint */}
              <div style={{ background:"#f5f3ff",border:"1px solid #ddd6fe",
                borderRadius:10,padding:"10px 14px",
                display:"flex",alignItems:"center",gap:8 }}>
                <span style={{ fontSize:14 }}>🔒</span>
                <span style={{ fontSize:12.5,color:"#5b21b6" }}>
                  Seuls les emails <strong>{role.domain}</strong> sont acceptés pour ce profil.
                </span>
              </div>

              {/* submit */}
              <button onClick={handleSend} disabled={!resetEmail||sending}
                style={{ padding:"13px",borderRadius:12,border:"none",
                  background:resetEmail&&!sending
                    ?"linear-gradient(135deg,#f97316,#9333ea)":"#e2e8f0",
                  color:resetEmail&&!sending?"white":"#94a3b8",
                  fontSize:14.5,fontWeight:700,
                  cursor:resetEmail&&!sending?"pointer":"not-allowed",
                  fontFamily:"inherit",
                  display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  boxShadow:resetEmail&&!sending?"0 4px 18px rgba(147,51,234,0.28)":"none" }}>
                {sending?(
                  <><motion.div animate={{rotate:360}}
                    transition={{duration:0.8,repeat:Infinity,ease:"linear"}}
                    style={{ width:17,height:17,borderRadius:"50%",
                      border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white" }}/>
                  Envoi en cours…</>
                ):(
                  <>📧 Envoyer le lien de réinitialisation</>
                )}
              </button>
              <button onClick={onClose}
                style={{ background:"none",border:"none",cursor:"pointer",
                  color:"#94a3b8",fontSize:13,fontFamily:"inherit",textAlign:"center" }}>
                Annuler
              </button>
            </div>
          ):(
            /* SENT */
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
              style={{ display:"flex",flexDirection:"column",
                alignItems:"center",gap:16,padding:"8px 0",textAlign:"center" }}>
              <motion.div initial={{scale:0}} animate={{scale:1}}
                transition={{type:"spring",stiffness:280,damping:20,delay:0.1}}
                style={{ width:70,height:70,borderRadius:"50%",fontSize:34,
                  background:"linear-gradient(135deg,#10b981,#059669)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  boxShadow:"0 8px 28px rgba(16,185,129,0.35)" }}>✅</motion.div>
              <div>
                <h3 style={{ fontSize:20,fontWeight:800,color:"#0f172a",margin:"0 0 8px" }}>
                  Email envoyé !
                </h3>
                <p style={{ fontSize:13.5,color:"#64748b",margin:0,lineHeight:1.6 }}>
                  Lien envoyé à<br/>
                  <strong style={{ color:"#0f172a" }}>{resetEmail}</strong>
                </p>
              </div>
              <div style={{ background:"#fffbeb",border:"1px solid #fde68a",
                borderRadius:12,padding:"13px 18px",width:"100%",textAlign:"left" }}>
                <div style={{ fontSize:12.5,fontWeight:700,color:"#78350f",marginBottom:8 }}>
                  📋 Instructions
                </div>
                {["Vérifiez votre boîte mail (et les spams)",
                  "Cliquez sur le lien dans les 30 minutes",
                  "Choisissez un nouveau mot de passe sécurisé",
                  "Reconnectez-vous avec vos nouveaux identifiants",
                ].map((s,i)=>(
                  <div key={i} style={{ display:"flex",gap:8,marginBottom:4,
                    fontSize:12.5,color:"#92400e" }}>
                    <span style={{ fontWeight:700,minWidth:16 }}>{i+1}.</span><span>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:12.5,color:"#94a3b8" }}>
                🕐 Le lien expire dans <strong>30 minutes</strong>
              </div>
              <button onClick={onClose}
                style={{ padding:"12px 32px",borderRadius:11,border:"none",
                  background:"linear-gradient(135deg,#f97316,#9333ea)",
                  color:"white",fontSize:14,fontWeight:700,
                  cursor:"pointer",fontFamily:"inherit",
                  boxShadow:"0 4px 16px rgba(147,51,234,0.28)" }}>
                Retour à la connexion
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [phase, setPhase]         = useState("intro"); // "intro" | "app"
  const [roleIdx, setRoleIdx]     = useState(0);
  const [adminType, setAdminType] = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const role = ROLES[roleIdx];

  /* Intro → app transition */
  useEffect(() => {
    const t = setTimeout(() => setPhase("app"), 2200);
    return () => clearTimeout(t);
  }, []);

  const switchRole = (i) => { setRoleIdx(i); setEmail(""); setAdminType(""); };

  const handleEmailBlur = () => {
    const local = email.split("@")[0].trim();
    if (local && !email.includes("@")) setEmail(local + role.domain);
  };

  /* ── Real API login ──────────────────────────────────────── */
  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (loading) return;
    setLoading(true);
    setLoginError("");

    try {
      const body = { email, password };
      if (role.key === "admin" && adminType) body.admin_type = adminType;

      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.message || "Erreur de connexion.");
        setLoading(false);
        return;
      }

      // Stocker token + user dans localStorage
      localStorage.setItem("umi_token", data.token);
      localStorage.setItem("umi_user", JSON.stringify(data.user));

      // Rediriger selon le rôle renvoyé par le serveur
      navigate(data.redirect_route || "/teacher");

    } catch (err) {
      setLoginError("Impossible de joindre le serveur. Vérifiez que Laravel tourne sur le port 8000.");
    } finally {
      setLoading(false);
    }
  };

  // Super Admin peut se connecter sans profil de service
  const canSubmit = !loading;

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
      overflow: "hidden",
      position: "relative",
      background: P.gradFull,  /* fallback visible during intro */
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ═══════════ INTRO OVERLAY ═══════════
          Full-screen gradient with logo centred.
          Fades out once phase === "app".
      ══════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            key="intro"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            style={{
              position: "fixed", inset: 0, zIndex: 50,
              background: P.gradFull,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 0,
            }}
          >
            {/* dot grid */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dotsIntro" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.3" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotsIntro)" />
            </svg>

            {/* blobs */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
              <Blob cx="15%"  cy="20%"  r={160} op={0.2}  dur={7}  delay={0}   />
              <Blob cx="80%"  cy="75%"  r={180} op={0.16} dur={9}  delay={1.2} />
              <Blob cx="60%"  cy="10%"  r={100} op={0.13} dur={6}  delay={0.6} />
            </svg>

            {/* Logo + name — slides up from bottom */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, position: "relative", zIndex: 2 }}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: 90, height: 90, borderRadius: 28,
                  background: "rgba(255,255,255,0.22)",
                  backdropFilter: "blur(12px)",
                  border: "2px solid rgba(255,255,255,0.45)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
                }}
              >
                <GraduationCap size={46} color="white" />
              </motion.div>

              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: "center" }}
              >
                <div style={{ fontSize: 52, fontWeight: 800, color: "white", letterSpacing: "-1.5px", lineHeight: 1, textShadow: "0 2px 20px rgba(0,0,0,0.2)" }}>
                  Umi-Flow
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: "4px", fontWeight: 600, marginTop: 10 }}>
                  PORTAIL ÉDUCATIF
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN LAYOUT ═══════════ */}
      <motion.div
        initial={false}
        style={{ display: "flex", minHeight: "100vh" }}
      >
        {/* ─── LEFT PANEL ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "app" ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            width: "42%", minWidth: 320,
            background: P.gradFull,
            position: "relative",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "60px 52px",
            overflow: "hidden",
          }}
        >
          {/* blobs */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
            <Blob cx="12%"  cy="16%"  r={110} op={0.2}  dur={7}  delay={0}   />
            <Blob cx="82%"  cy="72%"  r={140} op={0.14} dur={9}  delay={1.5} />
            <Blob cx="55%"  cy="10%"  r={80}  op={0.11} dur={6}  delay={0.8} />
            <Blob cx="20%"  cy="84%"  r={90}  op={0.12} dur={8}  delay={2}   />
          </svg>
          {/* dot grid */}
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.07, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dotsLeft" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.3" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dotsLeft)" />
          </svg>

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Logo — now small, pushed to top by right panel animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === "app" ? 1 : 0, y: phase === "app" ? 0 : 20 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 52 }}
            >
              <div style={{
                width: 54, height: 54, borderRadius: 16,
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                border: "1.5px solid rgba(255,255,255,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <GraduationCap size={28} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 27, fontWeight: 800, color: "white", letterSpacing: "-0.5px", lineHeight: 1 }}>
                  Umi-Flow
                </div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: "2.8px", fontWeight: 600, marginTop: 4 }}>
                  PORTAIL ÉDUCATIF
                </div>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: phase === "app" ? 1 : 0, y: phase === "app" ? 0 : 24 }}
              transition={{ duration: 0.65, delay: 0.4 }}
            >
              <h2 style={{ color: "white", fontSize: 30, fontWeight: 800, lineHeight: 1.3, margin: "0 0 14px", letterSpacing: "-0.4px" }}>
                Bienvenue sur<br />
                <span style={{ color: "rgba(255,255,255,0.65)" }}>Umi-Flow</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, margin: 0, lineHeight: 1.65 }}>
                Une plateforme universitaire<br />intelligente pour tous.
              </p>
            </motion.div>

            {/* Role list */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === "app" ? 1 : 0, y: phase === "app" ? 0 : 20 }}
              transition={{ duration: 0.65, delay: 0.52 }}
              style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 11 }}
            >
              {ROLES.map((r, i) => {
                const Icon = r.icon;
                const active = i === roleIdx;
                return (
                  <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 10, opacity: active ? 1 : 0.38, transition: "opacity .3s" }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 8,
                      background: active ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                      border: active ? "1px solid rgba(255,255,255,0.5)" : "1px solid rgba(255,255,255,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all .3s",
                    }}>
                      <Icon size={14} color="white" />
                    </div>
                    <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: active ? 700 : 400 }}>
                      {r.label}
                      <span style={{ color: "rgba(255,255,255,0.42)", fontWeight: 400, marginLeft: 7, fontSize: 11.5 }}>{r.domain}</span>
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          <div style={{ position: "absolute", bottom: 24, left: 52, color: "rgba(255,255,255,0.28)", fontSize: 11, zIndex: 2 }}>
            © 2025 Université Moulay Ismail — Meknès
          </div>
        </motion.div>

        {/* ─── RIGHT PANEL — slides up from bottom ─── */}
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: phase === "app" ? "0%" : "100%" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
          style={{
            flex: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "48px 40px",
            background: "linear-gradient(160deg, #fafbff 0%, #f1f5f9 100%)",
            overflowY: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 430 }}>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px" }}>
                Bienvenue
              </h1>
              <p style={{ color: "#94a3b8", fontSize: 14.5, margin: 0 }}>Connectez-vous pour continuer</p>
            </div>

            {/* Role tabs */}
            <div style={{ display: "flex", background: "#e2e8f0", borderRadius: 14, padding: 4, marginBottom: 22 }}>
              {ROLES.map((r, i) => {
                const Icon = r.icon;
                const active = i === roleIdx;
                return (
                  <motion.button
                    key={r.key}
                    onClick={() => switchRole(i)}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      flex: 1, padding: "9px 6px", borderRadius: 11, border: "none",
                      cursor: "pointer", background: "transparent",
                      color: active ? "#0f172a" : "#94a3b8",
                      fontSize: 12.5, fontWeight: active ? 700 : 400,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      fontFamily: "inherit", position: "relative", transition: "color .2s",
                    }}
                  >
                    {active && (
                      <motion.div
                        layoutId="tabBg"
                        style={{ position: "absolute", inset: 0, borderRadius: 11, background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.1)" }}
                        transition={{ type: "spring", stiffness: 420, damping: 36 }}
                      />
                    )}
                    <Icon size={13} style={{ position: "relative", zIndex: 1 }} />
                    <span style={{ position: "relative", zIndex: 1 }}>{r.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Info box */}
            <AnimatePresence mode="wait">
              <motion.div
                key={role.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
                style={{
                  background: P.accentLight,
                  border: `1px solid ${P.accentBorder}`,
                  borderRadius: 12, padding: "13px 16px", marginBottom: 20,
                }}
              >
                <p style={{ fontSize: 12.5, color: P.violet, fontWeight: 700, margin: "0 0 5px" }}>
                  Email autorisé :
                </p>
                <p style={{ fontSize: 12.5, color: P.accent, margin: 0, display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: P.accent, display: "inline-block", flexShrink: 0 }} />
                  {role.label}s : <strong style={{ marginLeft: 2 }}>{role.domain}</strong>
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 8 }}>
                  Email académique
                </label>
                <EmailField value={email} onChange={setEmail} onBlur={handleEmailBlur} />
              </div>

              {/* Admin selector */}
              <AnimatePresence>
                {role.key === "admin" && (
                  <motion.div
                    key="adminsel"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden", marginBottom: 16 }}
                  >
                    <label style={{ display: "block", fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 8 }}>
                      Profil administratif <span style={{ fontSize:11, color:"#94a3b8", fontWeight:400 }}>(optionnel pour Super Admin)</span>
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {/* Option Super Admin sans profil */}
                      <button type="button"
                        onClick={() => setAdminType("")}
                        style={{ padding:"10px 14px", borderRadius:11,
                          border: adminType === "" ? "2px solid #9333ea" : "1.5px solid #e2e8f0",
                          background: adminType === "" ? "#f5f3ff" : "white",
                          cursor:"pointer", display:"flex", alignItems:"center", gap:8,
                          fontSize:13, fontWeight: adminType === "" ? 700 : 500,
                          color: adminType === "" ? "#9333ea" : "#374151", fontFamily:"inherit" }}>
                        🔐 Super Admin
                      </button>
                      {role.adminTypes.map(t => {
                        const sel = adminType === t.value;
                        return (
                          <motion.button
                            key={t.value} type="button"
                            onClick={() => setAdminType(t.value)}
                            whileTap={{ scale: 0.97 }}
                            style={{
                              padding: "10px 12px", borderRadius: 10,
                              border: `1.5px solid ${sel ? P.accent : "#e2e8f0"}`,
                              background: sel ? P.accentLight : "white",
                              color: sel ? P.violet : "#64748b",
                              fontSize: 12.5, fontWeight: sel ? 700 : 400,
                              cursor: "pointer",
                              display: "flex", alignItems: "center", gap: 7,
                              fontFamily: "inherit", transition: "all .2s", textAlign: "left",
                              boxShadow: sel ? `0 0 0 3px ${P.focusRing}` : "none",
                            }}
                          >
                            <span style={{ fontSize: 15 }}>{t.emoji}</span>
                            <span style={{ lineHeight: 1.3 }}>{t.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div style={{ marginBottom: 26 }}>
                <label style={{ display: "block", fontSize: 13, color: "#374151", fontWeight: 600, marginBottom: 8 }}>
                  Mot de passe
                </label>
                <PassField value={password} onChange={setPassword} show={showPass} toggle={() => setShowPass(!showPass)} />
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background:"#fef2f2", border:"1px solid #fecaca",
                    borderRadius:10, padding:"10px 14px", marginBottom:4,
                    display:"flex", alignItems:"center", gap:8,
                    fontSize:13, color:"#991b1b", fontWeight:500 }}>
                  <span>⚠️</span>{loginError}
                </motion.div>
              )}

              <motion.button
                type="submit"
                onClick={handleSubmit}
                disabled={!canSubmit}
                whileHover={{ scale: canSubmit ? 1.01 : 1 }}
                whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                style={{
                  width: "100%", padding: "14px 20px", borderRadius: 12, border: "none",
                  cursor: canSubmit ? "pointer" : "not-allowed",
                  background: canSubmit ? P.gradBtn : "#e2e8f0",
                  color: canSubmit ? "white" : "#94a3b8",
                  fontSize: 15, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  fontFamily: "inherit", letterSpacing: "0.2px",
                  boxShadow: canSubmit ? "0 6px 24px rgba(234,88,12,0.28)" : "none",
                  transition: "background .3s, color .3s, box-shadow .3s",
                }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                      style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,.3)", borderTopColor: "white" }}
                    />
                    Connexion en cours…
                  </>
                ) : (
                  <>Connexion <ArrowRight size={17} /></>
                )}
              </motion.button>
            </form>

            <div style={{ textAlign: "right", marginTop: 14 }}>
              <button type="button"
                onClick={() => setShowForgot(true)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: P.accent, fontSize: 13, fontWeight: 500, fontFamily: "inherit",
                }}>
                Mot de passe oublié ?
              </button>
            </div>

            {/* ── Forgot Password Modal ── */}
            <AnimatePresence>
              {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} role={role} />}
            </AnimatePresence>

          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}