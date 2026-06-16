import { useState } from "react";
import { motion } from "framer-motion";
import {
  X, User, Mail, Phone, CreditCard, GraduationCap,
  BookOpen, Building2, Layers, LogOut, PenLine,
  CheckCircle, Shield, Eye, EyeOff, Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ── Mock profile — matches RegisterPage form fields ─────────── */
// PROF_PROFILE removed — user loaded inside component

const ACCENT = "#9333ea";

function InfoRow({ icon: Icon, label, value, color = "#64748b" }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:11,
      padding:"10px 0", borderBottom:"1px solid #f1f5f9" }}>
      <div style={{ width:32, height:32, borderRadius:9,
        background:`${ACCENT}12`, flexShrink:0,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Icon size={15} color={ACCENT}/>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600,
          marginBottom:2, letterSpacing:"0.3px" }}>
          {label.toUpperCase()}
        </div>
        <div style={{ fontSize:13.5, fontWeight:600, color:"#0f172a",
          lineHeight:1.4 }}>{value}</div>
      </div>
    </div>
  );
}

export default function ProfilePanel({ onClose }) {
  const navigate  = useNavigate();
  const [editing, setEditing]   = useState(false);
  const [showPass, setShowPass]  = useState(false);
  const [saved,   setSaved]     = useState(false);
  const p = (k,v) => setDraft(f=>({...f,[k]:v}));

  // ── Lire le vrai profil depuis localStorage ───────────────
  const buildProfile = () => {
    try {
      const u = JSON.parse(localStorage.getItem("umi_user")) || {};
      const roleLabel = {
        PROFESSEUR:"Enseignant", ETUDIANT:"Étudiant",
        SUPER_ADMIN:"Super Admin", ADMIN_ATTEST:"Admin Scolarité",
        ADMIN_BIB:"Admin Bibliothèque", ADMIN_EDT:"Admin EDT",
      }[u.db_role] || "Utilisateur";
      // Filières : tableau renvoyé par l'API ou filière unique
      const filieres = Array.isArray(u.filieres) && u.filieres.length > 0
        ? u.filieres
        : u.filiere ? [u.filiere] : [];
      // Date d'inscription
      const dateInscription = u.created_at
        ? new Date(u.created_at).toLocaleDateString("fr-FR",{year:"numeric",month:"long",day:"numeric"})
        : "—";
      return {
        prenom:          u.prenom      || "—",
        nom:             u.nom         || "—",
        email:           u.email       || "—",
        cin:             u.cin         || "—",
        telephone:       u.telephone   || "—",
        grade:           u.grade       || "—",
        specialite:      u.specialite  || "—",
        departement:     u.departement || "—",
        cne:             u.cne         || "—",
        filieres,
        service:         u.service     || "—",
        role:            roleLabel,
        dateInscription,
        password:        "••••••••••••",
        avatar:          null,
      };
    } catch {
      return { prenom:"—",nom:"—",email:"—",cin:"—",telephone:"—",grade:"—",
        specialite:"—",departement:"—",filieres:[],service:"—",role:"—",
        dateInscription:"—",password:"••••••••••••",avatar:null };
    }
  };

  const [profile, setProfile] = useState(buildProfile);
  const [draft,   setDraft]   = useState(buildProfile);

  const IS = { width:"100%", padding:"8px 11px", borderRadius:9,
    border:"1.5px solid #e2e8f0", fontSize:13, color:"#0f172a",
    fontFamily:"inherit", outline:"none", background:"#f8fafc",
    boxSizing:"border-box" };

  const save = () => {
    setProfile(draft);
    // Mettre à jour localStorage avec les nouvelles infos
    try {
      const u = JSON.parse(localStorage.getItem("umi_user")) || {};
      const updated = { ...u, prenom:draft.prenom, nom:draft.nom,
        telephone:draft.telephone, specialite:draft.specialite };
      localStorage.setItem("umi_user", JSON.stringify(updated));
    } catch(_) {}
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setEditing(false); }, 1600);
  };

  return (
    <>
      <div onClick={onClose}
        style={{ position:"fixed", inset:0, zIndex:9998 }}/>
      <motion.div
        initial={{ opacity:0, scale:0.95, y:-8 }}
        animate={{ opacity:1, scale:1, y:0 }}
        exit={{ opacity:0, scale:0.95, y:-8 }}
        transition={{ type:"spring", stiffness:360, damping:30 }}
        style={{ position:"fixed", top:72, right:16,
          width:360, maxHeight:580, background:"white", borderRadius:18,
          boxShadow:"0 20px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(147,51,234,0.12)",
          border:"1px solid #e2e8f0", overflow:"hidden", zIndex:9999,
          display:"flex", flexDirection:"column" }}>

        {/* top profile card */}
        <div style={{ background:`linear-gradient(135deg,${ACCENT},#7c3aed)`,
          padding:"20px 20px 16px", flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", marginBottom:14 }}>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              {/* avatar */}
              <div style={{ width:52, height:52, borderRadius:15,
                background:"rgba(255,255,255,0.25)",
                border:"2px solid rgba(255,255,255,0.4)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:22, fontWeight:800, color:"white", flexShrink:0 }}>
                {profile.prenom[0]}{profile.nom[0]}
              </div>
              <div>
                <div style={{ fontSize:16, fontWeight:800, color:"white", lineHeight:1.2 }}>
                  {profile.role === "Enseignant" ? "Prof. " : ""}{profile.prenom} {profile.nom}
                </div>
                <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:3 }}>
                  {profile.grade}
                </div>
                <div style={{ display:"inline-flex", alignItems:"center", gap:5,
                  background:"rgba(255,255,255,0.18)", borderRadius:20,
                  padding:"2px 10px", marginTop:5 }}>
                  <Shield size={10} color="white"/>
                  <span style={{ fontSize:11, color:"white", fontWeight:600 }}>
                    {profile.role}
                  </span>
                </div>
              </div>
            </div>
            <button onClick={onClose}
              style={{ width:26, height:26, borderRadius:7, border:"none",
                background:"rgba(255,255,255,0.2)", cursor:"pointer",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
              <X size={14} color="white"/>
            </button>
          </div>

          {/* email pill */}
          <div style={{ display:"flex", alignItems:"center", gap:7,
            background:"rgba(255,255,255,0.15)", borderRadius:10,
            padding:"7px 12px" }}>
            <Mail size={13} color="rgba(255,255,255,0.8)"/>
            <span style={{ fontSize:12.5, color:"rgba(255,255,255,0.9)",
              fontWeight:500 }}>{profile.email}</span>
          </div>
        </div>

        {/* scrollable body */}
        <div style={{ flex:1, overflowY:"auto" }}>

          {!editing ? (
            /* ── READ MODE ── */
            <div style={{ padding:"4px 18px 8px" }}>
              {/* Password — secured, read-only */}
              <div style={{ display:"flex", alignItems:"center", gap:11,
                padding:"10px 0", borderBottom:"1px solid #f1f5f9" }}>
                <div style={{ width:32, height:32, borderRadius:9,
                  background:`${ACCENT}12`, flexShrink:0,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <Lock size={15} color={ACCENT}/>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600,
                    marginBottom:2, letterSpacing:"0.3px" }}>MOT DE PASSE</div>
                  <div style={{ display:"flex", alignItems:"center",
                    justifyContent:"space-between" }}>
                    <div style={{ fontSize:15, fontWeight:700, color:"#0f172a",
                      letterSpacing:"3px", lineHeight:1 }}>
                      {showPass ? "Azerty@2025!" : "••••••••••••"}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <button onClick={()=>setShowPass(s=>!s)}
                        style={{ width:26, height:26, borderRadius:7, border:"none",
                          background:"#f1f5f9", cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {showPass
                          ? <EyeOff size={13} color="#64748b"/>
                          : <Eye size={13} color="#64748b"/>}
                      </button>
                      <span style={{ fontSize:10.5, color:"#94a3b8",
                        background:"#f8fafc", borderRadius:6,
                        padding:"2px 7px", border:"1px solid #e2e8f0" }}>
                        🔒 Non modifiable
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <InfoRow icon={CreditCard}  label="CIN"          value={profile.cin}/>
              <InfoRow icon={Phone}       label="Téléphone"    value={profile.telephone}/>
              {profile.role === "Enseignant" && (<>
                <InfoRow icon={GraduationCap} label="Grade"      value={profile.grade}/>
                <InfoRow icon={BookOpen}    label="Spécialité"   value={profile.specialite}/>
                <InfoRow icon={Building2}   label="Département"  value={profile.departement}/>
                <InfoRow icon={Layers}      label="Filières enseignées"
                  value={profile.filieres.join(" · ")}/>
              </>)}
              {profile.role === "Étudiant" && (<>
                <InfoRow icon={Layers}      label="Filière"
                  value={profile.filieres?.[0] || profile.departement || "—"}/>
                <InfoRow icon={BookOpen}    label="CNE"
                  value={profile.cne || "—"}/>
              </>)}
              <div style={{ display:"flex", alignItems:"center", gap:7,
                padding:"10px 0", fontSize:12, color:"#94a3b8" }}>
                <CheckCircle size={13} color="#10b981"/>
                Compte créé le {profile.dateInscription}
              </div>
            </div>
          ) : (
            /* ── EDIT MODE ── */
            <div style={{ padding:"12px 18px", display:"flex",
              flexDirection:"column", gap:10 }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#64748b",
                    display:"block", marginBottom:4 }}>PRÉNOM</label>
                  <input value={draft.prenom} onChange={e=>p("prenom",e.target.value)} style={IS}/>
                </div>
                <div>
                  <label style={{ fontSize:11, fontWeight:700, color:"#64748b",
                    display:"block", marginBottom:4 }}>NOM</label>
                  <input value={draft.nom} onChange={e=>p("nom",e.target.value)} style={IS}/>
                </div>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#64748b",
                  display:"block", marginBottom:4 }}>TÉLÉPHONE</label>
                <input value={draft.telephone} onChange={e=>p("telephone",e.target.value)}
                  type="tel" style={IS}/>
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:700, color:"#64748b",
                  display:"block", marginBottom:4 }}>SPÉCIALITÉ</label>
                <input value={draft.specialite} onChange={e=>p("specialite",e.target.value)} style={IS}/>
              </div>
              <div style={{ background:"#f8fafc", borderRadius:10,
                padding:"10px 12px", border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:11.5, color:"#94a3b8", marginBottom:4 }}>
                  🔒 CIN, email, grade et département — modifiables par l'administration uniquement
                </div>
              </div>
              {saved && (
                <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
                  style={{ display:"flex", alignItems:"center", gap:7,
                    background:"#ecfdf5", borderRadius:9, padding:"9px 12px",
                    border:"1px solid #a7f3d0" }}>
                  <CheckCircle size={14} color="#10b981"/>
                  <span style={{ fontSize:13, fontWeight:600, color:"#065f46" }}>
                    Profil mis à jour !
                  </span>
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* footer actions */}
        <div style={{ padding:"10px 16px 14px", borderTop:"1px solid #f1f5f9",
          display:"flex", gap:8, flexShrink:0 }}>
          {!editing ? (
            <>
              <button onClick={()=>{ setDraft(profile); setEditing(true); }}
                style={{ flex:1, padding:"9px", borderRadius:10, border:"none",
                  background:`${ACCENT}12`, color:ACCENT,
                  fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <PenLine size={14}/> Modifier le profil
              </button>
              <button onClick={()=>{ onClose(); navigate("/"); }}
                style={{ flex:1, padding:"9px", borderRadius:10, border:"none",
                  background:"#fef2f2", color:"#ef4444",
                  fontSize:13, fontWeight:700, cursor:"pointer",
                  fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <LogOut size={14}/> Déconnexion
              </button>
            </>
          ) : (
            <>
              <button onClick={()=>setEditing(false)}
                style={{ flex:1, padding:"9px", borderRadius:10,
                  border:"1.5px solid #e2e8f0", background:"white",
                  color:"#64748b", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:"inherit" }}>
                Annuler
              </button>
              <button onClick={save}
                style={{ flex:1, padding:"9px", borderRadius:10, border:"none",
                  background:`linear-gradient(135deg,${ACCENT},#7c3aed)`,
                  color:"white", fontSize:13, fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  boxShadow:`0 2px 10px ${ACCENT}40` }}>
                <CheckCircle size={14}/> Sauvegarder
              </button>
            </>
          )}
        </div>
      </motion.div>
    </>
  );
}