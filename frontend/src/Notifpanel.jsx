import { useState, useEffect } from "react";
import { notifStore, attestStore } from "./syncStore.js";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";

/* ── Shared data ─────────────────────────────────────────────── */
export const NOTIFS_DATA = [
  { id:1, type:"success", icon:"✅", titre:"Attestation signée",           corps:"Votre attestation de participation — Hackathon IA 2025 a été signée par l'administration.", date:"Il y a 10 min", lu:false },
  { id:2, type:"info",    icon:"📅", titre:"Réservation confirmée",        corps:"Votre réservation de la salle B204 — Mercredi 10:00 a été confirmée.",                        date:"Il y a 1h",    lu:false },
  { id:3, type:"success", icon:"✅", titre:"Demande d'emprunt acceptée",   corps:"L'emprunt de Machine Learning avec Python a été accordé jusqu'au 10 Fév 2025.",              date:"Il y a 2h",    lu:false },
  { id:4, type:"warning", icon:"⚠️", titre:"Retour de document en retard", corps:"L'ouvrage Réseaux Informatiques devait être retourné le 19 Jan. Contactez la bibliothèque.", date:"Hier",         lu:true  },
  { id:5, type:"info",    icon:"🎉", titre:"Événement publié",             corps:"Conférence IA & Société est maintenant publié et ouvert aux inscriptions.",                    date:"Hier",         lu:true  },
  { id:6, type:"success", icon:"✅", titre:"Club validé",                  corps:"Le Club Programmation a été validé par l'administration.",                                     date:"Il y a 2j",    lu:true  },
  { id:7, type:"info",    icon:"📋", titre:"Nouveau PFE soumis",           corps:"Fatima Zahra a soumis son rapport PFE pour validation.",                                       date:"Il y a 3j",    lu:true  },
];

// Notifs spécifiques aux étudiants
export const STUDENT_NOTIFS_DATA = [
  { id:101, type:"success", icon:"✅", titre:"Attestation disponible",       corps:"Votre attestation de scolarité 2024-2025 est signée et disponible en téléchargement.",        date:"Il y a 5 min",  lu:false, type_notif:"attest_signed" },
  { id:102, type:"info",    icon:"📚", titre:"Emprunt confirmé",             corps:"L'emprunt de 'Algorithmique — Le guide' a été confirmé. Retour prévu le 18/06/2025.",          date:"Il y a 1h",     lu:false },
  { id:103, type:"warning", icon:"⚠️", titre:"Retour en retard",             corps:"Le livre 'Machine Learning avec Python' devait être retourné il y a 4 jours.",                date:"Il y a 3h",     lu:false },
  { id:104, type:"info",    icon:"🎉", titre:"Événement ouvert",             corps:"Hackathon Web 2025 est ouvert aux inscriptions. Places limitées — 34/100.",                    date:"Hier",          lu:true  },
  { id:105, type:"success", icon:"🎭", titre:"Inscription au club confirmée",corps:"Votre demande d'adhésion au Club IA & Data a été acceptée.",                                   date:"Hier",          lu:true  },
  { id:106, type:"info",    icon:"🗓️", titre:"Nouvelle séance ajoutée",      corps:"Une séance de TP a été ajoutée : Lundi 08h00-10h00 · Salle B204 · Algorithmique.",             date:"Il y a 2j",     lu:true  },
  { id:107, type:"success", icon:"🎓", titre:"Notes disponibles",            corps:"Vos notes du semestre S1 2024-2025 sont consultables dans votre espace Notes.",                date:"Il y a 3j",     lu:true  },
  { id:108, type:"info",    icon:"💼", titre:"Nouvelle offre de stage",      corps:"InfoTech Casablanca propose un stage Full-Stack React/Laravel. Date limite : 15/06/2025.",    date:"Il y a 4j",     lu:true  },
];

const fmt     = (d) => d.toISOString().slice(0,10);
const addDays = (d,n) => { const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const TODAY   = new Date();

export const AGENDA_EVENTS = [
  { id:1,  date:fmt(TODAY),           heure:"08:00", titre:"Cours Algorithmique — INF301", lieu:"A101",              type:"cours",      color:"#3b82f6" },
  { id:2,  date:fmt(TODAY),           heure:"10:00", titre:"TD Base de Données — INF402",  lieu:"B204",              type:"cours",      color:"#6366f1" },
  { id:3,  date:fmt(TODAY),           heure:"14:00", titre:"Conférence IA & Société",       lieu:"Amphi A",           type:"événement",  color:"#ec4899" },
  { id:4,  date:fmt(addDays(TODAY,1)),heure:"09:00", titre:"Soutenance PFE — Fatima Zahra", lieu:"Amphi B",           type:"soutenance", color:"#10b981" },
  { id:5,  date:fmt(addDays(TODAY,1)),heure:"14:00", titre:"TP Intelligence Artificielle",  lieu:"C301",              type:"cours",      color:"#8b5cf6" },
  { id:6,  date:fmt(addDays(TODAY,1)),heure:"16:00", titre:"Réunion département Info",      lieu:"D401",              type:"réunion",    color:"#f59e0b" },
  { id:7,  date:fmt(addDays(TODAY,3)),heure:"08:00", titre:"Cours Algorithmique — INF301",  lieu:"A101",              type:"cours",      color:"#3b82f6" },
  { id:8,  date:fmt(addDays(TODAY,3)),heure:"10:00", titre:"Examen de rattrapage INF402",   lieu:"Amphi A",           type:"examen",     color:"#ef4444" },
  { id:9,  date:fmt(addDays(TODAY,5)),heure:"10:00", titre:"TD POO — INF205",               lieu:"C302",              type:"cours",      color:"#0ea5e9" },
  { id:10, date:fmt(addDays(TODAY,5)),heure:"14:00", titre:"Hackathon Web 2025",             lieu:"D401",              type:"événement",  color:"#ec4899" },
  { id:11, date:fmt(addDays(TODAY,7)),heure:"09:00", titre:"Conseil pédagogique",            lieu:"Salle des réunions",type:"réunion",    color:"#f59e0b" },
  { id:12, date:fmt(addDays(TODAY,8)),heure:"14:00", titre:"Cours IA Avancée — INF501",     lieu:"D401",              type:"cours",      color:"#8b5cf6" },
];

// Agenda spécifique étudiant
export const STUDENT_AGENDA_EVENTS = [
  { id:1,  date:fmt(TODAY),           heure:"08:00", titre:"Cours Algorithmique — INF301",  lieu:"Salle A101",  type:"cours",      color:"#3b82f6" },
  { id:2,  date:fmt(TODAY),           heure:"10:00", titre:"TD Base de Données — INF402",   lieu:"Salle B204",  type:"cours",      color:"#6366f1" },
  { id:3,  date:fmt(TODAY),           heure:"14:00", titre:"Conférence IA & Société",        lieu:"Amphi A",     type:"événement",  color:"#ec4899" },
  { id:4,  date:fmt(addDays(TODAY,1)),heure:"08:00", titre:"TP Algorithmique — INF301",      lieu:"Labo C301",   type:"cours",      color:"#8b5cf6" },
  { id:5,  date:fmt(addDays(TODAY,1)),heure:"14:00", titre:"Hackathon Web 2025",             lieu:"Salle D401",  type:"événement",  color:"#f97316" },
  { id:6,  date:fmt(addDays(TODAY,2)),heure:"10:00", titre:"Examen — Réseaux INF205",        lieu:"Amphi B",     type:"examen",     color:"#ef4444" },
  { id:7,  date:fmt(addDays(TODAY,3)),heure:"08:00", titre:"Cours Machine Learning — AI301", lieu:"Salle A102",  type:"cours",      color:"#10b981" },
  { id:8,  date:fmt(addDays(TODAY,4)),heure:"14:00", titre:"Réunion Club IA & Data",         lieu:"Salle C302",  type:"club",       color:"#a855f7" },
  { id:9,  date:fmt(addDays(TODAY,5)),heure:"09:00", titre:"Soutenance PFE — Promo 2025",    lieu:"Amphi A",     type:"soutenance", color:"#0ea5e9" },
  { id:10, date:fmt(addDays(TODAY,7)),heure:"10:00", titre:"Cours Deep Learning — AI303",    lieu:"Salle A101",  type:"cours",      color:"#8b5cf6" },
];

const TYPE_NOTIF_COLOR = {
  success:{ color:"#10b981", bg:"#ecfdf5", border:"#a7f3d0" },
  info:   { color:"#3b82f6", bg:"#eff6ff", border:"#bfdbfe" },
  warning:{ color:"#f59e0b", bg:"#fffbeb", border:"#fde68a" },
};

const JOURS_SHORT = ["Lu","Ma","Me","Je","Ve","Sa","Di"];
const MOIS_LABELS = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

/* ── Mini Calendar ───────────────────────────────────────────── */
function MiniCalendar({ selectedDate, onSelect, events }) {
  const [viewDate, setViewDate] = useState(new Date(selectedDate+"T00:00:00"));
  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay    = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const cells = Array.from({length:42}, (_,i) => {
    const d = i - startOffset + 1;
    if (d < 1)           return { day:daysInPrev+d,    current:false };
    if (d > daysInMonth) return { day:d-daysInMonth,   current:false };
    return                      { day:d,               current:true  };
  });

  const eventDates = new Set(events.map(e=>e.date));
  const todayStr   = fmt(TODAY);

  return (
    <div style={{ padding:"14px 16px 10px" }}>
      {/* nav */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12 }}>
        <button onClick={()=>setViewDate(new Date(year,month-1,1))}
          style={{ width:26,height:26,borderRadius:7,border:"none",background:"#f1f5f9",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <ChevronLeft size={14} color="#64748b"/>
        </button>
        <span style={{ fontSize:13.5,fontWeight:800,color:"#0f172a" }}>
          {MOIS_LABELS[month]} {year}
        </span>
        <button onClick={()=>setViewDate(new Date(year,month+1,1))}
          style={{ width:26,height:26,borderRadius:7,border:"none",background:"#f1f5f9",
            cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <ChevronRight size={14} color="#64748b"/>
        </button>
      </div>

      {/* day headers */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",marginBottom:4 }}>
        {JOURS_SHORT.map(j=>(
          <div key={j} style={{ textAlign:"center",fontSize:11,fontWeight:700,
            color:"#94a3b8",padding:"3px 0" }}>{j}</div>
        ))}
      </div>

      {/* cells */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2 }}>
        {cells.map((cell,i)=>{
          const dateStr = cell.current ? fmt(new Date(year,month,cell.day)) : null;
          const isToday    = dateStr===todayStr;
          const isSelected = dateStr===selectedDate;
          const hasEvent   = dateStr&&eventDates.has(dateStr);
          return (
            <div key={i}
              onClick={()=>{ if(cell.current&&dateStr) onSelect(dateStr); }}
              style={{ height:30,borderRadius:8,
                cursor:cell.current?"pointer":"default",
                display:"flex",flexDirection:"column",
                alignItems:"center",justifyContent:"center",gap:1,
                background:isSelected?"#9333ea":isToday?"#f5f3ff":"transparent",
                color:isSelected?"white":!cell.current?"#cbd5e1":"#0f172a",
                fontWeight:(isToday||isSelected)?700:400,
                fontSize:12.5,transition:"background .12s" }}>
              {cell.day}
              {hasEvent&&(
                <div style={{ width:4,height:4,borderRadius:"50%",
                  background:isSelected?"rgba(255,255,255,0.8)":isToday?"#9333ea":"#ec4899" }}/>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══ NotifPanel — shared component ══════════════════════════════ */
export default function NotifPanel({ onClose, accentColor="#9333ea" }) {
  const [activeTab,    setActiveTab]    = useState("notifs");
  // Notifs statiques filtrées selon le rôle connecté
  const currentUserRole = (() => {
    try { return JSON.parse(localStorage.getItem("umi_user"))?.db_role || ""; } catch { return ""; }
  })();
  // Étudiants voient leurs propres notifs démo, les profs voient les leurs
  const initialNotifs = currentUserRole === "ETUDIANT" ? STUDENT_NOTIFS_DATA : NOTIFS_DATA;
  const [notifs, setNotifs] = useState(initialNotifs);
  const [selectedDate, setSelectedDate] = useState(fmt(TODAY));

  // Lire les notifs temps réel depuis localStorage (syncStore)
  const [syncNotifs, setSyncNotifs] = useState([]);
  useEffect(() => {
    const currentUser = (() => {
      try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; }
    })();
    const currentUserId  = currentUser.id || currentUser.email || "";
    const currentRole    = currentUser.db_role || "";
    const currentNom     = (currentUser.prenom || "") + " " + (currentUser.nom || "");

    const load = () => {
      try {
        const all = JSON.parse(localStorage.getItem("umi_notifs")) || [];
        // Filtrer uniquement les notifs destinées à CET utilisateur
        // Étudiant : ses notifs par id/email uniquement
        // Prof     : ses notifs + notifs "PROF_NomPrenom"
        const mine = all.filter(n => {
          if (n.userId === currentUserId) return true;
          if (n.userId === String(currentUserId)) return true;
          if (currentRole === "PROFESSEUR" && n.userId === "PROF_" + currentNom.trim()) return true;
          return false;
        });
        setSyncNotifs(mine);
      } catch {}
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  // Télécharger une attestation signée
  const downloadAttest = (notif) => {
    if (notif.pdfUrl) {
      const a = document.createElement("a");
      a.href = notif.pdfUrl;
      a.download = (notif.attestId || "attestation") + ".pdf";
      a.click();
    } else {
      try {
        const all = JSON.parse(localStorage.getItem("umi_attestations")) || [];
        const attest = all.find(a => a.id === notif.attestId);
        if (attest?.pdfUrl) {
          const a = document.createElement("a");
          a.href = attest.pdfUrl; a.download = (attest.reference || "attestation") + ".pdf"; a.click();
        }
      } catch {}
    }
  };

  // Combiner notifs statiques + notifs temps réel
  const allNotifs = [
    ...notifs,
    ...syncNotifs.filter(sn => !notifs.some(n => String(n.id) === String(sn.id)))
  ];
  const unread = allNotifs.filter(n=>!n.lu).length;
  const markAll= () => {
    setNotifs(p=>p.map(n=>({...n,lu:true})));
    setSyncNotifs(p=>p.map(n=>({...n,lu:true})));
  };

  const agendaEvents = currentUserRole === "ETUDIANT" ? STUDENT_AGENDA_EVENTS : AGENDA_EVENTS;
  const dayEvents = agendaEvents
    .filter(e=>e.date===selectedDate)
    .sort((a,b)=>a.heure.localeCompare(b.heure));

  const selObj    = new Date(selectedDate+"T00:00:00");
  const isToday   = selectedDate===fmt(TODAY);
  const isTomorrow= selectedDate===fmt(addDays(TODAY,1));
  const dayLabel  = isToday ? "Aujourd'hui"
    : isTomorrow ? "Demain"
    : selObj.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed",inset:0,zIndex:9998 }}/>
      <motion.div
        initial={{opacity:0,scale:0.95,y:-8}}
        animate={{opacity:1,scale:1,y:0}}
        exit={{opacity:0,scale:0.95,y:-8}}
        transition={{type:"spring",stiffness:360,damping:30}}
        style={{ position:"absolute",top:"calc(100% + 10px)",right:0,
          width:380,maxHeight:580,background:"white",borderRadius:18,
          boxShadow:"0 20px 60px rgba(0,0,0,0.15),0 4px 16px rgba(147,51,234,0.1)",
          border:"1px solid #e2e8f0",overflow:"hidden",zIndex:300,
          display:"flex",flexDirection:"column" }}>

        {/* header */}
        <div style={{ padding:"14px 18px 12px",borderBottom:"1px solid #f1f5f9",
          display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0 }}>
          <div style={{ fontSize:15,fontWeight:800,color:"#0f172a" }}>Notifications & Agenda</div>
          <button onClick={onClose}
            style={{ width:26,height:26,borderRadius:7,border:"none",
              background:"#f1f5f9",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center" }}>
            <X size={14} color="#64748b"/>
          </button>
        </div>

        {/* tabs */}
        <div style={{ display:"flex",borderBottom:"1px solid #f1f5f9",flexShrink:0 }}>
          {[{id:"notifs",label:"Notifications",badge:unread},{id:"agenda",label:"Agenda"}].map(t=>(
            <button key={t.id} onClick={()=>setActiveTab(t.id)}
              style={{ flex:1,padding:"10px 0",border:"none",cursor:"pointer",
                background:"transparent",fontFamily:"inherit",
                fontSize:13,fontWeight:activeTab===t.id?700:500,
                color:activeTab===t.id?accentColor:"#64748b",
                borderBottom:activeTab===t.id?`2px solid ${accentColor}`:"2px solid transparent",
                marginBottom:-1,transition:"all .15s",
                display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
              {t.label}
              {t.badge>0&&<span style={{ background:"#f97316",color:"white",
                fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px" }}>
                {t.badge}</span>}
            </button>
          ))}
        </div>

        {/* scrollable */}
        <div style={{ flex:1,overflowY:"auto" }}>

          {/* ── NOTIFS ── */}
          {activeTab==="notifs"&&(
            <div>
              {unread>0&&(
                <div style={{ display:"flex",justifyContent:"flex-end",padding:"8px 14px 4px" }}>
                  <button onClick={markAll}
                    style={{ fontSize:12,color:accentColor,fontWeight:600,
                      background:"none",border:"none",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:4 }}>
                    <CheckCircle size={12}/> Tout marquer lu
                  </button>
                </div>
              )}
              {allNotifs.map((n,i)=>{
                const cfg=TYPE_NOTIF_COLOR[n.type] || TYPE_NOTIF_COLOR["info"];
                return (
                  <motion.div key={n.id}
                    initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                    transition={{delay:i*0.04}}
                    onClick={()=>setNotifs(p=>p.map(x=>x.id===n.id?{...x,lu:true}:x))}
                    style={{ display:"flex",gap:11,padding:"12px 16px",
                      borderBottom:"1px solid #f8fafc",
                      background:n.lu?"white":"#fafbff",cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                    onMouseLeave={e=>e.currentTarget.style.background=n.lu?"white":"#fafbff"}>
                    <div style={{ width:34,height:34,borderRadius:10,
                      background:cfg?.bg||"#f1f5f9",border:`1px solid ${cfg?.border||"#e2e8f0"}`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:16,flexShrink:0 }}>{n.icon||"🔔"}</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ display:"flex",justifyContent:"space-between",
                        alignItems:"flex-start",gap:6,marginBottom:3 }}>
                        <div style={{ fontSize:13,fontWeight:n.lu?600:700,
                          color:"#0f172a",lineHeight:1.3 }}>{n.titre}</div>
                        {!n.lu&&<div style={{ width:7,height:7,borderRadius:"50%",
                          background:"#f97316",flexShrink:0,marginTop:3 }}/>}
                      </div>
                      <div style={{ fontSize:12,color:"#64748b",lineHeight:1.4,marginBottom:4 }}>{n.corps}</div>
                      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                        <div style={{ fontSize:11,color:"#94a3b8" }}>{n.date}</div>
                        {/* Bouton téléchargement attestation signée */}
                        {n.type === "attest_signed" && (
                          <motion.button
                            whileHover={{scale:1.05}} whileTap={{scale:0.96}}
                            onClick={e=>{ e.stopPropagation(); downloadAttest(n); }}
                            style={{ display:"flex",alignItems:"center",gap:5,
                              padding:"5px 11px",borderRadius:8,border:"none",
                              background:"linear-gradient(135deg,#10b981,#059669)",
                              color:"white",fontSize:11.5,fontWeight:700,
                              cursor:"pointer",fontFamily:"inherit",
                              boxShadow:"0 2px 8px rgba(16,185,129,0.4)" }}>
                            📥 Télécharger PDF
                          </motion.button>
                        )}
                        {/* Bouton action générique */}
                        {n.action && n.type !== "attest_signed" && (
                          <motion.button
                            whileHover={{scale:1.05}} whileTap={{scale:0.96}}
                            onClick={e=>{ e.stopPropagation(); }}
                            style={{ display:"flex",alignItems:"center",gap:5,
                              padding:"5px 11px",borderRadius:8,border:"none",
                              background:"linear-gradient(135deg,#f97316,#9333ea)",
                              color:"white",fontSize:11.5,fontWeight:700,
                              cursor:"pointer",fontFamily:"inherit" }}>
                            {n.action.label}
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* ── AGENDA ── */}
          {activeTab==="agenda"&&(
            <div>
              <MiniCalendar
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                events={agendaEvents}/>

              <div style={{ height:1,background:"#f1f5f9",margin:"0 14px 10px" }}/>

              {/* day label */}
              <div style={{ padding:"0 16px 8px",
                display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <div style={{ fontSize:13.5,fontWeight:800,color:"#0f172a",
                  textTransform:"capitalize" }}>{dayLabel}</div>
                <span style={{ fontSize:11.5,color:"#94a3b8" }}>
                  {dayEvents.length} événement{dayEvents.length!==1?"s":""}
                </span>
              </div>

              {/* events */}
              {dayEvents.length===0?(
                <div style={{ textAlign:"center",padding:"16px 16px 24px",color:"#94a3b8" }}>
                  <div style={{ fontSize:28,marginBottom:6 }}>📭</div>
                  <div style={{ fontSize:13,fontWeight:500 }}>Aucun événement ce jour</div>
                </div>
              ):(
                <div style={{ padding:"0 12px 16px" }}>
                  {dayEvents.map((ev,i)=>(
                    <motion.div key={ev.id}
                      initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                      transition={{delay:i*0.06}}
                      style={{ display:"flex",alignItems:"center",gap:10,
                        padding:"10px 12px",marginBottom:7,
                        background:`${ev.color}08`,borderRadius:12,
                        borderLeft:`4px solid ${ev.color}` }}>
                      <div style={{ width:42,height:42,borderRadius:10,
                        background:ev.color+"18",
                        display:"flex",flexDirection:"column",
                        alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                        <span style={{ fontSize:14,fontWeight:800,color:ev.color,lineHeight:1 }}>
                          {ev.heure.split(":")[0]}
                        </span>
                        <span style={{ fontSize:10,color:ev.color+"99" }}>
                          :{ev.heure.split(":")[1]}
                        </span>
                      </div>
                      <div style={{ flex:1,minWidth:0 }}>
                        <div style={{ fontSize:13,fontWeight:700,color:"#0f172a",
                          overflow:"hidden",textOverflow:"ellipsis",
                          whiteSpace:"nowrap",marginBottom:4 }}>{ev.titre}</div>
                        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                          <span style={{ fontSize:11.5,color:"#64748b" }}>📍 {ev.lieu}</span>
                          <span style={{ background:ev.color+"18",color:ev.color,
                            fontSize:10.5,fontWeight:700,borderRadius:20,
                            padding:"1px 8px",textTransform:"capitalize" }}>{ev.type}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}