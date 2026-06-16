import { notes as notesAPI } from "./api.js";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Download, Bell, ChevronRight,
  Users, BookOpen, BarChart2, Filter, X, Check,
  TrendingUp, TrendingDown, Minus, Eye, Star,
  ChevronDown, FileText, PenLine, AlertCircle,
  GraduationCap, Award, ClipboardList, Hash,
} from "lucide-react";

/* ── Palette rose ───────────────────────────────────────────── */
const P = {
  primary: "#ec4899",
  dark:    "#831843",
  mid:     "#db2777",
  light:   "#fce7f3",
  lighter: "#fdf2f8",
  border:  "#fbcfe8",
  grad:    "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  gradWarm:"linear-gradient(135deg, #ec4899 0%, #f97316 100%)",
};

/* ── Data ───────────────────────────────────────────────────── */
// Toutes les filières — codes identiques à RegisterPage
const ALL_FILIERES = [
  { code:"GI",   label:"Génie Informatique",                          couleur:"#3b82f6" },
  { code:"AI",   label:"Intelligence Artificielle",                   couleur:"#8b5cf6" },
  { code:"DWM",  label:"Développement Web et Multimédia",             couleur:"#0ea5e9" },
  { code:"GE",   label:"Génie Électrique",                            couleur:"#f59e0b" },
  { code:"GTE",  label:"Génie Thermique et Électrique",               couleur:"#f97316" },
  { code:"GETE", label:"Génie Électrique et Techniques Énergétiques", couleur:"#ef4444" },
  { code:"GC",   label:"Génie Civil",                                 couleur:"#10b981" },
  { code:"PMD",  label:"Production et Maintenance des Dispositifs",   couleur:"#059669" },
  { code:"TM",   label:"Technique de Management",                     couleur:"#8b5cf6" },
  { code:"FBA",  label:"Finance, Banque et Assurance",                couleur:"#6366f1" },
  { code:"TCC",  label:"Technique de Communication et Création",      couleur:"#ec4899" },
];

// MATIERES par filière — codes RegisterPage
const MATIERES_PAR_FILIERE_ALL = {
  "GI":   ["Algorithmique avancée", "Base de Données", "Réseaux informatiques", "POO & Génie Logiciel"],
  "AI":   ["Machine Learning", "Python & Data Science", "Deep Learning", "NLP"],
  "DWM":  ["HTML/CSS & Design", "JavaScript", "PHP/MySQL", "UI/UX Design"],
  "GE":   ["Circuits électriques", "Électronique de puissance", "Automatique"],
  "GTE":  ["Thermodynamique", "Machines électriques", "Automatique industrielle"],
  "GETE": ["Énergies renouvelables", "Smart Grid", "Efficacité énergétique"],
  "GC":   ["Résistance des matériaux", "Béton armé", "Topographie"],
  "PMD":  ["Maintenance industrielle", "CAO/DAO", "Gestion de production"],
  "TM":   ["Management des organisations", "Marketing stratégique", "Droit des affaires"],
  "FBA":  ["Comptabilité générale", "Analyse financière", "Marchés financiers"],
  "TCC":  ["Communication orale", "Marketing digital", "Relations publiques", "Communication visuelle"],
};

// merged into MATIERES_PAR_FILIERE_ALL above
const MATIERES_PAR_FILIERE_LEGACY = {
  "GI":  ["Algorithmique", "Base de Données", "Réseaux", "POO", "Systèmes d'exploitation"],
  "AI":  ["Machine Learning", "Algorithmique", "Statistiques", "Python Avancé", "Big Data"],
  "AI_M1":  ["Deep Learning", "NLP", "Computer Vision", "IA Avancée", "Projet de recherche"],
  "DWM": ["HTML/CSS", "JavaScript", "PHP/MySQL", "Design UI/UX", "Gestion de projet"],
};

const TYPES_EVAL = [
  { id:"cc",     label:"Contrôle Continu", abr:"CC",  weight:30, couleur:"#3b82f6" },
  { id:"tp",     label:"Travaux Pratiques",abr:"TP",  weight:20, couleur:"#10b981" },
  { id:"examen", label:"Examen Final",     abr:"EF",  weight:50, couleur:"#ec4899" },
];

/* génère étudiants */
const NOMS = ["Amrani","Benchekroun","Tazi","El Idrissi","Filali","Benmoussa","Alami","Ziani","Moujahid","Berrada","Benali","Kaddouri","Alaoui","Moussaoui","Bensouda","Khattabi"];
const PRENOMS = ["Yassine","Salma","Mehdi","Fatima","Omar","Aicha","Rachid","Nour","Hassan","Zineb","Amine","Khadija","Rim","Hajar","Tariq","Meryem"];

function makeNote() { return +(Math.random()*9+8).toFixed(2); }
function makeMention(avg) {
  if (avg >= 16) return { label:"TB", color:"#10b981", bg:"#ecfdf5" };
  if (avg >= 14) return { label:"B",  color:"#3b82f6", bg:"#eff6ff" };
  if (avg >= 12) return { label:"AB", color:"#f59e0b", bg:"#fffbeb" };
  if (avg >= 10) return { label:"P",  color:"#64748b", bg:"#f1f5f9" };
  return { label:"F", color:"#ef4444", bg:"#fef2f2" };
}

function generateEtudiants(filiere, count) {
  const matieres = MATIERES_PAR_FILIERE_ALL[filiere] || MATIERES_PAR_FILIERE_ALL["GI"];
  return Array.from({ length: count }, (_, i) => {
    const prenom = PRENOMS[(i * 3) % PRENOMS.length];
    const nom    = NOMS[(i * 7 + 3) % NOMS.length];
    const notes  = {};
    matieres.forEach(m => {
      notes[m] = {
        cc:     makeNote(),
        tp:     makeNote(),
        examen: makeNote(),
      };
    });
    // weighted average
    const avgs = matieres.map(m => {
      const n = notes[m];
      return (n.cc * 0.3 + n.tp * 0.2 + n.examen * 0.5);
    });
    const moy = +(avgs.reduce((a, b) => a + b, 0) / avgs.length).toFixed(2);
    return {
      id: `${filiere}-${i+1}`,
      cne: `R${String(130000000 + i * 1234 + filiere.charCodeAt(0)).slice(0,9)}`,
      prenom, nom,
      filiere,
      notes,
      moyenne: moy,
      absences: Math.floor(Math.random() * 6),
      statut: moy >= 10 ? "admis" : "rattrapage",
    };
  });
}

const ALL_ETUDIANTS = {
  "GI":   generateEtudiants("GI",   18),
  "AI":   generateEtudiants("AI",   14),
  "DWM":  generateEtudiants("DWM",  12),
  "GE":   generateEtudiants("GE",   20),
  "GTE":  generateEtudiants("GTE",  16),
  "GETE": generateEtudiants("GETE", 14),
  "GC":   generateEtudiants("GC",   18),
  "PMD":  generateEtudiants("PMD",  15),
  "TM":   generateEtudiants("TM",   22),
  "FBA":  generateEtudiants("FBA",  20),
  "TCC":  generateEtudiants("TCC",  16),
};

/* ── Helpers ─────────────────────────────────────────────────── */
const noteColor = (n) =>
  n >= 16 ? "#10b981" : n >= 14 ? "#3b82f6" : n >= 12 ? "#f59e0b" : n >= 10 ? "#64748b" : "#ef4444";

const noteBg = (n) =>
  n >= 16 ? "#ecfdf5" : n >= 14 ? "#eff6ff" : n >= 12 ? "#fffbeb" : n >= 10 ? "#f8fafc" : "#fef2f2";

function NoteCell({ value }) {
  const col = noteColor(value);
  const bg  = noteBg(value);
  return (
    <div style={{
      background: bg, color: col,
      fontSize: 12.5, fontWeight: 700,
      borderRadius: 8, padding: "4px 8px",
      textAlign: "center", minWidth: 46,
      display: "inline-block",
    }}>
      {value.toFixed(1)}
    </div>
  );
}

function StatutBadge({ statut }) {
  const cfg = {
    admis:      { label: "Admis",      color: "#10b981", bg: "#ecfdf5" },
    rattrapage: { label: "Rattrapage", color: "#f59e0b", bg: "#fffbeb" },
  }[statut];
  return (
    <span style={{ background: cfg.bg, color: cfg.color,
      fontSize: 11.5, fontWeight: 700, borderRadius: 20,
      padding: "3px 10px" }}>{cfg.label}</span>
  );
}

/* ── Export CSV ─────────────────────────────────────────────── */
function exportCSV(etudiants, filiere, matieres) {
  const header = ["CNE","Prénom","Nom","Filière",
    ...matieres.flatMap(m => [`${m} (CC)`,`${m} (TP)`,`${m} (EF)`]),
    "Moyenne","Absences","Statut"
  ].join(",");
  const rows = etudiants.map(e => [
    e.cne, e.prenom, e.nom, e.filiere,
    ...matieres.flatMap(m => [e.notes[m].cc, e.notes[m].tp, e.notes[m].examen]),
    e.moyenne, e.absences, e.statut
  ].join(","));
  const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `etudiants_${filiere}_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

/* ── Student Detail Modal ───────────────────────────────────── */
function StudentModal({ etudiant, matieres, onClose }) {
  const [editNote, setEditNote] = useState(null); // {matiere, type, val}
  const [notes, setNotes] = useState(etudiant.notes);
  const [saved, setSaved] = useState(false);

  const recalcMoy = (n) => {
    const avgs = matieres.map(m => n[m].cc*0.3 + n[m].tp*0.2 + n[m].examen*0.5);
    return +(avgs.reduce((a,b)=>a+b,0)/avgs.length).toFixed(2);
  };

  const moy = recalcMoy(notes);
  const mention = makeMention(moy);

  const saveEdit = () => {
    if (!editNote) return;
    const updated = {
      ...notes,
      [editNote.matiere]: {
        ...notes[editNote.matiere],
        [editNote.type]: +editNote.val,
      }
    };
    setNotes(updated);
    // Sauvegarder en base
    notesAPI.bulk({ notes: updated.map(n=>({
      etudiant_id: etudiant.id, matiere_id: n.matiereId||n.id,
      cc: n.cc, tp: n.tp, examen: n.examen||n.ef,
      semestre: "S1", annee_universitaire: "2024-2025",
    }))}).catch(()=>{});
    setEditNote(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        style={{ background:"white",borderRadius:22,width:"100%",maxWidth:640,
          maxHeight:"90vh",overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)" }}>

        {/* header */}
        <div style={{ padding:"20px 24px 16px", background:P.grad,
          position:"sticky",top:0,zIndex:1,
          display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{ display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:42,height:42,borderRadius:12,
              background:"rgba(255,255,255,0.22)",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:18,fontWeight:800,color:"white" }}>
              {etudiant.prenom[0]}{etudiant.nom[0]}
            </div>
            <div>
              <div style={{ fontSize:16,fontWeight:800,color:"white" }}>
                {etudiant.prenom} {etudiant.nom}
              </div>
              <div style={{ fontSize:12,color:"rgba(255,255,255,0.7)" }}>
                CNE : {etudiant.cne} · {etudiant.filiere}
              </div>
            </div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)",border:"none",
              cursor:"pointer",color:"white",padding:8,borderRadius:9,display:"flex" }}>
            <X size={16}/>
          </button>
        </div>

        <div style={{ padding:"22px 24px 26px",display:"flex",flexDirection:"column",gap:16 }}>

          {/* KPIs */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
            {[
              { label:"Moyenne", value:moy.toFixed(2), color:noteColor(moy), bg:noteBg(moy) },
              { label:"Mention", value:mention.label,  color:mention.color,  bg:mention.bg },
              { label:"Absences",value:etudiant.absences, color:etudiant.absences>3?"#ef4444":"#64748b", bg:etudiant.absences>3?"#fef2f2":"#f8fafc" },
              { label:"Statut",  value:etudiant.statut==="admis"?"✅ Admis":"⚠️ Rattr.", color:etudiant.statut==="admis"?"#10b981":"#f59e0b", bg:etudiant.statut==="admis"?"#ecfdf5":"#fffbeb" },
            ].map(k => (
              <div key={k.label} style={{ background:k.bg,border:`1px solid ${k.color}22`,
                borderRadius:12,padding:"12px 14px",textAlign:"center" }}>
                <div style={{ fontSize:20,fontWeight:800,color:k.color }}>{k.value}</div>
                <div style={{ fontSize:11.5,color:"#64748b",marginTop:3 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* notes table */}
          <div>
            <div style={{ fontSize:13.5,fontWeight:800,color:"#0f172a",
              marginBottom:10,display:"flex",alignItems:"center",
              justifyContent:"space-between" }}>
              <span>Notes par matière</span>
              {saved && (
                <motion.span initial={{opacity:0}} animate={{opacity:1}}
                  style={{ fontSize:12,color:"#10b981",fontWeight:600,
                    display:"flex",alignItems:"center",gap:4 }}>
                  <Check size={13}/> Sauvegardé
                </motion.span>
              )}
            </div>
            <div style={{ borderRadius:13,border:"1px solid #e2e8f0",overflow:"hidden" }}>
              <table style={{ width:"100%",borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:"#f8fafc" }}>
                    <th style={{ padding:"10px 14px",textAlign:"left",
                      fontSize:12,fontWeight:700,color:"#64748b",
                      borderBottom:"1px solid #e2e8f0" }}>Matière</th>
                    {TYPES_EVAL.map(t => (
                      <th key={t.id} style={{ padding:"10px 14px",textAlign:"center",
                        fontSize:12,fontWeight:700,color:t.couleur,
                        borderBottom:"1px solid #e2e8f0",whiteSpace:"nowrap" }}>
                        {t.abr}
                        <span style={{ fontSize:10,color:"#94a3b8",fontWeight:400,marginLeft:4 }}>
                          ×{t.weight}%
                        </span>
                      </th>
                    ))}
                    <th style={{ padding:"10px 14px",textAlign:"center",
                      fontSize:12,fontWeight:700,color:"#ec4899",
                      borderBottom:"1px solid #e2e8f0" }}>Moy.</th>
                  </tr>
                </thead>
                <tbody>
                  {matieres.map((m, i) => {
                    const n = notes[m];
                    const matiereAvg = +(n.cc*0.3 + n.tp*0.2 + n.examen*0.5).toFixed(2);
                    return (
                      <tr key={m} style={{ borderBottom:i<matieres.length-1?"1px solid #f1f5f9":"none" }}>
                        <td style={{ padding:"10px 14px",fontSize:13,fontWeight:600,color:"#0f172a" }}>
                          {m}
                        </td>
                        {TYPES_EVAL.map(t => (
                          <td key={t.id} style={{ padding:"8px 14px",textAlign:"center" }}>
                            {editNote?.matiere===m && editNote?.type===t.id ? (
                              <div style={{ display:"flex",gap:4,alignItems:"center",justifyContent:"center" }}>
                                <input
                                  type="number" min={0} max={20} step={0.25}
                                  value={editNote.val}
                                  onChange={e=>setEditNote(p=>({...p,val:e.target.value}))}
                                  style={{ width:56,padding:"4px 6px",borderRadius:7,
                                    border:`1.5px solid ${P.primary}`,fontSize:13,
                                    fontWeight:700,textAlign:"center",outline:"none" }}
                                  autoFocus
                                />
                                <button onClick={saveEdit}
                                  style={{ width:24,height:24,borderRadius:6,border:"none",
                                    background:"#ecfdf5",cursor:"pointer",
                                    display:"flex",alignItems:"center",justifyContent:"center" }}>
                                  <Check size={12} color="#10b981"/>
                                </button>
                                <button onClick={()=>setEditNote(null)}
                                  style={{ width:24,height:24,borderRadius:6,border:"none",
                                    background:"#f1f5f9",cursor:"pointer",
                                    display:"flex",alignItems:"center",justifyContent:"center" }}>
                                  <X size={12} color="#94a3b8"/>
                                </button>
                              </div>
                            ) : (
                              <div style={{ display:"flex",alignItems:"center",
                                justifyContent:"center",gap:6 }}>
                                <NoteCell value={n[t.id]}/>
                                <button
                                  onClick={()=>setEditNote({matiere:m,type:t.id,val:n[t.id]})}
                                  title="Modifier"
                                  style={{ width:22,height:22,borderRadius:6,border:"none",
                                    background:"#f1f5f9",cursor:"pointer",
                                    display:"flex",alignItems:"center",justifyContent:"center",
                                    opacity:0.5 }}
                                  onMouseEnter={e=>e.currentTarget.style.opacity="1"}
                                  onMouseLeave={e=>e.currentTarget.style.opacity="0.5"}>
                                  <PenLine size={11} color="#64748b"/>
                                </button>
                              </div>
                            )}
                          </td>
                        ))}
                        <td style={{ padding:"8px 14px",textAlign:"center" }}>
                          <NoteCell value={matiereAvg}/>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {/* footer row */}
                <tfoot>
                  <tr style={{ background:"#fdf2f8",borderTop:"2px solid #fbcfe8" }}>
                    <td style={{ padding:"10px 14px",fontSize:13,fontWeight:800,color:"#831843" }}>
                      Moyenne générale
                    </td>
                    <td colSpan={3}/>
                    <td style={{ padding:"10px 14px",textAlign:"center" }}>
                      <span style={{ fontSize:15,fontWeight:800,color:noteColor(moy) }}>
                        {moy.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* absences & observations */}
          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
            <div style={{
              background: etudiant.absences>3 ? "#fef2f2" : "#f8fafc",
              border:`1px solid ${etudiant.absences>3?"#fecaca":"#e2e8f0"}`,
              borderRadius:12, padding:"13px 16px" }}>
              <div style={{ fontSize:12,fontWeight:700,
                color:etudiant.absences>3?"#991b1b":"#64748b",marginBottom:6 }}>
                ⚠️ Absences justifiées
              </div>
              <div style={{ fontSize:22,fontWeight:800,
                color:etudiant.absences>3?"#ef4444":"#0f172a" }}>
                {etudiant.absences}
              </div>
              {etudiant.absences>3 && (
                <div style={{ fontSize:11.5,color:"#ef4444",marginTop:4 }}>
                  Dépasse le seuil autorisé (3)
                </div>
              )}
            </div>
            <div style={{ background:"#f5f3ff",border:"1px solid #ddd6fe",
              borderRadius:12,padding:"13px 16px" }}>
              <div style={{ fontSize:12,fontWeight:700,color:"#7c3aed",marginBottom:6 }}>
                📊 Progression
              </div>
              <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                {moy>=12
                  ? <TrendingUp size={22} color="#10b981"/>
                  : moy>=10
                  ? <Minus size={22} color="#f59e0b"/>
                  : <TrendingDown size={22} color="#ef4444"/>
                }
                <span style={{ fontSize:14,fontWeight:700,
                  color:moy>=12?"#10b981":moy>=10?"#f59e0b":"#ef4444" }}>
                  {moy>=12?"En progression":moy>=10?"Stable":"En difficulté"}
                </span>
              </div>
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function EtudiantsPage() {
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
  const [activeFiliere, setActiveFiliere] = useState("GI");
  const [activeTab, setActiveTab]         = useState("liste");
  const [search, setSearch]               = useState("");
  const [filterStatut, setFilterStatut]   = useState("all");
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [evalType, setEvalType]           = useState("cc");

  // Filières du prof connecté (depuis localStorage)
  const profFilieres = (() => {
    try {
      const u = JSON.parse(localStorage.getItem("umi_user")) || {};
      const codes = Array.isArray(u.filieres) && u.filieres.length > 0
        ? u.filieres
        : u.filiere ? [u.filiere] : null;
      if (!codes) return ALL_FILIERES; // fallback: toutes les filières
      return ALL_FILIERES.filter(f => codes.includes(f.code));
    } catch { return ALL_FILIERES; }
  })();

  // S'assurer que la filière active est valide pour ce prof
  const validActiveFiliere = profFilieres.find(f => f.code === activeFiliere)
    ? activeFiliere
    : (profFilieres[0]?.code || "GI");

  const filiere  = profFilieres.find(f => f.code === validActiveFiliere);
  const matieres = MATIERES_PAR_FILIERE_ALL[validActiveFiliere] || MATIERES_PAR_FILIERE_ALL["GI-L3"];
  const etudiants = ALL_ETUDIANTS[validActiveFiliere] || [];

  const filtered = useMemo(() => etudiants.filter(e => {
    const q = search.toLowerCase();
    const matchQ = `${e.prenom} ${e.nom}`.toLowerCase().includes(q) || e.cne.includes(q);
    const matchS = filterStatut === "all" || e.statut === filterStatut;
    return matchQ && matchS;
  }), [etudiants, search, filterStatut]);

  const stats = useMemo(() => ({
    total:      (etudiants||[]).length,
    admis:      etudiants.filter(e => e.statut === "admis").length,
    rattrapage: etudiants.filter(e => e.statut === "rattrapage").length,
    moyGeneral: +(etudiants.reduce((a,e) => a+e.moyenne, 0) / etudiants.length).toFixed(2),
  }), [etudiants]);

  /* stats par matière */
  const statsMatieres = useMemo(() => matieres.map(m => {
    const moyCC    = +(etudiants.reduce((a,e)=>a+e.notes[m].cc,0)/etudiants.length).toFixed(2);
    const moyTP    = +(etudiants.reduce((a,e)=>a+e.notes[m].tp,0)/etudiants.length).toFixed(2);
    const moyExam  = +(etudiants.reduce((a,e)=>a+e.notes[m].examen,0)/etudiants.length).toFixed(2);
    const moyMat   = +(etudiants.reduce((a,e)=>a+(e.notes[m].cc*0.3+e.notes[m].tp*0.2+e.notes[m].examen*0.5),0)/etudiants.length).toFixed(2);
    const enDiff   = etudiants.filter(e=>e.notes[m].cc*0.3+e.notes[m].tp*0.2+e.notes[m].examen*0.5<10).length;
    return { matiere:m, moyCC, moyTP, moyExam, moyMat, enDiff };
  }), [etudiants, matieres]);

  const TABS = [
    { id:"liste",  label:"Liste étudiants", icon:Users },
    { id:"notes",  label:"Tableau des notes", icon:ClipboardList },
    { id:"stats",  label:"Statistiques",    icon:BarChart2 },
  ];

  return (
    <div style={{ minHeight:"100vh",
      background:"linear-gradient(160deg,#fdf2f8 0%,#fce7f3 30%,#f8faff 100%)",
      fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* NAVBAR */}
      <motion.nav initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
        style={{ height:62,background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(18px)",borderBottom:`1px solid ${P.border}55`,
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"0 32px",position:"sticky",top:0,zIndex:100,
          boxShadow:`0 2px 20px ${P.primary}10` }}>
        <div style={{ display:"flex",alignItems:"center",gap:14 }}>
          <motion.button onClick={()=>navigate("/teacher")}
            whileHover={{scale:1.04,x:-2}} whileTap={{scale:0.96}}
            style={{ display:"flex",alignItems:"center",gap:7,
              background:P.lighter,border:`1px solid ${P.border}`,
              borderRadius:10,padding:"7px 13px",cursor:"pointer",
              color:P.primary,fontSize:13,fontWeight:600,fontFamily:"inherit" }}>
            <ArrowLeft size={15}/> Retour
          </motion.button>
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <span style={{ fontSize:13,color:"#94a3b8" }}>Accueil</span>
            <ChevronRight size={13} color="#cbd5e1"/>
            <span style={{ fontSize:13,fontWeight:700,color:P.primary }}>Étudiants</span>
          </div>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ display:"flex",alignItems:"center",background:"#f1f5f9",
            borderRadius:10,padding:"0 13px",gap:7,width:240 }}>
            <Search size={14} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Nom, CNE…"
              style={{ border:"none",outline:"none",background:"transparent",
                fontSize:13,color:"#0f172a",padding:"9px 0",
                fontFamily:"inherit",width:"100%" }}/>
            {search && <button onClick={()=>setSearch("")}
              style={{ background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:0 }}>
              <X size={13}/></button>}
          </div>
          <motion.button
            onClick={()=>exportCSV(filtered, activeFiliere, matieres)}
            whileHover={{scale:1.03}} whileTap={{scale:0.97}}
            style={{ display:"flex",alignItems:"center",gap:6,padding:"9px 16px",
              borderRadius:10,border:"none",background:P.grad,color:"white",
              fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",
              boxShadow:`0 2px 12px ${P.primary}40` }}>
            <Download size={14}/> Exporter Excel
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
                background:"#fdf2f8",border:"1.5px solid #fbcfe8",
                borderRadius:10,padding:"5px 12px 5px 6px",cursor:"pointer" }}>
              <div style={{ width:28,height:28,borderRadius:8,
                background:"linear-gradient(135deg,#ec4899,#ec4899cc)",
                display:"flex",alignItems:"center",justifyContent:"center",
                color:"white",fontSize:13,fontWeight:800 }}>{_initials}</div>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:"#0f172a",lineHeight:1 }}>{_isProf?"Prof. ":""}{_displayName}</div>
                <div style={{ fontSize:10.5,color:"#ec4899",fontWeight:600,marginTop:1 }}>{_roleLabel}</div>
              </div>
            </div>
            {profileOpen&&<ProfilePanel onClose={()=>setProfileOpen(false)}/>}
          </div>
        </div>
      </motion.nav>

      <div style={{ maxWidth:1380,margin:"0 auto",padding:"28px 32px 60px" }}>

        {/* Hero */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:0.6,delay:0.1}}
          style={{ borderRadius:20,background:P.gradWarm,padding:"24px 32px",
            marginBottom:24,display:"flex",alignItems:"center",
            justifyContent:"space-between",position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",right:-30,top:-30,width:160,height:160,
            borderRadius:"50%",background:"rgba(255,255,255,0.08)" }}/>
          <div style={{ position:"relative",zIndex:1 }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:7,
              background:"rgba(255,255,255,0.18)",borderRadius:20,
              padding:"4px 13px",marginBottom:10 }}>
              <span style={{ fontSize:16 }}>🎓</span>
              <span style={{ fontSize:12,color:"white",fontWeight:600 }}>
                Mes étudiants — {_isProf?"Prof. ":""}{_displayName}
              </span>
            </div>
            <h1 style={{ fontSize:24,fontWeight:800,color:"white",
              letterSpacing:"-0.4px",margin:"0 0 5px" }}>
              Suivi des étudiants & évaluations
            </h1>
            <p style={{ fontSize:14,color:"rgba(255,255,255,0.75)",margin:0 }}>
              Notes, moyennes, absences et progression par filière
            </p>
          </div>
          <div style={{ display:"flex",gap:10,position:"relative",zIndex:1 }}>
            {[
              { v:stats.total,      l:"Étudiants", icon:"👥" },
              { v:stats.admis,      l:"Admis",     icon:"✅" },
              { v:stats.rattrapage, l:"Rattrapage",icon:"⚠️" },
              { v:stats.moyGeneral, l:"Moy. classe",icon:"📊" },
            ].map(s=>(
              <div key={s.l} style={{ background:"rgba(255,255,255,0.15)",
                backdropFilter:"blur(8px)",border:"1px solid rgba(255,255,255,0.25)",
                borderRadius:13,padding:"11px 16px",
                display:"flex",flexDirection:"column",alignItems:"center",minWidth:76 }}>
                <span style={{ fontSize:18,marginBottom:4 }}>{s.icon}</span>
                <div style={{ fontSize:20,fontWeight:800,color:"white",lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:11,color:"rgba(255,255,255,0.75)",marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Filière selector */}
        <div style={{ display:"flex",gap:8,marginBottom:20,flexWrap:"wrap" }}>
          {profFilieres.map(f=>(
            <motion.button key={f.code}
              onClick={()=>{ setActiveFiliere(f.code); setSearch(""); }}
              whileTap={{scale:0.97}}
              style={{ display:"flex",alignItems:"center",gap:7,
                padding:"9px 16px",borderRadius:12,border:"none",
                background:activeFiliere===f.code?P.grad:"white",
                color:activeFiliere===f.code?"white":"#64748b",
                fontSize:13,fontWeight:activeFiliere===f.code?700:500,
                cursor:"pointer",fontFamily:"inherit",
                boxShadow:activeFiliere===f.code?`0 2px 12px ${P.primary}40`:"0 1px 4px rgba(0,0,0,0.06)",
                border:activeFiliere===f.code?"none":`1.5px solid ${f.couleur}33`,
                transition:"all .2s" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",
                background:activeFiliere===f.code?"rgba(255,255,255,0.7)":f.couleur,
                flexShrink:0 }}/>
              {f.label}
              <span style={{ background:activeFiliere===f.code?"rgba(255,255,255,0.2)":f.couleur+"18",
                color:activeFiliere===f.code?"white":f.couleur,
                fontSize:11,fontWeight:700,borderRadius:20,
                padding:"1px 8px",marginLeft:2 }}>
                {(ALL_ETUDIANTS[f.code]||[]).length}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:"flex",gap:4,borderBottom:`2px solid ${P.light}`,marginBottom:20 }}>
          {TABS.map(t=>{
            const Icon=t.icon; const active=activeTab===t.id;
            return (
              <button key={t.id} onClick={()=>setActiveTab(t.id)}
                style={{ display:"flex",alignItems:"center",gap:7,
                  padding:"10px 18px",borderRadius:"10px 10px 0 0",
                  border:"none",cursor:"pointer",
                  background:active?"white":"transparent",
                  color:active?P.primary:"#64748b",
                  fontSize:13.5,fontWeight:active?700:500,fontFamily:"inherit",
                  borderBottom:active?`2px solid ${P.primary}`:"2px solid transparent",
                  marginBottom:-2,
                  boxShadow:active?`0 -2px 12px ${P.primary}12`:"none",
                  transition:"all .2s" }}>
                <Icon size={15}/>{t.label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ══ LISTE ══ */}
          {activeTab==="liste" && (
            <motion.div key="liste" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              <div style={{ display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap" }}>
                {["all","admis","rattrapage"].map(f=>(
                  <button key={f} onClick={()=>setFilterStatut(f)}
                    style={{ padding:"6px 14px",borderRadius:20,border:"none",
                      background:filterStatut===f?P.grad:"white",
                      color:filterStatut===f?"white":"#64748b",
                      fontSize:12.5,fontWeight:filterStatut===f?700:500,
                      cursor:"pointer",fontFamily:"inherit",
                      boxShadow:filterStatut===f?`0 2px 8px ${P.primary}40`:"0 1px 3px rgba(0,0,0,0.06)" }}>
                    {f==="all"?"Tous":f==="admis"?"✅ Admis":"⚠️ Rattrapage"}
                  </button>
                ))}
                <div style={{ flex:1 }}/>
                <span style={{ fontSize:13,color:"#64748b" }}>
                  <strong style={{ color:"#0f172a" }}>{filtered.length}</strong> étudiant{filtered.length>1?"s":""}
                </span>
              </div>

              {/* Excel-style table */}
              <div style={{ background:"white",borderRadius:16,
                border:"1px solid #e2e8f0",overflow:"auto",
                boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",minWidth:900 }}>
                  <thead>
                    <tr style={{ background:"#fdf2f8",position:"sticky",top:0,zIndex:1 }}>
                      <th style={{ padding:"11px 16px",textAlign:"left",
                        fontSize:11.5,fontWeight:700,color:"#831843",
                        borderBottom:"2px solid #fbcfe8",whiteSpace:"nowrap",
                        minWidth:200 }}>Étudiant</th>
                      <th style={{ padding:"11px 12px",textAlign:"center",
                        fontSize:11.5,fontWeight:700,color:"#831843",
                        borderBottom:"2px solid #fbcfe8" }}>CNE</th>
                      {matieres.map(m=>(
                        <th key={m} style={{ padding:"11px 10px",textAlign:"center",
                          fontSize:11,fontWeight:700,color:"#64748b",
                          borderBottom:"2px solid #fbcfe8",whiteSpace:"nowrap",
                          maxWidth:100 }}>
                          {m.length>12?m.slice(0,12)+"…":m}
                        </th>
                      ))}
                      <th style={{ padding:"11px 12px",textAlign:"center",
                        fontSize:11.5,fontWeight:700,color:P.primary,
                        borderBottom:"2px solid #fbcfe8",whiteSpace:"nowrap" }}>Moy.</th>
                      <th style={{ padding:"11px 12px",textAlign:"center",
                        fontSize:11.5,fontWeight:700,color:"#64748b",
                        borderBottom:"2px solid #fbcfe8" }}>Abs.</th>
                      <th style={{ padding:"11px 12px",textAlign:"center",
                        fontSize:11.5,fontWeight:700,color:"#64748b",
                        borderBottom:"2px solid #fbcfe8" }}>Statut</th>
                      <th style={{ padding:"11px 12px",textAlign:"center",
                        fontSize:11.5,fontWeight:700,color:"#64748b",
                        borderBottom:"2px solid #fbcfe8" }}>Détail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((e,i)=>{
                      const mention = makeMention(e.moyenne);
                      return (
                        <motion.tr key={e.id}
                          initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                          transition={{delay:i*0.03}}
                          style={{ borderBottom:i<filtered.length-1?"1px solid #f9f0f5":"none",
                            background:i%2===0?"white":"#fdf9fc" }}>
                          <td style={{ padding:"10px 16px" }}>
                            <div style={{ display:"flex",alignItems:"center",gap:9 }}>
                              <div style={{ width:32,height:32,borderRadius:9,
                                background:P.grad,color:"white",
                                fontSize:12,fontWeight:800,flexShrink:0,
                                display:"flex",alignItems:"center",justifyContent:"center" }}>
                                {e.prenom[0]}{e.nom[0]}
                              </div>
                              <div>
                                <div style={{ fontSize:13.5,fontWeight:700,color:"#0f172a" }}>
                                  {e.prenom} {e.nom}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"10px 12px",textAlign:"center",
                            fontSize:11.5,color:"#94a3b8",fontFamily:"monospace" }}>
                            {e.cne}
                          </td>
                          {matieres.map(m=>{
                            const moy = +(e.notes[m].cc*0.3+e.notes[m].tp*0.2+e.notes[m].examen*0.5).toFixed(1);
                            return (
                              <td key={m} style={{ padding:"8px 10px",textAlign:"center" }}>
                                <NoteCell value={moy}/>
                              </td>
                            );
                          })}
                          <td style={{ padding:"8px 12px",textAlign:"center" }}>
                            <div style={{ display:"flex",flexDirection:"column",
                              alignItems:"center",gap:3 }}>
                              <span style={{ fontSize:14,fontWeight:800,
                                color:noteColor(e.moyenne) }}>
                                {e.moyenne.toFixed(2)}
                              </span>
                              <span style={{ background:mention.bg,color:mention.color,
                                fontSize:10,fontWeight:700,borderRadius:20,
                                padding:"1px 7px" }}>{mention.label}</span>
                            </div>
                          </td>
                          <td style={{ padding:"8px 12px",textAlign:"center" }}>
                            <span style={{ fontSize:13,fontWeight:700,
                              color:e.absences>3?"#ef4444":"#64748b" }}>
                              {e.absences}
                            </span>
                          </td>
                          <td style={{ padding:"8px 12px",textAlign:"center" }}>
                            <StatutBadge statut={e.statut}/>
                          </td>
                          <td style={{ padding:"8px 12px",textAlign:"center" }}>
                            <button onClick={()=>setSelectedEtudiant(e)}
                              style={{ width:30,height:30,borderRadius:8,border:"none",
                                background:P.lighter,cursor:"pointer",
                                display:"flex",alignItems:"center",justifyContent:"center",
                                margin:"0 auto" }}>
                              <Eye size={14} color={P.primary}/>
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                  {/* average footer */}
                  <tfoot>
                    <tr style={{ background:"#fdf2f8",borderTop:"2px solid #fbcfe8" }}>
                      <td colSpan={2} style={{ padding:"10px 16px",
                        fontSize:12.5,fontWeight:800,color:"#831843" }}>
                        Moyenne de la classe
                      </td>
                      {matieres.map(m=>{
                        const avg = +(etudiants.reduce((a,e)=>a+(e.notes[m].cc*0.3+e.notes[m].tp*0.2+e.notes[m].examen*0.5),0)/etudiants.length).toFixed(1);
                        return (
                          <td key={m} style={{ padding:"8px 10px",textAlign:"center" }}>
                            <NoteCell value={avg}/>
                          </td>
                        );
                      })}
                      <td style={{ padding:"8px 12px",textAlign:"center" }}>
                        <span style={{ fontSize:14,fontWeight:800,
                          color:noteColor(stats.moyGeneral) }}>
                          {stats.moyGeneral}
                        </span>
                      </td>
                      <td colSpan={3}/>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          )}

          {/* ══ NOTES DÉTAILLÉES ══ */}
          {activeTab==="notes" && (
            <motion.div key="notes" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              {/* eval type tabs */}
              <div style={{ display:"flex",gap:8,marginBottom:16 }}>
                {TYPES_EVAL.map(t=>(
                  <button key={t.id} onClick={()=>setEvalType(t.id)}
                    style={{ display:"flex",alignItems:"center",gap:6,
                      padding:"8px 16px",borderRadius:10,border:"none",
                      background:evalType===t.id?t.couleur+"18":"white",
                      color:evalType===t.id?t.couleur:"#64748b",
                      fontSize:13,fontWeight:evalType===t.id?700:500,
                      cursor:"pointer",fontFamily:"inherit",
                      border:`1.5px solid ${evalType===t.id?t.couleur+"55":"#e2e8f0"}` }}>
                    {t.abr} — {t.label}
                    <span style={{ fontSize:11,color:evalType===t.id?t.couleur:"#94a3b8",
                      fontWeight:600 }}>×{t.weight}%</span>
                  </button>
                ))}
              </div>

              <div style={{ background:"white",borderRadius:16,
                border:"1px solid #e2e8f0",overflow:"auto",
                boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                <table style={{ width:"100%",borderCollapse:"collapse",minWidth:700 }}>
                  <thead>
                    <tr style={{ background:"#fdf2f8" }}>
                      <th style={{ padding:"11px 16px",textAlign:"left",
                        fontSize:12,fontWeight:700,color:"#831843",
                        borderBottom:"2px solid #fbcfe8",minWidth:180 }}>Étudiant</th>
                      {matieres.map(m=>(
                        <th key={m} style={{ padding:"11px 10px",textAlign:"center",
                          fontSize:11,fontWeight:700,color:"#64748b",
                          borderBottom:"2px solid #fbcfe8",whiteSpace:"nowrap" }}>
                          {m.length>14?m.slice(0,14)+"…":m}
                        </th>
                      ))}
                      <th style={{ padding:"11px 10px",textAlign:"center",
                        fontSize:12,fontWeight:700,color:P.primary,
                        borderBottom:"2px solid #fbcfe8" }}>Moy.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etudiants.map((e,i)=>{
                      const rowNotes = matieres.map(m => e.notes[m][evalType]);
                      const rowAvg   = +(rowNotes.reduce((a,b)=>a+b,0)/rowNotes.length).toFixed(2);
                      return (
                        <tr key={e.id}
                          style={{ borderBottom:i<etudiants.length-1?"1px solid #f9f0f5":"none",
                            background:i%2===0?"white":"#fdf9fc" }}>
                          <td style={{ padding:"9px 16px",fontSize:13,
                            fontWeight:700,color:"#0f172a" }}>
                            {e.prenom} {e.nom}
                          </td>
                          {matieres.map(m=>(
                            <td key={m} style={{ padding:"7px 10px",textAlign:"center" }}>
                              <NoteCell value={e.notes[m][evalType]}/>
                            </td>
                          ))}
                          <td style={{ padding:"7px 10px",textAlign:"center" }}>
                            <NoteCell value={rowAvg}/>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background:"#fdf2f8",borderTop:"2px solid #fbcfe8" }}>
                      <td style={{ padding:"10px 16px",fontSize:12.5,
                        fontWeight:800,color:"#831843" }}>
                        Moyenne {TYPES_EVAL.find(t=>t.id===evalType)?.abr}
                      </td>
                      {matieres.map(m=>{
                        const avg = +(etudiants.reduce((a,e)=>a+e.notes[m][evalType],0)/etudiants.length).toFixed(2);
                        return (
                          <td key={m} style={{ padding:"7px 10px",textAlign:"center" }}>
                            <NoteCell value={avg}/>
                          </td>
                        );
                      })}
                      <td/>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </motion.div>
          )}

          {/* ══ STATISTIQUES ══ */}
          {activeTab==="stats" && (
            <motion.div key="stats" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              {/* top-level KPIs */}
              <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22 }}>
                {[
                  { l:"Total étudiants", v:stats.total,      color:P.primary, Icon:Users },
                  { l:"Admis",           v:stats.admis,      color:"#10b981", Icon:Award },
                  { l:"Rattrapage",      v:stats.rattrapage, color:"#f59e0b", Icon:AlertCircle },
                  { l:"Moy. générale",   v:stats.moyGeneral, color:noteColor(stats.moyGeneral), Icon:BarChart2 },
                ].map(s=>(
                  <motion.div key={s.l} whileHover={{y:-3}}
                    style={{ background:"white",borderRadius:16,padding:"18px 20px",
                      border:`1px solid ${s.color}18`,
                      boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                      display:"flex",alignItems:"center",gap:14 }}>
                    <div style={{ width:42,height:42,borderRadius:12,
                      background:`${s.color}18`,
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                      <s.Icon size={20} color={s.color} strokeWidth={2}/>
                    </div>
                    <div>
                      <div style={{ fontSize:26,fontWeight:800,color:"#0f172a",lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{s.l}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* par matière */}
              <div style={{ background:"white",borderRadius:18,border:"1px solid #e2e8f0",
                padding:"22px",marginBottom:16,boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:15,fontWeight:800,color:"#0f172a",marginBottom:18 }}>
                  Moyennes par matière
                </div>
                {statsMatieres.map(s=>(
                  <div key={s.matiere} style={{ marginBottom:16 }}>
                    <div style={{ display:"flex",justifyContent:"space-between",
                      alignItems:"center",marginBottom:6 }}>
                      <div>
                        <span style={{ fontSize:13.5,fontWeight:700,color:"#0f172a" }}>
                          {s.matiere}
                        </span>
                        {s.enDiff>0 && (
                          <span style={{ marginLeft:8,background:"#fef2f2",color:"#ef4444",
                            fontSize:11,fontWeight:700,borderRadius:20,padding:"1px 8px" }}>
                            {s.enDiff} en difficulté
                          </span>
                        )}
                      </div>
                      <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                        {[{l:"CC",v:s.moyCC,c:"#3b82f6"},{l:"TP",v:s.moyTP,c:"#10b981"},{l:"EF",v:s.moyExam,c:P.primary}].map(n=>(
                          <span key={n.l} style={{ background:n.c+"18",color:n.c,
                            fontSize:11.5,fontWeight:700,borderRadius:8,
                            padding:"2px 9px" }}>{n.l} {n.v}</span>
                        ))}
                        <span style={{ fontSize:14,fontWeight:800,
                          color:noteColor(s.moyMat),minWidth:36 }}>
                          {s.moyMat}
                        </span>
                      </div>
                    </div>
                    <div style={{ height:10,background:"#f1f5f9",borderRadius:99,overflow:"hidden" }}>
                      <motion.div initial={{width:0}}
                        animate={{width:`${(s.moyMat/20)*100}%`}}
                        transition={{duration:0.8}}
                        style={{ height:"100%",borderRadius:99,
                          background:`linear-gradient(90deg,${P.primary},${noteColor(s.moyMat)})` }}/>
                    </div>
                  </div>
                ))}
              </div>

              {/* distribution des mentions */}
              <div style={{ background:"white",borderRadius:18,border:"1px solid #e2e8f0",
                padding:"22px",boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                <div style={{ fontSize:15,fontWeight:800,color:"#0f172a",marginBottom:16 }}>
                  Distribution des mentions
                </div>
                <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                  {[
                    { label:"TB ≥16", min:16, max:20, color:"#10b981", bg:"#ecfdf5" },
                    { label:"B ≥14",  min:14, max:16, color:"#3b82f6", bg:"#eff6ff" },
                    { label:"AB ≥12", min:12, max:14, color:"#f59e0b", bg:"#fffbeb" },
                    { label:"P ≥10",  min:10, max:12, color:"#64748b", bg:"#f1f5f9" },
                    { label:"F <10",  min:0,  max:10, color:"#ef4444", bg:"#fef2f2" },
                  ].map(r=>{
                    const cnt = etudiants.filter(e=>e.moyenne>=r.min&&e.moyenne<r.max).length;
                    const pct = Math.round((cnt/etudiants.length)*100);
                    return (
                      <div key={r.label} style={{ flex:1,minWidth:100,
                        background:r.bg,border:`1px solid ${r.color}33`,
                        borderRadius:13,padding:"14px 16px",textAlign:"center" }}>
                        <div style={{ fontSize:22,fontWeight:800,color:r.color }}>{cnt}</div>
                        <div style={{ fontSize:12,color:"#64748b",marginTop:3 }}>{r.label}</div>
                        <div style={{ fontSize:11,color:r.color,fontWeight:600,marginTop:2 }}>{pct}%</div>
                        <div style={{ height:5,background:r.color+"22",borderRadius:99,
                          overflow:"hidden",marginTop:8 }}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{duration:0.7}}
                            style={{ height:"100%",background:r.color,borderRadius:99 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Student detail modal */}
      <AnimatePresence>
        {selectedEtudiant && (
          <StudentModal
            etudiant={selectedEtudiant}
            matieres={matieres}
            onClose={()=>setSelectedEtudiant(null)}/>
        )}
      </AnimatePresence>
    </div>
  );
}