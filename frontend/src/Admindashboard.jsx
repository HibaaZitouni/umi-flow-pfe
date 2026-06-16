import { attestations as attestAPI, emprunts as empruntAPI, seances as seanceAPI, evenements as evAPI } from "./api.js";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { attestStore, notifStore } from "./syncStore.js";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, BookOpen, Calendar, LogOut, Bell, Search,
  Plus, Download, Upload, Check, X, Eye, Clock,
  Users, ChevronDown, AlertCircle, CheckCircle,
  Filter, Edit2, Trash2, RefreshCw, Send, Star,
  BookMarked, Library, ArrowLeft, ArrowRight,
  ClipboardList, GraduationCap, BarChart2,
  Layers, Settings, TrendingUp, Hash, Printer,
  XCircle, PenLine, BookCopy, CalendarDays,
  UserCheck, Zap, ChevronLeft, ChevronRight as ChevronR,
} from "lucide-react";

/* --- Palettes per service --- */
const SERVICES = {
  attest: {
    label: "Scolarité",
    icon: FileText,
    emoji: "📋",
    color: "#f59e0b",
    grad: "linear-gradient(135deg,#f59e0b,#d97706)",
    light: "#fffbeb",
    border: "#fde68a",
    dark: "#78350f",
  },
  bib: {
    label: "Bibliothèque",
    icon: Library,
    emoji: "📚",
    color: "#10b981",
    grad: "linear-gradient(135deg,#10b981,#059669)",
    light: "#ecfdf5",
    border: "#a7f3d0",
    dark: "#064e3b",
  },
  edt: {
    label: "Emploi du temps",
    icon: Calendar,
    emoji: "🗓️",
    color: "#3b82f6",
    grad: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
    light: "#eff6ff",
    border: "#bfdbfe",
    dark: "#1e3a8a",
  },
};

/* --- Mock data --- */
/* ATTESTATIONS */
const INIT_ATTEST = [
  { id:1,  etudiant:"Yassine Amrani",       cne:"R130045678", type:"Scolarité",    statut:"en_attente", date:"2025-01-20", motif:"Demande emploi" },
  { id:2,  etudiant:"Salma Benchekroun",    cne:"R130034521", type:"Réussite",     statut:"validee",    date:"2025-01-18", motif:"Concours" },
  { id:3,  etudiant:"Mehdi Tazi",           cne:"R130056789", type:"Relevé notes", statut:"generee",    date:"2025-01-17", motif:"Inscription master" },
  { id:4,  etudiant:"Fatima Zahra",         cne:"R130023456", type:"Scolarité",    statut:"en_attente", date:"2025-01-22", motif:"Stage" },
  { id:5,  etudiant:"Omar Filali",          cne:"R130078901", type:"Réussite",     statut:"refusee",    date:"2025-01-15", motif:"Visa" },
  { id:6,  etudiant:"Aicha Benmoussa",      cne:"R130012345", type:"Relevé notes", statut:"en_attente", date:"2025-01-23", motif:"Bourse" },
  { id:7,  etudiant:"Rachid Alami",         cne:"R130067890", type:"Scolarité",    statut:"validee",    date:"2025-01-14", motif:"Logement" },
  { id:8,  etudiant:"Nour El Houda",        cne:"R130045123", type:"Réussite",     statut:"generee",    date:"2025-01-16", motif:"Emploi" },
];

/* BIBLIOTHÈQUE */
const INIT_LIVRES = [
  { id:1,  titre:"Algorithmique — Le guide",      auteur:"T. Cormen",      isbn:"978-2-10-080",  cat:"Informatique",  dispo:3,  total:5,  annee:2022 },
  { id:2,  titre:"Base de données avancées",      auteur:"C. Date",        isbn:"978-0-32-192",  cat:"Informatique",  dispo:0,  total:3,  annee:2020 },
  { id:3,  titre:"Machine Learning avec Python",  auteur:"A. Géron",       isbn:"978-2-41-234",  cat:"IA",            dispo:2,  total:4,  annee:2023 },
  { id:4,  titre:"Génie Civil — Structures",      auteur:"R. Blanc",       isbn:"978-2-22-341",  cat:"Génie Civil",   dispo:1,  total:2,  annee:2021 },
  { id:5,  titre:"Management stratégique",        auteur:"M. Porter",      isbn:"978-2-10-991",  cat:"Management",    dispo:4,  total:4,  annee:2022 },
  { id:6,  titre:"Réseaux informatiques",         auteur:"A. Tanenbaum",   isbn:"978-2-74-402",  cat:"Informatique",  dispo:0,  total:2,  annee:2021 },
];

const INIT_EMPRUNTS = [
  { id:1,  etudiant:"Yassine Amrani",   livre:"Algorithmique — Le guide",     dateEmprunt:"2025-01-10", dateRetour:"2025-01-24", statut:"en_cours",   retard:0 },
  { id:2,  etudiant:"Salma Benchekroun",livre:"Machine Learning avec Python",  dateEmprunt:"2025-01-05", dateRetour:"2025-01-19", statut:"en_retard",  retard:4 },
  { id:3,  etudiant:"Mehdi Tazi",       livre:"Réseaux informatiques",         dateEmprunt:"2025-01-12", dateRetour:"2025-01-26", statut:"en_cours",   retard:0 },
  { id:4,  etudiant:"Fatima Zahra",     livre:"Base de données avancées",      dateEmprunt:"2024-12-20", dateRetour:"2025-01-03", statut:"retourne",   retard:0 },
  { id:5,  etudiant:"Omar Filali",      livre:"Management stratégique",        dateEmprunt:"2025-01-08", dateRetour:"2025-01-22", statut:"en_retard",  retard:2 },
];

/* EDT */
const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const SLOTS = ["08:00–10:00","10:00–12:00","14:00–16:00","16:00–18:00"];
const INIT_EDT = [
  { id:1,  jour:"Lundi",    slot:"08:00–10:00", matiere:"Algorithmique",    prof:"Prof. Benali",  salle:"A101", groupe:"GI-L3-G1", type:"CM", couleur:"#3b82f6" },
  { id:2,  jour:"Lundi",    slot:"10:00–12:00", matiere:"Base de Données",  prof:"Prof. Berrada", salle:"B204", groupe:"AI-L3-G1", type:"TD", couleur:"#8b5cf6" },
  { id:3,  jour:"Mardi",    slot:"08:00–10:00", matiere:"Machine Learning", prof:"Prof. Tazi",    salle:"C301", groupe:"AI-M1-G1", type:"TP", couleur:"#10b981" },
  { id:4,  jour:"Mardi",    slot:"14:00–16:00", matiere:"Réseaux",          prof:"Prof. Alami",   salle:"A102", groupe:"GI-L3-G2", type:"CM", couleur:"#f59e0b" },
  { id:5,  jour:"Mercredi", slot:"10:00–12:00", matiere:"POO",              prof:"Prof. Benali",  salle:"D401", groupe:"DWM-L2-G1",type:"TD", couleur:"#ef4444" },
  { id:6,  jour:"Jeudi",    slot:"08:00–10:00", matiere:"Algorithmique",    prof:"Prof. Berrada", salle:"A101", groupe:"GI-L3-G2", type:"CM", couleur:"#3b82f6" },
  { id:7,  jour:"Vendredi", slot:"14:00–16:00", matiere:"IA Avancée",       prof:"Prof. Tazi",    salle:"C302", groupe:"AI-M1-G2", type:"TP", couleur:"#10b981" },
];

const GROUPES = ["GI-L3-G1","GI-L3-G2","AI-L3-G1","AI-M1-G1","AI-M1-G2","DWM-L2-G1","DWM-L2-G2"];
const SALLES  = ["A101","A102","B204","C301","C302","D401","Amphi A","Amphi B"];
const PROFS   = ["Prof. Benali","Prof. Berrada","Prof. Tazi","Prof. Alami","Prof. Moujahid"];

const EVENTS = [
  { id:1, titre:"Journée Portes Ouvertes",   date:"2025-02-10", lieu:"Amphi A", type:"institutionnel", statut:"planifie",  inscrits:0  },
  { id:2, titre:"Conférence IA & Société",   date:"2025-02-15", lieu:"C301",    type:"academique",     statut:"publie",    inscrits:87 },
  { id:3, titre:"Hackathon Web 2025",        date:"2025-03-01", lieu:"D401",    type:"club",           statut:"planifie",  inscrits:34 },
  { id:4, titre:"Soutenance PFE — Batch 1",  date:"2025-02-20", lieu:"Amphi B", type:"academique",     statut:"publie",    inscrits:0  },
];

/* --- helpers --- */
const attestStatut = {
  en_attente: { label:"En attente",  color:"#f59e0b", bg:"#fffbeb", Icon:Clock },
  validee:    { label:"Validée",     color:"#3b82f6", bg:"#eff6ff", Icon:CheckCircle },
  generee:    { label:"Générée",     color:"#10b981", bg:"#ecfdf5", Icon:FileText },
  refusee:    { label:"Refusée",     color:"#ef4444", bg:"#fef2f2", Icon:XCircle },
};

const empruntStatut = {
  en_cours:  { label:"En cours",   color:"#3b82f6", bg:"#eff6ff" },
  en_retard: { label:"En retard",  color:"#ef4444", bg:"#fef2f2" },
  retourne:  { label:"Retourné",   color:"#10b981", bg:"#ecfdf5" },
};

const typeColors = { CM:"#3b82f6", TD:"#8b5cf6", TP:"#10b981" };

function Tag({ color, bg, label, icon:Icon, small }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:4,
      background:bg, color, fontSize:small?10.5:12, fontWeight:700,
      borderRadius:20, padding:small?"2px 8px":"4px 11px",
      border:`1px solid ${color}30` }}>
      {Icon && <Icon size={small?10:11} strokeWidth={2.5}/>}{label}
    </span>
  );
}

function ActionBtn({ icon:Icon, color="#94a3b8", title, onClick }) {
  const [h,setH]=useState(false);
  return (
    <button onClick={onClick} title={title}
      onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{ width:30,height:30,borderRadius:8,border:"none",
        background:h?color+"18":"#f8fafc",cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",
        transition:"all .15s" }}>
      <Icon size={14} color={h?color:"#94a3b8"}/>
    </button>
  );
}

/* Modal base */
function Modal({ onClose, title, subtitle, color, children, maxW=500 }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,zIndex:200,
        background:"rgba(15,23,42,0.55)",backdropFilter:"blur(6px)",
        display:"flex",alignItems:"center",justifyContent:"center",padding:20 }}
      onClick={onClose}>
      <motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}}
        exit={{scale:0.93,y:20}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={e=>e.stopPropagation()}
        style={{ background:"white",borderRadius:22,width:"100%",maxWidth:maxW,
          maxHeight:"90vh",overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"20px 24px 16px",
          background:`linear-gradient(135deg,${color},${color}cc)`,
          display:"flex",justifyContent:"space-between",alignItems:"center",
          position:"sticky",top:0,zIndex:1 }}>
          <div>
            <div style={{ fontSize:16,fontWeight:800,color:"white" }}>{title}</div>
            {subtitle && <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)",border:"none",
              cursor:"pointer",color:"white",padding:8,borderRadius:9,display:"flex" }}>
            <X size={16}/>
          </button>
        </div>
        <div style={{ padding:"22px 24px 26px" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

const LS = { display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6 };
const IS = { width:"100%",padding:"10px 12px",borderRadius:10,
  border:"1.5px solid #e2e8f0",fontSize:13.5,color:"#0f172a",
  fontFamily:"inherit",outline:"none",background:"#f8fafc",boxSizing:"border-box" };


/* ---
   ADMIN NOTIFICATIONS DATA & PANEL
--- */
const ADMIN_NOTIFS = [
  {
    id:1, lu:false, priorite:"haute", type:"attestation",
    icon:"📋", couleur:"#f59e0b",
    titre:"Attestation à signer — Yassine Amrani",
    corps:"Demande de scolarité pour motif emploi. En attente de votre signature.",
    date:"Il y a 5 min",
    action:{ label:"Signer", key:"sign_attest_1" },
  },
  {
    id:2, lu:false, priorite:"haute", type:"attestation",
    icon:"📋", couleur:"#f59e0b",
    titre:"Attestation à signer — Fatima Zahra",
    corps:"Demande de scolarité pour motif stage. En attente de signature.",
    date:"Il y a 20 min",
    action:{ label:"Signer", key:"sign_attest_2" },
  },

  {
    id:4, lu:false, priorite:"normale", type:"emprunt",
    icon:"📚", couleur:"#3b82f6",
    titre:"Demande d'emprunt — Yassine Amrani",
    corps:"Machine Learning avec Python — 14 jours. En attente de confirmation.",
    date:"Il y a 2h",
    action:{ label:"Confirmer", key:"confirm_emprunt_4" },
  },
  {
    id:5, lu:false, priorite:"haute", type:"retard",
    icon:"⚠️", couleur:"#ef4444",
    titre:"Retour en retard — Omar Filali",
    corps:"Base de Données Avancées — 3 jours de retard. Rappel nécessaire.",
    date:"Il y a 3h",
    action:{ label:"Envoyer rappel", key:"rappel_5" },
  },
  {
    id:6, lu:false, priorite:"normale", type:"club",
    icon:"🎭", couleur:"#10b981",
    titre:"Club à valider — Club Programmation",
    corps:"Demande de création du Club Programmation par Amine Berrada. En attente de validation.",
    date:"Il y a 5h",
    action:{ label:"Valider", key:"validate_club_6" },
  },
  {
    id:7, lu:true, priorite:"normale", type:"reservation",
    icon:"🏫", couleur:"#0ea5e9",
    titre:"Réservation confirmée — Prof. Berrada",
    corps:"Salle C302 — Vendredi 10:00. Réservation accordée.",
    date:"Hier",
    action:null,
  },
  {
    id:8, lu:true, priorite:"normale", type:"pfe",
    icon:"🎓", couleur:"#6366f1",
    titre:"PFE soumis — Fatima Zahra",
    corps:"Plateforme e-learning avec recommandations IA. Rapport déposé pour validation.",
    date:"Il y a 2j",
    action:null,
  },
];

const NOTIF_TYPE_CFG = {
  attestation: { bg:"#fffbeb", border:"#fde68a" },
  compte:      { bg:"#f5f3ff", border:"#ddd6fe" },
  emprunt:     { bg:"#eff6ff", border:"#bfdbfe" },
  retard:      { bg:"#fef2f2", border:"#fecaca" },
  club:        { bg:"#ecfdf5", border:"#a7f3d0" },
  reservation: { bg:"#f0f9ff", border:"#bae6fd" },
  pfe:         { bg:"#eef2ff", border:"#c7d2fe" },
};


/* --- SIGNATURE ATTESTATION MODAL --- */
function SignatureAttestModal({ notif, onClose, onSigned }) {
  const [sigMode,  setSigMode]  = useState("canvas"); // "canvas" | "upload"
  const [hasSig,   setHasSig]   = useState(false);
  const [uploadedSig, setUploadedSig] = useState(null);
  const [sending,  setSending]  = useState(false);
  const [isDrawing,setIsDrawing]= useState(false);

  const canvasRef = React.useRef(null);
  const lastPos   = React.useRef(null);

  const now = new Date().toLocaleDateString("fr-MA",{year:"numeric",month:"long",day:"numeric"});
  const refNum = `ATT-ADMIN-${notif.id}-${Date.now().toString().slice(-5)}`;

  /* --- Canvas helpers --- */
  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = "round";
    ctx.strokeStyle = "#1e3a8a";
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
    setHasSig(true);
  };

  const endDraw = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    setHasSig(false);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setUploadedSig(ev.target.result); setHasSig(true); };
    reader.readAsDataURL(file);
  };

  const handleSend = async () => {
    setSending(true);
    // Récupérer la signature (canvas ou image uploadée)
    let signatureData = null;
    if (sigMode === "canvas" && canvasRef.current) {
      signatureData = canvasRef.current.toDataURL("image/png");
    } else if (sigMode === "upload" && uploadedSig) {
      signatureData = uploadedSig;
    }
    setTimeout(() => { setSending(false); onSigned(signatureData); }, 1200);
  };

  const canSend = hasSig;

  // extract names from titre e.g. "Attestation à signer — Yassine Amrani"
  const etudiantNom = notif.titre.split("—")[1]?.trim() || "Étudiant";

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed",inset:0,zIndex:10000,
        background:"rgba(15,23,42,0.65)",backdropFilter:"blur(8px)",
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:16, overflowY:"auto" }}
      onClick={onClose}>
      <motion.div initial={{scale:0.92,y:24}} animate={{scale:1,y:0}}
        exit={{scale:0.92,y:24}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={e=>e.stopPropagation()}
        style={{ background:"white",borderRadius:22,width:"100%",maxWidth:640,
          maxHeight:"94vh",overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.25)" }}>

        {/* header */}
        <div style={{ padding:"20px 26px 16px",
          background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)",
          position:"sticky",top:0,zIndex:1,
          display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:12,
              background:"rgba(255,255,255,0.2)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>
              📋
            </div>
            <div>
              <div style={{ fontSize:16,fontWeight:800,color:"white" }}>
                Signer l'attestation
              </div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)" }}>
                {etudiantNom}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)",border:"none",
              cursor:"pointer",color:"white",padding:8,borderRadius:9,display:"flex" }}>
            <span style={{ fontSize:16 }}>✕</span>
          </button>
        </div>

        <div style={{ padding:"22px 26px 28px",display:"flex",flexDirection:"column",gap:20 }}>

          {/* --- Document aperçu --- */}
          <div style={{ border:"1.5px solid #e2e8f0",borderRadius:16,overflow:"hidden" }}>
            {/* doc header */}
            <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)",
              padding:"14px 20px",display:"flex",
              alignItems:"center",justifyContent:"space-between" }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                <span style={{ fontSize:22 }}>🎓</span>
                <div>
                  <div style={{ fontSize:13,fontWeight:800,color:"white" }}>
                    Université Moulay Ismail
                  </div>
                  <div style={{ fontSize:10,color:"rgba(255,255,255,0.65)",
                    letterSpacing:"1px" }}>MEKNÈS — MAROC</div>
                </div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:10,color:"rgba(255,255,255,0.6)" }}>Réf.</div>
                <div style={{ fontSize:11,fontWeight:700,color:"white",
                  fontFamily:"monospace" }}>{refNum}</div>
              </div>
            </div>

            {/* doc body */}
            <div style={{ padding:"20px 24px",background:"#fafafa" }}>
              <div style={{ textAlign:"center",marginBottom:16 }}>
                <div style={{ fontSize:16,fontWeight:800,color:"#0f172a",
                  letterSpacing:"0.5px",textTransform:"uppercase",
                  borderBottom:"2px solid #f59e0b",paddingBottom:8,
                  display:"inline-block" }}>
                  Attestation de Participation
                </div>
              </div>
              <p style={{ fontSize:13,color:"#374151",lineHeight:1.8,
                margin:"0 0 12px",textAlign:"justify" }}>
                Nous soussignés, l'administration de l'<strong>Université Moulay Ismail</strong>,
                attestons par la présente que :
              </p>
              <div style={{ background:"#fffbeb",border:"1px solid #fde68a",
                borderRadius:10,padding:"12px 16px",marginBottom:12 }}>
                <div style={{ fontSize:16,fontWeight:800,color:"#0f172a" }}>
                  {etudiantNom}
                </div>
              </div>
              <p style={{ fontSize:13,color:"#374151",lineHeight:1.8,
                margin:"0 0 12px",textAlign:"justify" }}>
                {notif.corps}
              </p>
              <p style={{ fontSize:12.5,color:"#64748b",lineHeight:1.7,
                margin:"0 0 16px",textAlign:"justify" }}>
                Cette attestation est délivrée pour servir et valoir ce que de droit.
              </p>

              {/* Signature zone */}
              <div style={{ display:"flex",justifyContent:"space-between",
                alignItems:"flex-end" }}>
                <div style={{ fontSize:12,color:"#94a3b8" }}>Émise le : {now}</div>

                {/* THE SIGNATURE BLOCK */}
                <div style={{ textAlign:"center",minWidth:200 }}>
                  <div style={{ fontSize:11,color:"#64748b",
                    marginBottom:6,fontWeight:600 }}>
                    Cachet & Signature Administration UMI
                  </div>
                  {/* signature display */}
                  <div style={{ width:200,height:80,borderRadius:10,
                    border:hasSig?"1.5px solid #10b981":"1.5px dashed #cbd5e1",
                    background:hasSig?"#f0fdf4":"#f8fafc",
                    display:"flex",alignItems:"center",justifyContent:"center",
                    overflow:"hidden",transition:"all .3s" }}>
                    {sigMode==="upload"&&uploadedSig ? (
                      <img src={uploadedSig} alt="signature"
                        style={{ maxWidth:"100%",maxHeight:"100%",objectFit:"contain" }}/>
                    ) : sigMode==="canvas"&&hasSig ? (
                      <canvas ref={null} style={{ display:"none" }}/>
                    ) : (
                      <span style={{ fontSize:12,color:"#cbd5e1" }}>
                        {hasSig?"✅ Signée":"En attente de signature"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* QR */}
            <div style={{ borderTop:"1px solid #e2e8f0",padding:"10px 20px",
              background:"#f8fafc",display:"flex",alignItems:"center",gap:10 }}>
              <div style={{ width:34,height:34,background:"#0f172a",
                borderRadius:6,display:"flex",alignItems:"center",
                justifyContent:"center",flexShrink:0 }}>
                <span style={{ fontSize:16 }}>▦</span>
              </div>
              <div style={{ fontSize:10.5,color:"#64748b" }}>
                portail.umi.ac.ma/verif · Hash : {refNum}-SHA256
              </div>
            </div>
          </div>

          {/* --- Zone de signature --- */}
          <div>
            <div style={{ fontSize:14,fontWeight:800,color:"#0f172a",marginBottom:12,
              display:"flex",alignItems:"center",gap:7 }}>
              ✍️ Votre signature
            </div>

            {/* mode switcher */}
            <div style={{ display:"flex",gap:8,marginBottom:14 }}>
              {[{id:"canvas",label:"✍️ Dessiner"},
                {id:"upload",label:"📤 Téléverser"}].map(m=>(
                <button key={m.id} onClick={()=>{setSigMode(m.id);setHasSig(false);setUploadedSig(null);clearCanvas();}}
                  style={{ flex:1,padding:"10px",borderRadius:11,border:"none",
                    background:sigMode===m.id?"#1e3a8a":"#f8fafc",
                    color:sigMode===m.id?"white":"#64748b",
                    fontSize:13.5,fontWeight:sigMode===m.id?700:500,
                    cursor:"pointer",fontFamily:"inherit",
                    border:sigMode===m.id?"none":"1.5px solid #e2e8f0",
                    transition:"all .2s" }}>
                  {m.label}
                </button>
              ))}
            </div>

            {/* CANVAS MODE */}
            {sigMode==="canvas"&&(
              <div>
                <div style={{ position:"relative",borderRadius:14,overflow:"hidden",
                  border:`2px solid ${hasSig?"#10b981":"#e2e8f0"}`,
                  background:"white",transition:"border .3s" }}>
                  <canvas
                    ref={canvasRef}
                    width={580} height={160}
                    onMouseDown={startDraw}
                    onMouseMove={draw}
                    onMouseUp={endDraw}
                    onMouseLeave={endDraw}
                    onTouchStart={startDraw}
                    onTouchMove={draw}
                    onTouchEnd={endDraw}
                    style={{ width:"100%",height:160,cursor:"crosshair",
                      display:"block", touchAction:"none" }}/>
                  {!hasSig&&(
                    <div style={{ position:"absolute",inset:0,
                      display:"flex",flexDirection:"column",
                      alignItems:"center",justifyContent:"center",
                      pointerEvents:"none",gap:8 }}>
                      <span style={{ fontSize:28 }}>✍️</span>
                      <span style={{ fontSize:13,color:"#94a3b8",fontWeight:500 }}>
                        Dessinez votre signature ici
                      </span>
                      <span style={{ fontSize:11.5,color:"#cbd5e1" }}>
                        Utilisez la souris ou le doigt (tactile)
                      </span>
                    </div>
                  )}
                </div>
                <div style={{ display:"flex",justifyContent:"flex-end",marginTop:8 }}>
                  <button onClick={clearCanvas}
                    style={{ fontSize:12.5,color:"#ef4444",fontWeight:600,
                      background:"none",border:"none",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:5 }}>
                    🗑️ Effacer la signature
                  </button>
                </div>
              </div>
            )}

            {/* UPLOAD MODE */}
            {sigMode==="upload"&&(
              <div>
                <label style={{ display:"flex",flexDirection:"column",
                  alignItems:"center",justifyContent:"center",gap:10,
                  padding:"28px 20px",borderRadius:14,cursor:"pointer",
                  border:`2px dashed ${uploadedSig?"#10b981":"#cbd5e1"}`,
                  background:uploadedSig?"#f0fdf4":"#f8fafc",
                  transition:"all .2s" }}
                  onMouseEnter={e=>!uploadedSig&&(e.currentTarget.style.borderColor="#1e3a8a")}
                  onMouseLeave={e=>!uploadedSig&&(e.currentTarget.style.borderColor="#cbd5e1")}>
                  <input type="file" accept="image/*"
                    onChange={handleUpload} style={{ display:"none" }}/>
                  {uploadedSig ? (
                    <>
                      <img src={uploadedSig} alt="sig"
                        style={{ maxHeight:100,maxWidth:"100%",
                          objectFit:"contain",borderRadius:8 }}/>
                      <span style={{ fontSize:13,color:"#10b981",fontWeight:600 }}>
                        ✅ Signature chargée — cliquez pour changer
                      </span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize:36 }}>📤</span>
                      <span style={{ fontSize:14,color:"#64748b",fontWeight:500 }}>
                        Cliquez ou glissez votre signature
                      </span>
                      <span style={{ fontSize:12,color:"#94a3b8" }}>
                        PNG, JPG ou SVG — fond transparent recommandé
                      </span>
                    </>
                  )}
                </label>
                {uploadedSig&&(
                  <div style={{ display:"flex",justifyContent:"flex-end",marginTop:8 }}>
                    <button onClick={()=>{setUploadedSig(null);setHasSig(false);}}
                      style={{ fontSize:12.5,color:"#ef4444",fontWeight:600,
                        background:"none",border:"none",cursor:"pointer" }}>
                      🗑️ Supprimer
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- Actions --- */}
          <div style={{ display:"flex",gap:10 }}>
            <button onClick={onClose}
              style={{ flex:1,padding:"12px",borderRadius:11,
                border:"1.5px solid #e2e8f0",background:"white",
                color:"#64748b",fontSize:13.5,fontWeight:600,
                cursor:"pointer",fontFamily:"inherit" }}>
              Annuler
            </button>
            <button onClick={handleSend} disabled={!canSend||sending}
              style={{ flex:2,padding:"12px",borderRadius:11,border:"none",
                background:canSend&&!sending
                  ?"linear-gradient(135deg,#1e3a8a,#3b82f6)":"#e2e8f0",
                color:canSend&&!sending?"white":"#94a3b8",
                fontSize:13.5,fontWeight:700,
                cursor:canSend&&!sending?"pointer":"not-allowed",
                fontFamily:"inherit",
                display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                boxShadow:canSend&&!sending?"0 4px 16px rgba(30,58,138,0.3)":"none",
                transition:"all .2s" }}>
              {sending?(
                <><motion.div animate={{rotate:360}}
                  transition={{duration:0.8,repeat:Infinity,ease:"linear"}}
                  style={{ width:16,height:16,borderRadius:"50%",
                    border:"2px solid rgba(255,255,255,0.3)",
                    borderTopColor:"white" }}/> Envoi en cours…</>
              ):(
                <>📤 Signer & renvoyer à l'émetteur</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AdminNotifPanel({ notifs, setNotifs, onClose, svc, onSignRequest }) {
  const [filter, setFilter] = useState("all");
  const [toast,  setToast]  = useState(null);

  const unread = notifs.filter(n=>!n.lu).length;
  const markAllRead = () => setNotifs(p=>p.map(n=>({...n,lu:true})));
  const markRead = (id) => setNotifs(p=>p.map(n=>n.id===id?{...n,lu:true}:n));

  const handleAction = (notif) => {
    // Attestations → ouvre la modal de signature
    if (notif.action?.key?.startsWith("sign_attest")) {
      markRead(notif.id);
      onSignRequest(notif);
      return;
    }
    const msgs = {
      confirm_emprunt_4:"✅ Emprunt confirmé",
      rappel_5:         "📧 Rappel envoyé à Omar Filali",
      validate_club_6:  "✅ Club Programmation validé",
    };
    setToast(msgs[notif.action?.key] || "✅ Action effectuée");
    markRead(notif.id);
    setNotifs(p=>p.map(n=>n.id===notif.id?{...n,lu:true,action:null}:n));
    setTimeout(()=>setToast(null), 2800);
  };

  const filtered = notifs.filter(n=>
    filter==="all" ? true :
    filter==="non_lues" ? !n.lu :
    filter==="actions" ? (n.action&&!n.lu) : true
  );

  const urgentes = notifs.filter(n=>!n.lu&&n.priorite==="haute");

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:9998 }}/>
      <motion.div
        initial={{opacity:0,scale:0.95,y:-8}}
        animate={{opacity:1,scale:1,y:0}}
        exit={{opacity:0,scale:0.95,y:-8}}
        transition={{type:"spring",stiffness:360,damping:30}}
        style={{ position:"fixed",top:72,right:16,
          width:400,maxHeight:580,background:"white",borderRadius:18,
          boxShadow:"0 20px 60px rgba(0,0,0,0.18),0 4px 16px rgba(0,0,0,0.08)",
          border:"1px solid #e2e8f0",overflow:"hidden",zIndex:9999,
          display:"flex",flexDirection:"column" }}>

        {/* header */}
        <div style={{ padding:"14px 18px 0",flexShrink:0 }}>
          <div style={{ display:"flex",justifyContent:"space-between",
            alignItems:"center",marginBottom:10 }}>
            <div style={{ display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ fontSize:15,fontWeight:800,color:"#0f172a" }}>
                Notifications
              </div>
              {unread>0&&(
                <span style={{ background:"#ef4444",color:"white",
                  fontSize:11,fontWeight:700,borderRadius:20,
                  padding:"2px 8px" }}>{unread} non lues</span>
              )}
            </div>
            <div style={{ display:"flex",gap:7,alignItems:"center" }}>
              {unread>0&&(
                <button onClick={markAllRead}
                  style={{ fontSize:11.5,color:"#9333ea",fontWeight:600,
                    background:"none",border:"none",cursor:"pointer" }}>
                  Tout lu
                </button>
              )}
              <button onClick={onClose}
                style={{ width:24,height:24,borderRadius:7,border:"none",
                  background:"#f1f5f9",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:13,color:"#64748b" }}>✕</span>
              </button>
            </div>
          </div>

          {/* urgentes banner */}
          {urgentes.length>0&&(
            <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
              style={{ background:"#fef2f2",border:"1px solid #fecaca",
                borderRadius:10,padding:"9px 13px",marginBottom:10,
                display:"flex",alignItems:"center",gap:8 }}>
              <span style={{ fontSize:16 }}>🚨</span>
              <span style={{ fontSize:12.5,fontWeight:700,color:"#991b1b" }}>
                {urgentes.length} action{urgentes.length>1?"s":""} urgente{urgentes.length>1?"s":""} en attente
              </span>
            </motion.div>
          )}

          {/* toast */}
          <AnimatePresence>
            {toast&&(
              <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
                exit={{opacity:0}} style={{ background:"#ecfdf5",
                  border:"1px solid #a7f3d0",borderRadius:10,
                  padding:"9px 13px",marginBottom:8,
                  fontSize:13,fontWeight:600,color:"#065f46" }}>
                {toast}
              </motion.div>
            )}
          </AnimatePresence>

          {/* filter tabs */}
          <div style={{ display:"flex",gap:4,borderBottom:"1px solid #f1f5f9",
            marginBottom:0 }}>
            {[
              {id:"all",     label:"Toutes"},
              {id:"non_lues",label:`Non lues (${unread})`},
              {id:"actions", label:"À traiter"},
            ].map(f=>(
              <button key={f.id} onClick={()=>setFilter(f.id)}
                style={{ flex:1,padding:"8px 4px",border:"none",cursor:"pointer",
                  background:"transparent",fontFamily:"inherit",
                  fontSize:12,fontWeight:filter===f.id?700:500,
                  color:filter===f.id?svc.color:"#64748b",
                  borderBottom:filter===f.id?`2px solid ${svc.color}`:"2px solid transparent",
                  marginBottom:-1,transition:"all .15s" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* list */}
        <div style={{ flex:1,overflowY:"auto" }}>
          {filtered.length===0?(
            <div style={{ textAlign:"center",padding:"36px 20px",color:"#94a3b8" }}>
              <div style={{ fontSize:36,marginBottom:10 }}>📭</div>
              <div style={{ fontSize:14,fontWeight:600 }}>Aucune notification</div>
            </div>
          ):filtered.map((n,i)=>{
            const typeCfg = NOTIF_TYPE_CFG[n.type]||{bg:"#f8fafc",border:"#e2e8f0"};
            return (
              <motion.div key={n.id}
                initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                transition={{delay:i*0.04}}
                style={{ borderBottom:"1px solid #f8fafc",
                  background:n.lu?"white":"#fffcf5",
                  padding:"12px 16px" }}>
                <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                  {/* icon */}
                  <div style={{ width:36,height:36,borderRadius:10,
                    background:typeCfg.bg,border:`1px solid ${typeCfg.border}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:17,flexShrink:0 }}>{n.icon}</div>

                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",
                      alignItems:"flex-start",gap:6,marginBottom:3 }}>
                      <div style={{ fontSize:13,fontWeight:n.lu?600:700,
                        color:"#0f172a",lineHeight:1.3 }}>{n.titre}</div>
                      {!n.lu&&<div style={{ width:7,height:7,borderRadius:"50%",
                        background:n.priorite==="haute"?"#ef4444":"#f59e0b",
                        flexShrink:0,marginTop:4 }}/>}
                    </div>
                    <div style={{ fontSize:12,color:"#64748b",
                      lineHeight:1.4,marginBottom:6 }}>{n.corps}</div>
                    <div style={{ display:"flex",justifyContent:"space-between",
                      alignItems:"center" }}>
                      <span style={{ fontSize:11,color:"#94a3b8" }}>{n.date}</span>
                      {n.action&&(
                        <motion.button
                          onClick={()=>handleAction(n)}
                          whileHover={{scale:1.04}} whileTap={{scale:0.96}}
                          style={{ display:"flex",alignItems:"center",gap:5,
                            padding:"5px 12px",borderRadius:8,border:"none",
                            background:svc.grad,color:"white",
                            fontSize:11.5,fontWeight:700,cursor:"pointer",
                            fontFamily:"inherit",
                            boxShadow:`0 2px 8px ${svc.color}40` }}>
                          {n.action.label} →
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* footer */}
        <div style={{ padding:"10px 16px",borderTop:"1px solid #f1f5f9",
          flexShrink:0,display:"flex",justifyContent:"space-between",
          alignItems:"center" }}>
          <span style={{ fontSize:12,color:"#94a3b8" }}>
            {notifs.filter(n=>n.action&&!n.lu).length} action(s) en attente
          </span>
          <button
            onClick={markAllRead}
            style={{ fontSize:12,color:svc.color,fontWeight:600,
              background:"none",border:"none",cursor:"pointer" }}>
            Tout marquer lu
          </button>
        </div>
      </motion.div>
    </>
  );
}

/* ---
   TAB 1 — SCOLARITÉ (Attestations)
--- */
function ScolariteTab() {
  const [attests, setAttests] = useState(INIT_ATTEST);
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [modal, setModal]     = useState(null); // { type, item }
  const svc = SERVICES.attest;

  useEffect(() => {
    attestAPI.getAll()
      .then(d => {
        const list = d?.data || d;
        if (Array.isArray(list) && list.length > 0) {
          setAttests(list.map(a => ({
            ...a,
            etudiant: a.nom_beneficiaire || a.etudiant || "—",
            cne: a.cin_beneficiaire || a.cne || "—",
          })));
        }
      })
      .catch(() => {});
  }, []);

  const filtered = attests.filter(a =>
    (a.etudiant.toLowerCase().includes(search.toLowerCase()) || a.cne.includes(search))
    && (filter==="all" || a.statut===filter)
  );

  const [toast, setToast] = useState(null);
  const notify = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const valider = id => {
    setAttests(p=>p.map(a=>a.id===id?{...a,statut:"validee"}:a));
    attestAPI.valider(id).catch(()=>{});
    notify("✅ Demande validée");
  };
  const refuser = id => {
    setAttests(p=>p.map(a=>a.id===id?{...a,statut:"refusee"}:a));
    attestAPI.refuser(id).catch(()=>{});
    notify("❌ Demande refusée","err");
  };

  const generer = id => {
    const attest = attests.find(a => a.id === id);
    if (!attest) return;
    const ref = "ATT-UMI-" + Math.random().toString(36).slice(2,9).toUpperCase() + "-2025";
    const today = new Date().toLocaleDateString("fr-FR", {year:"numeric",month:"long",day:"numeric"});
    const W = 595, H = 841, mL = 60, lineH = 14;

    const esc = str => (str||"")
      .replace(/\\/g,"\\\\")
      .replace(/\(/g,"\\(")
      .replace(/\)/g,"\\)")
      .replace(/[^\x20-\x7E]/g, c => ({"é":"e","è":"e","ê":"e","à":"a","â":"a","ù":"u","û":"u","î":"i","ç":"c","É":"E","è":"e"}[c]||"?"));

    const bodyLines = [
      "UNIVERSITE MOULAY ISMAIL - MEKNES",
      "================================================",
      "ATTESTATION - " + (attest.type||"").toUpperCase(),
      "================================================",
      "",
      "Reference : " + ref,
      "",
      "Nous soussignes, l'administration de l'Universite",
      "Moulay Ismail, attestons par la presente que :",
      "",
      "Etudiant : " + (attest.etudiant||""),
      "CNE      : " + (attest.cne||""),
      "",
      "Motif    : " + (attest.motif||""),
      "",
      "Cette attestation est delivree pour servir",
      "et valoir ce que de droit.",
      "",
      "Emise le : " + today,
      "",
      "================================================",
      "Verifiable sur : portail.umi.ac.ma/verif/" + ref,
    ];

    // Build PDF stream using explicit \n
    const NL = "\n";
    let s = "q 0.12 0.23 0.54 rg 0 " + (H-70) + " " + W + " 70 re f Q" + NL;
    s += "BT /F2 14 Tf 1 1 1 rg " + mL + " " + (H-42) + " Td (UNIVERSITE MOULAY ISMAIL) Tj ET" + NL;
    s += "BT /F1 8 Tf 0.7 0.7 0.7 rg " + (W-160) + " " + (H-40) + " Td (" + esc(ref) + ") Tj ET" + NL;
    s += "BT /F1 10 Tf 0 0 0 rg " + mL + " " + (H-100) + " Td " + lineH + " TL" + NL;
    bodyLines.forEach(l => {
      s += "(" + esc(l) + ") '" + NL;
    });
    s += "ET" + NL;
    s += "q 0.12 0.23 0.54 rg 0 24 " + W + " 5 re f Q" + NL;
    s += "BT /F1 8 Tf 1 1 1 rg " + mL + " 28 Td (Universite Moulay Ismail - Document officiel) Tj ET" + NL;

    // Assemble PDF objects
    const objs = [];
    const push = x => { objs.push(x); return objs.length; };
    push(""); push("");
    push("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>");
    push("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding>>");
    const cId = push("<</Length " + s.length + ">>" + NL + "stream" + NL + s + NL + "endstream");
    const pId = push("<</Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Contents " + cId + " 0 R /Resources <</Font <</F1 3 0 R /F2 4 0 R>>>>>>");
    objs[0] = "<</Type /Catalog /Pages 2 0 R>>";
    objs[1] = "<</Type /Pages /Kids [" + pId + " 0 R] /Count 1>>";

    let out = "%PDF-1.4" + NL;
    const offs = [];
    objs.forEach((o, i) => {
      offs.push(out.length);
      out += (i+1) + " 0 obj" + NL + o + NL + "endobj" + NL;
    });
    const xo = out.length;
    out += "xref" + NL + "0 " + (objs.length+1) + NL + "0000000000 65535 f " + NL;
    offs.forEach(o => { out += String(o).padStart(10,"0") + " 00000 n " + NL; });
    out += "trailer" + NL + "<</Size " + (objs.length+1) + " /Root 1 0 R>>" + NL + "startxref" + NL + xo + NL + "%%EOF";

    const bytes = new Uint8Array(out.length);
    for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
    const blob = new Blob([bytes], { type:"application/pdf" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url; a.download = ref + ".pdf"; a.click();
    URL.revokeObjectURL(url);
    setAttests(p => p.map(x => x.id===id ? {...x, statut:"generee", reference:ref} : x));
    notify("Attestation generee : " + ref);
  };

  const stats = {
    total:       attests.length,
    en_attente:  attests.filter(a=>a.statut==="en_attente").length,
    validee:     attests.filter(a=>a.statut==="validee").length,
    generee:     attests.filter(a=>a.statut==="generee").length,
  };

  return (
    <div style={{ position:"relative" }}>
      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed",bottom:24,right:24,zIndex:9999,
          background:toast.type==="err"?"#fef2f2":"#ecfdf5",
          border:`1px solid ${toast.type==="err"?"#fecaca":"#a7f3d0"}`,
          borderRadius:12,padding:"12px 18px",
          fontSize:13.5,fontWeight:600,
          color:toast.type==="err"?"#dc2626":"#065f46",
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)" }}>
          {toast.msg}
        </div>
      )}
      {/* stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22 }}>
        {[
          { label:"Total demandes",   value:stats.total,      color:svc.color,  Icon:FileText },
          { label:"En attente",       value:stats.en_attente, color:"#f59e0b",  Icon:Clock },
          { label:"Validées",         value:stats.validee,    color:"#3b82f6",  Icon:CheckCircle },
          { label:"Générées (PDF)",   value:stats.generee,    color:"#10b981",  Icon:Download },
        ].map(s=>(
          <motion.div key={s.label} whileHover={{y:-3}}
            style={{ background:"white",borderRadius:16,padding:"18px 20px",
              border:`1px solid ${s.color}20`,
              boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
              display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:42,height:42,borderRadius:12,
              background:s.color+"18",
              display:"flex",alignItems:"center",justifyContent:"center",
              flexShrink:0 }}>
              <s.Icon size={20} color={s.color} strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize:26,fontWeight:800,color:"#0f172a",lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* toolbar */}
      <div style={{ display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",
          background:"white",border:"1.5px solid #e2e8f0",
          borderRadius:10,padding:"0 12px",gap:8,flex:1,minWidth:200 }}>
          <Search size={14} color="#94a3b8"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Nom étudiant, CNE…"
            style={{ border:"none",outline:"none",background:"transparent",
              fontSize:13.5,color:"#0f172a",padding:"9px 0",fontFamily:"inherit",width:"100%" }}/>
        </div>
        {["all","en_attente","validee","generee","refusee"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)}
            style={{ padding:"8px 14px",borderRadius:20,border:"none",
              background:filter===f?svc.color:"white",
              color:filter===f?"white":"#64748b",
              fontSize:12.5,fontWeight:filter===f?700:500,
              cursor:"pointer",fontFamily:"inherit",
              boxShadow:filter===f?`0 2px 8px ${svc.color}40`:"0 1px 3px rgba(0,0,0,0.06)" }}>
            {f==="all"?"Toutes"
              :f==="en_attente"?"En attente"
              :f==="validee"?"Validées"
              :f==="generee"?"Générées":"Refusées"}
          </button>
        ))}
        <button onClick={()=>setModal({type:"new"})}
          style={{ display:"flex",alignItems:"center",gap:6,
            padding:"9px 16px",borderRadius:10,border:"none",
            background:svc.grad,color:"white",fontSize:13,fontWeight:700,
            cursor:"pointer",fontFamily:"inherit",
            boxShadow:`0 2px 10px ${svc.color}40` }}>
          <Plus size={14}/> Nouvelle demande
        </button>
      </div>

      {/* table */}
      <div style={{ background:"white",borderRadius:16,border:"1px solid #e2e8f0",
        overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
        <table style={{ width:"100%",borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:"#f8fafc" }}>
              {["Étudiant","CNE","Type","Motif","Date","Statut","Actions"].map(h=>(
                <th key={h} style={{ padding:"11px 15px",textAlign:"left",
                  fontSize:11.5,fontWeight:700,color:"#64748b",
                  borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a,i)=>{
              const sc = attestStatut[a.statut];
              return (
                <motion.tr key={a.id}
                  initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                  transition={{delay:i*0.04}}
                  style={{ borderBottom:i<filtered.length-1?"1px solid #f1f5f9":"none" }}>
                  <td style={{ padding:"12px 15px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                      <div style={{ width:32,height:32,borderRadius:9,
                        background:svc.grad,color:"white",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:12,fontWeight:800,flexShrink:0 }}>
                        {a.etudiant.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <span style={{ fontSize:13.5,fontWeight:700,color:"#0f172a" }}>{a.etudiant}</span>
                    </div>
                  </td>
                  <td style={{ padding:"12px 15px",fontSize:12,color:"#64748b",fontFamily:"monospace" }}>{a.cne}</td>
                  <td style={{ padding:"12px 15px" }}>
                    <span style={{ background:svc.light,color:svc.dark,
                      fontSize:12,fontWeight:700,borderRadius:8,
                      padding:"3px 9px",border:`1px solid ${svc.border}` }}>{a.type}</span>
                  </td>
                  <td style={{ padding:"12px 15px",fontSize:12.5,color:"#64748b" }}>{a.motif}</td>
                  <td style={{ padding:"12px 15px",fontSize:12,color:"#94a3b8" }}>{a.date}</td>
                  <td style={{ padding:"12px 15px" }}>
                    <Tag color={sc.color} bg={sc.bg} label={sc.label} icon={sc.Icon}/>
                  </td>
                  <td style={{ padding:"12px 15px" }}>
                    <div style={{ display:"flex",gap:5 }}>
                      {a.statut==="en_attente" && <>
                        <ActionBtn icon={Check} color="#10b981" title="Valider" onClick={()=>valider(a.id)}/>
                        <ActionBtn icon={X} color="#ef4444" title="Refuser" onClick={()=>refuser(a.id)}/>
                      </>}
                      {a.statut==="validee" && (
                        <ActionBtn icon={FileText} color="#3b82f6" title="Générer PDF" onClick={()=>generer(a.id)}/>
                      )}
                      {a.statut==="generee" && (
                        <ActionBtn icon={Download} color="#10b981" title="Télécharger" onClick={()=>{
                          const b=new Blob([`ATTESTATION\nÉtudiant: ${a.etudiant}\nType: ${a.type}\nDate: ${a.date}`],{type:"text/plain"});
                          const el=document.createElement("a");el.href=URL.createObjectURL(b);
                          el.download=`attestation_${a.etudiant.replace(/ /g,"_")}.txt`;el.click();
                        }}/>
                      )}
                      <ActionBtn icon={Eye} color="#64748b" title="Voir détails" onClick={()=>setModal({type:"view",item:a})}/>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div style={{ textAlign:"center",padding:"40px",color:"#94a3b8" }}>
            <FileText size={32} style={{ margin:"0 auto 10px",opacity:0.3 }}/>
            <div style={{ fontSize:14,fontWeight:600 }}>Aucune demande trouvée</div>
          </div>
        )}
      </div>

      {/* modals */}
      <AnimatePresence>
        {modal?.type==="view" && (
          <Modal onClose={()=>setModal(null)} title="Détails de la demande"
            subtitle={modal.item.etudiant} color={svc.color}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:14 }}>
              {[
                ["Étudiant",modal.item.etudiant],["CNE",modal.item.cne],
                ["Type",modal.item.type],["Motif",modal.item.motif],
                ["Date",modal.item.date],["Statut",modal.item.statut],
              ].map(([k,v])=>(
                <div key={k} style={{ background:"#f8fafc",borderRadius:10,padding:"12px 14px" }}>
                  <div style={{ fontSize:11,color:"#94a3b8",fontWeight:700,marginBottom:4 }}>{k.toUpperCase()}</div>
                  <div style={{ fontSize:14,fontWeight:700,color:"#0f172a" }}>{v}</div>
                </div>
              ))}
            </div>
          </Modal>
        )}
        {modal?.type==="new" && (
          <Modal onClose={()=>setModal(null)} title="Nouvelle demande d'attestation"
            subtitle="Saisie manuelle" color={svc.color}>
            <NewAttestForm svc={svc}
              onSubmit={data=>{
                setAttests(p=>[{...data,id:Date.now(),statut:"en_attente"},...p]);
                setModal(null);
              }}/>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function NewAttestForm({ svc, onSubmit }) {
  const [f,setF]=useState({etudiant:"",cne:"",type:"Scolarité",motif:"",date:new Date().toISOString().slice(0,10)});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Nom étudiant *</label>
          <input value={f.etudiant} onChange={e=>s("etudiant",e.target.value)} placeholder="Prénom Nom" style={IS}/></div>
        <div><label style={LS}>CNE *</label>
          <input value={f.cne} onChange={e=>s("cne",e.target.value)} placeholder="R130012345" style={IS}/></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Type d'attestation *</label>
          <select value={f.type} onChange={e=>s("type",e.target.value)} style={IS}>
            {["Scolarité","Réussite","Relevé notes"].map(t=><option key={t}>{t}</option>)}
          </select></div>
        <div><label style={LS}>Date</label>
          <input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={IS}/></div>
      </div>
      <div><label style={LS}>Motif</label>
        <input value={f.motif} onChange={e=>s("motif",e.target.value)} placeholder="Emploi, Stage, Concours…" style={IS}/></div>
      <button onClick={()=>f.etudiant&&f.cne&&onSubmit(f)}
        disabled={!f.etudiant||!f.cne}
        style={{ padding:"13px",borderRadius:12,border:"none",
          background:f.etudiant&&f.cne?svc.grad:"#e2e8f0",
          color:f.etudiant&&f.cne?"white":"#94a3b8",
          fontSize:14,fontWeight:700,cursor:f.etudiant&&f.cne?"pointer":"not-allowed",
          fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
        <Plus size={16}/> Enregistrer la demande
      </button>
    </div>
  );
}

/* ---
   TAB 2 — BIBLIOTHÈQUE
--- */
function BiblioTab() {
  const [livres, setLivres]     = useState(INIT_LIVRES);
  const [emprunts, setEmprunts] = useState(INIT_EMPRUNTS);
  const [subTab, setSubTab]     = useState("catalogue");
  const [search, setSearch]     = useState("");
  const [modal, setModal]       = useState(null);
  const svc = SERVICES.bib;

  const [toast, setToast] = useState(null);
  const notify = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const retourner = id => {
    setEmprunts(p=>p.map(e=>e.id===id?{...e,statut:"retourne",dateRetourEffective:new Date().toLocaleDateString("fr-FR")}:e));
    empruntAPI.retourner(id).catch(()=>{});
    notify("✅ Retour enregistré");
  };
  const renouveler = id => {
    setEmprunts(p=>p.map(e=>{
      if(e.id!==id) return e;
      if(e.renouvellements>=2) { notify("⚠️ Maximum 2 renouvellements atteint","err"); return e; }
      empruntAPI.renouveler(id).catch(()=>{});
      const newDate = new Date(Date.now()+14*24*3600*1000).toLocaleDateString("fr-FR");
      return {...e,dateRetour:newDate,renouvellements:(e.renouvellements||0)+1,statut:"en_cours"};
    }));
    notify("🔄 Emprunt renouvelé — +14 jours");
  };
  const envoyerRappel = (emprunt) => {
    notify(`📧 Rappel envoyé à ${emprunt.emprunteur}`);
  };
  const supprimerLivre = id => {
    setLivres(p=>p.filter(x=>x.id!==id));
    notify("🗑️ Livre retiré du catalogue","err");
  };
  const archiverLivre = id => {
    setLivres(p=>p.map(l=>l.id===id?{...l,archive:true}:l));
    notify("📦 Livre archivé");
  };

  const filteredLivres = livres.filter(l=>
    l.titre.toLowerCase().includes(search.toLowerCase())||
    l.auteur.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    livres:    livres.length,
    dispo:     livres.reduce((a,l)=>a+l.dispo,0),
    empruntes: emprunts.filter(e=>e.statut==="en_cours"||e.statut==="en_retard").length,
    retards:   emprunts.filter(e=>e.statut==="en_retard").length,
  };

  return (
    <div>
      {/* stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22 }}>
        {[
          { label:"Total livres",   value:stats.livres,    color:svc.color, Icon:BookOpen },
          { label:"Disponibles",    value:stats.dispo,     color:"#10b981", Icon:CheckCircle },
          { label:"En cours",       value:stats.empruntes, color:"#3b82f6", Icon:Clock },
          { label:"En retard",      value:stats.retards,   color:"#ef4444", Icon:AlertCircle },
        ].map(s=>(
          <motion.div key={s.label} whileHover={{y:-3}}
            style={{ background:"white",borderRadius:16,padding:"18px 20px",
              border:`1px solid ${s.color}20`,
              boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
              display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:s.color+"18",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <s.Icon size={20} color={s.color} strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize:26,fontWeight:800,color:"#0f172a",lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* sub-tabs */}
      <div style={{ display:"flex",gap:6,marginBottom:16 }}>
        {[{id:"catalogue",label:"Catalogue",Icon:BookOpen},{id:"emprunts",label:"Emprunts",Icon:ClipboardList}].map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",
              borderRadius:10,border:"none",
              background:subTab===t.id?svc.grad:"white",
              color:subTab===t.id?"white":"#64748b",
              fontSize:13,fontWeight:subTab===t.id?700:500,
              cursor:"pointer",fontFamily:"inherit",
              border:subTab===t.id?"none":"1.5px solid #e2e8f0",
              boxShadow:subTab===t.id?`0 2px 10px ${svc.color}40`:"none" }}>
            <t.Icon size={14}/>{t.label}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        <div style={{ display:"flex",alignItems:"center",background:"white",
          border:"1.5px solid #e2e8f0",borderRadius:10,padding:"0 12px",gap:8,width:240 }}>
          <Search size={14} color="#94a3b8"/>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Titre, auteur…"
            style={{ border:"none",outline:"none",background:"transparent",
              fontSize:13,color:"#0f172a",padding:"8px 0",fontFamily:"inherit",width:"100%" }}/>
        </div>
        <button onClick={()=>setModal({type:subTab==="catalogue"?"addLivre":"addEmprunt"})}
          style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",
            borderRadius:10,border:"none",background:svc.grad,color:"white",
            fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
            boxShadow:`0 2px 10px ${svc.color}40` }}>
          <Plus size={14}/>{subTab==="catalogue"?"Ajouter livre":"Nouvel emprunt"}
        </button>
      </div>

      {/* CATALOGUE */}
      {subTab==="catalogue" && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
          {filteredLivres.map((l,i)=>(
            <motion.div key={l.id}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.06}}
              whileHover={{y:-4,boxShadow:`0 12px 32px ${svc.color}18`}}
              style={{ background:"white",borderRadius:16,border:"1px solid #e2e8f0",
                overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ height:5,background:l.dispo>0?svc.grad:"linear-gradient(135deg,#94a3b8,#64748b)" }}/>
              <div style={{ padding:"18px 20px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8 }}>
                  <div style={{ width:44,height:44,borderRadius:12,
                    background:l.dispo>0?svc.light:"#f1f5f9",
                    display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <BookCopy size={22} color={l.dispo>0?svc.color:"#94a3b8"}/>
                  </div>
                  <span style={{ fontSize:11.5,fontWeight:700,borderRadius:20,padding:"3px 10px",
                    background:l.dispo>0?"#ecfdf5":"#fef2f2",
                    color:l.dispo>0?"#10b981":"#ef4444" }}>
                    {l.dispo}/{l.total} dispo
                  </span>
                </div>
                <div style={{ fontSize:14.5,fontWeight:800,color:"#0f172a",marginBottom:4,lineHeight:1.3 }}>
                  {l.titre}
                </div>
                <div style={{ fontSize:12.5,color:"#64748b",marginBottom:10 }}>{l.auteur} · {l.annee}</div>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                  <span style={{ fontSize:11.5,fontWeight:700,background:svc.light,
                    color:svc.dark,borderRadius:8,padding:"2px 9px",
                    border:`1px solid ${svc.border}` }}>{l.cat}</span>
                  <div style={{ display:"flex",gap:5 }}>
                    <ActionBtn icon={PenLine} color={svc.color} title="Modifier"
                      onClick={()=>setModal({type:"editLivre",item:l})}/>
                    <ActionBtn icon={Trash2} color="#ef4444" title="Supprimer"
                      onClick={()=>supprimerLivre(l.id)}/>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EMPRUNTS */}
      {subTab==="emprunts" && (
        <div style={{ background:"white",borderRadius:16,border:"1px solid #e2e8f0",
          overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
          <table style={{ width:"100%",borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Étudiant","Livre","Emprunt","Retour prévu","Retard","Statut","Actions"].map(h=>(
                  <th key={h} style={{ padding:"11px 14px",textAlign:"left",
                    fontSize:11.5,fontWeight:700,color:"#64748b",
                    borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {emprunts.map((e,i)=>{
                const sc = empruntStatut[e.statut];
                return (
                  <motion.tr key={e.id}
                    initial={{opacity:0}} animate={{opacity:1}}
                    transition={{delay:i*0.05}}
                    style={{ borderBottom:i<emprunts.length-1?"1px solid #f1f5f9":"none" }}>
                    <td style={{ padding:"12px 14px",fontSize:13.5,fontWeight:700,color:"#0f172a" }}>{e.etudiant}</td>
                    <td style={{ padding:"12px 14px",fontSize:12.5,color:"#64748b",maxWidth:200 }}>
                      <div style={{ overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{e.livre}</div>
                    </td>
                    <td style={{ padding:"12px 14px",fontSize:12,color:"#94a3b8" }}>{e.dateEmprunt}</td>
                    <td style={{ padding:"12px 14px",fontSize:12,color:"#94a3b8" }}>{e.dateRetour}</td>
                    <td style={{ padding:"12px 14px" }}>
                      {e.retard>0
                        ? <span style={{ color:"#ef4444",fontWeight:700,fontSize:12 }}>+{e.retard}j</span>
                        : <span style={{ color:"#10b981",fontSize:12 }}>—</span>}
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <Tag color={sc.color} bg={sc.bg} label={sc.label}/>
                    </td>
                    <td style={{ padding:"12px 14px" }}>
                      <div style={{ display:"flex",gap:5 }}>
                        {e.statut!=="retourne" && (<>
                          <ActionBtn icon={Check} color="#10b981" title="Marquer retourné"
                            onClick={()=>retourner(e.id)}/>
                          <ActionBtn icon={RefreshCw} color="#3b82f6" title="Renouveler +14j"
                            onClick={()=>renouveler(e.id)}/>
                          <ActionBtn icon={Send} color="#f59e0b" title="Envoyer rappel"
                            onClick={()=>envoyerRappel(e)}/>
                        </>)}
                        {e.retard>0 && (
                          <ActionBtn icon={Send} color="#ef4444" title="Rappel retard"
                            onClick={()=>envoyerRappel(e)}/>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {modal?.type==="addLivre" && (
          <Modal onClose={()=>setModal(null)} title="Ajouter un livre"
            subtitle="Catalogue bibliothèque" color={svc.color}>
            <AddLivreForm svc={svc} onSubmit={data=>{
              setLivres(p=>[{...data,id:Date.now(),dispo:data.total,archive:false},...p]);
              notify("✅ Livre ajouté au catalogue");
              setModal(null);
            }}/>
          </Modal>
        )}
        {modal?.type==="editLivre" && (
          <Modal onClose={()=>setModal(null)} title="Modifier le livre"
            subtitle={modal.item.titre} color={svc.color}>
            <AddLivreForm svc={svc} initial={modal.item} onSubmit={data=>{
              setLivres(p=>p.map(l=>l.id===modal.item.id?{...l,...data}:l));
              notify("✅ Livre mis à jour");
              setModal(null);
            }}/>
          </Modal>
        )}
        {modal?.type==="addEmprunt" && (
          <Modal onClose={()=>setModal(null)} title="Nouvel emprunt"
            subtitle="Enregistrement d'emprunt" color={svc.color}>
            <AddEmpruntForm svc={svc} livres={livres} onSubmit={data=>{
              setEmprunts(p=>[{...data, id:Date.now(), statut:"en_cours", retard:0, renouvellements:0},...p]);
              setLivres(p=>p.map(l=>l.id===data.livreId?{...l,dispo:Math.max(0,l.dispo-1)}:l));
              notify("✅ Emprunt enregistré");
              setModal(null);
            }}/>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddLivreForm({ svc, onSubmit, initial }) {
  const [f,setF]=useState(initial || {titre:"",auteur:"",isbn:"",cat:"Informatique",total:1,dispo:1,annee:2024});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <div><label style={LS}>Titre *</label>
        <input value={f.titre} onChange={e=>s("titre",e.target.value)} placeholder="Titre du livre" style={IS}/></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Auteur *</label>
          <input value={f.auteur} onChange={e=>s("auteur",e.target.value)} placeholder="Nom auteur" style={IS}/></div>
        <div><label style={LS}>ISBN</label>
          <input value={f.isbn} onChange={e=>s("isbn",e.target.value)} placeholder="978-..." style={IS}/></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12 }}>
        <div><label style={LS}>Catégorie</label>
          <select value={f.cat} onChange={e=>s("cat",e.target.value)} style={IS}>
            {["Informatique","IA","Génie Civil","Management","Autres"].map(c=><option key={c}>{c}</option>)}
          </select></div>
        <div><label style={LS}>Exemplaires</label>
          <input type="number" value={f.total} onChange={e=>s("total",+e.target.value)} min={1} style={IS}/></div>
        <div><label style={LS}>Année</label>
          <input type="number" value={f.annee} onChange={e=>s("annee",+e.target.value)} style={IS}/></div>
      </div>
      <button onClick={()=>f.titre&&f.auteur&&onSubmit({...f,dispo:f.total})}
        style={{ padding:"13px",borderRadius:12,border:"none",
          background:f.titre&&f.auteur?svc.grad:"#e2e8f0",
          color:f.titre&&f.auteur?"white":"#94a3b8",
          fontSize:14,fontWeight:700,cursor:f.titre&&f.auteur?"pointer":"not-allowed",fontFamily:"inherit",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
        <Plus size={16}/> Ajouter au catalogue
      </button>
    </div>
  );
}

/* ---
   FORM — NOUVEL EMPRUNT
--- */
function AddEmpruntForm({ svc, livres, onSubmit }) {
  const today = new Date().toISOString().split("T")[0];
  const retourDefault = new Date(Date.now()+14*24*3600*1000).toISOString().split("T")[0];
  const [f,setF] = useState({
    etudiant:"", cne:"", livreId:"", livre:"",
    dateEmprunt:today, dateRetour:retourDefault,
    emprunteurType:"etudiant",
  });
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const dispoLivres = livres.filter(l=>l.dispo>0&&!l.archive);
  const valid = f.etudiant && f.livreId;
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Étudiant / Emprunteur *</label>
          <input value={f.etudiant} onChange={e=>s("etudiant",e.target.value)}
            placeholder="Nom complet" style={IS}/></div>
        <div><label style={LS}>CNE</label>
          <input value={f.cne} onChange={e=>s("cne",e.target.value)}
            placeholder="R130045678" style={IS}/></div>
      </div>
      <div><label style={LS}>Livre *</label>
        <select value={f.livreId} onChange={e=>{
          const l=dispoLivres.find(x=>String(x.id)===e.target.value);
          s("livreId",e.target.value); s("livre",l?.titre||"");
        }} style={IS}>
          <option value="">-- Sélectionner un livre disponible --</option>
          {dispoLivres.map(l=>(
            <option key={l.id} value={l.id}>{l.titre} · {l.auteur} ({l.dispo} dispo)</option>
          ))}
        </select></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Date emprunt</label>
          <input type="date" value={f.dateEmprunt} onChange={e=>s("dateEmprunt",e.target.value)} style={IS}/></div>
        <div><label style={LS}>Retour prévu</label>
          <input type="date" value={f.dateRetour} onChange={e=>s("dateRetour",e.target.value)} style={IS}/></div>
      </div>
      <div><label style={LS}>Type emprunteur</label>
        <select value={f.emprunteurType} onChange={e=>s("emprunteurType",e.target.value)} style={IS}>
          <option value="etudiant">Étudiant</option>
          <option value="prof">Enseignant</option>
          <option value="staff">Personnel</option>
        </select></div>
      <button onClick={()=>valid&&onSubmit(f)} disabled={!valid}
        style={{ padding:"12px",borderRadius:11,border:"none",
          background:valid?svc.grad:"#e2e8f0",color:valid?"white":"#94a3b8",
          fontSize:14,fontWeight:700,cursor:valid?"pointer":"not-allowed",
          fontFamily:"inherit",boxShadow:valid?"0 4px 14px rgba(16,185,129,0.3)":"none" }}>
        + Enregistrer l'emprunt
      </button>
    </div>
  );
}

/* ---
   TAB 3 — EMPLOI DU TEMPS
--- */
function EdtTab() {
  const [seances, setSeances] = useState(INIT_EDT);
  const [events, setEvents]   = useState(EVENTS);
  const [subTab, setSubTab]   = useState("grille");
  const [modal, setModal]     = useState(null);
  const [viewGroupe, setViewGroupe] = useState("all");
  const svc = SERVICES.edt;

  const filteredSeances = viewGroupe==="all" ? seances
    : seances.filter(s=>s.groupe===viewGroupe);

  // Build grid: jour x slot
  const grid = {};
  JOURS.forEach(j=>{ grid[j]={}; SLOTS.forEach(sl=>{ grid[j][sl]=[]; }); });
  filteredSeances.forEach(s=>{ if(grid[s.jour]&&grid[s.jour][s.slot]) grid[s.jour][s.slot].push(s); });

  const [toast, setToast] = useState(null);
  const notify = (msg, type="ok") => { setToast({msg,type}); setTimeout(()=>setToast(null),3000); };

  const supprimer = id => {
    setSeances(p=>p.filter(s=>s.id!==id));
    notify("🗑️ Séance supprimée","err");
  };
  const publier = id => {
    setEvents(p=>p.map(e=>e.id===id?{...e,statut:"publie"}:e));
    notify("📢 Événement publié — inscriptions ouvertes");
  };
  const annulerEvent = id => {
    setEvents(p=>p.map(e=>e.id===id?{...e,statut:"annule"}:e));
    notify("❌ Événement annulé","err");
  };
  const confirmerResa = id => {
    setReservations(p=>p.map(r=>r.id===id?{...r,statut:"confirmee"}:r));
    notify("✅ Réservation confirmée");
  };
  const annulerResa = id => {
    setReservations(p=>p.map(r=>r.id===id?{...r,statut:"annulee"}:r));
    notify("❌ Réservation annulée","err");
  };

  return (
    <div>
      {/* stats */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22 }}>
        {[
          { label:"Séances/sem.",  value:seances.length,         color:svc.color, Icon:Calendar },
          { label:"Groupes",       value:GROUPES.length,          color:"#8b5cf6", Icon:Users },
          { label:"Salles",        value:SALLES.length,           color:"#10b981", Icon:Layers },
          { label:"Événements",    value:events.length,           color:"#f59e0b", Icon:Star },
        ].map(s=>(
          <motion.div key={s.label} whileHover={{y:-3}}
            style={{ background:"white",borderRadius:16,padding:"18px 20px",
              border:`1px solid ${s.color}20`,boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
              display:"flex",alignItems:"center",gap:14 }}>
            <div style={{ width:42,height:42,borderRadius:12,background:s.color+"18",
              display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
              <s.Icon size={20} color={s.color} strokeWidth={2}/>
            </div>
            <div>
              <div style={{ fontSize:26,fontWeight:800,color:"#0f172a",lineHeight:1 }}>{s.value}</div>
              <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* sub-tabs + actions */}
      <div style={{ display:"flex",gap:6,marginBottom:16,flexWrap:"wrap",alignItems:"center" }}>
        {[
          {id:"grille",  label:"Grille EDT",    Icon:CalendarDays},
          {id:"seances", label:"Liste séances",  Icon:ClipboardList},
          {id:"events",  label:"Événements",     Icon:Star},
        ].map(t=>(
          <button key={t.id} onClick={()=>setSubTab(t.id)}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 15px",
              borderRadius:10,border:"none",
              background:subTab===t.id?svc.grad:"white",
              color:subTab===t.id?"white":"#64748b",
              fontSize:13,fontWeight:subTab===t.id?700:500,cursor:"pointer",
              fontFamily:"inherit",
              border:subTab===t.id?"none":"1.5px solid #e2e8f0",
              boxShadow:subTab===t.id?`0 2px 10px ${svc.color}40`:"none" }}>
            <t.Icon size={14}/>{t.label}
          </button>
        ))}
        <div style={{ flex:1 }}/>
        {subTab==="grille" && (
          <select value={viewGroupe} onChange={e=>setViewGroupe(e.target.value)}
            style={{ padding:"9px 13px",borderRadius:10,border:"1.5px solid #e2e8f0",
              background:"white",fontSize:13,color:"#0f172a",fontFamily:"inherit",outline:"none" }}>
            <option value="all">Tous les groupes</option>
            {GROUPES.map(g=><option key={g}>{g}</option>)}
          </select>
        )}
        <button onClick={()=>setModal({type:subTab==="events"?"addEvent":"addSeance"})}
          style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 15px",
            borderRadius:10,border:"none",background:svc.grad,color:"white",
            fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
            boxShadow:`0 2px 10px ${svc.color}40` }}>
          <Plus size={14}/>{subTab==="events"?"Nouvel événement":"Ajouter séance"}
        </button>
      </div>

      {/* GRILLE */}
      {subTab==="grille" && (
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"separate",borderSpacing:6 }}>
            <thead>
              <tr>
                <th style={{ padding:"10px 14px",background:"#f8fafc",
                  borderRadius:10,fontSize:12,fontWeight:700,color:"#64748b",width:120 }}>Créneau</th>
                {JOURS.map(j=>(
                  <th key={j} style={{ padding:"10px 14px",background:svc.light,
                    borderRadius:10,fontSize:12.5,fontWeight:800,color:svc.dark,textAlign:"center" }}>{j}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SLOTS.map(sl=>(
                <tr key={sl}>
                  <td style={{ padding:"10px 14px",background:"#f8fafc",borderRadius:10,
                    fontSize:12,fontWeight:700,color:"#64748b",whiteSpace:"nowrap" }}>{sl}</td>
                  {JOURS.map(j=>{
                    const cells = grid[j][sl];
                    return (
                      <td key={j} style={{ padding:4,verticalAlign:"top" }}>
                        {cells.length===0
                          ? <div style={{ height:72,borderRadius:10,
                              border:"1.5px dashed #e2e8f0",
                              display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <span style={{ fontSize:18,color:"#e2e8f0" }}>+</span>
                            </div>
                          : cells.map(c=>(
                            <motion.div key={c.id} whileHover={{scale:1.02}}
                              style={{ background:c.couleur+"18",
                                border:`1.5px solid ${c.couleur}44`,
                                borderRadius:10,padding:"8px 10px",
                                marginBottom:4,cursor:"pointer",
                                borderLeft:`4px solid ${c.couleur}` }}>
                              <div style={{ fontSize:12,fontWeight:800,color:c.couleur,marginBottom:2 }}>
                                {c.matiere}
                              </div>
                              <div style={{ fontSize:11,color:"#64748b" }}>{c.prof}</div>
                              <div style={{ display:"flex",gap:5,marginTop:4 }}>
                                <span style={{ fontSize:10,fontWeight:700,
                                  background:typeColors[c.type]+"22",
                                  color:typeColors[c.type],borderRadius:6,padding:"1px 6px" }}>{c.type}</span>
                                <span style={{ fontSize:10,color:"#94a3b8" }}>{c.salle}</span>
                              </div>
                            </motion.div>
                          ))
                        }
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LISTE SÉANCES */}
      {subTab==="seances" && (
        <div style={{ background:"white",borderRadius:16,border:"1px solid #e2e8f0",
          overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
          <table style={{ width:"100%",borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#f8fafc" }}>
                {["Matière","Professeur","Groupe","Salle","Jour","Créneau","Type","Actions"].map(h=>(
                  <th key={h} style={{ padding:"11px 14px",textAlign:"left",
                    fontSize:11.5,fontWeight:700,color:"#64748b",
                    borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {seances.map((s,i)=>(
                <motion.tr key={s.id}
                  initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.04}}
                  style={{ borderBottom:i<seances.length-1?"1px solid #f1f5f9":"none" }}>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <div style={{ width:10,height:10,borderRadius:"50%",background:s.couleur,flexShrink:0 }}/>
                      <span style={{ fontSize:13.5,fontWeight:700,color:"#0f172a" }}>{s.matiere}</span>
                    </div>
                  </td>
                  <td style={{ padding:"11px 14px",fontSize:12.5,color:"#64748b" }}>{s.prof}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:svc.light,color:svc.dark,
                      fontSize:11.5,fontWeight:700,borderRadius:8,padding:"2px 8px",
                      border:`1px solid ${svc.border}` }}>{s.groupe}</span>
                  </td>
                  <td style={{ padding:"11px 14px",fontSize:12.5,color:"#64748b" }}>{s.salle}</td>
                  <td style={{ padding:"11px 14px",fontSize:12.5,color:"#64748b" }}>{s.jour}</td>
                  <td style={{ padding:"11px 14px",fontSize:12,color:"#94a3b8",whiteSpace:"nowrap" }}>{s.slot}</td>
                  <td style={{ padding:"11px 14px" }}>
                    <span style={{ background:typeColors[s.type]+"18",color:typeColors[s.type],
                      fontSize:11.5,fontWeight:700,borderRadius:8,padding:"3px 9px" }}>{s.type}</span>
                  </td>
                  <td style={{ padding:"11px 14px" }}>
                    <div style={{ display:"flex",gap:5 }}>
                      <ActionBtn icon={PenLine} color={svc.color} title="Modifier"
                        onClick={()=>setModal({type:"editSeance",item:s})}/>
                      <ActionBtn icon={Trash2} color="#ef4444" title="Supprimer"
                        onClick={()=>supprimer(s.id)}/>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ÉVÉNEMENTS */}
      {subTab==="events" && (
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
          {events.map((ev,i)=>(
            <motion.div key={ev.id}
              initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
              transition={{delay:i*0.07}}
              whileHover={{y:-4,boxShadow:`0 12px 32px ${svc.color}18`}}
              style={{ background:"white",borderRadius:16,border:"1px solid #e2e8f0",
                overflow:"hidden",boxShadow:"0 2px 8px rgba(0,0,0,0.05)" }}>
              <div style={{ height:5,background:ev.statut==="publie"?svc.grad:"linear-gradient(135deg,#94a3b8,#64748b)" }}/>
              <div style={{ padding:"18px 20px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10 }}>
                  <div style={{ fontSize:28 }}>
                    {ev.type==="academique"?"🎓":ev.type==="club"?"🎭":"🏛️"}
                  </div>
                  <span style={{ fontSize:11.5,fontWeight:700,borderRadius:20,padding:"3px 10px",
                    background:ev.statut==="publie"?svc.light:"#f1f5f9",
                    color:ev.statut==="publie"?svc.dark:"#64748b" }}>
                    {ev.statut==="publie"?"Publié":"Planifié"}
                  </span>
                </div>
                <div style={{ fontSize:14.5,fontWeight:800,color:"#0f172a",marginBottom:6,lineHeight:1.3 }}>
                  {ev.titre}
                </div>
                <div style={{ fontSize:12.5,color:"#64748b",marginBottom:10 }}>
                  📅 {ev.date} · 📍 {ev.lieu}
                </div>
                {ev.inscrits>0 && (
                  <div style={{ fontSize:12,color:svc.color,fontWeight:600,marginBottom:10 }}>
                    👥 {ev.inscrits} inscrits
                  </div>
                )}
                <div style={{ display:"flex",gap:7 }}>
                  {ev.statut==="planifie" && (
                    <button onClick={()=>publier(ev.id)}
                      style={{ flex:1,padding:"8px",borderRadius:9,border:"none",
                        background:svc.grad,color:"white",fontSize:12,fontWeight:700,
                        cursor:"pointer",fontFamily:"inherit",
                        display:"flex",alignItems:"center",justifyContent:"center",gap:5 }}>
                      <Send size={12}/> Publier
                    </button>
                  )}
                  <button onClick={()=>annulerEvent(ev.id)}
                    style={{ padding:"8px 12px",borderRadius:9,
                      border:"1.5px solid #fecaca",background:"#fef2f2",color:"#ef4444",
                      fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
                      display:"flex",alignItems:"center",gap:4 }}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal?.type==="addSeance" && (
          <Modal onClose={()=>setModal(null)} title="Ajouter une séance"
            subtitle="Emploi du temps" color={svc.color}>
            <AddSeanceForm svc={svc} onSubmit={data=>{
              const newS = {...data, id: Date.now()};
              setSeances(p=>[newS,...p]);
              seanceAPI.create({
                matiere: data.matiere,
                groupe: data.groupe,
                jour: data.jour,
                slot: data.slot,
                type: data.type,
                couleur: data.couleur,
                enseignant_id: data.enseignant_id || 1,
                salle_id: data.salle_id || 1,
              }).catch(()=>{});
              notify("✅ Séance ajoutée à l'emploi du temps");
              setModal(null);
            }}/>
          </Modal>
        )}
        {modal?.type==="editSeance" && (
          <Modal onClose={()=>setModal(null)} title="Modifier la séance"
            subtitle={modal.item.matiere} color={svc.color}>
            <AddSeanceForm svc={svc} initial={modal.item} onSubmit={data=>{
              setSeances(p=>p.map(s=>s.id===modal.item.id?{...s,...data}:s));
              notify("✅ Séance modifiée");
              setModal(null);
            }}/>
          </Modal>
        )}
        {modal?.type==="addEvent" && (
          <Modal onClose={()=>setModal(null)} title="Nouvel événement"
            subtitle="Planification" color={svc.color}>
            <AddEventForm svc={svc} onSubmit={data=>{
              setEvents(p=>[{...data,id:Date.now(),inscrits:0},...p]);
              notify("✅ Événement créé");
              setModal(null);
            }}/>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddSeanceForm({ svc, onSubmit, initial }) {
  const [f,setF]=useState(initial || {matiere:"",prof:PROFS[0],salle:SALLES[0],groupe:GROUPES[0],
    jour:JOURS[0],slot:SLOTS[0],type:"CM",couleur:"#3b82f6"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <div><label style={LS}>Matière *</label>
        <input value={f.matiere} onChange={e=>s("matiere",e.target.value)} placeholder="ex: Algorithmique" style={IS}/></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Professeur</label>
          <select value={f.prof} onChange={e=>s("prof",e.target.value)} style={IS}>
            {PROFS.map(p=><option key={p}>{p}</option>)}
          </select></div>
        <div><label style={LS}>Groupe</label>
          <select value={f.groupe} onChange={e=>s("groupe",e.target.value)} style={IS}>
            {GROUPES.map(g=><option key={g}>{g}</option>)}
          </select></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Salle</label>
          <select value={f.salle} onChange={e=>s("salle",e.target.value)} style={IS}>
            {SALLES.map(s=><option key={s}>{s}</option>)}
          </select></div>
        <div><label style={LS}>Type</label>
          <select value={f.type} onChange={e=>s("type",e.target.value)} style={IS}>
            {["CM","TD","TP"].map(t=><option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Jour</label>
          <select value={f.jour} onChange={e=>s("jour",e.target.value)} style={IS}>
            {JOURS.map(j=><option key={j}>{j}</option>)}
          </select></div>
        <div><label style={LS}>Créneau</label>
          <select value={f.slot} onChange={e=>s("slot",e.target.value)} style={IS}>
            {SLOTS.map(sl=><option key={sl}>{sl}</option>)}
          </select></div>
      </div>
      <div><label style={LS}>Couleur</label>
        <div style={{ display:"flex",gap:8 }}>
          {["#3b82f6","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899"].map(c=>(
            <div key={c} onClick={()=>s("couleur",c)}
              style={{ width:28,height:28,borderRadius:8,background:c,cursor:"pointer",
                border:f.couleur===c?"3px solid #0f172a":"2px solid transparent",
                boxSizing:"border-box",transition:"border .15s" }}/>
          ))}
        </div>
      </div>
      <button onClick={()=>f.matiere&&onSubmit(f)}
        style={{ padding:"13px",borderRadius:12,border:"none",
          background:f.matiere?svc.grad:"#e2e8f0",
          color:f.matiere?"white":"#94a3b8",
          fontSize:14,fontWeight:700,cursor:f.matiere?"pointer":"not-allowed",fontFamily:"inherit",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4 }}>
        <Plus size={16}/> Ajouter la séance
      </button>
    </div>
  );
}

function AddEventForm({ svc, onSubmit }) {
  const [f,setF]=useState({titre:"",date:"",lieu:"",type:"academique",statut:"planifie"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
      <div><label style={LS}>Titre *</label>
        <input value={f.titre} onChange={e=>s("titre",e.target.value)} placeholder="Titre de l'événement" style={IS}/></div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
        <div><label style={LS}>Date *</label>
          <input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={IS}/></div>
        <div><label style={LS}>Lieu</label>
          <input value={f.lieu} onChange={e=>s("lieu",e.target.value)} placeholder="Amphi A, Salle…" style={IS}/></div>
      </div>
      <div><label style={LS}>Type</label>
        <select value={f.type} onChange={e=>s("type",e.target.value)} style={IS}>
          {["academique","institutionnel","club"].map(t=><option key={t}>{t}</option>)}
        </select></div>
      <button onClick={()=>f.titre&&f.date&&onSubmit(f)}
        style={{ padding:"13px",borderRadius:12,border:"none",
          background:f.titre&&f.date?svc.grad:"#e2e8f0",
          color:f.titre&&f.date?"white":"#94a3b8",
          fontSize:14,fontWeight:700,cursor:f.titre&&f.date?"pointer":"not-allowed",fontFamily:"inherit",
          display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
        <Plus size={16}/> Créer l'événement
      </button>
    </div>
  );
}

/* ---
   MAIN DASHBOARD
--- */
// Map db_role / admin_type → service key
function getAdminService() {
  try {
    const u = JSON.parse(localStorage.getItem("umi_user")) || {};
    // admin_type priority (set at login)
    if (u.admin_type === "attest") return "attest";
    if (u.admin_type === "bib")    return "bib";
    if (u.admin_type === "edt")    return "edt";
    // fallback from db_role
    if (u.db_role === "ADMIN_ATTEST") return "attest";
    if (u.db_role === "ADMIN_BIB")    return "bib";
    if (u.db_role === "ADMIN_EDT")    return "edt";
    return null; // SUPER_ADMIN or unknown → null means all tabs visible
  } catch { return null; }
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Déterminer le service autorisé de cet admin
  const adminService = getAdminService(); // "attest" | "bib" | "edt" | null
  const allowedServices = adminService
    ? { [adminService]: SERVICES[adminService] }
    : SERVICES; // null → super admin, voit tout

  const [activeService, setActiveService] = useState(adminService || "attest");
  const [notifOpen, setNotifOpen]   = useState(false);
  const [adminNotifs, setAdminNotifs] = useState(ADMIN_NOTIFS);
  const [signModal, setSignModal]     = useState(null);

  // Nom affiché de l'admin connecté
  const adminUser = (() => {
    try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; }
  })();
  const adminNom = adminUser.prenom && adminUser.nom
    ? `${adminUser.prenom} ${adminUser.nom}` : "Administrateur";

  // Sécurité : si l'admin tente d'accéder à un service non autorisé via URL, bloquer
  // (en SPA c'est suffisant — le vrai contrôle est côté API Laravel)
  const isAuthorized = !adminService || activeService === adminService;

  const handleSigned = async (notif, signatureDataUrl) => {
    // Signer l'attestation dans le store partagé
    if (notif.attestId) {
      await attestStore.sign(notif.attestId, signatureDataUrl, adminUser);
    }
    setAdminNotifs(p=>p.map(n=>n.id===notif.id?{...n,lu:true,action:null}:n));
    setSignModal(null);
    setNotifOpen(false);
  };
  const svc = SERVICES[activeService] || SERVICES.attest;

  return (
    <div style={{ minHeight:"100vh", background:"#f8faff",
      fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* --- NAVBAR --- */}
      <nav style={{ height:62, background:"rgba(255,255,255,0.92)",
        backdropFilter:"blur(18px)",
        borderBottom:"1px solid rgba(0,0,0,0.07)",
        display:"flex", alignItems:"center",
        justifyContent:"space-between",
        padding:"0 32px", position:"sticky", top:0, zIndex:100,
        boxShadow:"0 2px 20px rgba(0,0,0,0.06)" }}>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:36,height:36,borderRadius:10,
            background:svc.grad,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:18,boxShadow:`0 2px 10px ${svc.color}40`,
            transition:"background .4s" }}>
            {svc.emoji}
          </div>
          <div>
            <div style={{ fontSize:16,fontWeight:800,color:"#0f172a",lineHeight:1 }}>Umi-Flow</div>
            <div style={{ fontSize:10,color:svc.color,fontWeight:700,letterSpacing:"0.5px" }}>
              ADMIN · {svc.label.toUpperCase()}
            </div>
          </div>
          <div style={{ width:1,height:26,background:"#e2e8f0",margin:"0 6px" }}/>
          <span style={{ display:"inline-flex",alignItems:"center",gap:5,
            background:svc.light,border:`1px solid ${svc.border}`,
            borderRadius:20,padding:"4px 12px" }}>
            <span style={{ fontSize:11.5,color:svc.dark,fontWeight:700 }}>
              {adminNom}
            </span>
          </span>
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ position:"relative" }}>
            <button
              onClick={()=>setNotifOpen(o=>!o)}
              style={{ width:36,height:36,borderRadius:10,
                background:notifOpen?"#f5f3ff":"#f1f5f9",
                border:notifOpen?"1px solid #ddd6fe":"none",
                cursor:"pointer",display:"flex",alignItems:"center",
                justifyContent:"center",position:"relative",transition:"all .2s" }}>
              <Bell size={16} color={notifOpen?"#9333ea":"#64748b"}/>
              {adminNotifs.filter(n=>!n.lu).length>0&&(
                <span style={{ position:"absolute",top:6,right:6,
                  width:16,height:16,borderRadius:"50%",
                  background:"#ef4444",border:"2px solid white",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,fontWeight:700,color:"white" }}>
                  {adminNotifs.filter(n=>!n.lu).length}
                </span>
              )}
            </button>
            {notifOpen&&(
              <AdminNotifPanel
                notifs={adminNotifs}
                setNotifs={setAdminNotifs}
                onClose={()=>setNotifOpen(false)}
                svc={svc}
                onSignRequest={(n)=>{ setSignModal(n); setNotifOpen(false); }}/>
            )}
          </div>
          <button onClick={()=>navigate("/")}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",
              borderRadius:10,border:"none",background:svc.grad,color:"white",
              fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",
              boxShadow:`0 2px 10px ${svc.color}40` }}>
            <LogOut size={14}/> Déconnexion
          </button>
        </div>
      </nav>

      {/* --- SERVICE TABS (top colored strip) --- */}
      <div style={{ background:"white",borderBottom:"1px solid #e2e8f0",
        padding:"0 32px",
        boxShadow:"0 1px 8px rgba(0,0,0,0.04)" }}>
        <div style={{ display:"flex",gap:0,maxWidth:1280,margin:"0 auto" }}>
          {Object.entries(allowedServices).map(([key,s])=>{
            const Icon = s.icon;
            const active = activeService===key;
            return (
              <motion.button key={key} onClick={()=>setActiveService(key)}
                whileTap={{scale:0.97}}
                style={{ display:"flex",alignItems:"center",gap:8,
                  padding:"14px 22px",border:"none",cursor:"pointer",
                  background:"transparent",
                  color:active?s.color:"#64748b",
                  fontSize:13.5,fontWeight:active?800:500,
                  fontFamily:"inherit",
                  borderBottom:active?`3px solid ${s.color}`:"3px solid transparent",
                  transition:"all .2s",position:"relative" }}>
                <span style={{ fontSize:16 }}>{s.emoji}</span>
                {s.label}
                {active && (
                  <motion.div layoutId="serviceIndicator"
                    style={{ position:"absolute",bottom:0,left:0,right:0,height:3,
                      background:s.grad,borderRadius:"3px 3px 0 0" }}/>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 32px 60px" }}>

        {/* Page header */}
        <motion.div key={activeService}
          initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}
          transition={{duration:0.35}}
          style={{ marginBottom:24 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:7,
            background:svc.light,border:`1px solid ${svc.border}`,
            borderRadius:20,padding:"4px 14px",marginBottom:12 }}>
            <span style={{ fontSize:14 }}>{svc.emoji}</span>
            <span style={{ fontSize:12,color:svc.dark,fontWeight:700 }}>
              Tableau de bord — {svc.label}
            </span>
          </div>
          <h1 style={{ fontSize:24,fontWeight:800,color:"#0f172a",
            letterSpacing:"-0.4px",margin:"0 0 5px" }}>
            {activeService==="attest" ? "Gestion des Attestations"
              :activeService==="bib"  ? "Gestion de la Bibliothèque"
              : "Gestion de l'Emploi du Temps"}
          </h1>
          <p style={{ fontSize:14,color:"#64748b",margin:0 }}>
            {activeService==="attest"
              ? "Validation, génération et suivi des demandes d'attestations étudiantes"
              : activeService==="bib"
              ? "Catalogue, emprunts, retours et disponibilité des ouvrages"
              : "Grille horaire, séances, groupes et événements universitaires"}
          </p>
        </motion.div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={activeService}
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
            exit={{opacity:0,x:-20}} transition={{duration:0.28}}>
            {activeService==="attest" && <ScolariteTab/>}
            {activeService==="bib"    && <BiblioTab/>}
            {activeService==="edt"    && <EdtTab/>}
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Signature Modal — rendered at root level for correct z-index */}
      <AnimatePresence>
        {signModal && (
          <SignatureAttestModal
            notif={signModal}
            onClose={()=>setSignModal(null)}
            onSigned={(sigData)=>handleSigned(signModal, sigData)}/>
        )}
      </AnimatePresence>
    </div>
  );
}