import { useState, useEffect } from "react";
import { evenements as evAPI } from "./api.js";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Plus, Bell, ChevronRight,
  Calendar, Users, MapPin, X, Check, Clock,
  CheckCircle, XCircle, Star, Download, Send,
  TrendingUp, DollarSign, Eye, Edit2, Trash2,
  BarChart2, Layers, Award, Heart, Zap,
  UserCheck, FileText, Building2, Filter,
} from "lucide-react";

/* ── Palette rouge ──────────────────────────────────────────── */
const R = {
  primary: "#ef4444",
  dark:    "#7f1d1d",
  mid:     "#dc2626",
  light:   "#fee2e2",
  lighter: "#fef2f2",
  border:  "#fecaca",
  grad:    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  gradWarm:"linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
};

/* ── Mock data ──────────────────────────────────────────────── */
const SALLES = ["Amphi A","Amphi B","Salle C301","Salle D401","Salle A101","Extérieur campus"];

const INIT_EVENTS = [
  {
    id:1,
    titre:"Conférence IA & Société",
    type:"academique",
    date:"2025-02-15",
    heure:"10:00",
    lieu:"Amphi A",
    statut:"publie",
    description:"Une exploration des impacts de l'intelligence artificielle sur notre société, avec des intervenants de renom.",
    capacite:200,
    inscrits:87,
    organisateur:"Club IA & Data",
    sponsors:[
      { nom:"TechMaroc", montant:5000, type:"financier" },
      { nom:"UMI",       montant:3000, type:"institutionnel" },
    ],
    budget:{ total:12000, depenses:7500 },
    participants:[
      { nom:"Yassine Amrani",    statut:"confirme",  date:"2025-01-20" },
      { nom:"Salma Benchekroun", statut:"confirme",  date:"2025-01-21" },
      { nom:"Mehdi Tazi",        statut:"en_attente",date:"2025-01-25" },
      { nom:"Fatima Zahra",      statut:"confirme",  date:"2025-01-22" },
      { nom:"Omar Filali",       statut:"annule",    date:"2025-01-23" },
    ],
    ressources:["Micro","Projecteur","PC"],
    image:"🤖",
  },
  {
    id:2,
    titre:"Journée Portes Ouvertes",
    type:"institutionnel",
    date:"2025-02-20",
    heure:"09:00",
    lieu:"Campus UMI",
    statut:"planifie",
    description:"Découvrez les filières et les activités de l'université Moulay Ismail.",
    capacite:500,
    inscrits:0,
    organisateur:"Direction UMI",
    sponsors:[
      { nom:"Région Meknès", montant:10000, type:"institutionnel" },
    ],
    budget:{ total:25000, depenses:8000 },
    participants:[],
    ressources:["Stands","Sono","Projecteurs"],
    image:"🏛️",
  },
  {
    id:3,
    titre:"Hackathon Web 2025",
    type:"club",
    date:"2025-03-01",
    heure:"08:00",
    lieu:"Salle D401",
    statut:"publie",
    description:"48h de coding pour créer des solutions innovantes. Équipes de 3 à 5 personnes.",
    capacite:60,
    inscrits:34,
    organisateur:"Club Programmation",
    sponsors:[
      { nom:"CodeMaroc",  montant:3000, type:"financier" },
      { nom:"TechStartup",montant:2000, type:"materiel" },
    ],
    budget:{ total:8000, depenses:3200 },
    participants:[
      { nom:"Amine Berrada",    statut:"confirme",  date:"2025-01-28" },
      { nom:"Khadija Moussaoui",statut:"confirme",  date:"2025-01-28" },
      { nom:"Tariq Bensouda",   statut:"confirme",  date:"2025-01-29" },
      { nom:"Rim Tazi",         statut:"en_attente",date:"2025-02-01" },
    ],
    ressources:["PC×30","WiFi","Projecteur"],
    image:"💻",
  },
  {
    id:4,
    titre:"Nuit du Théâtre UMI",
    type:"club",
    date:"2025-03-15",
    heure:"19:00",
    lieu:"Amphi B",
    statut:"planifie",
    description:"Soirée théâtrale avec deux pièces préparées par le Club Théâtre.",
    capacite:150,
    inscrits:0,
    organisateur:"Club Théâtre",
    sponsors:[],
    budget:{ total:4000, depenses:1200 },
    participants:[],
    ressources:["Scène","Éclairage","Sono"],
    image:"🎭",
  },
  {
    id:5,
    titre:"Soutenance PFE — Promotion 2025",
    type:"academique",
    date:"2025-03-20",
    heure:"08:30",
    lieu:"Amphi A",
    statut:"publie",
    description:"Soutenances de projets de fin d'études de la promotion 2025.",
    capacite:200,
    inscrits:45,
    organisateur:"Département Informatique",
    sponsors:[],
    budget:{ total:2000, depenses:800 },
    participants:[
      { nom:"Yassine Amrani",    statut:"confirme", date:"2025-02-01" },
      { nom:"Salma Benchekroun", statut:"confirme", date:"2025-02-01" },
      { nom:"Mehdi Tazi",        statut:"confirme", date:"2025-02-02" },
    ],
    ressources:["Projecteur","Micro","Tableau"],
    image:"🎓",
  },
];

/* ── Helpers ─────────────────────────────────────────────────── */
const typeCfg = {
  academique:    { label:"Académique",    color:"#3b82f6", bg:"#eff6ff",  icon:"🎓" },
  institutionnel:{ label:"Institutionnel",color:"#8b5cf6", bg:"#f5f3ff",  icon:"🏛️" },
  club:          { label:"Club",          color:"#f59e0b", bg:"#fffbeb",  icon:"🎭" },
};

const statutCfg = {
  planifie:{ label:"Planifié",  color:"#f59e0b", bg:"#fffbeb", Icon:Clock },
  publie:  { label:"Publié",    color:"#10b981", bg:"#ecfdf5", Icon:CheckCircle },
  termine: { label:"Terminé",   color:"#64748b", bg:"#f1f5f9", Icon:Award },
  annule:  { label:"Annulé",    color:"#ef4444", bg:"#fef2f2", Icon:XCircle },
};

const partStatut = {
  confirme:  { color:"#10b981", bg:"#ecfdf5", label:"Confirmé" },
  en_attente:{ color:"#f59e0b", bg:"#fffbeb", label:"En attente" },
  annule:    { color:"#ef4444", bg:"#fef2f2", label:"Annulé" },
};

const LS = { display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6 };
const IS = { width:"100%", padding:"10px 12px", borderRadius:10,
  border:"1.5px solid #e2e8f0", fontSize:13.5, color:"#0f172a",
  fontFamily:"inherit", outline:"none", background:"#f8fafc", boxSizing:"border-box" };

/* ── Modal ─────────────────────────────────────────────────── */
function Modal({ onClose, title, subtitle, children, maxW=600 }) {
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
          maxHeight:"92vh", overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ padding:"20px 24px 16px", background:R.gradWarm,
          position:"sticky", top:0, zIndex:1,
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
        <div style={{ padding:"22px 24px 28px" }}>{children}</div>
      </motion.div>
    </motion.div>
  );
}

/* ── Event Detail Modal ─────────────────────────────────────── */
function EventDetailModal({ event, onClose, onUpdate, onRegister }) {
  const [activeSection, setActiveSection] = useState("info");
  // Local state so inscription & sponsors update live inside modal
  const [localEvent, setLocalEvent] = useState(event);
  const [showSponsorForm, setShowSponsorForm] = useState(false);
  const [newSponsor, setNewSponsor] = useState({ nom:"", montant:"", type:"financier" });
  const [inscribed, setInscribed] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = (msg, color="#10b981") => {
    setToast({msg,color}); setTimeout(()=>setToast(null),2500);
  };

  const handleInscription = () => {
    if (inscribed) return;
    const updated = {
      ...localEvent,
      inscrits: localEvent.inscrits + 1,
      participants: [...localEvent.participants, {
        nom:"Prof. Dupont", statut:"confirme",
        date: new Date().toISOString().slice(0,10)
      }]
    };
    setLocalEvent(updated);
    setInscribed(true);
    onRegister(localEvent.id);
    notify("✅ Inscription confirmée !");
  };

  const handleAddSponsor = () => {
    if (!newSponsor.nom || !newSponsor.montant) return;
    const sp = { nom:newSponsor.nom, montant:+newSponsor.montant, type:newSponsor.type };
    setLocalEvent(prev=>({ ...prev, sponsors:[...prev.sponsors, sp] }));
    setNewSponsor({ nom:"", montant:"", type:"financier" });
    setShowSponsorForm(false);
    notify("🤝 Sponsor ajouté !");
  };

  const ev = localEvent; // alias
  const tc = typeCfg[ev.type];
  const sc = statutCfg[ev.statut];
  const inscriptionPct = Math.round(((ev?.inscrits||0)/ev.capacite)*100);
  const budgetPct = Math.round(((ev?.budget_depenses || ev?.budget?.depenses || 0)/(ev?.budget_total || ev?.budget?.total || 0))*100);
  const confirmes = (ev.participants||[]).filter(p=>p.statut==="confirme").length;

  const sections = [
    { id:"info",         label:"Infos" },
    { id:"participants", label:`Participants (${(ev.participants||[]).length})` },
    { id:"sponsors",     label:`Sponsors (${(ev.sponsors||[]).length})` },
    { id:"budget",       label:"Budget" },
    { id:"rapport",      label:"Rapport" },
  ];

  const exportParticipants = () => {
    const csv = "Nom,Statut,Date inscription\n" +
      (ev.participants||[]).map(p=>`${p.nom},${p.statut},${p.date}`).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    a.download = `participants_${ev.titre.replace(/ /g,"_")}.csv`;
    a.click();
  };

  return (
    <Modal onClose={onClose} title={event.titre}
      subtitle={`${tc.icon} ${tc.label} · ${ev.date}`} maxW={680}>
      <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              style={{ background:toast.color+"18", border:`1px solid ${toast.color}44`,
                borderRadius:10, padding:"10px 14px",
                fontSize:13.5, fontWeight:600, color:toast.color,
                display:"flex", alignItems:"center", gap:8 }}>
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* event header card */}
        <div style={{ display:"flex", gap:16, alignItems:"flex-start",
          background:"#f8fafc", borderRadius:14, padding:"16px 18px" }}>
          <div style={{ fontSize:44, lineHeight:1, flexShrink:0 }}>{ev.image}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap", marginBottom:8 }}>
              <span style={{ background:tc.bg, color:tc.color, fontSize:12,
                fontWeight:700, borderRadius:20, padding:"3px 10px" }}>{tc.icon} {tc.label}</span>
              <span style={{ background:sc.bg, color:sc.color, fontSize:12,
                fontWeight:700, borderRadius:20, padding:"3px 10px",
                display:"flex", alignItems:"center", gap:4 }}>
                <sc.Icon size={10}/>{sc.label}
              </span>
            </div>
            <div style={{ display:"flex", gap:14, flexWrap:"wrap", fontSize:12.5, color:"#64748b" }}>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <Calendar size={13}/>{ev.date} à {ev.heure}
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <MapPin size={13}/>{ev.lieu}
              </span>
              <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                <Users size={13}/>{(ev?.inscrits||0)}/{ev.capacite} inscrits
              </span>
            </div>
          </div>
          {event.statut==="planifie" && (
            <button onClick={()=>{ onUpdate(ev.id,"publie"); onClose(); }}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                borderRadius:10, border:"none",
                background:"linear-gradient(135deg,#10b981,#059669)", color:"white",
                fontSize:12.5, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                flexShrink:0, boxShadow:"0 2px 10px rgba(16,185,129,0.3)" }}>
              <Send size={13}/> Publier
            </button>
          )}
        </div>

        {/* inscription progress */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between",
            fontSize:12.5, fontWeight:600, color:"#0f172a", marginBottom:6 }}>
            <span>Taux d'inscription</span>
            <span style={{ color:inscriptionPct>80?R.primary:inscriptionPct>50?"#f59e0b":"#10b981" }}>
              {event.inscrits}/{event.capacite} places ({inscriptionPct}%)
            </span>
          </div>
          <div style={{ height:10, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
            <motion.div initial={{width:0}}
              animate={{width:`${inscriptionPct}%`}}
              transition={{duration:0.8}}
              style={{ height:"100%", borderRadius:99,
                background:inscriptionPct>80?R.grad:inscriptionPct>50?"linear-gradient(135deg,#f59e0b,#d97706)":"linear-gradient(135deg,#10b981,#059669)" }}/>
          </div>
        </div>

        {/* section tabs */}
        <div style={{ display:"flex", gap:4, borderBottom:"1px solid #e2e8f0" }}>
          {sections.map(sec=>(
            <button key={sec.id} onClick={()=>setActiveSection(sec.id)}
              style={{ padding:"8px 13px", border:"none", cursor:"pointer",
                background:"transparent", fontFamily:"inherit",
                color:activeSection===sec.id?R.primary:"#64748b",
                fontSize:12.5, fontWeight:activeSection===sec.id?700:500,
                borderBottom:activeSection===sec.id?`2px solid ${R.primary}`:"2px solid transparent",
                marginBottom:-1, transition:"all .15s" }}>
              {sec.label}
            </button>
          ))}
        </div>

        {/* INFO */}
        {activeSection==="info" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ background:R.lighter, border:`1px solid ${R.border}`,
              borderRadius:12, padding:"13px 16px" }}>
              <div style={{ fontSize:11.5, fontWeight:700, color:R.dark, marginBottom:6 }}>
                📋 Description
              </div>
              <p style={{ fontSize:13.5, color:"#374151", margin:0, lineHeight:1.6 }}>{ev.description}</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              <div style={{ background:"#f8fafc", borderRadius:11, padding:"12px 14px",
                border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:4 }}>ORGANISATEUR</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:"#0f172a" }}>{ev.organisateur}</div>
              </div>
              <div style={{ background:"#f8fafc", borderRadius:11, padding:"12px 14px",
                border:"1px solid #e2e8f0" }}>
                <div style={{ fontSize:11, color:"#94a3b8", fontWeight:600, marginBottom:4 }}>RESSOURCES</div>
                <div style={{ fontSize:12.5, fontWeight:600, color:"#0f172a" }}>
                  {(ev.ressources||[]).join(", ")}
                </div>
              </div>
            </div>
            <button onClick={handleInscription}
              style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
                background: inscribed ? "#ecfdf5" : R.gradWarm,
                color: inscribed ? "#10b981" : "white",
                fontSize:14, fontWeight:700,
                cursor: inscribed ? "default" : "pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow: inscribed ? "none" : `0 4px 16px ${R.primary}40`,
                border: inscribed ? "1.5px solid #a7f3d0" : "none",
                transition:"all .3s" }}>
              {inscribed
                ? <><CheckCircle size={16}/> Inscrit avec succès</>
                : <><UserCheck size={16}/> S'inscrire à cet événement</>}
            </button>
          </div>
        )}

        {/* PARTICIPANTS */}
        {activeSection==="participants" && (
          <div>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:12 }}>
              <div style={{ display:"flex", gap:8 }}>
                {Object.entries(partStatut).map(([k,v])=>{
                  const cnt = (event.participants||[]).filter(p=>p.statut===k).length;
                  return (
                    <span key={k} style={{ background:v.bg, color:v.color,
                      fontSize:11.5, fontWeight:700, borderRadius:20, padding:"3px 10px" }}>
                      {v.label}: {cnt}
                    </span>
                  );
                })}
              </div>
              <button onClick={exportParticipants}
                style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 12px",
                  borderRadius:9, border:`1px solid ${R.border}`, background:R.lighter,
                  color:R.primary, fontSize:12, fontWeight:700,
                  cursor:"pointer", fontFamily:"inherit" }}>
                <Download size={13}/> Exporter CSV
              </button>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {(ev.participants||[]).map((p,i)=>{
                const ps = partStatut[p.statut];
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12,
                    background:"#f8fafc", borderRadius:11, padding:"11px 14px",
                    border:"1px solid #e2e8f0" }}>
                    <div style={{ width:34, height:34, borderRadius:10,
                      background:R.gradWarm, display:"flex", alignItems:"center",
                      justifyContent:"center", color:"white", fontSize:13,
                      fontWeight:800, flexShrink:0 }}>{p.nom[0]}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:"#0f172a" }}>{p.nom}</div>
                      <div style={{ fontSize:11.5, color:"#94a3b8" }}>Inscrit le {p.date}</div>
                    </div>
                    <span style={{ background:ps.bg, color:ps.color,
                      fontSize:11.5, fontWeight:700, borderRadius:20,
                      padding:"3px 10px" }}>{ps.label}</span>
                  </div>
                );
              })}
              {(ev.participants||[]).length===0 && (
                <div style={{ textAlign:"center", padding:"32px", color:"#94a3b8" }}>
                  <Users size={32} style={{ margin:"0 auto 10px", opacity:0.3 }}/>
                  <div style={{ fontSize:14, fontWeight:600 }}>Aucune inscription</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SPONSORS */}
        {activeSection==="sponsors" && (
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {(ev.sponsors||[]).map((sp,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:14,
                background:"#f8fafc", borderRadius:12, padding:"14px 18px",
                border:"1px solid #e2e8f0" }}>
                <div style={{ width:44, height:44, borderRadius:12,
                  background:"linear-gradient(135deg,#667eea,#764ba2)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"white", fontSize:18, flexShrink:0 }}>🤝</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>{sp.nom}</div>
                  <span style={{ background:"#eff6ff", color:"#3b82f6",
                    fontSize:11.5, fontWeight:700, borderRadius:20, padding:"2px 9px" }}>
                    {sp.type==="financier"?"💰 Financier":sp.type==="materiel"?"🔧 Matériel":"🏛️ Institutionnel"}
                  </span>
                </div>
                <div style={{ fontSize:18, fontWeight:800, color:"#10b981" }}>
                  {sp.montant?.toLocaleString()} MAD
                </div>
              </div>
            ))}
            {(ev.sponsors||[]).length===0 && (
              <div style={{ textAlign:"center", padding:"32px", color:"#94a3b8" }}>
                <span style={{ fontSize:40, display:"block", marginBottom:10 }}>🤝</span>
                <div style={{ fontSize:14, fontWeight:600 }}>Aucun sponsor pour cet événement</div>
              </div>
            )}
            <AnimatePresence>
              {showSponsorForm && (
                <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
                  exit={{opacity:0,y:-8}}
                  style={{ background:"#f8fafc", border:"1px solid #e2e8f0",
                    borderRadius:12, padding:"14px 16px",
                    display:"flex", flexDirection:"column", gap:10 }}>
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8 }}>
                    <input value={newSponsor.nom} onChange={e=>setNewSponsor(p=>({...p,nom:e.target.value}))}
                      placeholder="Nom du sponsor"
                      style={{ padding:"9px 11px", borderRadius:9, border:"1.5px solid #e2e8f0",
                        fontSize:13, fontFamily:"inherit", outline:"none", background:"white" }}/>
                    <input type="number" value={newSponsor.montant}
                      onChange={e=>setNewSponsor(p=>({...p,montant:e.target.value}))}
                      placeholder="Montant"
                      style={{ padding:"9px 11px", borderRadius:9, border:"1.5px solid #e2e8f0",
                        fontSize:13, fontFamily:"inherit", outline:"none", background:"white" }}/>
                    <select value={newSponsor.type}
                      onChange={e=>setNewSponsor(p=>({...p,type:e.target.value}))}
                      style={{ padding:"9px 11px", borderRadius:9, border:"1.5px solid #e2e8f0",
                        fontSize:13, fontFamily:"inherit", outline:"none", background:"white" }}>
                      <option value="financier">💰 Financier</option>
                      <option value="materiel">🔧 Matériel</option>
                      <option value="institutionnel">🏛️ Institut.</option>
                    </select>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={handleAddSponsor}
                      style={{ flex:2, padding:"9px", borderRadius:9, border:"none",
                        background:R.gradWarm, color:"white", fontSize:13, fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit" }}>
                      ✓ Confirmer
                    </button>
                    <button onClick={()=>setShowSponsorForm(false)}
                      style={{ flex:1, padding:"9px", borderRadius:9,
                        border:"1px solid #e2e8f0", background:"white",
                        color:"#64748b", fontSize:13, fontWeight:600,
                        cursor:"pointer", fontFamily:"inherit" }}>
                      Annuler
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button onClick={()=>setShowSponsorForm(s=>!s)}
              style={{ padding:"12px", borderRadius:12, border:"none",
                background: showSponsorForm ? "#f1f5f9" : R.gradWarm,
                color: showSponsorForm ? "#64748b" : "white",
                fontSize:14, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <Plus size={16}/> {showSponsorForm ? "Fermer le formulaire" : "Ajouter un sponsor"}
            </button>
          </div>
        )}

        {/* BUDGET */}
        {activeSection==="budget" && (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10 }}>
              {[
                { label:"Budget total",   value:`${(ev?.budget_total || ev?.budget?.total || 0)?.toLocaleString()} MAD`,    color:"#3b82f6" },
                { label:"Dépenses",       value:`${(ev?.budget_depenses || ev?.budget?.depenses || 0)?.toLocaleString()} MAD`, color:R.primary },
                { label:"Disponible",     value:`${((ev?.budget_total || ev?.budget?.total || 0)-(ev?.budget_depenses || ev?.budget?.depenses || 0))?.toLocaleString()} MAD`, color:"#10b981" },
              ].map(b=>(
                <div key={b.label} style={{ background:b.color+"0d",
                  border:`1px solid ${b.color}22`, borderRadius:12, padding:"14px 16px",
                  textAlign:"center" }}>
                  <div style={{ fontSize:18, fontWeight:800, color:b.color }}>{b.value}</div>
                  <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>{b.label}</div>
                </div>
              ))}
            </div>
            <div>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6,
                fontSize:12.5, fontWeight:600 }}>
                <span>Utilisation du budget</span>
                <span style={{ color:budgetPct>80?R.primary:"#10b981" }}>{budgetPct}%</span>
              </div>
              <div style={{ height:10, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                <motion.div initial={{width:0}} animate={{width:`${budgetPct}%`}}
                  transition={{duration:0.8}}
                  style={{ height:"100%", borderRadius:99,
                    background:budgetPct>80?R.grad:"linear-gradient(135deg,#10b981,#059669)" }}/>
              </div>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              {(ev.sponsors||[]).map(sp=>(
                <div key={sp.nom} style={{ flex:1, background:"#ecfdf5",
                  border:"1px solid #a7f3d0", borderRadius:11, padding:"11px 14px",
                  textAlign:"center" }}>
                  <div style={{ fontSize:14, fontWeight:800, color:"#10b981" }}>
                    +{sp.montant?.toLocaleString()}
                  </div>
                  <div style={{ fontSize:11, color:"#64748b", marginTop:2 }}>{sp.nom}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RAPPORT */}
        {activeSection==="rapport" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:10 }}>
              {[
                { label:"Inscrits total",    value:event.inscrits, icon:"👥", color:"#3b82f6" },
                { label:"Confirmés",         value:confirmes,       icon:"✅", color:"#10b981" },
                { label:"Taux remplissage",  value:`${inscriptionPct}%`, icon:"📊", color:R.primary },
                { label:"Budget consommé",   value:`${budgetPct}%`, icon:"💰", color:"#f59e0b" },
              ].map(r=>(
                <div key={r.label} style={{ background:r.color+"0d",
                  border:`1px solid ${r.color}22`, borderRadius:12, padding:"14px 16px" }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{r.icon}</div>
                  <div style={{ fontSize:22, fontWeight:800, color:r.color }}>{r.value}</div>
                  <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{r.label}</div>
                </div>
              ))}
            </div>
            <button onClick={exportParticipants}
              style={{ padding:"13px", borderRadius:12, border:"none",
                background:R.gradWarm, color:"white", fontSize:14, fontWeight:700,
                cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:`0 4px 16px ${R.primary}40` }}>
              <Download size={16}/> Exporter le rapport complet (CSV)
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ── Create Event Modal ─────────────────────────────────────── */
function CreateEventModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    titre:"", type:"academique", date:"", heure:"",
    lieu:SALLES[0], description:"", capacite:50,
    organisateur:"Prof. Ahmed Benali",
    budgetTotal:0,
    sponsorNom:"", sponsorMontant:"", sponsorType:"financier",
    ressources:"",
  });
  const [sponsors, setSponsors] = useState([]);
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));

  const addSponsor = () => {
    if(!form.sponsorNom||!form.sponsorMontant) return;
    setSponsors(p=>[...p, { nom:form.sponsorNom, montant:+form.sponsorMontant, type:form.sponsorType }]);
    s("sponsorNom",""); s("sponsorMontant","");
  };

  const valid = form.titre && form.date && form.heure && form.description;

  return (
    <Modal onClose={onClose} title="Créer un événement"
      subtitle="Planning, ressources et sponsors" maxW={580}>
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

        <div>
          <label style={LS}>Titre de l'événement *</label>
          <input value={form.titre} onChange={e=>s("titre",e.target.value)}
            placeholder="ex: Conférence IA & Société" style={IS}/>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Type *</label>
            <select value={form.type} onChange={e=>s("type",e.target.value)} style={IS}>
              <option value="academique">🎓 Académique</option>
              <option value="institutionnel">🏛️ Institutionnel</option>
              <option value="club">🎭 Club</option>
            </select>
          </div>
          <div>
            <label style={LS}>Organisateur</label>
            <input value={form.organisateur} onChange={e=>s("organisateur",e.target.value)}
              placeholder="Département, Club…" style={IS}/>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Date *</label>
            <input type="date" value={form.date} onChange={e=>s("date",e.target.value)} style={IS}/>
          </div>
          <div>
            <label style={LS}>Heure *</label>
            <input type="time" value={form.heure} onChange={e=>s("heure",e.target.value)} style={IS}/>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Lieu (réservation de salle)</label>
            <select value={form.lieu} onChange={e=>s("lieu",e.target.value)} style={IS}>
              {SALLES.map(sl=><option key={sl}>{sl}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Capacité max.</label>
            <input type="number" value={form.capacite} onChange={e=>s("capacite",+e.target.value)}
              min={1} style={IS}/>
          </div>
        </div>

        <div>
          <label style={LS}>Description *</label>
          <textarea value={form.description} onChange={e=>s("description",e.target.value)}
            placeholder="Décrivez l'événement…" rows={3}
            style={{...IS, resize:"none"}}/>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Budget total (MAD)</label>
            <input type="number" value={form.budgetTotal} onChange={e=>s("budgetTotal",+e.target.value)}
              min={0} style={IS}/>
          </div>
          <div>
            <label style={LS}>Ressources nécessaires</label>
            <input value={form.ressources} onChange={e=>s("ressources",e.target.value)}
              placeholder="Projecteur, Micro…" style={IS}/>
          </div>
        </div>

        {/* Sponsors */}
        <div>
          <label style={LS}>Sponsors / Partenaires</label>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr auto", gap:8 }}>
            <input value={form.sponsorNom} onChange={e=>s("sponsorNom",e.target.value)}
              placeholder="Nom du sponsor" style={{...IS, margin:0}}/>
            <input type="number" value={form.sponsorMontant}
              onChange={e=>s("sponsorMontant",e.target.value)}
              placeholder="Montant" style={{...IS, margin:0}}/>
            <select value={form.sponsorType} onChange={e=>s("sponsorType",e.target.value)}
              style={{...IS, margin:0}}>
              <option value="financier">💰 Financier</option>
              <option value="materiel">🔧 Matériel</option>
              <option value="institutionnel">🏛️ Institut.</option>
            </select>
            <button onClick={addSponsor}
              style={{ padding:"0 14px", borderRadius:10, border:"none",
                background:R.gradWarm, color:"white", fontSize:14,
                fontWeight:700, cursor:"pointer" }}>+</button>
          </div>
          {sponsors.length>0 && (
            <div style={{ marginTop:10, display:"flex", flexDirection:"column", gap:6 }}>
              {sponsors.map((sp,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:10,
                  background:"#f8fafc", borderRadius:9, padding:"8px 12px",
                  border:"1px solid #e2e8f0" }}>
                  <span style={{ flex:1, fontSize:13, fontWeight:600, color:"#0f172a" }}>
                    🤝 {sp.nom}
                  </span>
                  <span style={{ fontSize:13, color:"#10b981", fontWeight:700 }}>
                    {sp.montant?.toLocaleString()} MAD
                  </span>
                  <button onClick={()=>setSponsors(p=>p.filter((_,j)=>j!==i))}
                    style={{ background:"none", border:"none", cursor:"pointer", color:"#94a3b8" }}>
                    <X size={14}/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <motion.button
          onClick={()=>{ if(!valid) return;
            onSave({
              ...form, id:Date.now(), statut:"planifie",
              inscrits:0, participants:[],
              sponsors, image: typeCfg[form.type].icon,
              budget:{ total:form.budgetTotal, depenses:0 },
              ressources:(form?.ressources||"").split(",").map(r=>r.trim()).filter(Boolean),
            });
            onClose();
          }}
          disabled={!valid}
          whileHover={{scale:valid?1.01:1}} whileTap={{scale:valid?0.98:1}}
          style={{ padding:"13px", borderRadius:12, border:"none",
            background:valid?R.gradWarm:"#e2e8f0",
            color:valid?"white":"#94a3b8",
            fontSize:14.5, fontWeight:700, cursor:valid?"pointer":"not-allowed",
            fontFamily:"inherit", marginTop:4,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:valid?`0 6px 20px ${R.primary}40`:"none" }}>
          <Calendar size={17}/> Créer l'événement
        </motion.button>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function EvenementsPage() {
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
  const [events, setEvents]     = useState(INIT_EVENTS);
  const [search, setSearch]     = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStat, setFilterStat] = useState("all");
  const [activeTab, setActiveTab] = useState("liste");
  const [detailEvent, setDetailEvent] = useState(null);
  const [showCreate, setShowCreate]   = useState(null);

  // Données mock uniquement
  // useEffect API désactivé temporairement

  const addEvent = (e) => {
    setEvents(p=>[e,...p]);
    evAPI.create(e).catch(()=>{});
  };
  const updateStatut = (id, statut) => {
    setEvents(p=>p.map(e=>e.id===id?{...e,statut}:e));
    if (statut==="publie")  evAPI.publier(id).catch(()=>{});
    if (statut==="annule")  evAPI.annuler(id).catch(()=>{});
  };
  const registerToEvent = (id) => {
    const ev = (events||[]).find(e=>e.id===id);
    if (!ev || ev.inscrit || (ev?.inscrits||0) >= ev.capacite) return;
    setEvents(p=>p.map(e=>e.id===id?{...e,
      inscrit: true,
      inscrits: ((e?.inscrits||0)||0)+1,
      participants: [...(e.participants||[]), {
        nom: _u.prenom ? `${_u.prenom} ${_u.nom}` : "Utilisateur",
        statut:"confirme",
        date:new Date().toISOString().slice(0,10)
      }]
    }:e));
    evAPI.inscrire(id).catch(()=>{});
  };

  const safeEvents = (events||[]).filter(e=>e && typeof e === 'object');
  const stats = {
    total:   safeEvents.length,
    publies: safeEvents.filter(e=>e.statut==="publie").length,
    inscrits:safeEvents.reduce((a,e)=>a+(e.inscrits||0),0),
    budget:  safeEvents.reduce((a,e)=>a+(e.budget?.total||e.budget_total||0),0),
  };

  const filtered = safeEvents.filter(e=>
    ((e.titre||"").toLowerCase().includes(search.toLowerCase())||
     (e.organisateur||"").toLowerCase().includes(search.toLowerCase()))
    && (filterType==="all" || e.type===filterType)
    && (filterStat==="all" || e.statut===filterStat)
  );

  const upcomingEvents = [...safeEvents]
    .filter(e=>e.statut!=="termine"&&e.statut!=="annule")
    .sort((a,b)=>(a.date||'').localeCompare(b.date||''))
    .slice(0,3);

  const TABS = [
    { id:"liste",    label:"Liste",      icon:Layers },
    { id:"planning", label:"Planning",   icon:Calendar },
    { id:"stats",    label:"Statistiques",icon:BarChart2 },
  ];

  return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(160deg,#fff5f5 0%,#fef2f2 40%,#fff5f5 100%)",
      fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* NAVBAR */}
      <motion.nav initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
        style={{ height:62, background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(18px)", borderBottom:`1px solid ${R.border}55`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", position:"sticky", top:0, zIndex:100,
          boxShadow:`0 2px 20px ${R.primary}10` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <motion.button onClick={()=>navigate("/teacher")}
            whileHover={{scale:1.04,x:-2}} whileTap={{scale:0.96}}
            style={{ display:"flex", alignItems:"center", gap:7,
              background:R.lighter, border:`1px solid ${R.border}`,
              borderRadius:10, padding:"7px 13px", cursor:"pointer",
              color:R.primary, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
            <ArrowLeft size={15}/> Retour
          </motion.button>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Accueil</span>
            <ChevronRight size={13} color="#cbd5e1"/>
            <span style={{ fontSize:13, fontWeight:700, color:R.primary }}>Événements</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", background:"#f1f5f9",
            borderRadius:10, padding:"0 13px", gap:7, width:220 }}>
            <Search size={14} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Titre, organisateur…"
              style={{ border:"none", outline:"none", background:"transparent",
                fontSize:13, color:"#0f172a", padding:"9px 0",
                fontFamily:"inherit", width:"100%" }}/>
          </div>
          <motion.button onClick={()=>setShowCreate(true)}
            whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
              borderRadius:10, border:"none", background:R.gradWarm, color:"white",
              fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 2px 12px ${R.primary}40` }}>
            <Plus size={14}/> Créer un événement
          </motion.button>
                    <div style={{ position:"relative" }}>
            <button onClick={()=>setNotifOpen(o=>!o)}
              style={{ width:36,height:36,borderRadius:10,
                background:notifOpen?"#f5f3ff":"#f1f5f9",
                border:notifOpen?"1px solid #ddd6fe":"none",
                cursor:"pointer",display:"flex",alignItems:"center",
                justifyContent:"center",position:"relative",transition:"all .2s" }}>
              <Bell size={16} color={notifOpen?"#9333ea":"#64748b"}/>
            </button>
            {notifOpen&&<NotifPanel onClose={()=>setNotifOpen(false)}/>}
          </div>
          <div style={{ position:"relative" }}>
            <div onClick={()=>setProfileOpen(o=>!o)}
              style={{ display:"flex",alignItems:"center",gap:8,
                background:"#fef2f2",border:"1.5px solid #fecaca",
                borderRadius:10,padding:"5px 12px 5px 6px",cursor:"pointer" }}>
              <div style={{ width:28,height:28,borderRadius:8,
                background:"linear-gradient(135deg,#ef4444,#ef4444cc)",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"white",fontSize:13,fontWeight:800 }}>{_initials}</div>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:"#0f172a",lineHeight:1 }}>{_isProf?"Prof. ":""}{_displayName}</div>
                <div style={{ fontSize:10.5,color:"#ef4444",fontWeight:600,marginTop:1 }}>{_roleLabel}</div>
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
          style={{ borderRadius:20, background:R.gradWarm, padding:"26px 34px",
            marginBottom:26, display:"flex", alignItems:"center",
            justifyContent:"space-between", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160,
            borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7,
              background:"rgba(255,255,255,0.18)", borderRadius:20, padding:"4px 13px", marginBottom:10 }}>
              <span style={{ fontSize:16 }}>🎉</span>
              <span style={{ fontSize:12, color:"white", fontWeight:600 }}>Événements Universitaires</span>
            </div>
            <h1 style={{ fontSize:24, fontWeight:800, color:"white",
              letterSpacing:"-0.4px", margin:"0 0 5px" }}>
              Agenda & Événements UMI
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:0 }}>
              Conférences, hackathons, journées culturelles et soutenances
            </p>
          </div>
          <div style={{ display:"flex", gap:10, position:"relative", zIndex:1 }}>
            {[
              { v:stats.total,   l:"Événements", icon:"🎉" },
              { v:stats.publies, l:"Publiés",    icon:"✅" },
              { v:stats.inscrits,l:"Inscrits",   icon:"👥" },
              { v:`${(stats.budget/1000).toFixed(0)}k`, l:"Budget MAD", icon:"💰" },
            ].map(s=>(
              <div key={s.l} style={{ background:"rgba(255,255,255,0.15)",
                backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.25)",
                borderRadius:13, padding:"11px 16px",
                display:"flex", flexDirection:"column", alignItems:"center", minWidth:78 }}>
                <span style={{ fontSize:18, marginBottom:4 }}>{s.icon}</span>
                <div style={{ fontSize:20, fontWeight:800, color:"white", lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, borderBottom:`2px solid ${R.light}`, marginBottom:20 }}>
          {TABS.map(t=>{
            const Icon=t.icon;
            const active=activeTab===t.id;
            return (
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{ display:"flex", alignItems:"center", gap:7,
                  padding:"10px 18px", borderRadius:"10px 10px 0 0",
                  border:"none", cursor:"pointer",
                  background:active?"white":"transparent",
                  color:active?R.primary:"#64748b",
                  fontSize:13.5, fontWeight:active?700:500, fontFamily:"inherit",
                  borderBottom:active?`2px solid ${R.primary}`:"2px solid transparent",
                  marginBottom:-2,
                  boxShadow:active?`0 -2px 12px ${R.primary}12`:"none",
                  transition:"all .2s" }}>
                <Icon size={15}/>{t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ── LISTE ── */}
          {activeTab==="liste" && (
            <motion.div key="liste"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              {/* filters */}
              <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
                {[{v:"all",l:"Tous"},{v:"academique",l:"🎓 Académique"},
                  {v:"institutionnel",l:"🏛️ Institutionnel"},{v:"club",l:"🎭 Club"}].map(f=>(
                  <button key={f.v} onClick={()=>setFilterType(f.v)}
                    style={{ padding:"7px 14px", borderRadius:20, border:"none",
                      background:filterType===f.v?R.gradWarm:"white",
                      color:filterType===f.v?"white":"#64748b",
                      fontSize:12.5, fontWeight:filterType===f.v?700:500,
                      cursor:"pointer", fontFamily:"inherit",
                      boxShadow:filterType===f.v?`0 2px 8px ${R.primary}40`:"0 1px 3px rgba(0,0,0,0.06)" }}>
                    {f.l}
                  </button>
                ))}
                <div style={{ flex:1 }}/>
                {["all","planifie","publie","termine"].map(f=>(
                  <button key={f} onClick={()=>setFilterStat(f)}
                    style={{ padding:"7px 12px", borderRadius:20,
                      border:`1.5px solid ${filterStat===f?R.primary+"55":"#e2e8f0"}`,
                      background:filterStat===f?R.lighter:"white",
                      color:filterStat===f?R.primary:"#64748b",
                      fontSize:12, fontWeight:filterStat===f?700:500,
                      cursor:"pointer", fontFamily:"inherit" }}>
                    {f==="all"?"Tous statuts":f==="planifie"?"Planifiés":f==="publie"?"Publiés":"Terminés"}
                  </button>
                ))}
              </div>

              <div style={{ display:"grid",
                gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:18 }}>
                {filtered.map((ev,i)=>{
                  const tc = typeCfg[ev.type];
                  const sc = statutCfg[ev.statut];
                  const pct = Math.round(((ev?.inscrits||0)/ev.capacite)*100);
                  return (
                    <motion.div key={ev.id}
                      initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                      transition={{delay:i*0.06}}
                      whileHover={{y:-5,boxShadow:`0 16px 40px ${R.primary}14`}}
                      onClick={()=>setDetailEvent(ev)}
                      style={{ background:"white", borderRadius:18,
                        border:"1px solid #e2e8f0", overflow:"hidden",
                        cursor:"pointer", boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                        transition:"all .2s" }}>
                      {/* top gradient bar */}
                      <div style={{ height:5, background:R.gradWarm }}/>
                      <div style={{ padding:"20px 22px" }}>
                        {/* header */}
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"flex-start", marginBottom:12 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                            <div style={{ width:52, height:52, borderRadius:14,
                              background:R.lighter, border:`1.5px solid ${R.border}`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:26, flexShrink:0 }}>{ev.image}</div>
                            <div>
                              <div style={{ fontSize:14.5, fontWeight:800, color:"#0f172a",
                                lineHeight:1.2, marginBottom:5 }}>{ev.titre}</div>
                              <div style={{ display:"flex", gap:6 }}>
                                <span style={{ background:tc.bg, color:tc.color,
                                  fontSize:11, fontWeight:700, borderRadius:20,
                                  padding:"2px 8px" }}>{tc.icon} {tc.label}</span>
                                <span style={{ background:sc.bg, color:sc.color,
                                  fontSize:11, fontWeight:700, borderRadius:20,
                                  padding:"2px 8px", display:"flex", alignItems:"center", gap:3 }}>
                                  <sc.Icon size={9}/>{sc.label}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* info */}
                        <div style={{ display:"flex", flexDirection:"column", gap:5, marginBottom:14 }}>
                          <div style={{ fontSize:12.5, color:"#64748b",
                            display:"flex", alignItems:"center", gap:6 }}>
                            <Calendar size={13} color={R.primary}/>
                            {ev.date} à {ev.heure}
                          </div>
                          <div style={{ fontSize:12.5, color:"#64748b",
                            display:"flex", alignItems:"center", gap:6 }}>
                            <MapPin size={13} color={R.primary}/>{ev.lieu}
                          </div>
                          <div style={{ fontSize:12.5, color:"#64748b",
                            display:"flex", alignItems:"center", gap:6 }}>
                            <Users size={13} color={R.primary}/>
                            {(ev?.inscrits||0)}/{ev.capacite} inscrits
                          </div>
                        </div>

                        {/* inscription bar */}
                        <div style={{ marginBottom:14 }}>
                          <div style={{ height:6, background:"#e2e8f0",
                            borderRadius:99, overflow:"hidden" }}>
                            <div style={{ width:`${pct}%`, height:"100%",
                              background:pct>80?R.grad:R.gradWarm,
                              borderRadius:99, transition:"width .5s" }}/>
                          </div>
                        </div>

                        {/* sponsors + budget */}
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center" }}>
                          <div style={{ display:"flex", gap:6 }}>
                            {(ev?.sponsors||[]).slice(0,2).map(sp=>(
                              <span key={sp.nom} style={{ background:"#ecfdf5",
                                color:"#10b981", fontSize:11, fontWeight:700,
                                borderRadius:20, padding:"2px 8px" }}>
                                🤝 {sp.nom}
                              </span>
                            ))}
                            {(ev.sponsors||[]).length>2 && (
                              <span style={{ fontSize:11, color:"#94a3b8" }}>
                                +{(ev.sponsors||[]).length-2}
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize:12, fontWeight:700, color:"#10b981" }}>
                            💰 {(ev?.budget_total || ev?.budget?.total || 0)?.toLocaleString()} MAD
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── PLANNING ── */}
          {activeTab==="planning" && (
            <motion.div key="planning"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {/* month header */}
                <div style={{ background:R.gradWarm, borderRadius:14,
                  padding:"16px 22px", marginBottom:16,
                  display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:16, fontWeight:800, color:"white" }}>
                    Février — Mars 2025
                  </span>
                  <div style={{ display:"flex", gap:8 }}>
                    {[...new Set((events||[]).filter(e=>e.statut!=="annule").map(e=>e.type))].map(t=>(
                      <span key={t} style={{ background:"rgba(255,255,255,0.2)",
                        color:"white", fontSize:11.5, fontWeight:700,
                        borderRadius:20, padding:"3px 10px" }}>
                        {typeCfg[t].icon} {typeCfg[t].label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* timeline */}
                {[...events]
                  .sort((a,b)=>(a.date||'').localeCompare(b.date||''))
                  .map((ev,i)=>{
                  const tc = typeCfg[ev.type];
                  const sc = statutCfg[ev.statut];
                  return (
                    <motion.div key={ev.id}
                      initial={{opacity:0,x:-12}} animate={{opacity:1,x:0}}
                      transition={{delay:i*0.07}}
                      whileHover={{x:6}}
                      onClick={()=>setDetailEvent(ev)}
                      style={{ display:"flex", gap:0, cursor:"pointer" }}>
                      {/* date column */}
                      <div style={{ width:90, flexShrink:0, padding:"0 16px 0 0",
                        textAlign:"right" }}>
                        <div style={{ fontSize:22, fontWeight:800, color:R.primary,
                          lineHeight:1 }}>{ev.date.slice(8)}</div>
                        <div style={{ fontSize:11, color:"#94a3b8", marginTop:2 }}>
                          {["jan","fév","mar","avr","mai","jun","jul","aoû","sep","oct","nov","déc"][+ev.date.slice(5,7)-1]}
                        </div>
                      </div>
                      {/* line */}
                      <div style={{ width:2, background:i===0?"transparent":"#f1f5f9",
                        marginRight:16, flexShrink:0, position:"relative" }}>
                        <div style={{ position:"absolute", top:8, left:-5,
                          width:12, height:12, borderRadius:"50%",
                          background:R.gradWarm,
                          border:"2px solid white",
                          boxShadow:`0 0 0 3px ${R.light}` }}/>
                      </div>
                      {/* card */}
                      <div style={{ flex:1, background:"white", borderRadius:14,
                        border:"1px solid #e2e8f0", padding:"14px 18px",
                        marginBottom:10, boxShadow:"0 1px 6px rgba(0,0,0,0.04)" }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center", marginBottom:6 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <span style={{ fontSize:22 }}>{ev.image}</span>
                            <div>
                              <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>
                                {ev.titre}
                              </div>
                              <div style={{ fontSize:12, color:"#64748b" }}>
                                ⏰ {ev.heure} · 📍 {ev.lieu}
                              </div>
                            </div>
                          </div>
                          <div style={{ display:"flex", gap:6 }}>
                            <span style={{ background:tc.bg, color:tc.color,
                              fontSize:11, fontWeight:700, borderRadius:20, padding:"2px 9px" }}>
                              {tc.icon}
                            </span>
                            <span style={{ background:sc.bg, color:sc.color,
                              fontSize:11, fontWeight:700, borderRadius:20, padding:"2px 9px",
                              display:"flex", alignItems:"center", gap:3 }}>
                              <sc.Icon size={9}/>{sc.label}
                            </span>
                          </div>
                        </div>
                        <div style={{ display:"flex", gap:12,
                          fontSize:12, color:"#94a3b8" }}>
                          <span>👥 {(ev?.inscrits||0)} inscrits</span>
                          <span>🏛️ {ev.organisateur}</span>
                          {(ev.sponsors||[]).length>0&&<span>🤝 {(ev.sponsors||[]).length} sponsor(s)</span>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── STATISTIQUES ── */}
          {activeTab==="stats" && (
            <motion.div key="stats"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              {/* KPIs */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                {[
                  { label:"Total événements",  value:stats.total,   icon:Calendar, color:R.primary },
                  { label:"Publiés",           value:stats.publies, icon:CheckCircle,color:"#10b981" },
                  { label:"Total inscrits",    value:stats.inscrits,icon:Users,    color:"#3b82f6" },
                  { label:"Budget total (MAD)",value:`${(stats.budget/1000).toFixed(1)}k`,icon:DollarSign,color:"#f59e0b" },
                ].map(s=>(
                  <motion.div key={s.label} whileHover={{y:-3}}
                    style={{ background:"white", borderRadius:16, padding:"20px",
                      border:`1px solid ${s.color}18`,
                      boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                      display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:13,
                      background:s.color+"18",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0 }}>
                      <s.icon size={22} color={s.color} strokeWidth={2}/>
                    </div>
                    <div>
                      <div style={{ fontSize:26, fontWeight:800, color:"#0f172a", lineHeight:1 }}>{s.value}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {/* répartition type */}
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Répartition par type
                  </div>
                  {Object.entries(typeCfg).map(([k,tc])=>{
                    const cnt = (events||[]).filter(e=>e.type===k).length;
                    const pct = Math.round((cnt/(events||[]).length)*100);
                    return (
                      <div key={k} style={{ marginBottom:12 }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          fontSize:13, marginBottom:5 }}>
                          <span style={{ fontWeight:600, color:"#0f172a" }}>
                            {tc.icon} {tc.label}
                          </span>
                          <span style={{ color:tc.color, fontWeight:700 }}>{cnt} ({pct}%)</span>
                        </div>
                        <div style={{ height:8, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{duration:0.8}}
                            style={{ height:"100%", background:tc.color, borderRadius:99 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* top events */}
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Top événements (inscrits)
                  </div>
                  {[...events].sort((a,b)=>b.inscrits-a.inscrits).slice(0,5).map((ev,i)=>(
                    <div key={ev.id} style={{ display:"flex", alignItems:"center",
                      gap:12, marginBottom:10 }}>
                      <div style={{ width:28, height:28, borderRadius:8,
                        background:R.gradWarm,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"white", fontSize:12, fontWeight:800, flexShrink:0 }}>
                        {i+1}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, fontWeight:700, color:"#0f172a",
                          overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          {ev.titre}
                        </div>
                        <div style={{ height:5, background:"#e2e8f0", borderRadius:99,
                          overflow:"hidden", marginTop:4 }}>
                          <div style={{ width:`${Math.round((ev?.inscrits||0)/ev.capacite*100)}%`,
                            height:"100%", background:R.gradWarm, borderRadius:99 }}/>
                        </div>
                      </div>
                      <span style={{ fontSize:12.5, fontWeight:700, color:R.primary,
                        flexShrink:0, minWidth:30, textAlign:"right" }}>
                        {(ev?.inscrits||0)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* budget overview */}
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)", gridColumn:"span 2" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Suivi budgétaire par événement
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {(events||[]).filter(e=>(e?.budget_total || e?.budget?.total || 0)>0).map(ev=>{
                      const pct = Math.round(((ev?.budget_depenses || ev?.budget?.depenses || 0)/(ev?.budget_total || ev?.budget?.total || 0))*100);
                      return (
                        <div key={ev.id} style={{ display:"flex", alignItems:"center", gap:14 }}>
                          <span style={{ fontSize:20, flexShrink:0 }}>{ev.image}</span>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", justifyContent:"space-between",
                              fontSize:12.5, fontWeight:600, marginBottom:4 }}>
                              <span style={{ overflow:"hidden", textOverflow:"ellipsis",
                                whiteSpace:"nowrap", color:"#0f172a" }}>{ev.titre}</span>
                              <span style={{ color:pct>80?R.primary:"#10b981",
                                flexShrink:0, marginLeft:8 }}>
                                {(ev?.budget_depenses || ev?.budget?.depenses || 0)?.toLocaleString()} / {(ev?.budget_total || ev?.budget?.total || 0)?.toLocaleString()} MAD
                              </span>
                            </div>
                            <div style={{ height:8, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                              <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                                transition={{duration:0.7}}
                                style={{ height:"100%", borderRadius:99,
                                  background:pct>80?R.grad:"linear-gradient(135deg,#10b981,#059669)" }}/>
                            </div>
                          </div>
                          <span style={{ fontSize:11.5, fontWeight:700, flexShrink:0,
                            color:pct>80?R.primary:"#10b981" }}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {detailEvent && (
          <EventDetailModal event={detailEvent} onClose={()=>setDetailEvent(null)}
            onUpdate={updateStatut} onRegister={registerToEvent}/>
        )}
        {showCreate && (
          <CreateEventModal onClose={()=>setShowCreate(false)} onSave={addEvent}/>
        )}
      </AnimatePresence>
    </div>
  );
}