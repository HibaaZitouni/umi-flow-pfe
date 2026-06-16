import { clubs as clubsAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Plus, Bell, ChevronRight,
  Users, Star, Check, X, Crown, Wallet,
  UserCheck, Camera, BookOpen, Theater, Palette,
  Cpu, Code2, Music, Globe, Heart, Microscope,
  Edit2, Trash2, Eye, Send, CheckCircle,
  XCircle, Clock, Filter, Award, ChevronDown,
  FileText, Download, Printer,
} from "lucide-react";

/* ── Palette orange/ambre ───────────────────────────────────── */
const O = {
  primary: "#f59e0b",
  dark:    "#78350f",
  mid:     "#d97706",
  light:   "#fef3c7",
  lighter: "#fffbeb",
  border:  "#fde68a",
  grad:    "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
  gradSoft:"linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
};

/* ── Categories ─────────────────────────────────────────────── */
const CATEGORIES = [
  { id:"photo",   nom:"Photographie",  icon:"📸", couleur:"#ec4899", bg:"#fdf2f8" },
  { id:"lecture", nom:"Lecture",       icon:"📖", couleur:"#8b5cf6", bg:"#f5f3ff" },
  { id:"theatre", nom:"Théâtre",       icon:"🎭", couleur:"#ef4444", bg:"#fef2f2" },
  { id:"arts",    nom:"Arts & Dessin", icon:"🎨", couleur:"#f59e0b", bg:"#fffbeb" },
  { id:"ai",      nom:"Intelligence Artificielle", icon:"🤖", couleur:"#3b82f6", bg:"#eff6ff" },
  { id:"prog",    nom:"Programmation", icon:"💻", couleur:"#10b981", bg:"#ecfdf5" },
  { id:"musique", nom:"Musique",       icon:"🎵", couleur:"#6366f1", bg:"#eef2ff" },
  { id:"science", nom:"Sciences",      icon:"🔬", couleur:"#0ea5e9", bg:"#f0f9ff" },
  { id:"sport",   nom:"Sport",         icon:"⚽", couleur:"#22c55e", bg:"#f0fdf4" },
  { id:"env",     nom:"Environnement", icon:"🌿", couleur:"#16a34a", bg:"#f0fdf4" },
];

/* ── Mock data ──────────────────────────────────────────────── */
const INIT_CLUBS = [
  {
    id:1, nom:"Club Photo UMI", categorie:"photo", statut:"actif",
    description:"Club de photographie et arts visuels de l'université.",
    president:{ nom:"Yassine Amrani", role:"Président" },
    tresorier:{ nom:"Salma Benchekroun", role:"Trésorier" },
    membres:["Yassine Amrani","Salma Benchekroun","Mehdi Tazi","Fatima Zahra","Omar Filali","Aicha Benmoussa"],
    prof_referent:"Prof. Ahmed Benali",
    prof_role:"Membre",
    dateCreation:"2024-09-15",
    budget:3500,
    evenements:4,
    reglement:"Le club respecte les valeurs de l'UMI et organise des sorties photographiques mensuelles.",
  },
  {
    id:2, nom:"Club IA & Data", categorie:"ai", statut:"actif",
    description:"Exploration de l'IA, machine learning et data science.",
    president:{ nom:"Rachid Alami", role:"Président" },
    tresorier:{ nom:"Nour El Houda", role:"Trésorier" },
    membres:["Rachid Alami","Nour El Houda","Karim Benjelloun","Hind Tazi","Amine Berrada"],
    prof_referent:"Prof. Karim Tazi",
    prof_role:"Président",
    dateCreation:"2024-10-01",
    budget:5200,
    evenements:6,
    reglement:"Organise des hackathons et ateliers data science chaque mois.",
  },
  {
    id:3, nom:"Club Théâtre", categorie:"theatre", statut:"actif",
    description:"Atelier d'expression théâtrale et arts de la scène.",
    president:{ nom:"Fatima Zahra", role:"Président" },
    tresorier:{ nom:"Hassan Ouali", role:"Trésorier" },
    membres:["Fatima Zahra","Hassan Ouali","Zineb Alaoui","Youssef Kaddouri"],
    prof_referent:"Prof. Nadia Berrada",
    prof_role:"Membre",
    dateCreation:"2024-09-20",
    budget:2800,
    evenements:3,
    reglement:"Répétitions hebdomadaires chaque mercredi.",
  },
  {
    id:4, nom:"Club Programmation", categorie:"prog", statut:"en_attente",
    description:"Coding club ouvert à tous les niveaux.",
    president:{ nom:"Amine Berrada", role:"Président" },
    tresorier:{ nom:"Khadija Moussaoui", role:"Trésorier" },
    membres:["Amine Berrada","Khadija Moussaoui","Tariq Bensouda"],
    prof_referent:"Prof. Fatima Moujahid",
    prof_role:"Membre",
    dateCreation:"2025-01-10",
    budget:0,
    evenements:0,
    reglement:"En attente de validation administrative.",
  },
  {
    id:5, nom:"Club Lecture", categorie:"lecture", statut:"actif",
    description:"Cercle de lecture et débats littéraires.",
    president:{ nom:"Zineb Alaoui", role:"Président" },
    tresorier:{ nom:"Saad Benali", role:"Trésorier" },
    membres:["Zineb Alaoui","Saad Benali","Rim Tazi","Hajar Moujahid","Yasmine Filali"],
    prof_referent:"Prof. Hassan Alami",
    prof_role:"Membre",
    dateCreation:"2024-09-05",
    budget:1500,
    evenements:8,
    reglement:"Réunion bimensuelle avec présentation d'un livre.",
  },
  {
    id:6, nom:"Club Arts & Dessin", categorie:"arts", statut:"suspendu",
    description:"Peinture, illustration et arts plastiques.",
    president:{ nom:"Meryem Ziani", role:"Président" },
    tresorier:{ nom:"Bilal Khattabi", role:"Trésorier" },
    membres:["Meryem Ziani","Bilal Khattabi"],
    prof_referent:"Prof. Ahmed Benali",
    prof_role:"Membre",
    dateCreation:"2024-10-15",
    budget:900,
    evenements:1,
    reglement:"Club suspendu — renouvellement de bureau en cours.",
  },
];

/* ── Club events mock ───────────────────────────────────────── */
const CLUB_EVENTS = {
  1: [ // Club Photo UMI
    { id:1, titre:"Expo Photo Campus", date:"2025-02-10", lieu:"Hall principal", statut:"publie",  inscrits:45, image:"📸" },
    { id:2, titre:"Sortie photo Meknès", date:"2025-03-05", lieu:"Médina Meknès", statut:"planifie",inscrits:18, image:"🏙️" },
    { id:3, titre:"Atelier portrait", date:"2025-01-20", lieu:"Salle A101",   statut:"termine", inscrits:20, image:"🎨" },
    { id:4, titre:"Concours mobile photo", date:"2025-04-01", lieu:"En ligne", statut:"planifie",inscrits:0,  image:"🏆" },
  ],
  2: [ // Club IA & Data
    { id:5, titre:"Hackathon IA 2025",       date:"2025-03-01", lieu:"Salle D401", statut:"publie",  inscrits:34, image:"🤖" },
    { id:6, titre:"Conférence ML pratique",  date:"2025-02-15", lieu:"Amphi A",    statut:"publie",  inscrits:87, image:"🎤" },
    { id:7, titre:"Workshop Python & Data",  date:"2025-01-28", lieu:"Labo B204",  statut:"termine", inscrits:25, image:"💻" },
    { id:8, titre:"Séance Kaggle challenge", date:"2025-04-10", lieu:"Labo C301",  statut:"planifie",inscrits:0,  image:"📊" },
    { id:9, titre:"Présentation PFE IA",     date:"2025-03-20", lieu:"Amphi B",    statut:"publie",  inscrits:50, image:"🎓" },
  ],
  3: [ // Club Théâtre
    { id:10, titre:"Pièce : Le Malade imaginaire", date:"2025-03-15", lieu:"Amphi B",  statut:"publie",  inscrits:120, image:"🎭" },
    { id:11, titre:"Atelier improvisation",        date:"2025-02-05", lieu:"Salle C302",statut:"termine", inscrits:15,  image:"🎪" },
    { id:12, titre:"Auditions nouvelles recrues",  date:"2025-01-15", lieu:"Salle A102",statut:"termine", inscrits:22,  image:"🎬" },
  ],
  4: [], // Club Prog (en attente)
  5: [ // Club Lecture
    { id:13, titre:"Séance : L'Alchimiste",   date:"2025-02-01", lieu:"Bibliothèque", statut:"termine", inscrits:12, image:"📖" },
    { id:14, titre:"Débat littérature marocaine", date:"2025-03-10", lieu:"Salle C302", statut:"publie", inscrits:18, image:"🗣️" },
    { id:15, titre:"Rencontre auteur invité",  date:"2025-04-05", lieu:"Amphi A",      statut:"planifie",inscrits:0,  image:"✍️" },
    { id:16, titre:"Club de poésie",           date:"2025-02-20", lieu:"Jardin campus",statut:"termine", inscrits:8,  image:"🌸" },
    { id:17, titre:"Présentation BD franco-marocaine",date:"2025-01-10",lieu:"Salle A101",statut:"termine",inscrits:20,image:"🖼️"},
    { id:18, titre:"Nuit de la lecture",       date:"2025-05-10", lieu:"Bibliothèque", statut:"planifie",inscrits:0,  image:"🌙" },
    { id:19, titre:"Atelier écriture créative",date:"2025-04-20", lieu:"Salle C302",   statut:"planifie",inscrits:0,  image:"📝" },
    { id:20, titre:"Prix du meilleur livre 2025",date:"2025-06-01",lieu:"Amphi B",     statut:"planifie",inscrits:0,  image:"🏆" },
  ],
  6: [ // Club Arts (suspendu)
    { id:21, titre:"Exposition peinture", date:"2024-12-10", lieu:"Hall principal", statut:"termine", inscrits:60, image:"🎨" },
  ],
};

/* ── Helpers ─────────────────────────────────────────────────── */
const statutCfg = {
  actif:      { label:"Actif",       color:"#10b981", bg:"#ecfdf5", Icon:CheckCircle },
  en_attente: { label:"En attente",  color:"#f59e0b", bg:"#fffbeb", Icon:Clock },
  suspendu:   { label:"Suspendu",    color:"#ef4444", bg:"#fef2f2", Icon:XCircle },
};

function getCatInfo(id) { return CATEGORIES.find(c=>c.id===id)||CATEGORIES[0]; }

const LS = { display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6 };
const IS = { width:"100%", padding:"10px 12px", borderRadius:10,
  border:"1.5px solid #e2e8f0", fontSize:13.5, color:"#0f172a",
  fontFamily:"inherit", outline:"none", background:"#f8fafc", boxSizing:"border-box" };

/* ── Modal ─────────────────────────────────────────────────── */
function Modal({ onClose, title, subtitle, children, maxW=560 }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, zIndex:200,
        background:"rgba(15,23,42,0.55)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}}
        exit={{scale:0.93,y:20}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={e=>e.stopPropagation()}
        style={{ background:"white", borderRadius:22, width:"100%", maxWidth:maxW,
          maxHeight:"90vh", overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.18)" }}>
        <div style={{ padding:"20px 24px 16px", background:O.grad, position:"sticky", top:0,
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"white" }}>{title}</div>
            {subtitle && <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{subtitle}</div>}
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)", border:"none",
              cursor:"pointer", color:"white", padding:8, borderRadius:9, display:"flex" }}>
            <X size={16}/>
          </button>
        </div>
        <div style={{ padding:"22px 24px 26px" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Attestation Modal ──────────────────────────────────────── */
function AttestationModal({ event, club, profNom, onClose }) {
  const [step, setStep]       = useState("preview"); // preview | sent
  const [sending, setSending] = useState(false);
  const [nom, setNom]         = useState(`Prof. ${profNom}`);
  const [cin, setCin]         = useState("");
  const [note, setNote]       = useState("");

  const now = new Date().toLocaleDateString("fr-MA", {
    year:"numeric", month:"long", day:"numeric"
  });
  const refNum = `ATT-CLUB-${club.id}-${event.id}-${Date.now().toString().slice(-5)}`;

  const handleSend = () => {
    if (!cin) return;
    setSending(true);
    setTimeout(()=>{ setSending(false); setStep("sent"); }, 1800);
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, zIndex:400,
        background:"rgba(15,23,42,0.65)", backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <motion.div initial={{scale:0.92,y:24}} animate={{scale:1,y:0}}
        exit={{scale:0.92,y:24}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={e=>e.stopPropagation()}
        style={{ background:"white", borderRadius:22, width:"100%", maxWidth:560,
          maxHeight:"92vh", overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.22)" }}>

        {/* header */}
        <div style={{ padding:"20px 24px 16px",
          background:"linear-gradient(135deg,#f59e0b,#ea580c)",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11,
              background:"rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <FileText size={18} color="white"/>
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:800, color:"white" }}>
                Attestation de participation
              </div>
              <div style={{ fontSize:11.5, color:"rgba(255,255,255,0.7)" }}>
                Génération & envoi à l'administration
              </div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)", border:"none",
              cursor:"pointer", color:"white", padding:8, borderRadius:9, display:"flex" }}>
            <X size={16}/>
          </button>
        </div>

        <div style={{ padding:"22px 24px 26px" }}>

          {step === "preview" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Bénéficiaire */}
              <div>
                <label style={{ display:"block", fontSize:12, fontWeight:700,
                  color:"#374151", marginBottom:6 }}>
                  Nom du bénéficiaire *
                </label>
                <input value={nom} onChange={e=>setNom(e.target.value)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:10,
                    border:"1.5px solid #e2e8f0", fontSize:13.5, color:"#0f172a",
                    fontFamily:"inherit", outline:"none", background:"#f8fafc",
                    boxSizing:"border-box" }}/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ display:"block", fontSize:12, fontWeight:700,
                    color:"#374151", marginBottom:6 }}>CIN *</label>
                  <input value={cin} onChange={e=>setCin(e.target.value)}
                    placeholder="ex: AB123456"
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10,
                      border:`1.5px solid ${cin?"#e2e8f0":"#fde68a"}`,
                      fontSize:13.5, color:"#0f172a", fontFamily:"inherit",
                      outline:"none", background:"#f8fafc", boxSizing:"border-box" }}/>
                </div>
                <div>
                  <label style={{ display:"block", fontSize:12, fontWeight:700,
                    color:"#374151", marginBottom:6 }}>Note / Rôle dans l'événement</label>
                  <input value={note} onChange={e=>setNote(e.target.value)}
                    placeholder="ex: Organisateur, Intervenant…"
                    style={{ width:"100%", padding:"10px 12px", borderRadius:10,
                      border:"1.5px solid #e2e8f0", fontSize:13.5, color:"#0f172a",
                      fontFamily:"inherit", outline:"none", background:"#f8fafc",
                      boxSizing:"border-box" }}/>
                </div>
              </div>

              {/* Document preview */}
              <div style={{ border:"1.5px solid #e2e8f0", borderRadius:14,
                overflow:"hidden", background:"#fafafa" }}>
                {/* doc header */}
                <div style={{ background:"linear-gradient(135deg,#1e3a8a,#1d4ed8)",
                  padding:"16px 20px", display:"flex",
                  alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ fontSize:24 }}>🎓</span>
                    <div>
                      <div style={{ fontSize:13, fontWeight:800, color:"white",
                        letterSpacing:"-0.2px" }}>Université Moulay Ismail</div>
                      <div style={{ fontSize:10, color:"rgba(255,255,255,0.65)",
                        letterSpacing:"1px" }}>MEKNÈS — MAROC</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)" }}>Réf.</div>
                    <div style={{ fontSize:11, fontWeight:700, color:"white",
                      fontFamily:"monospace" }}>{refNum}</div>
                  </div>
                </div>

                {/* doc body */}
                <div style={{ padding:"20px 24px" }}>
                  <div style={{ textAlign:"center", marginBottom:18 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:"#0f172a",
                      letterSpacing:"0.5px", textTransform:"uppercase",
                      borderBottom:"2px solid #f59e0b", paddingBottom:8,
                      display:"inline-block" }}>
                      Attestation de Participation
                    </div>
                  </div>

                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.8,
                    margin:"0 0 14px", textAlign:"justify" }}>
                    Nous soussignés, l'administration de l'<strong>Université Moulay Ismail</strong>,
                    attestons par la présente que :
                  </p>

                  <div style={{ background:"#fffbeb", border:"1px solid #fde68a",
                    borderRadius:10, padding:"14px 18px", marginBottom:14 }}>
                    <div style={{ fontSize:16, fontWeight:800, color:"#0f172a",
                      marginBottom:4 }}>
                      {nom || "Nom du bénéficiaire"}
                    </div>
                    {cin && <div style={{ fontSize:12.5, color:"#64748b" }}>CIN : {cin}</div>}
                    {note && <div style={{ fontSize:12.5, color:"#64748b",
                      marginTop:2 }}>Rôle : {note}</div>}
                  </div>

                  <p style={{ fontSize:13, color:"#374151", lineHeight:1.8,
                    margin:"0 0 14px", textAlign:"justify" }}>
                    a participé à l'événement organisé par le <strong>{club.nom}</strong> :
                  </p>

                  <div style={{ background:"#eff6ff", border:"1px solid #bfdbfe",
                    borderRadius:10, padding:"12px 18px", marginBottom:16 }}>
                    <div style={{ fontSize:14.5, fontWeight:800, color:"#1e3a8a",
                      marginBottom:6 }}>{event.image} {event.titre}</div>
                    <div style={{ display:"flex", gap:14, fontSize:12.5,
                      color:"#3b82f6", flexWrap:"wrap" }}>
                      <span>📅 {event.date}</span>
                      <span>📍 {event.lieu}</span>
                      <span>👥 {event.inscrits} participants</span>
                    </div>
                  </div>

                  <p style={{ fontSize:12.5, color:"#64748b", lineHeight:1.7,
                    margin:"0 0 16px", textAlign:"justify" }}>
                    Cette attestation est délivrée pour servir et valoir ce que de droit,
                    et sera effective après signature et cachet de l'administration compétente.
                  </p>

                  <div style={{ display:"flex", justifyContent:"space-between",
                    alignItems:"flex-end", marginTop:10 }}>
                    <div style={{ fontSize:12, color:"#94a3b8" }}>
                      Émise le : {now}
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ width:100, height:40, border:"1px dashed #cbd5e1",
                        borderRadius:6, display:"flex", alignItems:"center",
                        justifyContent:"center", marginBottom:4 }}>
                        <span style={{ fontSize:10, color:"#cbd5e1" }}>Cachet & Signature</span>
                      </div>
                      <div style={{ fontSize:11, color:"#94a3b8" }}>Administration UMI</div>
                    </div>
                  </div>
                </div>

                {/* QR + hash */}
                <div style={{ borderTop:"1px solid #e2e8f0",
                  padding:"10px 20px", background:"#f8fafc",
                  display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:36, height:36, background:"#0f172a",
                    borderRadius:6, display:"flex", alignItems:"center",
                    justifyContent:"center", flexShrink:0 }}>
                    <span style={{ fontSize:18 }}>▦</span>
                  </div>
                  <div>
                    <div style={{ fontSize:10.5, fontWeight:600, color:"#64748b" }}>
                      Vérifiez cette attestation sur : portail.umi.ac.ma/verif
                    </div>
                    <div style={{ fontSize:9.5, color:"#94a3b8", fontFamily:"monospace" }}>
                      Hash : {refNum}-SHA256-{Math.random().toString(36).slice(2,10).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              {/* info box */}
              <div style={{ display:"flex", alignItems:"center", gap:8,
                background:"#eff6ff", border:"1px solid #bfdbfe",
                borderRadius:10, padding:"11px 14px" }}>
                <span style={{ fontSize:16 }}>ℹ️</span>
                <span style={{ fontSize:12.5, color:"#1d4ed8", fontWeight:500 }}>
                  L'attestation sera envoyée à l'administration pour signature.
                  Vous recevrez un email de confirmation sous 48h.
                </span>
              </div>

              {/* actions */}
              <div style={{ display:"flex", gap:10 }}>
                <button
                  onClick={()=>{
                    const txt = `ATTESTATION DE PARTICIPATION\n\nRéf: ${refNum}\nBénéficiaire: ${nom}\nCIN: ${cin}\nÉvénement: ${event.titre}\nDate: ${event.date}\nLieu: ${event.lieu}\nClub: ${club.nom}\n\nÉmise le: ${now}\nUniversité Moulay Ismail`;
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob([txt],{type:"text/plain"}));
                    a.download = `attestation_${event.titre.replace(/ /g,"_")}_${refNum}.txt`;
                    a.click();
                  }}
                  style={{ flex:1, padding:"12px", borderRadius:11,
                    border:"1.5px solid #e2e8f0", background:"white",
                    color:"#374151", fontSize:13.5, fontWeight:600,
                    cursor:"pointer", fontFamily:"inherit",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
                  <Download size={15}/> Télécharger
                </button>
                <button onClick={handleSend} disabled={!cin||sending}
                  style={{ flex:2, padding:"12px", borderRadius:11, border:"none",
                    background:(cin&&!sending)?"linear-gradient(135deg,#f59e0b,#ea580c)":"#e2e8f0",
                    color:(cin&&!sending)?"white":"#94a3b8",
                    fontSize:13.5, fontWeight:700,
                    cursor:(cin&&!sending)?"pointer":"not-allowed",
                    fontFamily:"inherit",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                    boxShadow:(cin&&!sending)?"0 4px 16px rgba(245,158,11,0.35)":"none" }}>
                  {sending ? (
                    <>
                      <motion.div animate={{rotate:360}}
                        transition={{duration:0.8,repeat:Infinity,ease:"linear"}}
                        style={{ width:16, height:16, borderRadius:"50%",
                          border:"2px solid rgba(255,255,255,0.3)",
                          borderTopColor:"white" }}/>
                      Envoi en cours…
                    </>
                  ) : (
                    <><Send size={15}/> Envoyer à l'admin pour signature</>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === "sent" && (
            <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
              style={{ display:"flex", flexDirection:"column",
                alignItems:"center", gap:16, padding:"16px 0", textAlign:"center" }}>
              <motion.div initial={{scale:0}} animate={{scale:1}}
                transition={{type:"spring",stiffness:280,damping:20,delay:0.1}}
                style={{ width:72, height:72, borderRadius:"50%",
                  background:"linear-gradient(135deg,#10b981,#059669)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:"0 8px 28px rgba(16,185,129,0.35)" }}>
                <Check size={34} color="white" strokeWidth={2.5}/>
              </motion.div>

              <div>
                <h3 style={{ fontSize:20, fontWeight:800, color:"#0f172a",
                  margin:"0 0 8px" }}>Attestation envoyée !</h3>
                <p style={{ fontSize:13.5, color:"#64748b", margin:0, lineHeight:1.6 }}>
                  L'attestation de <strong>{nom}</strong> pour l'événement<br/>
                  <strong>{event.titre}</strong> a été transmise<br/>
                  à l'administration pour signature.
                </p>
              </div>

              <div style={{ background:"#fffbeb", border:"1px solid #fde68a",
                borderRadius:12, padding:"14px 20px", width:"100%" }}>
                <div style={{ fontSize:12, fontWeight:700, color:"#78350f",
                  marginBottom:8 }}>📋 Récapitulatif</div>
                <div style={{ display:"flex", flexDirection:"column", gap:5,
                  fontSize:12.5, color:"#374151" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#94a3b8" }}>Référence</span>
                    <span style={{ fontWeight:700, fontFamily:"monospace",
                      fontSize:11 }}>{refNum}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#94a3b8" }}>Bénéficiaire</span>
                    <span style={{ fontWeight:600 }}>{nom}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#94a3b8" }}>Événement</span>
                    <span style={{ fontWeight:600 }}>{event.titre}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <span style={{ color:"#94a3b8" }}>Délai réponse</span>
                    <span style={{ fontWeight:600, color:"#10b981" }}>48h maximum</span>
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:7,
                fontSize:12.5, color:"#64748b" }}>
                <span>📧</span>
                <span>Un email de suivi vous sera envoyé à votre adresse UMI</span>
              </div>

              <button onClick={onClose}
                style={{ padding:"12px 32px", borderRadius:11, border:"none",
                  background:"linear-gradient(135deg,#f59e0b,#ea580c)",
                  color:"white", fontSize:14, fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit",
                  boxShadow:"0 4px 16px rgba(245,158,11,0.35)" }}>
                Fermer
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Club Detail Modal ──────────────────────────────────────── */
function ClubDetailModal({ club, onClose, onUpdate, profNom }) {
  const [showEvents, setShowEvents] = useState(false);
  const [attestModal, setAttestModal] = useState(null); // ev object
  const clubEvents = CLUB_EVENTS[club.id] || [];
  const cat = getCatInfo(club.categorie);
  const sc  = statutCfg[club.statut];
  const isProfMember = club.prof_referent === `Prof. ${profNom.split(" ").pop()}` ||
    club.prof_referent.includes(profNom);
  const isProfPresident = club.prof_role === "Président";

  return (
    <Modal onClose={onClose} title={club.nom} subtitle={cat.nom} maxW={620}>
      <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

        {/* header info */}
        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <div style={{ width:60, height:60, borderRadius:18,
            background:cat.bg, border:`2px solid ${cat.couleur}33`,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, flexShrink:0 }}>
            {cat.icon}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:6 }}>
              <span style={{ background:sc.bg, color:sc.color, fontSize:12,
                fontWeight:700, borderRadius:20, padding:"3px 10px",
                display:"flex", alignItems:"center", gap:4 }}>
                <sc.Icon size={11}/>{sc.label}
              </span>
              <span style={{ background:cat.bg, color:cat.couleur, fontSize:12,
                fontWeight:700, borderRadius:20, padding:"3px 10px" }}>{cat.nom}</span>
              {isProfMember && (
                <span style={{ background:"#fef3c7", color:O.dark, fontSize:12,
                  fontWeight:700, borderRadius:20, padding:"3px 10px",
                  display:"flex", alignItems:"center", gap:4 }}>
                  {isProfPresident ? <Crown size={11}/> : <UserCheck size={11}/>}
                  {club.prof_role}
                </span>
              )}
            </div>
            <p style={{ fontSize:13, color:"#64748b", margin:0, lineHeight:1.5 }}>{club.description}</p>
          </div>
        </div>

        {/* bureau */}
        <div style={{ background:"#f8fafc", borderRadius:14, padding:"16px 18px" }}>
          <div style={{ fontSize:13, fontWeight:800, color:"#0f172a", marginBottom:12,
            display:"flex", alignItems:"center", gap:6 }}>
            <Crown size={15} color={O.primary}/> Bureau du club
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {[
              { role:"Président", nom:club.president.nom, icon:"👑" },
              { role:"Trésorier", nom:club.tresorier.nom, icon:"💰" },
              { role:"Prof. référent", nom:club.prof_referent.replace("Prof. ",""), icon:"👨‍🏫" },
              { role:"Rôle du prof", nom:club.prof_role, icon:"🏷️" },
            ].map(b=>(
              <div key={b.role} style={{ background:"white", borderRadius:10, padding:"10px 13px",
                border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:3 }}>{b.role}</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#0f172a" }}>
                  {b.icon} {b.nom}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* membres */}
        <div>
          <div style={{ fontSize:13, fontWeight:800, color:"#0f172a", marginBottom:10,
            display:"flex", alignItems:"center", gap:6 }}>
            <Users size={15} color={O.primary}/> Membres ({club.membres.length})
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
            {club.membres.map(m=>(
              <div key={m} style={{ display:"flex", alignItems:"center", gap:7,
                background:"#f8fafc", border:"1px solid #e2e8f0",
                borderRadius:20, padding:"5px 13px" }}>
                <div style={{ width:22, height:22, borderRadius:"50%",
                  background:O.grad, display:"flex", alignItems:"center",
                  justifyContent:"center", color:"white", fontSize:10, fontWeight:800 }}>
                  {m[0]}
                </div>
                <span style={{ fontSize:12.5, color:"#0f172a", fontWeight:500 }}>{m}</span>
                {m === club.president.nom && <Crown size={11} color={O.primary}/>}
              </div>
            ))}
          </div>
        </div>

        {/* stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          {[
            { label:"Budget", value:`${club.budget.toLocaleString()} MAD`, icon:"💰" },
            { label:"Événements", value:club.evenements, icon:"🎉" },
            { label:"Créé le", value:club.dateCreation, icon:"📅" },
          ].map(s=>(
            <div key={s.label} style={{ background:O.lighter, borderRadius:11,
              padding:"12px 14px", border:`1px solid ${O.border}`, textAlign:"center" }}>
              <div style={{ fontSize:20, marginBottom:4 }}>{s.icon}</div>
              <div style={{ fontSize:15, fontWeight:800, color:"#0f172a" }}>{s.value}</div>
              <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Événements du club */}
        <div>
          <button onClick={()=>setShowEvents(s=>!s)}
            style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
              padding:"13px 16px", borderRadius:12,
              background: showEvents ? O.lighter : "#f8fafc",
              border:`1.5px solid ${showEvents ? O.border : "#e2e8f0"}`,
              cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8,
              fontSize:13.5, fontWeight:800, color:"#0f172a" }}>
              🎉 Événements du club
              <span style={{ background:O.grad, color:"white", fontSize:11,
                fontWeight:700, borderRadius:20, padding:"2px 9px" }}>
                {clubEvents.length}
              </span>
            </div>
            <span style={{ fontSize:12, color:O.primary, fontWeight:600 }}>
              {showEvents ? "▲ Masquer" : "▼ Voir tous"}
            </span>
          </button>

          <AnimatePresence>
            {showEvents && (
              <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
                exit={{opacity:0,height:0}} transition={{duration:0.3,ease:[0.22,1,0.36,1]}}
                style={{ overflow:"hidden" }}>
                <div style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:10 }}>
                  {clubEvents.length === 0 ? (
                    <div style={{ textAlign:"center", padding:"24px", color:"#94a3b8" }}>
                      <span style={{ fontSize:32, display:"block", marginBottom:8 }}>📅</span>
                      <div style={{ fontSize:13, fontWeight:600 }}>Aucun événement pour ce club</div>
                    </div>
                  ) : clubEvents.map((ev,i)=>{
                    const sc = {
                      publie:   { color:"#10b981", bg:"#ecfdf5", label:"Publié" },
                      planifie: { color:"#f59e0b", bg:"#fffbeb", label:"Planifié" },
                      termine:  { color:"#64748b", bg:"#f1f5f9", label:"Terminé" },
                    }[ev.statut] || { color:"#64748b", bg:"#f1f5f9", label:ev.statut };
                    return (
                      <motion.div key={ev.id}
                        initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}
                        transition={{delay:i*0.05}}
                        style={{ background:"white", borderRadius:12,
                          border:"1px solid #e2e8f0",
                          boxShadow:"0 1px 5px rgba(0,0,0,0.04)",
                          overflow:"hidden" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12,
                          padding:"12px 14px" }}>
                          <div style={{ width:38, height:38, borderRadius:10,
                            background:O.lighter, border:`1px solid ${O.border}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:20, flexShrink:0 }}>{ev.image}</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13.5, fontWeight:700, color:"#0f172a",
                              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {ev.titre}
                            </div>
                            <div style={{ fontSize:12, color:"#64748b", marginTop:2,
                              display:"flex", gap:8, flexWrap:"wrap" }}>
                              <span>📅 {ev.date}</span>
                              <span>📍 {ev.lieu}</span>
                              <span>👥 {ev.inscrits} inscrits</span>
                            </div>
                          </div>
                          <span style={{ background:sc.bg, color:sc.color,
                            fontSize:11, fontWeight:700, borderRadius:20,
                            padding:"3px 10px", flexShrink:0 }}>{sc.label}</span>
                        </div>
                        {/* Attestation button */}
                        <div style={{ borderTop:"1px solid #f1f5f9",
                          padding:"9px 14px", display:"flex",
                          alignItems:"center", justifyContent:"space-between",
                          background:"#fafafa" }}>
                          <span style={{ fontSize:11.5, color:"#94a3b8" }}>
                            Attestation de participation
                          </span>
                          <button
                            onClick={()=>setAttestModal(ev)}
                            style={{ display:"flex", alignItems:"center", gap:5,
                              padding:"6px 12px", borderRadius:8, border:"none",
                              background:O.grad, color:"white",
                              fontSize:12, fontWeight:700, cursor:"pointer",
                              fontFamily:"inherit",
                              boxShadow:`0 2px 8px ${O.primary}40` }}>
                            <FileText size={12}/> Générer & Envoyer
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* règlement */}
        <div style={{ background:O.lighter, border:`1px solid ${O.border}`, borderRadius:12, padding:"13px 16px" }}>
          <div style={{ fontSize:12, fontWeight:700, color:O.dark, marginBottom:6 }}>📜 Règlement intérieur</div>
          <p style={{ fontSize:13, color:"#64748b", margin:0, lineHeight:1.6 }}>{club.reglement}</p>
        </div>

        {/* Attestation Modal */}
        <AnimatePresence>
          {attestModal && (
            <AttestationModal
              event={attestModal}
              club={club}
              profNom={profNom}
              onClose={()=>setAttestModal(null)}/>
          )}
        </AnimatePresence>

      {/* actions */}
        {club.statut==="en_attente" && (
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>{ onUpdate(club.id,"actif"); onClose(); }}
              style={{ flex:1, padding:"12px", borderRadius:11, border:"none",
                background:"linear-gradient(135deg,#10b981,#059669)", color:"white",
                fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                boxShadow:"0 4px 14px rgba(16,185,129,0.3)" }}>
              <CheckCircle size={16}/> Valider le club
            </button>
            <button onClick={()=>{ onUpdate(club.id,"suspendu"); onClose(); }}
              style={{ flex:1, padding:"12px", borderRadius:11,
                border:"1px solid #fecaca", background:"#fef2f2",
                color:"#ef4444", fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:7 }}>
              <XCircle size={16}/> Refuser
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ── Create Club Modal ──────────────────────────────────────── */
function CreateClubModal({ onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nom:"", categorie:"photo", description:"", reglement:"",
    president:"", tresorier:"", prof_referent:"Prof. Ahmed Benali",
    prof_role:"Membre", budget:0,
  });
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));

  const step1Valid = form.nom && form.categorie && form.description;
  const step2Valid = form.president && form.tresorier;

  const PROFS = ["Prof. Ahmed Benali","Prof. Nadia Berrada","Prof. Karim Tazi","Prof. Hassan Alami","Prof. Fatima Moujahid"];

  const submit = () => {
    onSave({
      ...form, id:Date.now(), statut:"en_attente",
      membres:[form.president, form.tresorier],
      evenements:0, dateCreation:new Date().toISOString().slice(0,10),
      president:{ nom:form.president, role:"Président" },
      tresorier:{ nom:form.tresorier, role:"Trésorier" },
    });
    onClose();
  };

  const cat = getCatInfo(form.categorie);

  return (
    <Modal onClose={onClose} title="Créer un nouveau club" subtitle={`Étape ${step}/2`} maxW={540}>
      {/* progress */}
      <div style={{ height:5, background:"#e2e8f0", borderRadius:99, overflow:"hidden", marginBottom:22 }}>
        <motion.div animate={{width:`${step===1?50:100}%`}}
          transition={{duration:0.4,ease:[0.22,1,0.36,1]}}
          style={{ height:"100%", background:O.grad, borderRadius:99 }}/>
      </div>

      <AnimatePresence mode="wait">
        {step===1 && (
          <motion.div key="s1"
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
            exit={{opacity:0,x:-20}} transition={{duration:0.25}}
            style={{ display:"flex", flexDirection:"column", gap:14 }}>

            <div>
              <label style={LS}>Nom du club *</label>
              <input value={form.nom} onChange={e=>s("nom",e.target.value)}
                placeholder="ex: Club Photo UMI" style={IS}/>
            </div>

            <div>
              <label style={LS}>Catégorie *</label>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:7 }}>
                {CATEGORIES.map(c=>(
                  <button key={c.id} type="button" onClick={()=>s("categorie",c.id)}
                    style={{ display:"flex", flexDirection:"column", alignItems:"center",
                      gap:5, padding:"10px 4px", borderRadius:12, border:"none",
                      background:form.categorie===c.id?c.bg:"#f8fafc",
                      cursor:"pointer", fontFamily:"inherit",
                      border:`1.5px solid ${form.categorie===c.id?c.couleur+"66":"#e2e8f0"}`,
                      transition:"all .15s" }}>
                    <span style={{ fontSize:20 }}>{c.icon}</span>
                    <span style={{ fontSize:10, fontWeight:form.categorie===c.id?700:500,
                      color:form.categorie===c.id?c.couleur:"#64748b",
                      lineHeight:1.2, textAlign:"center" }}>
                      {c.nom.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
              {form.categorie && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}
                  style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:6,
                    background:cat.bg, border:`1px solid ${cat.couleur}44`,
                    borderRadius:20, padding:"4px 12px" }}>
                  <span>{cat.icon}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:cat.couleur }}>{cat.nom}</span>
                </motion.div>
              )}
            </div>

            <div>
              <label style={LS}>Description *</label>
              <textarea value={form.description} onChange={e=>s("description",e.target.value)}
                placeholder="Décrivez les objectifs et activités du club…"
                rows={3} style={{...IS, resize:"none"}}/>
            </div>

            <div>
              <label style={LS}>Règlement intérieur</label>
              <textarea value={form.reglement} onChange={e=>s("reglement",e.target.value)}
                placeholder="Règles de fonctionnement, fréquence des réunions…"
                rows={2} style={{...IS, resize:"none"}}/>
            </div>

            <button onClick={()=>step1Valid&&setStep(2)} disabled={!step1Valid}
              style={{ padding:"13px", borderRadius:12, border:"none",
                background:step1Valid?O.grad:"#e2e8f0",
                color:step1Valid?"white":"#94a3b8",
                fontSize:14.5, fontWeight:700,
                cursor:step1Valid?"pointer":"not-allowed", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:step1Valid?`0 6px 20px ${O.primary}40`:"none" }}>
              Suivant → Bureau & Infos
            </button>
          </motion.div>
        )}

        {step===2 && (
          <motion.div key="s2"
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
            exit={{opacity:0,x:-20}} transition={{duration:0.25}}
            style={{ display:"flex", flexDirection:"column", gap:14 }}>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={LS}>Président(e) *</label>
                <input value={form.president} onChange={e=>s("president",e.target.value)}
                  placeholder="Nom complet" style={IS}/>
              </div>
              <div>
                <label style={LS}>Trésorier(e) *</label>
                <input value={form.tresorier} onChange={e=>s("tresorier",e.target.value)}
                  placeholder="Nom complet" style={IS}/>
              </div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div>
                <label style={LS}>Professeur référent</label>
                <select value={form.prof_referent} onChange={e=>s("prof_referent",e.target.value)} style={IS}>
                  {PROFS.map(p=><option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={LS}>Rôle du professeur</label>
                <select value={form.prof_role} onChange={e=>s("prof_role",e.target.value)} style={IS}>
                  <option value="Président">Président</option>
                  <option value="Membre">Membre</option>
                  <option value="Conseiller">Conseiller</option>
                </select>
              </div>
            </div>

            <div>
              <label style={LS}>Budget initial (MAD)</label>
              <input type="number" value={form.budget} onChange={e=>s("budget",+e.target.value)}
                min={0} placeholder="0" style={IS}/>
            </div>

            {/* preview card */}
            {form.president && (
              <motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}
                style={{ background:O.lighter, border:`1px solid ${O.border}`,
                  borderRadius:13, padding:"13px 16px" }}>
                <div style={{ fontSize:11.5, fontWeight:700, color:O.dark,
                  marginBottom:8, display:"flex", alignItems:"center", gap:5 }}>
                  {cat.icon} Aperçu du club
                </div>
                <div style={{ fontSize:14, fontWeight:800, color:"#0f172a", marginBottom:4 }}>{form.nom}</div>
                <div style={{ fontSize:12, color:"#64748b" }}>
                  👑 {form.president} · 💰 {form.tresorier}
                </div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>
                  👨‍🏫 {form.prof_referent} ({form.prof_role})
                </div>
              </motion.div>
            )}

            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setStep(1)}
                style={{ flex:1, padding:"12px", borderRadius:11,
                  border:"1.5px solid #e2e8f0", background:"white",
                  color:"#374151", fontSize:14, fontWeight:600,
                  cursor:"pointer", fontFamily:"inherit" }}>
                ← Retour
              </button>
              <button onClick={()=>step2Valid&&submit()} disabled={!step2Valid}
                style={{ flex:2, padding:"12px", borderRadius:11, border:"none",
                  background:step2Valid?O.grad:"#e2e8f0",
                  color:step2Valid?"white":"#94a3b8",
                  fontSize:14.5, fontWeight:700,
                  cursor:step2Valid?"pointer":"not-allowed", fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow:step2Valid?`0 6px 20px ${O.primary}40`:"none" }}>
                <CheckCircle size={16}/> Soumettre pour validation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function ClubsPage() {
  const navigate = useNavigate();
  // ── Guard : rediriger vers login si pas de token ──────────
  useEffect(() => {
    const token = localStorage.getItem("umi_token");
    const user  = localStorage.getItem("umi_user");
    if (!token || !user) navigate("/");
  }, []);

  // ── Utilisateur connecté ──────────────────────────────────
  const _u = (() => { try { return JSON.parse(localStorage.getItem("umi_user"))||{}; } catch{return{};} })();
  const _displayName = _u.prenom && _u.nom ? `${_u.prenom} ${_u.nom}` : "Utilisateur";
  const _roleLabel = {PROFESSEUR:"Enseignant",ETUDIANT:"Étudiant",SUPER_ADMIN:"Super Admin",ADMIN_ATTEST:"Admin Scolarité",ADMIN_BIB:"Admin Bibliothèque",ADMIN_EDT:"Admin EDT"}[_u.db_role]||"Utilisateur";
  const _initials = (_u.prenom?.[0]||"U").toUpperCase()+(_u.nom?.[0]||"").toUpperCase();
  const _isProf = _u.db_role === "PROFESSEUR";
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clubs, setClubs]     = useState(INIT_CLUBS);
  const [search, setSearch]   = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [filterStat, setFilterStat] = useState("all");
  const [detailClub, setDetailClub] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState("clubs");

  const addClub = (c) => {
    setClubs(p=>[c,...p]);
    clubsAPI.create({ nom: c.nom, categorie: c.categorie,
      description: c.description, reglement: c.reglement,
      president_nom: c.bureau?.president||"", tresorier_nom: c.bureau?.tresorier||"",
    }).catch(()=>{});
  };
  const updateStatut = (id, statut) => setClubs(p=>p.map(c=>c.id===id?{...c,statut}:c));

  const filtered = clubs.filter(c=>
    (c.nom.toLowerCase().includes(search.toLowerCase())||
     getCatInfo(c.categorie).nom.toLowerCase().includes(search.toLowerCase()))
    && (filterCat==="all"  || c.categorie===filterCat)
    && (filterStat==="all" || c.statut===filterStat)
  );

  const stats = {
    total:      clubs.length,
    actifs:     clubs.filter(c=>c.statut==="actif").length,
    enAttente:  clubs.filter(c=>c.statut==="en_attente").length,
    membres:    [...new Set(clubs.flatMap(c=>c.membres))].length,
  };

  /* My clubs as prof (simulated) */
  const mesClubs = clubs.filter(c=>c.prof_referent==="Prof. Ahmed Benali");

  const TABS = [
    { id:"clubs",   label:"Tous les clubs",  icon:Users },
    { id:"mes",     label:"Mes clubs",        icon:Star },
    { id:"attente", label:"En attente",       icon:Clock, badge:stats.enAttente },
  ];

  return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(160deg,#fffcf0 0%,#fffbeb 40%,#fff7f0 100%)",
      fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* NAVBAR */}
      <motion.nav initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
        style={{ height:62, background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(18px)", borderBottom:`1px solid ${O.border}55`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", position:"sticky", top:0, zIndex:100,
          boxShadow:`0 2px 20px ${O.primary}10` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <motion.button onClick={()=>navigate("/teacher")}
            whileHover={{scale:1.04,x:-2}} whileTap={{scale:0.96}}
            style={{ display:"flex", alignItems:"center", gap:7,
              background:O.lighter, border:`1px solid ${O.border}`,
              borderRadius:10, padding:"7px 13px", cursor:"pointer",
              color:O.primary, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
            <ArrowLeft size={15}/> Retour
          </motion.button>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Accueil</span>
            <ChevronRight size={13} color="#cbd5e1"/>
            <span style={{ fontSize:13, fontWeight:700, color:O.primary }}>Clubs & Associations</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", background:"#f1f5f9",
            borderRadius:10, padding:"0 13px", gap:7, width:220 }}>
            <Search size={14} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Nom, catégorie…"
              style={{ border:"none", outline:"none", background:"transparent",
                fontSize:13, color:"#0f172a", padding:"9px 0", fontFamily:"inherit", width:"100%" }}/>
          </div>
          <motion.button onClick={()=>setShowCreate(true)}
            whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
              borderRadius:10, border:"none", background:O.grad, color:"white",
              fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 2px 12px ${O.primary}40` }}>
            <Plus size={14}/> Créer un club
          </motion.button>
          <div style={{ position:"relative" }}>
            <button onClick={()=>setNotifOpen(o=>!o)}
              style={{ width:36, height:36, borderRadius:10,
                background:notifOpen?"#f5f3ff":"#f1f5f9",
                border:notifOpen?"1px solid #ddd6fe":"none",
                cursor:"pointer", display:"flex", alignItems:"center",
                justifyContent:"center", position:"relative", transition:"all .2s" }}>
              <Bell size={16} color={notifOpen?"#9333ea":"#64748b"}/>
              {stats.enAttente>0&&<span style={{ position:"absolute", top:7, right:7, width:7,
              height:7, borderRadius:"50%", background:"#ef4444", border:"1.5px solid white" }}/>}
            </button>
            {notifOpen&&<NotifPanel onClose={()=>setNotifOpen(false)}/>}
          </div>
          <div style={{ position:"relative" }}>
            <div onClick={()=>setProfileOpen(o=>!o)}
              style={{ display:"flex", alignItems:"center", gap:8,
                background:"#fffbeb", border:"1.5px solid #fde68a",
                borderRadius:10, padding:"5px 12px 5px 6px",
                cursor:"pointer" }}>
              <div style={{ width:28, height:28, borderRadius:8,
                background:"linear-gradient(135deg,#f59e0b,#f59e0bcc)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"white", fontSize:13, fontWeight:800 }}>{_initials}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", lineHeight:1 }}>{_isProf?"Prof. ":""}{_displayName}</div>
                <div style={{ fontSize:10.5, color:"#f59e0b", fontWeight:600, marginTop:1 }}>{_roleLabel}</div>
              </div>
            </div>
            {profileOpen&&<ProfilePanel onClose={()=>setProfileOpen(false)}/>}
          </div>
        </div>
      </motion.nav>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"28px 32px 60px" }}>

        {/* Hero */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:0.6,delay:0.1}}
          style={{ borderRadius:20, background:O.grad, padding:"26px 34px",
            marginBottom:26, display:"flex", alignItems:"center",
            justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160,
            borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7,
              background:"rgba(255,255,255,0.18)", borderRadius:20, padding:"4px 13px", marginBottom:10 }}>
              <span style={{ fontSize:16 }}>🎭</span>
              <span style={{ fontSize:12, color:"white", fontWeight:600 }}>Clubs & Associations UMI</span>
            </div>
            <h1 style={{ fontSize:24, fontWeight:800, color:"white",
              letterSpacing:"-0.4px", margin:"0 0 5px" }}>
              Vie associative de l'université
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:0 }}>
              Rejoignez un club, créez des projets, rencontrez des passionnés
            </p>
          </div>
          <div style={{ display:"flex", gap:10, position:"relative", zIndex:1 }}>
            {[
              { v:stats.total,    l:"Clubs",      icon:"🎭" },
              { v:stats.actifs,   l:"Actifs",     icon:"✅" },
              { v:stats.membres,  l:"Membres",    icon:"👥" },
              { v:stats.enAttente,l:"En attente", icon:"⏳" },
            ].map(s=>(
              <div key={s.l} style={{ background:"rgba(255,255,255,0.15)",
                backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.25)",
                borderRadius:13, padding:"11px 16px",
                display:"flex", flexDirection:"column", alignItems:"center", minWidth:72 }}>
                <span style={{ fontSize:18, marginBottom:4 }}>{s.icon}</span>
                <div style={{ fontSize:20, fontWeight:800, color:"white", lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, borderBottom:`2px solid ${O.light}`, marginBottom:20 }}>
          {TABS.map(t=>{
            const Icon=t.icon;
            const active=activeTab===t.id;
            return (
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{ display:"flex", alignItems:"center", gap:7,
                  padding:"10px 18px", borderRadius:"10px 10px 0 0",
                  border:"none", cursor:"pointer",
                  background:active?"white":"transparent",
                  color:active?O.primary:"#64748b",
                  fontSize:13.5, fontWeight:active?700:500, fontFamily:"inherit",
                  borderBottom:active?`2px solid ${O.primary}`:"2px solid transparent",
                  marginBottom:-2,
                  boxShadow:active?`0 -2px 12px ${O.primary}12`:"none",
                  transition:"all .2s" }}>
                <Icon size={15}/>{t.label}
                {t.badge>0&&<span style={{ background:"#ef4444",color:"white",fontSize:10,
                  fontWeight:700,borderRadius:10,padding:"1px 6px" }}>{t.badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
          <button onClick={()=>setFilterCat("all")}
            style={{ padding:"7px 14px", borderRadius:20, border:"none",
              background:filterCat==="all"?O.grad:"white",
              color:filterCat==="all"?"white":"#64748b",
              fontSize:12.5, fontWeight:filterCat==="all"?700:500,
              cursor:"pointer", fontFamily:"inherit",
              boxShadow:filterCat==="all"?`0 2px 8px ${O.primary}40`:"0 1px 3px rgba(0,0,0,0.06)" }}>
            Toutes catégories
          </button>
          {CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setFilterCat(c.id)}
              style={{ padding:"7px 12px", borderRadius:20, border:"none",
                background:filterCat===c.id?c.bg:"white",
                color:filterCat===c.id?c.couleur:"#64748b",
                fontSize:12.5, fontWeight:filterCat===c.id?700:500,
                cursor:"pointer", fontFamily:"inherit",
                border:`1.5px solid ${filterCat===c.id?c.couleur+"55":"#e2e8f0"}`,
                transition:"all .15s" }}>
              {c.icon} {c.nom}
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}
            initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
            exit={{opacity:0}} transition={{duration:0.25}}>
            <div style={{ display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:18 }}>
              {(activeTab==="mes" ? mesClubs
                : activeTab==="attente" ? clubs.filter(c=>c.statut==="en_attente")
                : filtered).map((club,i)=>{
                const cat = getCatInfo(club.categorie);
                const sc  = statutCfg[club.statut];
                const isProfPresident = club.prof_role==="Président" && club.prof_referent==="Prof. Ahmed Benali";
                return (
                  <motion.div key={club.id}
                    initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                    transition={{delay:i*0.06}}
                    whileHover={{y:-5, boxShadow:`0 16px 40px ${cat.couleur}18`}}
                    onClick={()=>setDetailClub(club)}
                    style={{ background:"white", borderRadius:18,
                      border:`1px solid ${club.statut==="en_attente"?"#fde68a":"#e2e8f0"}`,
                      overflow:"hidden", cursor:"pointer",
                      boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                      transition:"box-shadow .2s, transform .2s" }}>
                    {/* top bar */}
                    <div style={{ height:5,
                      background:`linear-gradient(90deg,${cat.couleur},${cat.couleur}88)` }}/>
                    <div style={{ padding:"20px 22px" }}>
                      {/* header */}
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"flex-start", marginBottom:12 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <div style={{ width:48, height:48, borderRadius:14,
                            background:cat.bg, border:`1.5px solid ${cat.couleur}33`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            fontSize:24, flexShrink:0 }}>
                            {cat.icon}
                          </div>
                          <div>
                            <div style={{ fontSize:15, fontWeight:800, color:"#0f172a",
                              lineHeight:1.2, marginBottom:4 }}>{club.nom}</div>
                            <span style={{ background:cat.bg, color:cat.couleur,
                              fontSize:11, fontWeight:700, borderRadius:20, padding:"2px 9px" }}>
                              {cat.nom}
                            </span>
                          </div>
                        </div>
                        <span style={{ background:sc.bg, color:sc.color,
                          fontSize:11, fontWeight:700, borderRadius:20,
                          padding:"3px 9px", flexShrink:0,
                          display:"flex", alignItems:"center", gap:3 }}>
                          <sc.Icon size={9}/>{sc.label}
                        </span>
                      </div>

                      {/* description */}
                      <p style={{ fontSize:12.5, color:"#64748b", margin:"0 0 14px",
                        lineHeight:1.5, display:"-webkit-box",
                        WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                        {club.description}
                      </p>

                      {/* bureau */}
                      <div style={{ display:"flex", gap:7, marginBottom:14, flexWrap:"wrap" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:5,
                          background:"#f8fafc", borderRadius:20, padding:"4px 10px" }}>
                          <Crown size={11} color={O.primary}/>
                          <span style={{ fontSize:11.5, color:"#0f172a", fontWeight:600 }}>
                            {club.president.nom.split(" ")[0]}
                          </span>
                        </div>
                        {isProfPresident && (
                          <div style={{ display:"flex", alignItems:"center", gap:5,
                            background:O.lighter, border:`1px solid ${O.border}`,
                            borderRadius:20, padding:"4px 10px" }}>
                            <span style={{ fontSize:11.5, color:O.dark, fontWeight:700 }}>
                              👨‍🏫 Présidé par prof
                            </span>
                          </div>
                        )}
                      </div>

                      {/* footer */}
                      <div style={{ display:"flex", justifyContent:"space-between",
                        alignItems:"center" }}>
                        <div style={{ display:"flex", gap:12 }}>
                          <span style={{ fontSize:12, color:"#64748b",
                            display:"flex", alignItems:"center", gap:4 }}>
                            <Users size={12}/> {club.membres.length}
                          </span>
                          <span style={{ fontSize:12, color:"#64748b",
                            display:"flex", alignItems:"center", gap:4 }}>
                            🎉 {(CLUB_EVENTS[club.id]||[]).length}
                          </span>
                          <span style={{ fontSize:12, color:"#64748b",
                            display:"flex", alignItems:"center", gap:4 }}>
                            💰 {club.budget.toLocaleString()}
                          </span>
                        </div>
                        <div style={{ width:28, height:28, borderRadius:9,
                          background:cat.couleur+"18",
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <ChevronRight size={14} color={cat.couleur}/>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Empty state */}
              {filtered.length===0 && activeTab==="clubs" && (
                <div style={{ gridColumn:"1/-1", textAlign:"center",
                  padding:"60px 20px", color:"#94a3b8" }}>
                  <span style={{ fontSize:48, display:"block", marginBottom:12 }}>🎭</span>
                  <div style={{ fontSize:15, fontWeight:600 }}>Aucun club trouvé</div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {detailClub && (
          <ClubDetailModal club={detailClub} onClose={()=>setDetailClub(null)}
            onUpdate={updateStatut} profNom={_u.nom||""}/>
        )}
        {showCreate && (
          <CreateClubModal onClose={()=>setShowCreate(false)} onSave={addClub}/>
        )}
      </AnimatePresence>
    </div>
  );
}