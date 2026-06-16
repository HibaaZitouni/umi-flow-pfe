import { auth } from "./api.js";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, Mail, Lock, Eye, EyeOff,
  Phone, BookOpen, GraduationCap, ChevronDown,
  Check, ArrowRight, Upload, Sparkles, Building2,
  ShieldCheck, X,
} from "lucide-react";

const P = {
  gradFull:  "linear-gradient(145deg, #f97316 0%, #ea580c 18%, #9333ea 60%, #7c3aed 100%)",
  gradBtn:   "linear-gradient(135deg, #f97316 0%, #9333ea 100%)",
  accent:    "#9333ea",
  orange:    "#f97316",
  focusRing: "#ede9fe",
};

/* ─── Data ──────────────────────────────────────────────────── */
const ROLES = [
  {
    key: "teacher",
    label: "Enseignant",
    desc: "Accédez à vos cours, emplois du temps et thèses PFE",
    icon: BookOpen,
    emoji: "👨‍🏫",
    color: "#9333ea",
    bg: "#f5f3ff",
    border: "#e9d5ff",
  },
  {
    key: "student",
    label: "Étudiant",
    desc: "Consultez vos notes, attestations et emplois du temps",
    icon: GraduationCap,
    emoji: "🎓",
    color: "#3b82f6",
    bg: "#eff6ff",
    border: "#dbeafe",
  },
  {
    key: "admin",
    label: "Administration",
    desc: "Gérez les ressources, réservations et documents officiels",
    icon: ShieldCheck,
    emoji: "🏛️",
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
  },
];

const GRADES = [
  "Professeur Assistant",
  "Professeur Habilité",
  "Professeur de l'Enseignement Supérieur",
  "Professeur de l'Enseignement Supérieur Agrégé",
  "Maître de Conférences",
  "Maître de Conférences Agrégé",
  "Docteur",
  "Ingénieur d'État",
  "Vacataire / Intervenant",
];

const ADMIN_ROLES = [
  "Scolarité",
  "Responsable Logistique",
  "Bibliothécaire",
  "Direction",
  "Service Informatique",
];

const FILIERES_NIVEAUX = ["L1","L2","L3","M1","M2"];

const DEPARTEMENTS = [
  {
    id: "info", nom: "Informatique", icon: "💻", couleur: "#3b82f6",
    filieres: [
      { code: "GI",  nom: "Génie Informatique" },
      { code: "AI",  nom: "Intelligence Artificielle" },
      { code: "DWM", nom: "Développement Web et Multimédia" },
    ],
  },
  {
    id: "electro", nom: "Génie Électrique & Énergies", icon: "⚡", couleur: "#f59e0b",
    filieres: [
      { code: "GE",   nom: "Génie Électrique" },
      { code: "GTE",  nom: "Génie Thermique et Électrique" },
      { code: "GETE", nom: "Génie Électrique et Techniques Énergétiques" },
    ],
  },
  {
    id: "civil", nom: "Génie Civil & Mécanique", icon: "🏗️", couleur: "#10b981",
    filieres: [
      { code: "GC",  nom: "Génie Civil" },
      { code: "PMD", nom: "Production et Maintenance des Dispositifs" },
    ],
  },
  {
    id: "management", nom: "Techniques de Management", icon: "📊", couleur: "#8b5cf6",
    filieres: [
      { code: "TM",  nom: "Technique de Management" },
      { code: "FBA", nom: "Finance, Banque et Assurance" },
    ],
  },
  {
    id: "comm", nom: "Communication & Multimédia", icon: "🎨", couleur: "#ec4899",
    filieres: [
      { code: "TCC", nom: "Technique de Communication et Création" },
    ],
  },
];

/* ─── Reusable field ────────────────────────────────────────── */
function Field({ label, icon: Icon, type = "text", value, onChange,
  placeholder, required, right, hint }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600,
        color: "#374151", marginBottom: 7 }}>
        {label}{required && <span style={{ color: P.orange, marginLeft: 2 }}>*</span>}
      </label>
      <div style={{
        display: "flex", alignItems: "center", background: "white",
        border: `1.5px solid ${focused ? P.accent : "#e2e8f0"}`,
        borderRadius: 11,
        boxShadow: focused ? `0 0 0 3px ${P.focusRing}` : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "border-color .2s, box-shadow .2s",
      }}>
        {Icon && (
          <div style={{ padding: "0 13px", color: focused ? P.accent : "#cbd5e1",
            transition: "color .2s", flexShrink: 0 }}>
            <Icon size={16} />
          </div>
        )}
        <input type={type} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder} required={required}
          style={{ flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14, color: "#0f172a", padding: "12px 0", fontFamily: "inherit" }} />
        {right}
      </div>
      {hint && <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "5px 0 0 2px" }}>{hint}</p>}
    </div>
  );
}

/* ─── Native select styled ──────────────────────────────────── */
function SelectField({ label, icon: Icon, value, onChange, options, placeholder, required }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 600,
        color: "#374151", marginBottom: 7 }}>
        {label}{required && <span style={{ color: P.orange, marginLeft: 2 }}>*</span>}
      </label>
      <div style={{
        display: "flex", alignItems: "center", background: "white",
        border: `1.5px solid ${focused ? P.accent : "#e2e8f0"}`,
        borderRadius: 11,
        boxShadow: focused ? `0 0 0 3px ${P.focusRing}` : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "border-color .2s, box-shadow .2s",
      }}>
        {Icon && (
          <div style={{ padding: "0 13px", color: focused ? P.accent : "#cbd5e1",
            transition: "color .2s", flexShrink: 0, pointerEvents: "none" }}>
            <Icon size={16} />
          </div>
        )}
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          style={{
            flex: 1, border: "none", outline: "none", background: "transparent",
            fontSize: 14, color: value ? "#0f172a" : "#9ca3af",
            padding: "12px 0", fontFamily: "inherit", cursor: "pointer",
            appearance: "none", WebkitAppearance: "none",
          }}
        >
          <option value="" disabled style={{ color: "#9ca3af" }}>{placeholder}</option>
          {options.map(o => (
            <option key={o} value={o} style={{ color: "#0f172a" }}>{o}</option>
          ))}
        </select>
        <div style={{ padding: "0 13px", color: "#94a3b8", pointerEvents: "none" }}>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
}

/* ─── Blob ──────────────────────────────────────────────────── */
const Blob = ({ cx, cy, r, op, dur, delay }) => (
  <motion.circle cx={cx} cy={cy} r={r}
    style={{ opacity: op, filter: "blur(40px)" }}
    animate={{ cy: [cy, cy - 18, cy] }}
    transition={{ duration: dur, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

/* ══════════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════════ */
export default function RegisterPage() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [step, setStep]   = useState(0); // 0=role, 1=identity, 2=dept(teacher)/details, 3=account
  const [done, setDone]   = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [showPass,  setShowPass]  = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  /* teacher filieres multi-select */
  const [openDept, setOpenDept] = useState(null);
  const [selectedFilieres, setSelectedFilieres] = useState({});

  const toggleFiliere = (deptId, code) => {
    setSelectedFilieres(prev => {
      const cur = new Set(prev[deptId] || []);
      cur.has(code) ? cur.delete(code) : cur.add(code);
      return { ...prev, [deptId]: cur };
    });
  };

  const allSelected = DEPARTEMENTS.flatMap(d =>
    [...(selectedFilieres[d.id] || [])].map(code => ({
      deptId: d.id, code, couleur: d.couleur,
      nom: d.filieres.find(f => f.code === code)?.nom,
    }))
  );

  const [form, setForm] = useState({
    prenom: "", nom: "", cin: "", telephone: "",
    grade: "", specialite: "",
    // student
    cne: "", niveau: "", filiere_etudiant: "",
    // admin
    adminRole: "", service: "",
    // common
    email: "", password: "", password2: "",
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const role = ROLES.find(r => r.key === selectedRole);

  /* step counts per role */
  const totalSteps = selectedRole === "teacher" ? 3
    : selectedRole === "student" ? 2
    : selectedRole === "admin"   ? 2 : 0;

  const step1Valid = form.prenom && form.nom && form.cin &&
    (selectedRole === "teacher" ? !!form.grade : true) &&
    (selectedRole === "student" ? !!form.cne   : true) &&
    (selectedRole === "admin"   ? !!form.adminRole : true);

  const step2Valid = selectedRole === "teacher"
    ? allSelected.length > 0
    : selectedRole === "student"
    ? !!form.niveau && !!form.filiere_etudiant
    : !!form.service;

  const step3Valid = form.email && form.password &&
    form.password === form.password2 &&
    form.email.includes(
      selectedRole === "student" ? "@edu.umi.ac.ma"
      : selectedRole === "admin" ? "@admin.ac.ma"
      : "@umi.ac.ma"
    );

  const emailDomain = selectedRole === "student" ? "@edu.umi.ac.ma"
    : selectedRole === "admin" ? "@admin.ac.ma"
    : "@umi.ac.ma";

  const emailOk = form.email.includes(emailDomain);

  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const handleSubmit = async () => {
    setRegError("");
    setRegLoading(true);

    try {
      // Map role → db_role + admin_type
      const adminRoleMap = {
        "Scolarité":             "ADMIN_ATTEST",
        "Bibliothécaire":        "ADMIN_BIB",
        "Responsable Logistique":"ADMIN_EDT",
        "Direction":             "ADMIN_EDT",
        "Service Informatique":  "ADMIN_EDT",
      };
      const dbRole = selectedRole === "teacher" ? "PROFESSEUR"
        : selectedRole === "admin" ? (adminRoleMap[form.adminRole] || "ADMIN_ATTEST")
        : "ETUDIANT";
      const adminTypeMap = { "ADMIN_ATTEST":"attest","ADMIN_BIB":"bib","ADMIN_EDT":"edt" };
      const adminType = selectedRole === "admin" ? (adminTypeMap[dbRole] || "attest") : undefined;

      const body = {
        nom:         form.nom,
        prenom:      form.prenom,
        email:       form.email,
        password:    form.password,
        password_confirmation: form.password2,
        cin:         form.cin,
        telephone:   form.telephone,
        db_role:     dbRole,
        admin_type:  adminType,
        service:     form.adminRole   || undefined,
        // Enseignant
        grade:       form.grade       || undefined,
        specialite:  form.specialite  || undefined,
        departement: allSelected.length > 0 ? allSelected[0]?.deptId : undefined,
        filieres:    allSelected.length > 0 ? allSelected.map(f => f.code) : undefined,
        // Étudiant
        cne:         form.cne         || undefined,
        filiere:     form.filiere_etudiant || undefined,
      };

      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      console.log("Register response:", res.status, data);

      if (!res.ok) {
        console.error("Register errors:", data.errors || data.message);
        const firstError = data.errors
          ? Object.values(data.errors)[0]?.[0]
          : data.message;
        setRegError(firstError || "Erreur lors de l'inscription.");
        setRegLoading(false);
        return;
      }

      // Stocker token + user
      localStorage.setItem("umi_token", data.token);
      localStorage.setItem("umi_user", JSON.stringify(data.user));

      // Redirection selon le rôle
      setDone(true);
      const redirectTo = data.redirect_route || "/teacher";
      setTimeout(() => navigate(redirectTo), 3200);

    } catch (err) {
      console.error("Register network error:", err);
      setRegError("Impossible de joindre le serveur. Vérifiez que Laravel tourne sur :8000");
      setRegLoading(false);
    }
  };


  /* progress bar width */
  const progress = step === 0 ? 0 : (step / totalSteps) * 100;

  return (
    <div style={{ minHeight: "100vh", display: "flex",
      fontFamily: "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* ══ LEFT PANEL ══ */}
      <motion.div
        initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}
        style={{ width: "38%", minWidth: 290, background: P.gradFull,
          position: "relative", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: "56px 44px", overflow: "hidden" }}
      >
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none" }}
          xmlns="http://www.w3.org/2000/svg">
          <Blob cx="12%"  cy="16%"  r={110} op={0.18} dur={7}  delay={0}   />
          <Blob cx="82%"  cy="72%"  r={140} op={0.14} dur={9}  delay={1.5} />
          <Blob cx="55%"  cy="10%"  r={80}  op={0.11} dur={6}  delay={0.8} />
          <Blob cx="18%"  cy="84%"  r={90}  op={0.12} dur={8}  delay={2}   />
        </svg>
        <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0.07,pointerEvents:"none" }}
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dotsR" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.3" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dotsR)"/>
        </svg>

        <div style={{ position:"relative", zIndex:2 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:44 }}>
            <span style={{ fontSize:24, fontWeight:800, color:"white", letterSpacing:"-0.5px" }}>Umi-Flow</span>
            <span style={{ fontSize:20 }}>👨‍🏫</span>
          </div>

          <h2 style={{ color:"white", fontSize:26, fontWeight:800, lineHeight:1.3,
            margin:"0 0 12px", letterSpacing:"-0.4px" }}>
            Rejoignez<br/>
            <span style={{ color:"rgba(255,255,255,0.65)" }}>la communauté UMI</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.6)", fontSize:14, margin:"0 0 40px", lineHeight:1.65 }}>
            Créez votre compte et accédez aux outils pédagogiques de l'Université Moulay Ismail.
          </p>

          {/* steps */}
          {selectedRole && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {[
                { n:1, label: selectedRole==="teacher" ? "Identité & Grade"
                    : selectedRole==="student" ? "Identité & Infos"
                    : "Identité & Profil" },
                ...(selectedRole==="teacher" ? [{ n:2, label:"Département & Filières" }] : []),
                ...(selectedRole==="student" ? [{ n:2, label:"Filière & Niveau" }] : []),
                ...(selectedRole==="admin"   ? [{ n:2, label:"Rôle & Service" }] : []),
                { n:3, label:"Compte & Accès" },
              ].map(s => {
                const isActive   = step === s.n;
                const isComplete = step > s.n || done;
                return (
                  <div key={s.n} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:30, height:30, borderRadius:9, flexShrink:0,
                      background: isComplete ? "rgba(255,255,255,0.95)"
                        : isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)",
                      border: isActive ? "1.5px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.18)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      transition:"all .4s" }}>
                      {isComplete
                        ? <Check size={14} color={P.accent} strokeWidth={2.5}/>
                        : <span style={{ fontSize:12, fontWeight:800,
                            color: isActive ? "white" : "rgba(255,255,255,0.45)" }}>{s.n}</span>
                      }
                    </div>
                    <span style={{ fontSize:13, fontWeight: isActive ? 700 : 400,
                      color: isActive ? "white" : "rgba(255,255,255,0.5)", transition:"all .3s" }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* selected role badge */}
          {role && (
            <motion.div initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              style={{ marginTop:32, background:"rgba(255,255,255,0.15)",
                backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.28)",
                borderRadius:13, padding:"13px 16px",
                display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ fontSize:24 }}>{role.emoji}</span>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"white" }}>{role.label}</div>
                <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.55)", marginTop:2 }}>
                  {emailDomain}
                </div>
              </div>
            </motion.div>
          )}

          {/* filieres pills for teacher */}
          {selectedRole==="teacher" && allSelected.length > 0 && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
              style={{ marginTop:14, display:"flex", flexWrap:"wrap", gap:6 }}>
              {allSelected.map(f => (
                <span key={f.code} style={{
                  background:"rgba(255,255,255,0.2)",
                  border:"1px solid rgba(255,255,255,0.35)",
                  borderRadius:20, padding:"3px 10px",
                  fontSize:11.5, fontWeight:700, color:"white" }}>{f.code}</span>
              ))}
            </motion.div>
          )}
        </div>

        <div style={{ position:"absolute", bottom:20, left:44,
          color:"rgba(255,255,255,0.28)", fontSize:11, zIndex:2 }}>
          © 2025 Université Moulay Ismail
        </div>
      </motion.div>

      {/* ══ RIGHT PANEL ══ */}
      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
        transition={{ duration:0.55, delay:0.2 }}
        style={{ flex:1, display:"flex", alignItems:"flex-start",
          justifyContent:"center", padding:"44px 44px",
          background:"linear-gradient(160deg,#fafbff 0%,#f1f5f9 100%)",
          overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:500 }}>

          {/* back link */}
          <Link to="/" style={{ display:"inline-flex", alignItems:"center", gap:6,
            fontSize:13, color:"#64748b", fontWeight:500,
            textDecoration:"none", marginBottom:24 }}>
            <ArrowLeft size={14}/> Retour à la connexion
          </Link>

          {/* ── SUCCESS ── */}
          <AnimatePresence>
            {done && (
              <motion.div initial={{ opacity:0, scale:0.92 }} animate={{ opacity:1, scale:1 }}
                style={{ textAlign:"center", padding:"32px 0" }}>
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }}
                  transition={{ type:"spring", stiffness:280, damping:20, delay:0.1 }}
                  style={{ width:80, height:80, borderRadius:"50%", background:P.gradBtn,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    margin:"0 auto 20px", boxShadow:"0 8px 32px rgba(234,88,12,0.3)" }}>
                  <Check size={36} color="white" strokeWidth={2.5}/>
                </motion.div>
                <h2 style={{ fontSize:24, fontWeight:800, color:"#0f172a", margin:"0 0 10px" }}>
                  Compte créé !
                </h2>
                <p style={{ fontSize:14.5, color:"#64748b", lineHeight:1.6, margin:"0 0 24px" }}>
                  Votre demande a été envoyée à l'administration.<br/>
                  Redirection en cours…
                </p>
                <motion.div animate={{ width:["0%","100%"] }} transition={{ duration:3 }}
                  style={{ height:4, background:P.gradBtn, borderRadius:99, margin:"0 auto", maxWidth:240 }}/>
              </motion.div>
            )}
          </AnimatePresence>

          {!done && (
            <div>

              {/* ════ STEP 0 — Choix du rôle ════ */}
              {step === 0 && (
                <motion.div key="role"
                  initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
                  transition={{ duration:0.3 }}>
                  <h1 style={{ fontSize:25, fontWeight:800, color:"#0f172a",
                    letterSpacing:"-0.4px", margin:"0 0 6px" }}>
                    Vous êtes…
                  </h1>
                  <p style={{ fontSize:14, color:"#94a3b8", margin:"0 0 28px" }}>
                    Sélectionnez votre profil pour personnaliser votre inscription.
                  </p>

                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    {ROLES.map(r => {
                      const Icon = r.icon;
                      const isSel = selectedRole === r.key;
                      return (
                        <motion.button key={r.key} type="button"
                          onClick={() => setSelectedRole(r.key)}
                          whileHover={{ x:4 }} whileTap={{ scale:0.98 }}
                          style={{ display:"flex", alignItems:"center", gap:16,
                            padding:"18px 20px", borderRadius:16, border:"none",
                            background: isSel ? r.bg : "white",
                            outline: isSel ? `2px solid ${r.color}` : "1.5px solid #e2e8f0",
                            cursor:"pointer", textAlign:"left", fontFamily:"inherit",
                            boxShadow: isSel ? `0 4px 20px ${r.color}20` : "0 1px 4px rgba(0,0,0,0.05)",
                            transition:"all .2s" }}>
                          {/* emoji bubble */}
                          <div style={{ width:52, height:52, borderRadius:14, flexShrink:0,
                            background: isSel ? r.color + "22" : "#f1f5f9",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:26, border: isSel ? `1.5px solid ${r.color}44` : "none",
                            transition:"all .2s" }}>
                            {r.emoji}
                          </div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:15, fontWeight:800,
                              color: isSel ? r.color : "#0f172a",
                              marginBottom:4, transition:"color .2s" }}>
                              {r.label}
                            </div>
                            <div style={{ fontSize:12.5, color:"#64748b", lineHeight:1.45 }}>
                              {r.desc}
                            </div>
                          </div>
                          <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0,
                            border: isSel ? `none` : "2px solid #e2e8f0",
                            background: isSel ? r.color : "transparent",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            transition:"all .2s" }}>
                            {isSel && <Check size={13} color="white" strokeWidth={3}/>}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <motion.button type="button"
                    onClick={() => selectedRole && setStep(1)}
                    disabled={!selectedRole}
                    whileHover={{ scale: selectedRole ? 1.01 : 1 }}
                    whileTap={{ scale: selectedRole ? 0.98 : 1 }}
                    style={{ width:"100%", marginTop:24, padding:"14px", borderRadius:12,
                      border:"none",
                      background: selectedRole ? P.gradBtn : "#e2e8f0",
                      color: selectedRole ? "white" : "#94a3b8",
                      fontSize:14.5, fontWeight:700,
                      cursor: selectedRole ? "pointer" : "not-allowed",
                      fontFamily:"inherit",
                      display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                      boxShadow: selectedRole ? "0 6px 24px rgba(234,88,12,0.25)" : "none" }}>
                    Continuer <ArrowRight size={17}/>
                  </motion.button>
                </motion.div>
              )}

              {/* ════ STEP 1 — Identité ════ */}
              {step === 1 && (
                <motion.div key="id"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                  transition={{ duration:0.28 }}>

                  <h1 style={{ fontSize:24, fontWeight:800, color:"#0f172a",
                    margin:"0 0 4px" }}>Votre identité</h1>
                  <p style={{ fontSize:13.5, color:"#94a3b8", margin:"0 0 6px" }}>
                    Étape 1 sur {totalSteps}
                  </p>
                  <ProgressBar value={progress}/>

                  {/* avatar */}
                  <div style={{ display:"flex", alignItems:"center", gap:16, margin:"20px 0 18px" }}>
                    <div onClick={() => document.getElementById("avatarInput").click()}
                      style={{ width:68, height:68, borderRadius:18, flexShrink:0,
                        background: avatar ? "transparent" : "#f5f3ff",
                        border:`2px dashed ${P.accent}55`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        cursor:"pointer", overflow:"hidden" }}>
                      {avatar
                        ? <img src={URL.createObjectURL(avatar)} alt=""
                            style={{ width:"100%",height:"100%",objectFit:"cover" }}/>
                        : <Upload size={20} color={P.accent}/>}
                      <input id="avatarInput" type="file" accept="image/*"
                        style={{ display:"none" }} onChange={e => setAvatar(e.target.files[0])}/>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#0f172a", marginBottom:2 }}>
                        Photo de profil
                      </div>
                      <div style={{ fontSize:12, color:"#94a3b8" }}>Optionnelle · max 5MB</div>
                    </div>
                  </div>

                  <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                      <Field label="Prénom" icon={User} value={form.prenom}
                        onChange={v=>set("prenom",v)} placeholder="Mohamed" required/>
                      <Field label="Nom" icon={User} value={form.nom}
                        onChange={v=>set("nom",v)} placeholder="Dupont" required/>
                    </div>

                    <Field label="CIN" icon={GraduationCap} value={form.cin}
                      onChange={v=>set("cin",v)} placeholder="AB123456" required/>

                    <Field label="Téléphone" icon={Phone} value={form.telephone}
                      onChange={v=>set("telephone",v)} placeholder="06 12 34 56 78" type="tel"/>

                    {/* TEACHER specific */}
                    {selectedRole==="teacher" && <>
                      <SelectField label="Grade" icon={Sparkles} value={form.grade}
                        onChange={v=>set("grade",v)} options={GRADES}
                        placeholder="Sélectionner votre grade…" required/>
                      <Field label="Spécialité / Domaine" icon={BookOpen} value={form.specialite}
                        onChange={v=>set("specialite",v)} placeholder="ex: Machine Learning, Réseaux…"/>
                    </>}

                    {/* STUDENT specific */}
                    {selectedRole==="student" && <>
                      <Field label="CNE" icon={GraduationCap} value={form.cne}
                        onChange={v=>set("cne",v)} placeholder="ex: R123456789" required/>
                    </>}

                    {/* ADMIN specific */}
                    {selectedRole==="admin" && <>
                      <SelectField label="Rôle administratif" icon={ShieldCheck}
                        value={form.adminRole} onChange={v=>set("adminRole",v)}
                        options={ADMIN_ROLES} placeholder="Sélectionner votre rôle…" required/>
                    </>}
                  </div>

                  <div style={{ display:"flex", gap:10, marginTop:22 }}>
                    <motion.button type="button" onClick={() => setStep(0)}
                      whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                      style={backBtnStyle}>← Retour</motion.button>
                    <motion.button type="button"
                      onClick={() => step1Valid && setStep(2)}
                      disabled={!step1Valid}
                      whileHover={{ scale: step1Valid ? 1.01 : 1 }}
                      whileTap={{ scale: step1Valid ? 0.98 : 1 }}
                      style={nextBtnStyle(step1Valid)}>
                      Continuer <ArrowRight size={16}/>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ════ STEP 2 — Dept/Filière/Rôle ════ */}
              {step === 2 && (
                <motion.div key="dept"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                  transition={{ duration:0.28 }}>

                  <h1 style={{ fontSize:24, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>
                    {selectedRole==="teacher" ? "Département & Filières"
                      : selectedRole==="student" ? "Filière & Niveau"
                      : "Service & Détails"}
                  </h1>
                  <p style={{ fontSize:13.5, color:"#94a3b8", margin:"0 0 6px" }}>
                    Étape 2 sur {totalSteps}
                  </p>
                  <ProgressBar value={progress}/>

                  <div style={{ marginTop:20 }}>

                  {/* ── TEACHER: dept accordion + multi filiere ── */}
                  {selectedRole==="teacher" && (
                    <>
                      <div style={{ display:"flex", alignItems:"center", gap:8,
                        background:"#f0f9ff", border:"1px solid #bae6fd",
                        borderRadius:10, padding:"10px 14px", marginBottom:14 }}>
                        <Sparkles size={14} color="#0ea5e9"/>
                        <span style={{ fontSize:12.5, color:"#0369a1", fontWeight:500 }}>
                          Vous pouvez sélectionner <strong>plusieurs filières</strong>.
                        </span>
                      </div>

                      {/* selected tags */}
                      {allSelected.length > 0 && (
                        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
                          {allSelected.map(f => (
                            <span key={f.code} style={{
                              display:"inline-flex", alignItems:"center", gap:5,
                              background: f.couleur+"18", border:`1.5px solid ${f.couleur}55`,
                              borderRadius:20, padding:"3px 10px 3px 11px",
                              fontSize:12.5, fontWeight:700, color:f.couleur }}>
                              {f.code}
                              <button onClick={() => toggleFiliere(f.deptId,f.code)}
                                style={{ background:"none", border:"none", cursor:"pointer",
                                  color:f.couleur, padding:0, display:"flex",
                                  alignItems:"center", marginLeft:1 }}>
                                <X size={11} strokeWidth={2.5}/>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* accordion */}
                      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {DEPARTEMENTS.map(d => {
                          const isOpen  = openDept === d.id;
                          const dSel    = selectedFilieres[d.id] || new Set();
                          const cnt     = dSel.size;
                          return (
                            <div key={d.id} style={{ background:"white", borderRadius:13,
                              border:`1.5px solid ${cnt>0 ? d.couleur+"66" : isOpen ? d.couleur+"44" : "#e2e8f0"}`,
                              overflow:"hidden",
                              boxShadow: cnt>0 ? `0 3px 14px ${d.couleur}14` : "0 1px 4px rgba(0,0,0,0.04)",
                              transition:"all .25s" }}>
                              <button type="button"
                                onClick={() => setOpenDept(isOpen ? null : d.id)}
                                style={{ width:"100%", display:"flex", alignItems:"center",
                                  justifyContent:"space-between",
                                  padding:"12px 15px", background:"transparent",
                                  border:"none", cursor:"pointer", textAlign:"left",
                                  fontFamily:"inherit" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <div style={{ width:36, height:36, borderRadius:10,
                                    background: d.couleur+"18",
                                    display:"flex", alignItems:"center", justifyContent:"center",
                                    fontSize:17, flexShrink:0 }}>{d.icon}</div>
                                  <div>
                                    <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{d.nom}</div>
                                    <div style={{ fontSize:11.5, marginTop:1,
                                      color: cnt>0 ? d.couleur : "#94a3b8",
                                      fontWeight: cnt>0 ? 600 : 400 }}>
                                      {cnt>0 ? `${cnt} filière${cnt>1?"s":""} sélectionnée${cnt>1?"s":""}` : `${d.filieres.length} filière${d.filieres.length>1?"s":""}`}
                                    </div>
                                  </div>
                                </div>
                                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                                  {cnt>0 && (
                                    <div style={{ width:20, height:20, borderRadius:"50%",
                                      background:d.couleur, display:"flex",
                                      alignItems:"center", justifyContent:"center" }}>
                                      <span style={{ fontSize:10, fontWeight:800, color:"white" }}>{cnt}</span>
                                    </div>
                                  )}
                                  <div style={{ color:"#94a3b8", transition:"transform .22s",
                                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                                    <ChevronDown size={15}/>
                                  </div>
                                </div>
                              </button>

                              <AnimatePresence>
                                {isOpen && (
                                  <motion.div
                                    initial={{ height:0, opacity:0 }}
                                    animate={{ height:"auto", opacity:1 }}
                                    exit={{ height:0, opacity:0 }}
                                    transition={{ duration:0.25, ease:[0.22,1,0.36,1] }}
                                    style={{ overflow:"hidden" }}>
                                    <div style={{ padding:"0 12px 12px",
                                      borderTop:`1px solid ${d.couleur}22`,
                                      paddingTop:10,
                                      display:"flex", flexDirection:"column", gap:6 }}>
                                      {d.filieres.map(f => {
                                        const sel = dSel.has(f.code);
                                        return (
                                          <button key={f.code} type="button"
                                            onClick={() => toggleFiliere(d.id,f.code)}
                                            style={{ display:"flex", alignItems:"center", gap:10,
                                              padding:"9px 12px", borderRadius:10,
                                              border:`1.5px solid ${sel ? d.couleur : d.couleur+"28"}`,
                                              background: sel ? d.couleur+"12" : "transparent",
                                              cursor:"pointer", textAlign:"left",
                                              fontFamily:"inherit", transition:"all .18s" }}>
                                            <div style={{ width:20, height:20, borderRadius:6,
                                              background: sel ? d.couleur : "white",
                                              border:`2px solid ${sel ? d.couleur : "#cbd5e1"}`,
                                              display:"flex", alignItems:"center",
                                              justifyContent:"center", flexShrink:0,
                                              transition:"all .18s" }}>
                                              {sel && <Check size={12} color="white" strokeWidth={3}/>}
                                            </div>
                                            <div>
                                              <div style={{ fontSize:13, fontWeight: sel?700:500,
                                                color: sel?d.couleur:"#374151" }}>{f.nom}</div>
                                              <div style={{ fontSize:11, color:"#94a3b8", marginTop:1, fontWeight:600 }}>{f.code}</div>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {/* ── STUDENT: filière + niveau ── */}
                  {selectedRole==="student" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <SelectField label="Département" icon={Building2}
                        value={form.filiere_etudiant}
                        onChange={v=>set("filiere_etudiant",v)}
                        options={DEPARTEMENTS.flatMap(d=>d.filieres.map(f=>`${f.code} — ${f.nom}`))}
                        placeholder="Sélectionner votre filière…" required/>
                      <SelectField label="Niveau d'études" icon={GraduationCap}
                        value={form.niveau} onChange={v=>set("niveau",v)}
                        options={FILIERES_NIVEAUX}
                        placeholder="Sélectionner votre niveau…" required/>
                    </div>
                  )}

                  {/* ── ADMIN: service ── */}
                  {selectedRole==="admin" && (
                    <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                      <Field label="Service / Département" icon={Building2}
                        value={form.service} onChange={v=>set("service",v)}
                        placeholder="ex: Service Scolarité, Direction…" required/>
                    </div>
                  )}

                  </div>

                  <div style={{ display:"flex", gap:10, marginTop:22 }}>
                    <motion.button type="button" onClick={() => setStep(1)}
                      whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                      style={backBtnStyle}>← Retour</motion.button>
                    <motion.button type="button"
                      onClick={() => step2Valid && setStep(3)}
                      disabled={!step2Valid}
                      whileHover={{ scale: step2Valid ? 1.01 : 1 }}
                      whileTap={{ scale: step2Valid ? 0.98 : 1 }}
                      style={nextBtnStyle(step2Valid)}>
                      Continuer <ArrowRight size={16}/>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ════ STEP 3 — Compte ════ */}
              {step === 3 && (
                <motion.div key="account"
                  initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }}
                  transition={{ duration:0.28 }}>

                  <h1 style={{ fontSize:24, fontWeight:800, color:"#0f172a", margin:"0 0 4px" }}>
                    Accès au compte
                  </h1>
                  <p style={{ fontSize:13.5, color:"#94a3b8", margin:"0 0 6px" }}>
                    Étape 3 sur {totalSteps}
                  </p>
                  <ProgressBar value={100}/>

                  <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:20 }}>
                    {/* email */}
                    <div>
                      <label style={{ display:"block", fontSize:12.5, fontWeight:600,
                        color:"#374151", marginBottom:7 }}>
                        Email académique <span style={{ color:P.orange }}>*</span>
                      </label>
                      <div style={{ display:"flex", alignItems:"center", background:"white",
                        border:`1.5px solid ${emailOk ? "#10b981" : "#e2e8f0"}`,
                        borderRadius:11, overflow:"hidden",
                        boxShadow: emailOk ? "0 0 0 3px #d1fae5" : "0 1px 3px rgba(0,0,0,0.05)",
                        transition:"all .2s" }}>
                        <div style={{ padding:"0 13px", color:"#cbd5e1", flexShrink:0 }}>
                          <Mail size={16}/>
                        </div>
                        <input type="email" value={form.email}
                          onChange={e=>set("email",e.target.value)}
                          placeholder={`prenom.nom${emailDomain}`}
                          style={{ flex:1, border:"none", outline:"none", background:"transparent",
                            fontSize:14, color:"#0f172a", padding:"12px 0", fontFamily:"inherit" }}/>
                        {emailOk && (
                          <div style={{ padding:"0 12px" }}>
                            <Check size={16} color="#10b981" strokeWidth={2.5}/>
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize:11.5, color:"#94a3b8", margin:"5px 0 0 2px" }}>
                        Domaine requis : <strong style={{ color:P.accent }}>{emailDomain}</strong>
                      </p>
                    </div>

                    <Field label="Mot de passe" icon={Lock}
                      type={showPass ? "text" : "password"}
                      value={form.password} onChange={v=>set("password",v)}
                      placeholder="••••••••" required
                      right={
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          style={{ padding:"0 13px", background:"none", border:"none",
                            color:"#94a3b8", cursor:"pointer" }}>
                          {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      }/>

                    <Field label="Confirmer le mot de passe" icon={Lock}
                      type={showPass2 ? "text" : "password"}
                      value={form.password2} onChange={v=>set("password2",v)}
                      placeholder="••••••••" required
                      right={
                        <button type="button" onClick={() => setShowPass2(!showPass2)}
                          style={{ padding:"0 13px", background:"none", border:"none",
                            color:"#94a3b8", cursor:"pointer" }}>
                          {showPass2 ? <EyeOff size={16}/> : <Eye size={16}/>}
                        </button>
                      }/>

                    {form.password2 && (
                      <div style={{ display:"flex", alignItems:"center", gap:6,
                        fontSize:12.5, fontWeight:600,
                        color: form.password===form.password2 ? "#10b981" : "#ef4444" }}>
                        {form.password===form.password2
                          ? <><Check size={14} strokeWidth={2.5}/> Mots de passe identiques</>
                          : <><X size={14} strokeWidth={2.5}/> Ne correspondent pas</>}
                      </div>
                    )}

                    {/* recap */}
                    {step3Valid && (
                      <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
                        style={{ background:"linear-gradient(135deg,#f5f3ff,#fef7f0)",
                          border:"1px solid #e9d5ff", borderRadius:13, padding:"14px 18px" }}>
                        <div style={{ fontSize:11.5, fontWeight:700, color:P.accent,
                          marginBottom:10, display:"flex", alignItems:"center", gap:5 }}>
                          <Sparkles size={12}/> RÉCAPITULATIF
                        </div>
                        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                          {[
                            ["Nom", `${form.prenom} ${form.nom}`],
                            ["Profil", role?.label],
                            selectedRole==="teacher" ? ["Grade", form.grade] : null,
                            selectedRole==="teacher" ? ["Filières", allSelected.map(f=>f.code).join(", ")] : null,
                            selectedRole==="student" ? ["CNE", form.cne] : null,
                            selectedRole==="student" ? ["Niveau", form.niveau] : null,
                            selectedRole==="admin"   ? ["Rôle", form.adminRole] : null,
                          ].filter(Boolean).map(([k,v]) => v ? (
                            <div key={k}>
                              <div style={{ fontSize:10.5, color:"#94a3b8", fontWeight:600 }}>{k}</div>
                              <div style={{ fontSize:12.5, color:"#0f172a", fontWeight:600, marginTop:2 }}>{v}</div>
                            </div>
                          ) : null)}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Erreur API */}
                  {regError && (
                    <motion.div initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}}
                      style={{ background:"#fef2f2", border:"1px solid #fecaca",
                        borderRadius:10, padding:"10px 14px", marginTop:10,
                        fontSize:13, color:"#ef4444", fontWeight:500 }}>
                      ⚠️ {regError}
                    </motion.div>
                  )}

                  <div style={{ display:"flex", gap:10, marginTop:22 }}>
                    <motion.button type="button" onClick={() => setStep(2)}
                      whileHover={{ scale:1.01 }} whileTap={{ scale:0.98 }}
                      style={backBtnStyle}>← Retour</motion.button>
                    <motion.button type="button"
                      onClick={handleSubmit}
                      disabled={!step3Valid || regLoading}
                      whileHover={{ scale: step3Valid ? 1.01 : 1 }}
                      whileTap={{ scale: step3Valid ? 0.98 : 1 }}
                      style={nextBtnStyle(step3Valid && !regLoading)}>
                      {regLoading ? (
                        <>
                          <motion.div animate={{rotate:360}}
                            transition={{duration:0.8,repeat:Infinity,ease:"linear"}}
                            style={{width:16,height:16,borderRadius:"50%",
                              border:"2px solid rgba(255,255,255,0.3)",
                              borderTopColor:"white"}}/>
                          Création en cours…
                        </>
                      ) : (
                        <><Check size={16}/> Créer mon compte</>
                      )}
                    </motion.button>
                  </div>

                  <p style={{ fontSize:11.5, color:"#94a3b8", textAlign:"center",
                    marginTop:16, lineHeight:1.6 }}>
                    Votre compte sera activé immédiatement.
                  </p>
                </motion.div>
              )}

            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── shared button styles ──────────────────────────────────── */
const backBtnStyle = {
  flex:1, padding:"13px", borderRadius:12,
  border:"1.5px solid #e2e8f0", background:"white",
  color:"#374151", fontSize:14, fontWeight:600,
  cursor:"pointer", fontFamily:"inherit",
};
const nextBtnStyle = (valid) => ({
  flex:2, padding:"13px", borderRadius:12, border:"none",
  background: valid ? "linear-gradient(135deg,#f97316,#9333ea)" : "#e2e8f0",
  color: valid ? "white" : "#94a3b8",
  fontSize:14.5, fontWeight:700,
  cursor: valid ? "pointer" : "not-allowed",
  fontFamily:"inherit",
  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
  boxShadow: valid ? "0 6px 24px rgba(234,88,12,0.25)" : "none",
});

/* ─── progress bar ──────────────────────────────────────────── */
function ProgressBar({ value }) {
  return (
    <div style={{ height:5, background:"#e2e8f0", borderRadius:99,
      overflow:"hidden", marginBottom:4 }}>
      <motion.div animate={{ width:`${value}%` }}
        transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
        style={{ height:"100%", borderRadius:99,
          background:"linear-gradient(135deg,#f97316,#9333ea)" }}/>
    </div>
  );
}