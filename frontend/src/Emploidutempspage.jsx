import { seances as seancesAPI, users as usersAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { edtStore } from "./syncStore.js";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, Plus, Download,
  Search, Bell, ChevronRight, X, Check,
  AlertTriangle, Filter,
  Users, Layers, BookOpen, Settings,
  Eye, Printer, FileText, Share2,
  CheckCircle, XCircle, Lock, Unlock,
  BarChart2, TrendingUp,
} from "lucide-react";

/* ── Palette vert ───────────────────────────────────────────── */
const G = {
  primary: "#10b981",
  dark:    "#064e3b",
  mid:     "#059669",
  light:   "#d1fae5",
  lighter: "#ecfdf5",
  border:  "#a7f3d0",
  grad:    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  gradSoft:"linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
};

/* ── Static data ────────────────────────────────────────────── */
const JOURS   = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const SLOTS   = [
  { id:"S1", label:"08:00 – 10:00" },
  { id:"S2", label:"10:00 – 12:00" },
  { id:"S3", label:"14:00 – 16:00" },
  { id:"S4", label:"16:00 – 18:00" },
];
// Groupes par filière (code RegisterPage)
const GROUPES_PAR_FILIERE = {
  "GI":   ["GI-G1","GI-G2","GI-G3"],
  "AI":   ["AI-G1","AI-G2"],
  "DWM":  ["DWM-G1","DWM-G2"],
  "GE":   ["GE-G1","GE-G2"],
  "GTE":  ["GTE-G1","GTE-G2"],
  "GETE": ["GETE-G1"],
  "GC":   ["GC-G1","GC-G2"],
  "PMD":  ["PMD-G1"],
  "TM":   ["TM-G1","TM-G2"],
  "FBA":  ["FBA-G1","FBA-G2","FBA-G3"],
  "TCC":  ["TCC-G1","TCC-G2"],
};
const GROUPES = Object.values(GROUPES_PAR_FILIERE).flat();

const SALLES   = [
  { id:"A101", nom:"Salle A101",  cap:40, type:"CM",  equip:["Projecteur","Tableau"] },
  { id:"A102", nom:"Salle A102",  cap:35, type:"CM",  equip:["Projecteur","Tableau"] },
  { id:"B204", nom:"Labo B204",   cap:25, type:"TP",  equip:["PC×25","Tableau"] },
  { id:"C301", nom:"Labo C301",   cap:20, type:"TP",  equip:["PC×20","Tableau"] },
  { id:"C302", nom:"Salle C302",  cap:30, type:"TD",  equip:["Projecteur","Tableau"] },
  { id:"D401", nom:"Salle D401",  cap:45, type:"CM",  equip:["Projecteur","Vidéo"] },
  { id:"E101", nom:"Salle E101",  cap:40, type:"CM",  equip:["Tableau"] },
  { id:"AMP_A",nom:"Amphi A",     cap:200,type:"CM",  equip:["Micro","Projecteur"] },
  { id:"AMP_B",nom:"Amphi B",     cap:150,type:"CM",  equip:["Micro","Projecteur"] },
];

const ENSEIGNANTS = [
  "Prof. Ahmed Benali","Prof. Nadia Berrada","Prof. Karim Tazi",
  "Prof. Hassan Alaoui","Prof. Sara Mansouri","Prof. Youssef Rachidi",
  "Prof. Mohammed Ouali",
];

// Matières complètes par filière
const MATIERES_PAR_FILIERE_EDT = {
  "GI":   [
    { id:"GI1", nom:"Algorithmique avancée",   equip:["Projecteur"], type:"CM" },
    { id:"GI2", nom:"Base de Données",         equip:["Projecteur"], type:"TD" },
    { id:"GI3", nom:"Réseaux informatiques",   equip:["Projecteur"], type:"CM" },
    { id:"GI4", nom:"POO & Génie Logiciel",    equip:["PC×25"],      type:"TP" },
  ],
  "AI":   [
    { id:"AI1", nom:"Machine Learning",        equip:["PC×25"],      type:"TP" },
    { id:"AI2", nom:"Python & Data Science",   equip:["PC×20"],      type:"TP" },
    { id:"AI3", nom:"Deep Learning",           equip:["Projecteur"], type:"CM" },
    { id:"AI4", nom:"NLP",                     equip:["Projecteur"], type:"CM" },
  ],
  "DWM":  [
    { id:"DWM1",nom:"HTML/CSS & Design",       equip:["PC×25"],      type:"TP" },
    { id:"DWM2",nom:"JavaScript",              equip:["PC×25"],      type:"TP" },
    { id:"DWM3",nom:"PHP/MySQL",               equip:["PC×20"],      type:"TP" },
    { id:"DWM4",nom:"UI/UX Design",            equip:["Projecteur"], type:"TD" },
  ],
  "GE":   [
    { id:"GE1", nom:"Circuits électriques",    equip:["Tableau"],    type:"CM" },
    { id:"GE2", nom:"Électronique de puissance",equip:["Tableau"],   type:"TD" },
    { id:"GE3", nom:"Automatique",             equip:["Projecteur"], type:"CM" },
  ],
  "GTE":  [
    { id:"GTE1",nom:"Thermodynamique",         equip:["Tableau"],    type:"CM" },
    { id:"GTE2",nom:"Machines électriques",    equip:["Tableau"],    type:"CM" },
    { id:"GTE3",nom:"Automatique industrielle",equip:["Projecteur"], type:"TD" },
  ],
  "GETE": [
    { id:"GETE1",nom:"Énergies renouvelables", equip:["Projecteur"], type:"CM" },
    { id:"GETE2",nom:"Smart Grid",             equip:["Projecteur"], type:"CM" },
    { id:"GETE3",nom:"Efficacité énergétique", equip:["Tableau"],    type:"TD" },
  ],
  "GC":   [
    { id:"GC1", nom:"Résistance des matériaux",equip:["Tableau"],    type:"CM" },
    { id:"GC2", nom:"Béton armé",              equip:["Tableau"],    type:"TD" },
    { id:"GC3", nom:"Topographie",             equip:["Projecteur"], type:"TP" },
  ],
  "PMD":  [
    { id:"PMD1",nom:"Maintenance industrielle",equip:["Tableau"],    type:"CM" },
    { id:"PMD2",nom:"CAO/DAO",                 equip:["PC×20"],      type:"TP" },
    { id:"PMD3",nom:"Gestion de production",   equip:["Projecteur"], type:"CM" },
  ],
  "TM":   [
    { id:"TM1", nom:"Management des organisations",equip:["Projecteur"],type:"CM" },
    { id:"TM2", nom:"Marketing stratégique",   equip:["Projecteur"], type:"CM" },
    { id:"TM3", nom:"Droit des affaires",      equip:["Tableau"],    type:"TD" },
  ],
  "FBA":  [
    { id:"FBA1",nom:"Comptabilité générale",   equip:["Tableau"],    type:"CM" },
    { id:"FBA2",nom:"Analyse financière",      equip:["Projecteur"], type:"CM" },
    { id:"FBA3",nom:"Marchés financiers",      equip:["Projecteur"], type:"CM" },
  ],
  "TCC":  [
    { id:"TCC1",nom:"Communication orale",     equip:["Micro"],      type:"CM" },
    { id:"TCC2",nom:"Marketing digital",       equip:["Projecteur"], type:"TD" },
    { id:"TCC3",nom:"Relations publiques",     equip:["Projecteur"], type:"CM" },
    { id:"TCC4",nom:"Communication visuelle",  equip:["Projecteur"], type:"TD" },
  ],
};
// MATIERES globales pour compatibilité avec le formulaire (toutes filières)
const MATIERES = Object.values(MATIERES_PAR_FILIERE_EDT).flat();

/* ── Prof identity (from ProfilePanel) ─────────────────────── */
// Prof name and filieres are read dynamically from localStorage inside the component

/* ── EDT initial — séances pour tous les départements ──────── */
const INIT_EDT = [
  // Informatique — GI
  { id:1,  jour:"Lundi",    slot:"S1", matiere:"Algorithmique avancée",  groupe:"GI-G1",   salle:"A101", enseignant:"Prof. Ahmed Benali",    type:"CM", couleur:"#10b981", locked:true  },
  { id:2,  jour:"Lundi",    slot:"S2", matiere:"Base de Données",        groupe:"GI-G2",   salle:"C302", enseignant:"Prof. Nadia Berrada",    type:"TD", couleur:"#3b82f6", locked:true  },
  { id:3,  jour:"Mardi",    slot:"S1", matiere:"POO & Génie Logiciel",   groupe:"GI-G1",   salle:"B204", enseignant:"Prof. Nadia Berrada",    type:"TP", couleur:"#8b5cf6", locked:false },
  { id:4,  jour:"Mercredi", slot:"S2", matiere:"Réseaux informatiques",  groupe:"GI-G3",   salle:"A102", enseignant:"Prof. Ahmed Benali",    type:"CM", couleur:"#f59e0b", locked:true  },
  { id:5,  jour:"Jeudi",    slot:"S3", matiere:"Base de Données",        groupe:"GI-G1",   salle:"C302", enseignant:"Prof. Nadia Berrada",    type:"TD", couleur:"#3b82f6", locked:false },
  { id:6,  jour:"Vendredi", slot:"S1", matiere:"Algorithmique avancée",  groupe:"GI-G2",   salle:"A101", enseignant:"Prof. Ahmed Benali",    type:"CM", couleur:"#10b981", locked:false },
  // Informatique — AI
  { id:7,  jour:"Lundi",    slot:"S3", matiere:"Machine Learning",       groupe:"AI-G1",   salle:"B204", enseignant:"Prof. Karim Tazi",      type:"TP", couleur:"#8b5cf6", locked:true  },
  { id:8,  jour:"Mardi",    slot:"S2", matiere:"Deep Learning",          groupe:"AI-G2",   salle:"D401", enseignant:"Prof. Karim Tazi",      type:"CM", couleur:"#ec4899", locked:false },
  { id:9,  jour:"Jeudi",    slot:"S1", matiere:"NLP",                    groupe:"AI-G1",   salle:"A102", enseignant:"Prof. Ahmed Benali",    type:"CM", couleur:"#6366f1", locked:true  },
  { id:10, jour:"Vendredi", slot:"S3", matiere:"Python & Data Science",  groupe:"AI-G2",   salle:"C301", enseignant:"Prof. Karim Tazi",      type:"TP", couleur:"#f97316", locked:false },
  // Informatique — DWM
  { id:11, jour:"Lundi",    slot:"S4", matiere:"HTML/CSS & Design",      groupe:"DWM-G1",  salle:"C301", enseignant:"Prof. Nadia Berrada",    type:"TP", couleur:"#0ea5e9", locked:false },
  { id:12, jour:"Mercredi", slot:"S4", matiere:"JavaScript",             groupe:"DWM-G2",  salle:"B204", enseignant:"Prof. Nadia Berrada",    type:"TP", couleur:"#f59e0b", locked:true  },
  // Génie Électrique — GE
  { id:13, jour:"Lundi",    slot:"S1", matiere:"Circuits électriques",   groupe:"GE-G1",   salle:"E101", enseignant:"Prof. Hassan Alaoui",   type:"CM", couleur:"#f59e0b", locked:true  },
  { id:14, jour:"Mardi",    slot:"S3", matiere:"Automatique",            groupe:"GE-G2",   salle:"A102", enseignant:"Prof. Hassan Alaoui",   type:"CM", couleur:"#10b981", locked:false },
  { id:15, jour:"Mercredi", slot:"S1", matiere:"Électronique de puissance",groupe:"GE-G1", salle:"C302", enseignant:"Prof. Hassan Alaoui",   type:"TD", couleur:"#f97316", locked:true  },
  // GTE
  { id:16, jour:"Lundi",    slot:"S2", matiere:"Thermodynamique",        groupe:"GTE-G1",  salle:"A101", enseignant:"Prof. Hassan Alaoui",   type:"CM", couleur:"#ef4444", locked:false },
  { id:17, jour:"Jeudi",    slot:"S2", matiere:"Machines électriques",   groupe:"GTE-G2",  salle:"E101", enseignant:"Prof. Hassan Alaoui",   type:"CM", couleur:"#f59e0b", locked:true  },
  // GETE
  { id:18, jour:"Mardi",    slot:"S4", matiere:"Énergies renouvelables", groupe:"GETE-G1", salle:"D401", enseignant:"Prof. Hassan Alaoui",   type:"CM", couleur:"#10b981", locked:false },
  // Génie Civil — GC
  { id:19, jour:"Lundi",    slot:"S3", matiere:"Résistance des matériaux",groupe:"GC-G1",  salle:"A101", enseignant:"Prof. Mohammed Ouali",  type:"CM", couleur:"#64748b", locked:true  },
  { id:20, jour:"Mercredi", slot:"S3", matiere:"Béton armé",             groupe:"GC-G2",   salle:"C302", enseignant:"Prof. Mohammed Ouali",  type:"TD", couleur:"#94a3b8", locked:false },
  // PMD
  { id:21, jour:"Jeudi",    slot:"S4", matiere:"Maintenance industrielle",groupe:"PMD-G1", salle:"E101", enseignant:"Prof. Mohammed Ouali",  type:"CM", couleur:"#6366f1", locked:false },
  // TCC
  { id:22, jour:"Lundi",    slot:"S2", matiere:"Communication orale",    groupe:"TCC-G1",  salle:"D401", enseignant:"Prof. Youssef Rachidi", type:"CM", couleur:"#ec4899", locked:true  },
  { id:23, jour:"Mardi",    slot:"S1", matiere:"Marketing digital",      groupe:"TCC-G2",  salle:"C302", enseignant:"Prof. Youssef Rachidi", type:"TD", couleur:"#f97316", locked:false },
  { id:24, jour:"Vendredi", slot:"S2", matiere:"Relations publiques",    groupe:"TCC-G1",  salle:"A102", enseignant:"Prof. Youssef Rachidi", type:"CM", couleur:"#8b5cf6", locked:true  },
  // FBA
  { id:25, jour:"Lundi",    slot:"S4", matiere:"Comptabilité générale",  groupe:"FBA-G1",  salle:"AMP_B",enseignant:"Prof. Sara Mansouri",   type:"CM", couleur:"#10b981", locked:true  },
  { id:26, jour:"Mercredi", slot:"S1", matiere:"Analyse financière",     groupe:"FBA-G2",  salle:"D401", enseignant:"Prof. Sara Mansouri",   type:"CM", couleur:"#3b82f6", locked:false },
  { id:27, jour:"Jeudi",    slot:"S2", matiere:"Marchés financiers",     groupe:"FBA-G3",  salle:"AMP_B",enseignant:"Prof. Sara Mansouri",   type:"CM", couleur:"#6366f1", locked:true  },
  // TM
  { id:28, jour:"Mardi",    slot:"S2", matiere:"Management des organisations",groupe:"TM-G1",salle:"A101",enseignant:"Prof. Sara Mansouri",  type:"CM", couleur:"#8b5cf6", locked:false },
  { id:29, jour:"Vendredi", slot:"S4", matiere:"Marketing stratégique",  groupe:"TM-G2",   salle:"C302", enseignant:"Prof. Sara Mansouri",   type:"CM", couleur:"#f59e0b", locked:true  },
];

const INIT_RESERVATIONS = [
  { id:1,  ressource:"A101", créneau:"Lundi-S3",    motif:"Réunion pédagogique",  type:"cours",     demandeur:"Prof. Benali",  statut:"confirmee", priorite:1 },
  { id:2,  ressource:"B204", créneau:"Mardi-S2",    motif:"Hackathon Club Info",  type:"club",      demandeur:"Club Info",     statut:"en_attente",priorite:3 },
  { id:3,  ressource:"AMP_A",créneau:"Jeudi-S2",    motif:"Conférence IA",        type:"evenement", demandeur:"Dept. Info",    statut:"confirmee", priorite:2 },
  { id:4,  ressource:"C302", créneau:"Vendredi-S1", motif:"TD rattrapé",          type:"cours",     demandeur:"Prof. Berrada", statut:"conflit",   priorite:1 },
];

const TYPE_COLORS = { CM:"#10b981", TD:"#3b82f6", TP:"#8b5cf6" };
const PRIO_COLORS = { cours:"#10b981", evenement:"#3b82f6", club:"#f59e0b" };

/* ── Helpers ────────────────────────────────────────────────── */
function detectConflicts(edt) {
  const conflicts = [];
  for (let i=0; i<edt.length; i++) {
    for (let j=i+1; j<edt.length; j++) {
      const a=edt[i], b=edt[j];
      if (a.jour===b.jour && a.slot===b.slot) {
        if (a.salle===b.salle)        conflicts.push({ type:"salle",       msg:`Conflit salle ${a.salle} — ${a.jour} ${SLOTS.find(s=>s.id===a.slot)?.label}`, ids:[a.id,b.id] });
        if (a.enseignant===b.enseignant) conflicts.push({ type:"enseignant",  msg:`Conflit enseignant ${a.enseignant} — ${a.jour}`, ids:[a.id,b.id] });
        if (a.groupe===b.groupe)      conflicts.push({ type:"groupe",      msg:`Conflit groupe ${a.groupe} — ${a.jour}`, ids:[a.id,b.id] });
      }
    }
  }
  return conflicts;
}

/* ── Sub-components ─────────────────────────────────────────── */
function StatCard({ icon:Icon, label, value, color, sub }) {
  return (
    <motion.div whileHover={{ y:-3, boxShadow:`0 12px 28px ${color}20` }}
      style={{ background:"white", borderRadius:16, padding:"18px 20px",
        border:`1px solid ${color}20`,
        boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
        display:"flex", alignItems:"center", gap:14,
        transition:"box-shadow .2s", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", right:-8, top:-8, width:60, height:60,
        borderRadius:"50%", background:color+"0d" }}/>
      <div style={{ width:44, height:44, borderRadius:13,
        background:color+"18", border:`1px solid ${color}20`,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
        <Icon size={22} color={color} strokeWidth={2}/>
      </div>
      <div>
        <div style={{ fontSize:28, fontWeight:800, color:"#0f172a", lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12.5, color:"#64748b", marginTop:3 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color, marginTop:2, fontWeight:600 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

function TypeBadge({ type, small }) {
  const col = TYPE_COLORS[type] || G.primary;
  return (
    <span style={{ display:"inline-flex", alignItems:"center",
      background:col+"18", color:col,
      fontSize:small?10:11.5, fontWeight:700, borderRadius:6,
      padding:small?"1px 6px":"3px 9px" }}>{type}</span>
  );
}

function Modal({ onClose, title, subtitle, children, maxW=520 }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{ position:"fixed", inset:0, zIndex:300,
        background:"rgba(15,23,42,0.55)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}}
        exit={{scale:0.93,y:20}}
        transition={{type:"spring",stiffness:340,damping:28}}
        onClick={e=>e.stopPropagation()}
        style={{ background:"white", borderRadius:22, width:"100%", maxWidth:maxW,
          maxHeight:"90vh", overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)" }}>
        <div style={{ padding:"20px 24px 16px",
          background:G.grad, position:"sticky", top:0, zIndex:1,
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

const LS = { display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6 };
const IS = { width:"100%", padding:"10px 12px", borderRadius:10,
  border:"1.5px solid #e2e8f0", fontSize:13.5, color:"#0f172a",
  fontFamily:"inherit", outline:"none", background:"#f8fafc", boxSizing:"border-box" };

/* ════════════ GRILLE EDT ═══════════════════════════════════ */
function GrilleEDT({ edt, setEdt, conflicts, viewMode, filterGroupe, filterEnseignant, filterSalle, onCellClick }) {

  const filtered = edt.filter(s =>
    (filterGroupe==="all"      || s.groupe===filterGroupe) &&
    (filterEnseignant==="all"  || s.enseignant===filterEnseignant) &&
    (filterSalle==="all"       || s.salle===filterSalle)
  );

  const conflictIds = new Set(conflicts.flatMap(c=>c.ids));

  const grid = {};
  JOURS.forEach(j=>{ grid[j]={}; SLOTS.forEach(s=>{ grid[j][s.id]=[]; }); });
  filtered.forEach(s=>{ if(grid[s.jour]?.[s.slot]) grid[s.jour][s.slot].push(s); });

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"separate", borderSpacing:5, minWidth:800 }}>
        <thead>
          <tr>
            <th style={{ padding:"10px 14px", background:"#f8fafc",
              borderRadius:10, fontSize:12, fontWeight:700, color:"#64748b", width:130 }}>
              Créneau
            </th>
            {JOURS.map(j=>(
              <th key={j} style={{ padding:"10px 14px", background:G.lighter,
                borderRadius:10, fontSize:13, fontWeight:800, color:G.dark, textAlign:"center" }}>
                {j}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SLOTS.map(sl=>(
            <tr key={sl.id}>
              <td style={{ padding:"10px 14px", background:"#f8fafc",
                borderRadius:10, fontSize:12, fontWeight:700,
                color:"#64748b", whiteSpace:"nowrap", verticalAlign:"middle" }}>
                <div>{sl.label.split("–")[0].trim()}</div>
                <div style={{ fontSize:11, color:"#94a3b8" }}>– {sl.label.split("–")[1].trim()}</div>
              </td>
              {JOURS.map(j=>{
                const cells = grid[j][sl.id] || [];
                const isEmpty = cells.length===0;
                return (
                  <td key={j} style={{ padding:3, verticalAlign:"top", minWidth:130 }}>
                    {isEmpty ? (
                      <motion.div
                        onClick={()=>onCellClick(j, sl.id)}
                        whileHover={{ background:"#f0fdf4", borderColor:G.primary }}
                        style={{ height:80, borderRadius:10,
                          border:"1.5px dashed #d1fae5",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          cursor:"pointer", transition:"all .15s" }}>
                        <Plus size={16} color="#a7f3d0"/>
                      </motion.div>
                    ) : (
                      cells.map(c=>{
                        const hasConflict = conflictIds.has(c.id);
                        return (
                          <motion.div key={c.id}
                            whileHover={{ scale:1.02, y:-2 }}
                            style={{
                              background:`${c.couleur}14`,
                              border:`1.5px solid ${hasConflict?"#ef4444":c.couleur+"44"}`,
                              borderLeft:`4px solid ${hasConflict?"#ef4444":c.couleur}`,
                              borderRadius:10, padding:"8px 10px",
                              marginBottom:3, cursor:"pointer",
                              boxShadow: hasConflict?"0 0 0 2px #fee2e2":"none",
                              transition:"all .15s", position:"relative" }}>
                            {hasConflict && (
                              <div style={{ position:"absolute", top:4, right:4 }}>
                                <AlertTriangle size={12} color="#ef4444"/>
                              </div>
                            )}
                            {c.locked && (
                              <div style={{ position:"absolute", top:4, right:hasConflict?20:4 }}>
                                <Lock size={11} color="#94a3b8"/>
                              </div>
                            )}
                            <div style={{ fontSize:12, fontWeight:800, color:c.couleur,
                              marginBottom:2, paddingRight:20 }}>
                              {c.matiere}
                            </div>
                            <div style={{ fontSize:11, color:"#64748b", marginBottom:3 }}>
                              {c.groupe}
                            </div>
                            <div style={{ fontSize:11, color:"#94a3b8", marginBottom:4 }}>
                              {c.enseignant.replace("Prof. ","")} · {c.salle}
                            </div>
                            <TypeBadge type={c.type} small/>
                          </motion.div>
                        );
                      })
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ════════════ RESERVATION MODAL ════════════════════════════ */
function ReservationModal({ onClose, onSave, existingReservations, edt }) {
  const [form, setForm] = useState({
    ressource: SALLES[0].id,
    jour: JOURS[0],
    slot: "S1",
    motif: "",
    type: "cours",
    demandeur: "Prof. Ahmed Benali",
  });
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));

  const cleComposee = `${form.ressource}-${form.jour}-${form.slot}`;

  // Conflict detection
  const resConflict = existingReservations.find(r=>
    r.ressource===form.ressource && r.créneau===`${form.jour}-${form.slot}` && r.statut!=="annulee"
  );
  const edtConflict = edt.find(e=>
    e.salle===form.ressource && e.jour===form.jour && e.slot===form.slot
  );
  const hasConflict = !!(resConflict || edtConflict);

  const salle = SALLES.find(s=>s.id===form.ressource);

  // Priority label
  const prioLabel = { cours:"🔴 Haute (Cours)", evenement:"🟡 Moyenne (Événement)", club:"🟢 Basse (Club)" }[form.type];

  const valid = form.motif && !hasConflict;

  return (
    <Modal onClose={onClose} title="Nouvelle réservation" subtitle="Salle / Labo / Équipement">
      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

        {/* ressource */}
        <div>
          <label style={LS}>Ressource *</label>
          <select value={form.ressource} onChange={e=>s("ressource",e.target.value)} style={IS}>
            {SALLES.map(sl=>(
              <option key={sl.id} value={sl.id}>{sl.nom} — cap.{sl.cap} · {sl.type}</option>
            ))}
          </select>
          {salle && (
            <div style={{ marginTop:6, display:"flex", gap:6, flexWrap:"wrap" }}>
              {salle.equip.map(eq=>(
                <span key={eq} style={{ background:G.lighter, color:G.dark,
                  fontSize:11, fontWeight:600, borderRadius:7, padding:"2px 8px",
                  border:`1px solid ${G.border}` }}>{eq}</span>
              ))}
            </div>
          )}
        </div>

        {/* créneau */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Jour *</label>
            <select value={form.jour} onChange={e=>s("jour",e.target.value)} style={IS}>
              {JOURS.map(j=><option key={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Créneau *</label>
            <select value={form.slot} onChange={e=>s("slot",e.target.value)} style={IS}>
              {SLOTS.map(sl=><option key={sl.id} value={sl.id}>{sl.label}</option>)}
            </select>
          </div>
        </div>

        {/* Conflict indicator */}
        <div style={{
          background: hasConflict?"#fef2f2":"#f0fdf4",
          border:`1px solid ${hasConflict?"#fecaca":G.border}`,
          borderRadius:11, padding:"11px 14px",
          display:"flex", alignItems:"flex-start", gap:9 }}>
          {hasConflict
            ? <AlertTriangle size={16} color="#ef4444" style={{flexShrink:0,marginTop:1}}/>
            : <CheckCircle size={16} color={G.primary} style={{flexShrink:0,marginTop:1}}/>}
          <div>
            <div style={{ fontSize:13, fontWeight:700,
              color:hasConflict?"#991b1b":G.dark }}>
              {hasConflict?"⚠️ Conflit détecté":"✅ Créneau disponible"}
            </div>
            <div style={{ fontSize:12, color:hasConflict?"#dc2626":"#64748b", marginTop:2 }}>
              {hasConflict
                ? (edtConflict
                    ? `EDT: ${edtConflict.matiere} (${edtConflict.groupe}) dans cette salle`
                    : `Réservation existante: ${resConflict?.motif}`)
                : `Clé: ${cleComposee}`}
            </div>
          </div>
        </div>

        {/* type + priorité */}
        <div>
          <label style={LS}>Type de réservation</label>
          <div style={{ display:"flex", gap:8 }}>
            {["cours","evenement","club"].map(t=>(
              <button key={t} type="button"
                onClick={()=>s("type",t)}
                style={{ flex:1, padding:"9px", borderRadius:10, border:"none",
                  background:form.type===t?PRIO_COLORS[t]+"18":"#f8fafc",
                  color:form.type===t?PRIO_COLORS[t]:"#64748b",
                  fontSize:12.5, fontWeight:form.type===t?700:500,
                  cursor:"pointer", fontFamily:"inherit",
                  border:`1.5px solid ${form.type===t?PRIO_COLORS[t]+"55":"#e2e8f0"}`,
                  transition:"all .18s" }}>
                {t==="cours"?"📚 Cours":t==="evenement"?"🎤 Événement":"🎭 Club"}
              </button>
            ))}
          </div>
          <div style={{ fontSize:11.5, color:"#64748b", marginTop:6 }}>
            Priorité : <strong>{prioLabel}</strong>
          </div>
        </div>

        {/* demandeur + motif */}
        <div>
          <label style={LS}>Demandeur</label>
          <select value={form.demandeur} onChange={e=>s("demandeur",e.target.value)} style={IS}>
            {ENSEIGNANTS.map(e=><option key={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <label style={LS}>Motif *</label>
          <input value={form.motif} onChange={e=>s("motif",e.target.value)}
            placeholder="Ex: TD rattrapé, Réunion pédagogique…" style={IS}/>
        </div>

        <motion.button
          onClick={()=>{ if(valid) { onSave({
            ...form, id:Date.now(),
            créneau:`${form.jour}-${form.slot}`,
            statut:"en_attente", priorite:form.type==="cours"?1:form.type==="evenement"?2:3
          }); onClose(); }}}
          disabled={!valid}
          whileHover={{scale:valid?1.01:1}} whileTap={{scale:valid?0.98:1}}
          style={{ padding:"13px", borderRadius:12, border:"none",
            background:valid?G.grad:"#e2e8f0",
            color:valid?"white":"#94a3b8",
            fontSize:14.5, fontWeight:700, cursor:valid?"pointer":"not-allowed",
            fontFamily:"inherit", marginTop:4,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:valid?`0 6px 20px ${G.primary}40`:"none" }}>
          <CheckCircle size={17}/> Confirmer la réservation
        </motion.button>
      </div>
    </Modal>
  );
}

/* ════════════ ADD SÉANCE MODAL ═════════════════════════════ */
function AddSeanceModal({ onClose, onSave, defaultJour, defaultSlot, edt }) {
  // Matières filtrées selon les filières du prof connecté
  const profFilieres = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("umi_user")) || {};
      const codes = Array.isArray(u.filieres) && u.filieres.length > 0
        ? u.filieres : u.filiere ? [u.filiere] : null;
      return codes;
    } catch { return null; }
  })();

  // Matières disponibles = union des matières des filières du prof
  const matieresDispo = profFilieres
    ? profFilieres.flatMap(f => MATIERES_PAR_FILIERE_EDT[f] || [])
    : MATIERES;

  // Groupes disponibles = groupes des filières du prof
  const groupesDispo = profFilieres
    ? profFilieres.flatMap(f => GROUPES_PAR_FILIERE[f] || [])
    : GROUPES;

  const firstMat = matieresDispo[0] || MATIERES[0];
  const firstGroupe = groupesDispo[0] || GROUPES[0];

  const [form, setForm] = useState({
    matiere: firstMat.nom,
    groupe:  firstGroupe,
    salle:   SALLES[0].id,
    enseignant: ENSEIGNANTS[0],
    jour:    defaultJour || JOURS[0],
    slot:    defaultSlot || "S1",
    type:    firstMat.type || "CM",
  });
  const s=(k,v)=>setForm(f=>({...f,[k]:v}));

  const salle = SALLES.find(sl=>sl.id===form.salle);

  // Check hard constraints
  const sameSlot = edt.filter(e=>e.jour===form.jour && e.slot===form.slot);
  const salleConflict = sameSlot.find(e=>e.salle===form.salle);
  const profConflict  = sameSlot.find(e=>e.enseignant===form.enseignant);
  const groupeConflict= sameSlot.find(e=>e.groupe===form.groupe);
  const hasConflict = !!(salleConflict||profConflict||groupeConflict);


  return (
    <Modal onClose={onClose} title="Ajouter une séance" subtitle="Contraintes vérifiées en temps réel" maxW={560}>
      <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Matière *</label>
            <select value={form.matiere} onChange={e=>{ s("matiere",e.target.value);
              const m=matieresDispo.find(m=>m.nom===e.target.value);
              if(m) s("type",m.type); }} style={IS}>
              {matieresDispo.map(m=><option key={m.id}>{m.nom}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Type</label>
            <select value={form.type} onChange={e=>s("type",e.target.value)} style={IS}>
              {["CM","TD","TP"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Groupe</label>
            <select value={form.groupe} onChange={e=>s("groupe",e.target.value)} style={IS}>
              {groupesDispo.map(g=><option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Enseignant</label>
            <select value={form.enseignant} onChange={e=>s("enseignant",e.target.value)} style={IS}>
              {ENSEIGNANTS.map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={LS}>Salle</label>
          <select value={form.salle} onChange={e=>s("salle",e.target.value)} style={IS}>
            {SALLES.map(sl=><option key={sl.id} value={sl.id}>{sl.nom} (cap.{sl.cap})</option>)}
          </select>
          {salle && (
            <div style={{ marginTop:5, display:"flex", gap:5, flexWrap:"wrap" }}>
              {salle.equip.map(eq=>(
                <span key={eq} style={{ background:G.lighter, color:G.dark,
                  fontSize:10.5, fontWeight:600, borderRadius:6, padding:"1px 7px",
                  border:`1px solid ${G.border}` }}>{eq}</span>
              ))}
            </div>
          )}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={LS}>Jour</label>
            <select value={form.jour} onChange={e=>s("jour",e.target.value)} style={IS}>
              {JOURS.map(j=><option key={j}>{j}</option>)}
            </select>
          </div>
          <div>
            <label style={LS}>Créneau</label>
            <select value={form.slot} onChange={e=>s("slot",e.target.value)} style={IS}>
              {SLOTS.map(sl=><option key={sl.id} value={sl.id}>{sl.label}</option>)}
            </select>
          </div>
        </div>

        {/* Constraint checker */}
        {(salleConflict||profConflict||groupeConflict) && (
          <motion.div initial={{opacity:0,y:-4}} animate={{opacity:1,y:0}}
            style={{ background:"#fef2f2", border:"1px solid #fecaca",
              borderRadius:11, padding:"11px 14px" }}>
            <div style={{ fontSize:13, fontWeight:700, color:"#991b1b", marginBottom:6,
              display:"flex", alignItems:"center", gap:6 }}>
              <AlertTriangle size={14}/> Contraintes dures violées
            </div>
            {salleConflict  && <div style={{ fontSize:12, color:"#dc2626", marginBottom:3 }}>• Salle déjà occupée ({salleConflict.matiere})</div>}
            {profConflict   && <div style={{ fontSize:12, color:"#dc2626", marginBottom:3 }}>• Enseignant déjà affecté ({profConflict.matiere})</div>}
            {groupeConflict && <div style={{ fontSize:12, color:"#dc2626" }}>• Groupe déjà en cours ({groupeConflict.matiere})</div>}
          </motion.div>
        )}

        {!hasConflict && form.matiere && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            style={{ background:G.lighter, border:`1px solid ${G.border}`,
              borderRadius:11, padding:"10px 14px",
              display:"flex", alignItems:"center", gap:7 }}>
            <CheckCircle size={14} color={G.primary}/>
            <span style={{ fontSize:12.5, color:G.dark, fontWeight:600 }}>
              Aucun conflit — créneau valide ✓
            </span>
          </motion.div>
        )}

<motion.button
          onClick={()=>{ if(!hasConflict&&form.matiere) {
            const typeCol = {CM:G.primary, TD:'#3b82f6', TP:'#8b5cf6'}[form.type]||G.primary;
            onSave({...form, couleur:typeCol, id:Date.now(), locked:false});
            onClose();
          }}}
          disabled={hasConflict||!form.matiere}
          whileHover={{scale:!hasConflict?1.01:1}}
          whileTap={{scale:!hasConflict?0.98:1}}
          style={{ padding:"13px", borderRadius:12, border:"none",
            background:(!hasConflict&&form.matiere)?G.grad:"#e2e8f0",
            color:(!hasConflict&&form.matiere)?"white":"#94a3b8",
            fontSize:14.5, fontWeight:700,
            cursor:(!hasConflict&&form.matiere)?"pointer":"not-allowed",
            fontFamily:"inherit", marginTop:4,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            boxShadow:(!hasConflict&&form.matiere)?`0 6px 20px ${G.primary}40`:"none" }}>
          <Plus size={17}/> Ajouter la séance
        </motion.button>
      </div>
    </Modal>
  );
}


/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export default function EmploiDuTempsPage() {
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
  const [edt, setEdt] = useState(INIT_EDT);

  // IDs réels depuis la BDD
  const [dbSalles, setDbSalles] = useState([]);
  const [dbEnseignants, setDbEnseignants] = useState([]);
  useEffect(() => {
    const tk = localStorage.getItem('umi_token') || '';
    fetch('http://localhost:8000/api/salles', {
      headers: { 'Authorization': 'Bearer ' + tk, 'Accept': 'application/json' }
    }).then(r => r.json()).then(d => {
      const list = Array.isArray(d) ? d : (d?.data || []);
      if (list.length > 0) setDbSalles(list);
    }).catch(() => {});
    usersAPI.getAll().then(d => {
      const list = Array.isArray(d) ? d : (d?.data || []);
      const profs = list.filter(u => u.db_role === 'PROFESSEUR');
      if (profs.length > 0) setDbEnseignants(profs);
    }).catch(() => {});
  }, []);


  // Charger les séances depuis la BDD au montage
  useEffect(() => {
    seancesAPI.getAll()
      .then(d => {
        const list = Array.isArray(d) ? d : (d?.data || []);
        if (list.length > 0) {
          setEdt(list.map(s => ({
            id:         s.id,
            jour:       s.jour,
            slot:       s.slot,
            matiere:    s.matiere,
            groupe:     s.groupe,
            salle:      s.salle?.code || s.salle || '—',
            enseignant: s.enseignant ? ('Prof. ' + s.enseignant.prenom + ' ' + s.enseignant.nom) : '—',
            type:       s.type,
            couleur:    s.couleur || '#3b82f6',
          })));
        }
      })
      .catch(() => {});
  }, []);
  const [reservations, setReservations] = useState(INIT_RESERVATIONS);
  const [activeTab, setActiveTab]   = useState("grille");
  const [viewMode, setViewMode]     = useState("groupe");
  const [filterGroupe, setFilterGroupe] = useState("all");
  const [filterEns, setFilterEns]   = useState("all");
  const [filterSalle, setFilterSalle] = useState("all");
  const [filterFiliere, setFilterFiliere] = useState("all");
  const [mesCours, setMesCours]     = useState(false); // off par défaut — affiche tous les cours

  // Prof connecté — lu depuis localStorage
  const currentProf = (() => {
    try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; }
  })();
  const PROF_NAME = currentProf.prenom && currentProf.nom
    ? `${currentProf.prenom} ${currentProf.nom}`
    : "";
  const PROF_FULL = PROF_NAME ? `Prof. ${PROF_NAME}` : "";
  const PROF_FILIERES = Array.isArray(currentProf.filieres) && currentProf.filieres.length > 0
    ? currentProf.filieres
    : currentProf.filiere ? [currentProf.filiere] : null;
  const [modal, setModal]           = useState(null);
  const [search, setSearch]         = useState("");

  const conflicts = detectConflicts(edt);

  // EDT filtered to prof's own courses (+ filière filter)
  const profEdt = edt.filter(s => {
    // "Mes cours" : filtre par nom exact du prof connecté
    const isOwn = !mesCours || !PROF_FULL || s.enseignant === PROF_FULL;
    // Filtre filière : le groupe commence par le code filière
    const filMatch = filterFiliere === "all" || s.groupe.startsWith(filterFiliere + "-");
    return isOwn && filMatch;
  });

  const addSeance = async (s) => {
    const u = (() => { try { return JSON.parse(localStorage.getItem('umi_user'))||{}; } catch{return{};} })();
    try {
      // Résoudre les vrais IDs depuis la BDD
      const salleObj = dbSalles.find(sl => sl.code === s.salle || String(sl.id) === String(s.salle)) || dbSalles[0];
      const salleId  = salleObj?.id || 1;
      const ensNom   = (s.enseignant || '').replace('Prof. ', '').trim();
      const ensObj   = dbEnseignants.find(e => (e.prenom + ' ' + e.nom) === ensNom || e.nom === ensNom.split(' ').pop())
                     || { id: u.id || 1 };
      const ensId    = ensObj?.id || u.id || 1;
      const created = await seancesAPI.create({
        matiere:       s.matiere,
        groupe:        s.groupe,
        jour:          s.jour,
        slot:          s.slot,
        type:          s.type,
        couleur:       s.couleur || '#3b82f6',
        enseignant_id: ensId,
        salle_id:      salleId,
      });
      const newS = {
        id: created.id || Date.now(),
        jour: s.jour, slot: s.slot,
        matiere: s.matiere, groupe: s.groupe,
        salle: s.salle || '—',
        enseignant: u.prenom ? ('Prof. ' + u.prenom + ' ' + u.nom) : '—',
        type: s.type, couleur: s.couleur || '#3b82f6',
      };
      setEdt(p => [...p, newS]);
      try { edtStore.add(newS, u?.prenom + ' ' + u?.nom); } catch(e) {}
    } catch(e) {
      console.error('Erreur ajout séance:', e);
    }
  };
  const addReservation = (r) => {
    setReservations(p=>[r,...p]);
    resAPI.create({ salle_id: r.salleId||r.salle, jour: r.jour,
      slot: r.slot, motif: r.motif, type: r.type||"cours" }).catch(()=>{});
  };

  const exportICS = () => {
    const lines = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//UMI-Flow//FR"];
    edt.forEach(s=>{
      const slotObj = SLOTS.find(sl=>sl.id===s.slot);
      lines.push("BEGIN:VEVENT");
      lines.push(`SUMMARY:${s.matiere} — ${s.groupe}`);
      lines.push(`DESCRIPTION:${s.enseignant} · ${s.salle} · ${s.type}`);
      lines.push(`LOCATION:${s.salle}`);
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const blob = new Blob([lines.join("\n")],{type:"text/calendar"});
    const a = document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="emploi_du_temps_umi.ics"; a.click();
  };

  const exportPDF = () => {
    const rows = edt.map(s=>`${s.jour}\t${SLOTS.find(sl=>sl.id===s.slot)?.label}\t${s.matiere}\t${s.groupe}\t${s.enseignant}\t${s.salle}\t${s.type}`).join("\n");
    const blob = new Blob([`EDT UMI-Flow\n\nJour\tCréneau\tMatière\tGroupe\tEnseignant\tSalle\tType\n${rows}`],{type:"text/plain"});
    const a = document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="emploi_du_temps.txt"; a.click();
  };

  const TABS = [
    { id:"grille",      label:"Grille EDT",      icon:Calendar },
    { id:"reservations",label:"Réservations",     icon:Lock },
    { id:"stats",       label:"Statistiques",     icon:BarChart2 },
  ];

  const stats = {
    seances:  profEdt.length,
    conflits: conflicts.length,
    salles:   new Set(profEdt.map(e=>e.salle)).size,
    groupes:  new Set(profEdt.map(e=>e.groupe)).size,
  };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(160deg,#f0fdf9 0%,#ecfdf5 40%,#f8faff 100%)",
      fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* ── NAVBAR ── */}
      <motion.nav initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
        style={{ height:62, background:"rgba(255,255,255,0.9)",
          backdropFilter:"blur(18px)",
          borderBottom:`1px solid ${G.border}55`,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", position:"sticky", top:0, zIndex:100,
          boxShadow:`0 2px 20px ${G.primary}10` }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <motion.button onClick={()=>navigate("/teacher")}
            whileHover={{scale:1.04,x:-2}} whileTap={{scale:0.96}}
            style={{ display:"flex", alignItems:"center", gap:7,
              background:G.lighter, border:`1px solid ${G.border}`,
              borderRadius:10, padding:"7px 13px", cursor:"pointer",
              color:G.primary, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
            <ArrowLeft size={15}/> Retour
          </motion.button>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Accueil</span>
            <ChevronRight size={13} color="#cbd5e1"/>
            <span style={{ fontSize:13, fontWeight:700, color:G.primary }}>Emploi du temps</span>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", background:"#f1f5f9",
            borderRadius:10, padding:"0 13px", gap:7, width:220 }}>
            <Search size={14} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Matière, groupe, salle…"
              style={{ border:"none", outline:"none", background:"transparent",
                fontSize:13, color:"#0f172a", padding:"9px 0",
                fontFamily:"inherit", width:"100%" }}/>
          </div>

<motion.button onClick={()=>setModal("reservation")}
            whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            style={{ display:"flex", alignItems:"center", gap:6,
              padding:"8px 14px", borderRadius:10, border:"none",
              background:G.grad, color:"white",
              fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
              boxShadow:`0 2px 10px ${G.primary}40` }}>
            <Plus size={14}/> Réserver
          </motion.button>

          {/* exports */}
          <div style={{ display:"flex", gap:6 }}>
            <button onClick={exportPDF} title="Export PDF/TXT"
              style={{ width:36, height:36, borderRadius:10, border:`1.5px solid ${G.border}`,
                background:G.lighter, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center" }}>
              <Printer size={16} color={G.dark}/>
            </button>
            <button onClick={exportICS} title="Export ICS (Calendrier)"
              style={{ width:36, height:36, borderRadius:10, border:`1.5px solid ${G.border}`,
                background:G.lighter, cursor:"pointer", display:"flex",
                alignItems:"center", justifyContent:"center" }}>
              <Share2 size={16} color={G.dark}/>
            </button>
          </div>

          <button style={{ width:36, height:36, borderRadius:10, background:"#f1f5f9",
            border:"none", cursor:"pointer", display:"flex",
            alignItems:"center", justifyContent:"center", position:"relative" }}>
            <Bell size={16} color="#64748b"/>
            {conflicts.length>0 && (
              <span style={{ position:"absolute", top:6, right:6,
                width:8, height:8, borderRadius:"50%",
                background:"#ef4444", border:"1.5px solid white" }}/>
            )}
          </button>

          <div style={{ position:"relative" }}>
            <div onClick={()=>setProfileOpen(o=>!o)} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8,
            background:G.lighter, border:`1.5px solid ${G.border}`,
            borderRadius:10, padding:"5px 12px 5px 6px" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:G.grad,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"white", fontSize:13, fontWeight:800 }}>{_initials}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", lineHeight:1 }}>{_isProf?"Prof. ":""}{_displayName}</div>
              <div style={{ fontSize:10.5, color:G.primary, fontWeight:600, marginTop:1 }}>{_roleLabel}</div>
            </div>
          </div>
            {profileOpen&&<ProfilePanel onClose={()=>setProfileOpen(false)}/>
            }
          </div>
        </div>
      </motion.nav>

      <div style={{ maxWidth:1400, margin:"0 auto", padding:"28px 32px 60px" }}>

        {/* ── Hero band ── */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:0.6,delay:0.1}}
          style={{ borderRadius:20, background:G.grad,
            padding:"26px 34px", marginBottom:26,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160,
            borderRadius:"50%", background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"absolute", right:80, bottom:-50, width:120, height:120,
            borderRadius:"50%", background:"rgba(255,255,255,0.05)" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7,
              background:"rgba(255,255,255,0.18)", borderRadius:20, padding:"4px 13px", marginBottom:10 }}>
              <Calendar size={13} color="white"/>
              <span style={{ fontSize:12, color:"white", fontWeight:600 }}>Emploi du temps</span>
            </div>
            <h1 style={{ fontSize:24, fontWeight:800, color:"white",
              letterSpacing:"-0.4px", margin:"0 0 5px" }}>
              Gestion de l'Emploi du Temps
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:0 }}>
              Réservations, génération automatique, export PDF/ICS
            </p>
          </div>
          {/* stat pills */}
          <div style={{ display:"flex", gap:10, position:"relative", zIndex:1 }}>
            {[
              { icon:Calendar, v:stats.seances,  l:"Séances" },
              { icon:Users,    v:stats.groupes,  l:"Groupes" },
              { icon:Layers,   v:stats.salles,   l:"Salles" },
              { icon:AlertTriangle, v:conflicts.length, l:"Conflits" },
            ].map(({icon:Icon,v,l})=>(
              <div key={l} style={{ background:"rgba(255,255,255,0.15)",
                backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.25)",
                borderRadius:13, padding:"11px 16px",
                display:"flex", flexDirection:"column", alignItems:"center", minWidth:72 }}>
                <Icon size={16} color="white" style={{marginBottom:5}}/>
                <div style={{ fontSize:20, fontWeight:800, color:"white", lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* conflict alert */}
        {conflicts.length>0 && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}}
            style={{ background:"#fef2f2", border:"1px solid #fecaca",
              borderRadius:12, padding:"12px 18px", marginBottom:18,
              display:"flex", alignItems:"center", gap:10 }}>
            <AlertTriangle size={16} color="#ef4444" style={{flexShrink:0}}/>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:13.5, fontWeight:700, color:"#991b1b" }}>
                {conflicts.length} conflit{conflicts.length>1?"s":""} détecté{conflicts.length>1?"s":""}
              </span>
              <span style={{ fontSize:12.5, color:"#dc2626", marginLeft:8 }}>
                {conflicts.map(c=>c.msg).join(" · ")}
              </span>
            </div>

          </motion.div>
        )}

        {/* ── Tabs ── */}
        <div style={{ display:"flex", gap:4, borderBottom:`2px solid ${G.light}`, marginBottom:20 }}>
          {TABS.map(t=>{
            const Icon=t.icon;
            const active=activeTab===t.id;
            return (
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{ display:"flex", alignItems:"center", gap:7,
                  padding:"10px 18px", borderRadius:"10px 10px 0 0",
                  border:"none", cursor:"pointer",
                  background:active?"white":"transparent",
                  color:active?G.primary:"#64748b",
                  fontSize:13.5, fontWeight:active?700:500,
                  fontFamily:"inherit",
                  borderBottom:active?`2px solid ${G.primary}`:"2px solid transparent",
                  marginBottom:-2,
                  boxShadow:active?`0 -2px 12px ${G.primary}12`:"none",
                  transition:"all .2s" }}>
                <Icon size={15}/>{t.label}
                {t.id==="reservations" && reservations.filter(r=>r.statut==="en_attente").length>0 && (
                  <span style={{ background:"#ef4444", color:"white",
                    fontSize:10, fontWeight:700, borderRadius:10, padding:"1px 6px" }}>
                    {reservations.filter(r=>r.statut==="en_attente").length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB CONTENT ── */}
        <AnimatePresence mode="wait">

          {/* GRILLE EDT */}
          {activeTab==="grille" && (
            <motion.div key="grille"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}} transition={{duration:0.28}}>

              {/* filters */}
              <div style={{ display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center" }}>

                {/* Mes cours toggle */}
                <button
                  onClick={()=>setMesCours(m=>!m)}
                  style={{ display:"flex", alignItems:"center", gap:7,
                    padding:"7px 14px", borderRadius:20, border:"none",
                    background:mesCours?G.grad:"white",
                    color:mesCours?"white":"#64748b",
                    fontSize:12.5, fontWeight:mesCours?700:500,
                    cursor:"pointer", fontFamily:"inherit",
                    boxShadow:mesCours?`0 2px 8px ${G.primary}40`:"0 1px 3px rgba(0,0,0,0.06)" }}>
                  👨‍🏫 {mesCours ? "Mes cours uniquement" : "Tous les cours"}
                </button>

                {/* Filière filter */}
                <select value={filterFiliere} onChange={e=>setFilterFiliere(e.target.value)}
                  style={{ padding:"7px 12px", borderRadius:20,
                    border:`1.5px solid ${G.border}`, background:G.lighter,
                    fontSize:12.5, color:G.dark, fontFamily:"inherit", outline:"none" }}>
                  <option value="all">Toutes filières</option>
                  {(PROF_FILIERES || Object.keys(GROUPES_PAR_FILIERE)).map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>

                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:13, color:"#64748b", fontWeight:600 }}>Vue :</span>
                  {["groupe","enseignant","salle"].map(v=>(
                    <button key={v} onClick={()=>setViewMode(v)}
                      style={{ padding:"6px 13px", borderRadius:20, border:"none",
                        background:viewMode===v?G.grad:"white",
                        color:viewMode===v?"white":"#64748b",
                        fontSize:12.5, fontWeight:viewMode===v?700:500,
                        cursor:"pointer", fontFamily:"inherit",
                        boxShadow:viewMode===v?`0 2px 8px ${G.primary}40`:"0 1px 3px rgba(0,0,0,0.06)" }}>
                      {v==="groupe"?"👥 Groupe":v==="enseignant"?"👨‍🏫 Enseignant":"🏫 Salle"}
                    </button>
                  ))}
                </div>
                <div style={{ flex:1 }}/>
                {viewMode==="groupe" && (
                  <select value={filterGroupe} onChange={e=>setFilterGroupe(e.target.value)}
                    style={{ padding:"8px 12px", borderRadius:10,
                      border:`1.5px solid ${G.border}`, background:G.lighter,
                      fontSize:13, color:G.dark, fontFamily:"inherit", outline:"none" }}>
                    <option value="all">Tous les groupes</option>
                    {GROUPES.map(g=><option key={g}>{g}</option>)}
                  </select>
                )}
                {viewMode==="enseignant" && (
                  <select value={filterEns} onChange={e=>setFilterEns(e.target.value)}
                    style={{ padding:"8px 12px", borderRadius:10,
                      border:`1.5px solid ${G.border}`, background:G.lighter,
                      fontSize:13, color:G.dark, fontFamily:"inherit", outline:"none" }}>
                    <option value="all">Tous les enseignants</option>
                    {ENSEIGNANTS.map(e=><option key={e}>{e.replace("Prof. ","")}</option>)}
                  </select>
                )}
                {viewMode==="salle" && (
                  <select value={filterSalle} onChange={e=>setFilterSalle(e.target.value)}
                    style={{ padding:"8px 12px", borderRadius:10,
                      border:`1.5px solid ${G.border}`, background:G.lighter,
                      fontSize:13, color:G.dark, fontFamily:"inherit", outline:"none" }}>
                    <option value="all">Toutes les salles</option>
                    {SALLES.map(s=><option key={s.id}>{s.nom}</option>)}
                  </select>
                )}
                <button onClick={()=>setModal("addseance")}
                  style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
                    borderRadius:10, border:"none", background:G.grad, color:"white",
                    fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                    boxShadow:`0 2px 10px ${G.primary}40` }}>
                  <Plus size={14}/> Ajouter séance
                </button>
              </div>

              {/* legend */}
              <div style={{ display:"flex", gap:10, marginBottom:12, flexWrap:"wrap" }}>
                {Object.entries(TYPE_COLORS).map(([t,c])=>(
                  <div key={t} style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <div style={{ width:10,height:10,borderRadius:3,background:c }}/>
                    <span style={{ fontSize:12,color:"#64748b",fontWeight:500 }}>{t}</span>
                  </div>
                ))}
                <div style={{ display:"flex", alignItems:"center", gap:5, marginLeft:10 }}>
                  <Lock size={11} color="#94a3b8"/>
                  <span style={{ fontSize:12,color:"#94a3b8" }}>Verrouillé</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <AlertTriangle size={11} color="#ef4444"/>
                  <span style={{ fontSize:12,color:"#94a3b8" }}>Conflit</span>
                </div>
              </div>

              <GrilleEDT edt={profEdt} setEdt={setEdt} conflicts={conflicts}
                viewMode={viewMode}
                filterGroupe={viewMode==="groupe"?filterGroupe:"all"}
                filterEnseignant={viewMode==="enseignant"?filterEns:"all"}
                filterSalle={viewMode==="salle"?filterSalle:"all"}
                onCellClick={(jour,slot)=>setModal({type:"addseance",jour,slot})}/>
            </motion.div>
          )}

          {/* RÉSERVATIONS */}
          {activeTab==="reservations" && (
            <motion.div key="res"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}} transition={{duration:0.28}}>

              <div style={{ display:"flex", gap:10, marginBottom:14, alignItems:"center" }}>
                <div style={{ fontSize:13.5, fontWeight:600, color:"#0f172a" }}>
                  {reservations.length} réservation{reservations.length>1?"s":""}
                </div>
                <div style={{ flex:1 }}/>
                <div style={{ fontSize:12, color:"#64748b", display:"flex", alignItems:"center", gap:8 }}>
                  Priorités :
                  {Object.entries(PRIO_COLORS).map(([t,c])=>(
                    <span key={t} style={{ background:c+"18",color:c,fontSize:11.5,
                      fontWeight:700,borderRadius:20,padding:"2px 9px" }}>
                      {t==="cours"?"📚 Cours":t==="evenement"?"🎤 Évén.":"🎭 Club"}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {reservations.map((r,i)=>{
                  const statCfg = {
                    en_attente:{ color:"#f59e0b", bg:"#fffbeb", label:"En attente" },
                    confirmee:  { color:G.primary, bg:G.lighter, label:"Confirmée" },
                    conflit:    { color:"#ef4444", bg:"#fef2f2", label:"Conflit !" },
                    annulee:    { color:"#94a3b8", bg:"#f1f5f9", label:"Annulée" },
                  }[r.statut]||{color:"#94a3b8",bg:"#f1f5f9",label:r.statut};
                  return (
                    <motion.div key={r.id}
                      initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                      transition={{delay:i*0.06}}
                      whileHover={{x:4}}
                      style={{ background:"white", borderRadius:14,
                        border:`1px solid ${r.statut==="conflit"?"#fecaca":"#e2e8f0"}`,
                        padding:"15px 20px",
                        display:"flex", alignItems:"center", gap:16,
                        boxShadow:r.statut==="conflit"?"0 0 0 2px #fee2e2":"0 1px 6px rgba(0,0,0,0.04)" }}>
                      <div style={{ width:42, height:42, borderRadius:12,
                        background:PRIO_COLORS[r.type]+"18",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        flexShrink:0 }}>
                        <Layers size={20} color={PRIO_COLORS[r.type]}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:3 }}>
                          {r.motif}
                        </div>
                        <div style={{ fontSize:12, color:"#64748b",
                          display:"flex", gap:10, flexWrap:"wrap" }}>
                          <span>🏫 {SALLES.find(s=>s.id===r.ressource)?.nom||r.ressource}</span>
                          <span>📅 {r.créneau.replace("-S1"," 08:00").replace("-S2"," 10:00").replace("-S3"," 14:00").replace("-S4"," 16:00")}</span>
                          <span>👤 {r.demandeur}</span>
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:7, flexShrink:0 }}>
                        <span style={{ background:statCfg.bg, color:statCfg.color,
                          fontSize:11.5, fontWeight:700, borderRadius:20, padding:"3px 10px" }}>
                          {statCfg.label}
                        </span>
                        <div style={{ display:"flex", gap:6 }}>
                          {r.statut==="en_attente" && <>
                            <button onClick={()=>setReservations(p=>p.map(x=>x.id===r.id?{...x,statut:"confirmee"}:x))}
                              style={{ width:28,height:28,borderRadius:8,border:"none",
                                background:"#ecfdf5",cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <Check size={13} color={G.primary}/>
                            </button>
                            <button onClick={()=>setReservations(p=>p.map(x=>x.id===r.id?{...x,statut:"annulee"}:x))}
                              style={{ width:28,height:28,borderRadius:8,border:"none",
                                background:"#fef2f2",cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center" }}>
                              <X size={13} color="#ef4444"/>
                            </button>
                          </>}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STATISTIQUES */}
          {activeTab==="stats" && (
            <motion.div key="stats"
              initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0,y:-8}} transition={{duration:0.28}}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:24 }}>
                <StatCard icon={Calendar} label="Séances/semaine" value={stats.seances}     color={G.primary} sub="Semestre en cours"/>
                <StatCard icon={Users}    label="Groupes actifs"  value={stats.groupes}     color="#8b5cf6"/>
                <StatCard icon={Layers}   label="Salles utilisées"value={stats.salles}      color="#3b82f6"/>
                <StatCard icon={AlertTriangle} label="Conflits"   value={conflicts.length}  color={conflicts.length>0?"#ef4444":"#10b981"} sub={conflicts.length===0?"Aucun conflit ✓":"À résoudre"}/>
              </div>

              {/* taux occupation par salle */}
              <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                padding:"24px", marginBottom:16, boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:18 }}>
                  Taux d'occupation des salles
                </div>
                {SALLES.slice(0,6).map(s=>{
                  const used = edt.filter(e=>e.salle===s.id).length;
                  const maxSlots = JOURS.length * SLOTS.length;
                  const pct = Math.round((used/maxSlots)*100);
                  return (
                    <div key={s.id} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", justifyContent:"space-between",
                        marginBottom:5, fontSize:13 }}>
                        <span style={{ fontWeight:600, color:"#0f172a" }}>{s.nom}</span>
                        <span style={{ color:G.primary, fontWeight:700 }}>{pct}% · {used}/{maxSlots} créneaux</span>
                      </div>
                      <div style={{ height:8, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                        <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                          transition={{duration:0.8, delay:0.1}}
                          style={{ height:"100%",
                            background:pct>70?G.grad:"linear-gradient(135deg,#a7f3d0,#10b981)",
                            borderRadius:99 }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* répartition par type */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Répartition par type
                  </div>
                  {["CM","TD","TP"].map(t=>{
                    const cnt = edt.filter(e=>e.type===t).length;
                    const pct = Math.round((cnt/edt.length)*100);
                    return (
                      <div key={t} style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                        <span style={{ width:32, height:32, borderRadius:9,
                          background:TYPE_COLORS[t]+"18",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontSize:11, fontWeight:800, color:TYPE_COLORS[t], flexShrink:0 }}>{t}</span>
                        <div style={{ flex:1 }}>
                          <div style={{ height:8, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                            <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                              transition={{duration:0.7}}
                              style={{ height:"100%", background:TYPE_COLORS[t], borderRadius:99 }}/>
                          </div>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:TYPE_COLORS[t], minWidth:40, textAlign:"right" }}>
                          {cnt} ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Charge enseignants
                  </div>
                  {ENSEIGNANTS.map(ens=>{
                    const cnt = edt.filter(e=>e.enseignant===ens).length;
                    const pct = Math.round((cnt/JOURS.length/SLOTS.length)*100);
                    return (
                      <div key={ens} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:9 }}>
                        <div style={{ width:28, height:28, borderRadius:8, background:G.grad,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"white", fontSize:10, fontWeight:800, flexShrink:0 }}>
                          {ens.split(" ").pop()[0]}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:12, fontWeight:600, color:"#0f172a", marginBottom:3 }}>
                            {ens.replace("Prof. ","")}
                          </div>
                          <div style={{ height:6, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                            <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                              transition={{duration:0.7}}
                              style={{ height:"100%", background:G.primary, borderRadius:99 }}/>
                          </div>
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:G.primary, minWidth:30 }}>
                          {cnt}h
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ── MODALS ── */}
      <AnimatePresence>
        {modal==="reservation" && (
          <ReservationModal
            onClose={()=>setModal(null)}
            onSave={addReservation}
            existingReservations={reservations}
            edt={edt}/>
        )}
        {(modal==="addseance" || (modal&&modal.type==="addseance")) && (
          <AddSeanceModal
            onClose={()=>setModal(null)}
            onSave={addSeance}
            defaultJour={modal?.jour}
            defaultSlot={modal?.slot}
            edt={edt}/>
        )}

      </AnimatePresence>
    </div>
  );
}