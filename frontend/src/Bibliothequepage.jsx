import { documents as docAPI, emprunts as empruntAPI } from "./api.js";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Plus, Bell, ChevronRight,
  BookOpen, FileText, Archive, Download,
  Clock, CheckCircle, XCircle, AlertCircle,
  X, Check, Library, Users, Calendar,
  RefreshCw, Send, Trash2, BarChart2, GraduationCap,
} from "lucide-react";

const V = {
  primary:"#8b5cf6", dark:"#4c1d95", mid:"#7c3aed",
  light:"#ede9fe", lighter:"#f5f3ff", border:"#ddd6fe",
  grad:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
  gradWarm:"linear-gradient(135deg,#8b5cf6,#ec4899)",
};

const TYPES_DOC = [
  {id:"livre",  label:"Livre",  icon:"📚",color:"#3b82f6",bg:"#eff6ff"},
  {id:"these",  label:"Thèse",  icon:"🎓",color:"#8b5cf6",bg:"#f5f3ff"},
  {id:"pfe",    label:"PFE",    icon:"📋",color:"#10b981",bg:"#ecfdf5"},
  {id:"article",label:"Article",icon:"📄",color:"#f59e0b",bg:"#fffbeb"},
  {id:"rapport",label:"Rapport",icon:"📊",color:"#ef4444",bg:"#fef2f2"},
];
const DOMAINES=["Informatique","Intelligence Artificielle","Génie Électrique","Génie Civil","Management","Communication","Mathématiques","Physique","Autre"];
const INIT_DOCUMENTS=[
  {id:1,type:"livre",  titre:"Algorithmique — Le Guide Complet",         auteurs:["T. Cormen","C. Leiserson"],annee:2022,domaine:"Informatique",isbn:"978-2-10",exemplaires:5,dispo:3,description:"Référence mondiale en algorithmique.",fichier:true,archive:false},
  {id:2,type:"livre",  titre:"Base de Données Avancées",                  auteurs:["C.J. Date"],              annee:2020,domaine:"Informatique",isbn:"978-0-32",exemplaires:3,dispo:0,description:"Théorie des BDD relationnelles.",fichier:true,archive:false},
  {id:3,type:"these",  titre:"Détection d'intrusions par ML",             auteurs:["Yassine Amrani"],         annee:2024,domaine:"Intelligence Artificielle",isbn:null,exemplaires:2,dispo:2,description:"Thèse — Sécurité & ML.",fichier:true,archive:false},
  {id:4,type:"pfe",    titre:"Plateforme e-learning avec recommandations",auteurs:["Fatima Zahra"],           annee:2024,domaine:"Intelligence Artificielle",isbn:null,exemplaires:1,dispo:1,description:"PFE Master — LMS intelligent.",fichier:true,archive:false},
  {id:5,type:"livre",  titre:"Machine Learning avec Python",              auteurs:["Aurélien Géron"],         annee:2023,domaine:"Intelligence Artificielle",isbn:"978-2-41",exemplaires:4,dispo:2,description:"Guide pratique ML.",fichier:true,archive:false},
  {id:6,type:"these",  titre:"Optimisation des réseaux électriques",      auteurs:["Hassan Ouali"],           annee:2023,domaine:"Génie Électrique",isbn:null,exemplaires:1,dispo:1,description:"Thèse — Efficacité énergétique.",fichier:true,archive:false},
  {id:7,type:"pfe",    titre:"Application mobile de gestion universitaire",auteurs:["Salma Benchekroun"],    annee:2024,domaine:"Informatique",isbn:null,exemplaires:1,dispo:1,description:"PFE Génie Logiciel.",fichier:true,archive:false},
  {id:8,type:"livre",  titre:"Réseaux Informatiques",                     auteurs:["Andrew Tanenbaum"],       annee:2021,domaine:"Informatique",isbn:"978-2-74",exemplaires:2,dispo:0,description:"Architecture des réseaux.",fichier:false,archive:false},
  {id:9,type:"article",titre:"Transformer Models for NLP",                 auteurs:["Vaswani et al."],         annee:2023,domaine:"Intelligence Artificielle",isbn:null,exemplaires:1,dispo:1,description:"Attention Is All You Need.",fichier:true,archive:false},
  {id:10,type:"pfe",   titre:"Gestion intelligente des déchets urbains",  auteurs:["Omar Filali"],            annee:2023,domaine:"Génie Civil",isbn:null,exemplaires:1,dispo:1,description:"PFE — IoT et environnement.",fichier:true,archive:true},
  {id:11,type:"livre", titre:"Management Stratégique",                    auteurs:["Michael Porter"],         annee:2022,domaine:"Management",isbn:"978-2-10",exemplaires:4,dispo:4,description:"Stratégie concurrentielle.",fichier:true,archive:false},
  {id:12,type:"rapport",titre:"Rapport Annuel UMI 2023-2024",             auteurs:["Direction UMI"],          annee:2024,domaine:"Autre",isbn:null,exemplaires:3,dispo:3,description:"Rapport d'activité.",fichier:true,archive:false},
];
const INIT_EMPRUNTS=[
  {id:1,docId:1, docTitre:"Algorithmique — Le Guide Complet",emprunteur:"Prof. Ahmed Benali", emprunteurType:"prof",    dateEmprunt:"2025-01-10",dateRetour:"2025-01-24",dateRetourEffective:null,  statut:"en_cours", penalite:0,renouvellements:0},
  {id:2,docId:5, docTitre:"Machine Learning avec Python",    emprunteur:"Yassine Amrani",     emprunteurType:"etudiant",dateEmprunt:"2025-01-05",dateRetour:"2025-01-19",dateRetourEffective:null,  statut:"en_retard",penalite:0,renouvellements:1},
  {id:3,docId:8, docTitre:"Réseaux Informatiques",           emprunteur:"Salma Benchekroun",  emprunteurType:"etudiant",dateEmprunt:"2025-01-12",dateRetour:"2025-01-26",dateRetourEffective:null,  statut:"en_cours", penalite:0,renouvellements:0},
  {id:4,docId:2, docTitre:"Base de Données Avancées",        emprunteur:"Mehdi Tazi",         emprunteurType:"etudiant",dateEmprunt:"2024-12-20",dateRetour:"2025-01-03",dateRetourEffective:"2025-01-03",statut:"retourne",penalite:0,renouvellements:0},
  {id:5,docId:2, docTitre:"Base de Données Avancées",        emprunteur:"Omar Filali",        emprunteurType:"etudiant",dateEmprunt:"2025-01-08",dateRetour:"2025-01-22",dateRetourEffective:null,  statut:"en_retard",penalite:0,renouvellements:0},
  {id:6,docId:11,docTitre:"Management Stratégique",          emprunteur:"Prof. Nadia Berrada",emprunteurType:"prof",    dateEmprunt:"2025-01-15",dateRetour:"2025-01-29",dateRetourEffective:null,  statut:"en_cours", penalite:0,renouvellements:0},
  {id:7,docId:5, docTitre:"Machine Learning avec Python",    emprunteur:"Fatima Zahra",       emprunteurType:"etudiant",dateEmprunt:"2024-11-01",dateRetour:"2024-11-15",dateRetourEffective:"2024-11-14",statut:"retourne",penalite:0,renouvellements:0},
  {id:8,docId:1, docTitre:"Algorithmique — Le Guide Complet",emprunteur:"Rachid Alami",       emprunteurType:"etudiant",dateEmprunt:"2025-01-18",dateRetour:"2025-02-01",dateRetourEffective:null,  statut:"en_cours", penalite:0,renouvellements:0},
];
const INIT_ARCHIVES=[
  {id:1,type:"PFE",    libelle:"PFE antérieurs à 2018",     duree:"5 ans",    statut:"actif", dateDebut:"2018-01-01",nbDocs:45, action:"anonymiser"},
  {id:2,type:"Thèse",  libelle:"Thèses de doctorat",        duree:"Permanent",statut:"actif", dateDebut:"2010-01-01",nbDocs:120,action:"conserver"},
  {id:3,type:"Rapport",libelle:"Rapports annuels",           duree:"10 ans",   statut:"actif", dateDebut:"2015-01-01",nbDocs:18, action:"conserver"},
  {id:4,type:"Article",libelle:"Articles de recherche",      duree:"Permanent",statut:"actif", dateDebut:"2012-01-01",nbDocs:230,action:"conserver"},
  {id:5,type:"PFE",    libelle:"PFE Informatique 2020-2022",duree:"2 ans",    statut:"expire",dateDebut:"2020-01-01",nbDocs:67, action:"supprimer"},
  {id:6,type:"Rapport",libelle:"Rapports de stage 2019",     duree:"1 an",     statut:"expire",dateDebut:"2019-01-01",nbDocs:34, action:"supprimer"},
];
const getTypeInfo=(id)=>TYPES_DOC.find(t=>t.id===id)||TYPES_DOC[0];
const empruntStatutCfg={en_cours:{label:"En cours",color:"#3b82f6",bg:"#eff6ff",Icon:Clock},en_retard:{label:"En retard",color:"#ef4444",bg:"#fef2f2",Icon:AlertCircle},retourne:{label:"Retourné",color:"#10b981",bg:"#ecfdf5",Icon:CheckCircle},renouvele:{label:"Renouvelé",color:"#f59e0b",bg:"#fffbeb",Icon:RefreshCw}};
const archiveStatutCfg={actif:{label:"Actif",color:"#10b981",bg:"#ecfdf5"},expire:{label:"Expiré",color:"#ef4444",bg:"#fef2f2"}};
const LS={display:"block",fontSize:12,fontWeight:700,color:"#374151",marginBottom:6};
const IS={width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13.5,color:"#0f172a",fontFamily:"inherit",outline:"none",background:"#f8fafc",boxSizing:"border-box"};
function Modal({onClose,title,subtitle,children,maxW=560}){return(<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} style={{position:"fixed",inset:0,zIndex:200,background:"rgba(15,23,42,0.55)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={onClose}><motion.div initial={{scale:0.93,y:20}} animate={{scale:1,y:0}} exit={{scale:0.93,y:20}} transition={{type:"spring",stiffness:340,damping:28}} onClick={e=>e.stopPropagation()} style={{background:"white",borderRadius:22,width:"100%",maxWidth:maxW,maxHeight:"90vh",overflow:"auto",boxShadow:"0 32px 80px rgba(0,0,0,0.2)"}}><div style={{padding:"20px 24px 16px",background:V.grad,position:"sticky",top:0,zIndex:1,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:16,fontWeight:800,color:"white"}}>{title}</div>{subtitle&&<div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:2}}>{subtitle}</div>}</div><button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",cursor:"pointer",color:"white",padding:8,borderRadius:9,display:"flex"}}><X size={16}/></button></div><div style={{padding:"22px 24px 26px"}}>{children}</div></motion.div></motion.div>);}
function DocDetailModal({doc,emprunts,onClose,onEmprunt}){const ti=getTypeInfo(doc.type);const docEmprunts=emprunts.filter(e=>e.docId===doc.id);const [requested,setRequested]=useState(false);const [requesting,setRequesting]=useState(false);const handleEmprunt=()=>{setRequesting(true);setTimeout(()=>{setRequesting(false);setRequested(true);onEmprunt(doc);},1400);};return(<Modal onClose={onClose} title={doc.titre} subtitle={`${ti.icon} ${ti.label} · ${doc.annee}`} maxW={600}><div style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"flex",gap:14,background:"#f8fafc",borderRadius:14,padding:"16px 18px"}}><div style={{width:56,height:56,borderRadius:16,background:ti.bg,border:`2px solid ${ti.color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{ti.icon}</div><div style={{flex:1}}><div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:8}}><span style={{background:ti.bg,color:ti.color,fontSize:12,fontWeight:700,borderRadius:20,padding:"3px 11px"}}>{ti.icon} {ti.label}</span><span style={{background:V.light,color:V.dark,fontSize:12,fontWeight:700,borderRadius:20,padding:"3px 11px"}}>{doc.domaine}</span><span style={{background:doc.dispo>0?"#ecfdf5":"#fef2f2",color:doc.dispo>0?"#10b981":"#ef4444",fontSize:12,fontWeight:700,borderRadius:20,padding:"3px 11px"}}>{doc.dispo>0?`✅ ${doc.dispo}/${doc.exemplaires} dispo`:"❌ Non disponible"}</span></div><p style={{fontSize:13,color:"#64748b",margin:0,lineHeight:1.5}}>{doc.description}</p></div></div><div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>{[["Auteur(s)",doc.auteurs.join(", ")],["Année",""+doc.annee],["Domaine",doc.domaine],...(doc.isbn?[["ISBN",doc.isbn]]:[]),["Exemplaires",`${doc.dispo}/${doc.exemplaires}`],["Fichier",doc.fichier?"✅ PDF dispo":"❌ Non numérisé"]].map(([k,v])=>(<div key={k} style={{background:"#f8fafc",borderRadius:10,padding:"11px 13px",border:"1px solid #e2e8f0"}}><div style={{fontSize:10.5,color:"#94a3b8",fontWeight:700,marginBottom:3}}>{k.toUpperCase()}</div><div style={{fontSize:13,fontWeight:700,color:"#0f172a"}}>{v}</div></div>))}</div>{docEmprunts.length>0&&<div><div style={{fontSize:13,fontWeight:800,color:"#0f172a",marginBottom:10}}>Historique des emprunts ({docEmprunts.length})</div><div style={{display:"flex",flexDirection:"column",gap:6}}>{docEmprunts.map(e=>{const sc=empruntStatutCfg[e.statut];return(<div key={e.id} style={{display:"flex",alignItems:"center",gap:10,background:"#f8fafc",borderRadius:10,padding:"9px 13px",border:"1px solid #e2e8f0"}}><div style={{width:28,height:28,borderRadius:8,background:V.grad,color:"white",fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{e.emprunteur[0]}</div><div style={{flex:1}}><div style={{fontSize:12.5,fontWeight:700,color:"#0f172a"}}>{e.emprunteur}</div><div style={{fontSize:11.5,color:"#94a3b8"}}>{e.dateEmprunt} → {e.dateRetour}</div></div><span style={{background:sc.bg,color:sc.color,fontSize:11,fontWeight:700,borderRadius:20,padding:"2px 9px",display:"flex",alignItems:"center",gap:3}}><sc.Icon size={10}/>{sc.label}</span></div>);})}</div></div>}<div style={{display:"flex",gap:10}}>{doc.fichier&&<button onClick={()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([`[Fichier simulé]\n${doc.titre}`],{type:"text/plain"}));a.download=`${doc.titre.replace(/ /g,"_")}.txt`;a.click();}} style={{flex:1,padding:"12px",borderRadius:11,border:`1.5px solid ${V.border}`,background:V.lighter,color:V.dark,fontSize:13.5,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}><Download size={15}/> Télécharger</button>}<button onClick={handleEmprunt} disabled={doc.dispo===0||requested||requesting} style={{flex:2,padding:"12px",borderRadius:11,border:requested?"1.5px solid #a7f3d0":"none",background:requested?"#ecfdf5":(doc.dispo===0||requesting)?"#e2e8f0":V.grad,color:requested?"#10b981":(doc.dispo===0||requesting)?"#94a3b8":"white",fontSize:13.5,fontWeight:700,cursor:(doc.dispo===0||requested||requesting)?"not-allowed":"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:7,transition:"all .3s",boxShadow:(doc.dispo>0&&!requested&&!requesting)?`0 4px 16px ${V.primary}40`:"none"}}>{requesting?<>Traitement…</>:requested?<><CheckCircle size={15}/> Demande enregistrée</>:doc.dispo===0?"❌ Indisponible":<><BookOpen size={15}/> Demander l'emprunt</>}</button></div></div></Modal>);}
function AddDocModal({onClose,onSave}){const [form,setForm]=useState({type:"livre",titre:"",auteurs:"",annee:2024,domaine:DOMAINES[0],isbn:"",exemplaires:1,description:"",fichier:false});const s=(k,v)=>setForm(f=>({...f,[k]:v}));const valid=form.titre&&form.auteurs&&form.annee;const ti=getTypeInfo(form.type);return(<Modal onClose={onClose} title="Ajouter un document" subtitle="Catalogue bibliothèque" maxW={540}><div style={{display:"flex",flexDirection:"column",gap:13}}><div><label style={LS}>Type *</label><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{TYPES_DOC.map(t=>(<button key={t.id} type="button" onClick={()=>s("type",t.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:20,border:`1.5px solid ${form.type===t.id?t.color+"66":"#e2e8f0"}`,background:form.type===t.id?t.bg:"#f8fafc",color:form.type===t.id?t.color:"#64748b",fontSize:12.5,fontWeight:form.type===t.id?700:500,cursor:"pointer",fontFamily:"inherit"}}><span>{t.icon}</span>{t.label}</button>))}</div></div><div><label style={LS}>Titre *</label><input value={form.titre} onChange={e=>s("titre",e.target.value)} placeholder="Titre complet" style={IS}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Auteur(s) *</label><input value={form.auteurs} onChange={e=>s("auteurs",e.target.value)} placeholder="Nom1, Nom2" style={IS}/></div><div><label style={LS}>Année *</label><input type="number" value={form.annee} onChange={e=>s("annee",+e.target.value)} style={IS}/></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Domaine</label><select value={form.domaine} onChange={e=>s("domaine",e.target.value)} style={IS}>{DOMAINES.map(d=><option key={d}>{d}</option>)}</select></div><div><label style={LS}>Exemplaires</label><input type="number" value={form.exemplaires} onChange={e=>s("exemplaires",+e.target.value)} min={1} style={IS}/></div></div>{(form.type==="livre"||form.type==="article")&&<div><label style={LS}>ISBN/ISSN</label><input value={form.isbn} onChange={e=>s("isbn",e.target.value)} placeholder="978-X-XX-XXXXXX-X" style={IS}/></div>}<div><label style={LS}>Description</label><textarea value={form.description} onChange={e=>s("description",e.target.value)} placeholder="Résumé…" rows={3} style={{...IS,resize:"none"}}/></div><label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13.5,color:"#374151",fontWeight:500}}><input type="checkbox" checked={form.fichier} onChange={e=>s("fichier",e.target.checked)} style={{width:16,height:16}}/>Fichier numérique disponible (PDF)</label>{form.titre&&<motion.div initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} style={{background:ti.bg,border:`1px solid ${ti.color}33`,borderRadius:12,padding:"12px 15px",display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:24}}>{ti.icon}</span><div><div style={{fontSize:13.5,fontWeight:800,color:"#0f172a"}}>{form.titre}</div><div style={{fontSize:12,color:"#64748b",marginTop:2}}>{form.auteurs||"Auteur(s)"} · {form.annee}</div></div></motion.div>}<button onClick={()=>{if(!valid)return;onSave({...form,id:Date.now(),auteurs:form.auteurs.split(",").map(a=>a.trim()),dispo:form.exemplaires,archive:false});onClose();}} disabled={!valid} style={{padding:"13px",borderRadius:12,border:"none",background:valid?V.grad:"#e2e8f0",color:valid?"white":"#94a3b8",fontSize:14.5,fontWeight:700,cursor:valid?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:valid?`0 6px 20px ${V.primary}40`:"none"}}><GraduationCap size={17}/> Ajouter au catalogue</button></div></Modal>);}
function NewEmpruntModal({docs,onClose,onSave}){const [form,setForm]=useState({docId:"",emprunteur:"",emprunteurType:"etudiant",dateEmprunt:new Date().toISOString().slice(0,10),dateRetour:""});const s=(k,v)=>setForm(f=>({...f,[k]:v}));const docsDispo=docs.filter(d=>d.dispo>0);const selectedDoc=docs.find(d=>d.id===+form.docId);const valid=form.docId&&form.emprunteur&&form.dateRetour;const autoRetour=()=>{const d=new Date();d.setDate(d.getDate()+14);s("dateRetour",d.toISOString().slice(0,10));};return(<Modal onClose={onClose} title="Nouvel emprunt" subtitle="Enregistrer un emprunt"><div style={{display:"flex",flexDirection:"column",gap:13}}><div><label style={LS}>Document *</label><select value={form.docId} onChange={e=>s("docId",e.target.value)} style={IS}><option value="">— Sélectionner —</option>{docsDispo.map(d=><option key={d.id} value={d.id}>{getTypeInfo(d.type).icon} {d.titre} ({d.dispo} dispo)</option>)}</select>{selectedDoc&&<motion.div initial={{opacity:0}} animate={{opacity:1}} style={{marginTop:7,display:"flex",alignItems:"center",gap:8,background:getTypeInfo(selectedDoc.type).bg,borderRadius:9,padding:"7px 11px"}}><span style={{fontSize:16}}>{getTypeInfo(selectedDoc.type).icon}</span><div><div style={{fontSize:12.5,fontWeight:700,color:"#0f172a"}}>{selectedDoc.titre}</div><div style={{fontSize:11.5,color:"#64748b"}}>{selectedDoc.auteurs.join(", ")} · {selectedDoc.annee}</div></div></motion.div>}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Emprunteur *</label><input value={form.emprunteur} onChange={e=>s("emprunteur",e.target.value)} placeholder="Nom complet" style={IS}/></div><div><label style={LS}>Type</label><select value={form.emprunteurType} onChange={e=>s("emprunteurType",e.target.value)} style={IS}><option value="etudiant">🎓 Étudiant</option><option value="prof">👨‍🏫 Enseignant</option><option value="staff">🏛️ Personnel</option></select></div></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Date d'emprunt</label><input type="date" value={form.dateEmprunt} onChange={e=>s("dateEmprunt",e.target.value)} style={IS}/></div><div><label style={LS}>Date de retour *</label><div style={{display:"flex",gap:7}}><input type="date" value={form.dateRetour} onChange={e=>s("dateRetour",e.target.value)} style={{...IS,flex:1}}/><button onClick={autoRetour} style={{padding:"0 11px",borderRadius:9,border:`1.5px solid ${V.border}`,background:V.lighter,color:V.primary,cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"inherit",flexShrink:0}}>+14j</button></div></div></div><button onClick={()=>{if(!valid)return;onSave({...form,id:Date.now(),docId:+form.docId,docTitre:selectedDoc?.titre||"",statut:"en_cours",penalite:0,renouvellements:0,dateRetourEffective:null});onClose();}} disabled={!valid} style={{padding:"13px",borderRadius:12,border:"none",background:valid?V.grad:"#e2e8f0",color:valid?"white":"#94a3b8",fontSize:14.5,fontWeight:700,cursor:valid?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:valid?`0 6px 20px ${V.primary}40`:"none"}}><BookOpen size={17}/> Enregistrer l'emprunt</button></div></Modal>);}
function ArchivePolicyModal({onClose,onSave}){const [form,setForm]=useState({type:"PFE",libelle:"",duree:"5 ans",action:"conserver",dateDebut:new Date().toISOString().slice(0,10)});const s=(k,v)=>setForm(f=>({...f,[k]:v}));const valid=form.libelle;return(<Modal onClose={onClose} title="Politique d'archivage" subtitle="Règle de conservation" maxW={480}><div style={{display:"flex",flexDirection:"column",gap:13}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Type</label><select value={form.type} onChange={e=>s("type",e.target.value)} style={IS}>{["Livre","Thèse","PFE","Article","Rapport"].map(t=><option key={t}>{t}</option>)}</select></div><div><label style={LS}>Durée</label><select value={form.duree} onChange={e=>s("duree",e.target.value)} style={IS}>{["1 an","2 ans","5 ans","10 ans","Permanent"].map(d=><option key={d}>{d}</option>)}</select></div></div><div><label style={LS}>Libellé *</label><input value={form.libelle} onChange={e=>s("libelle",e.target.value)} placeholder="ex: PFE Informatique 2020-2024" style={IS}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}><div><label style={LS}>Action à l'expiration</label><select value={form.action} onChange={e=>s("action",e.target.value)} style={IS}><option value="conserver">🗃️ Conserver</option><option value="anonymiser">🔒 Anonymiser</option><option value="supprimer">🗑️ Supprimer</option></select></div><div><label style={LS}>Date de début</label><input type="date" value={form.dateDebut} onChange={e=>s("dateDebut",e.target.value)} style={IS}/></div></div><div style={{background:V.lighter,border:`1px solid ${V.border}`,borderRadius:10,padding:"11px 14px"}}><p style={{fontSize:12.5,color:V.dark,margin:0,lineHeight:1.5}}>La politique s'appliquera aux documents du type sélectionné à l'expiration de la durée de conservation.</p></div><button onClick={()=>{if(!valid)return;onSave({...form,id:Date.now(),statut:"actif",nbDocs:0});onClose();}} disabled={!valid} style={{padding:"13px",borderRadius:12,border:"none",background:valid?V.grad:"#e2e8f0",color:valid?"white":"#94a3b8",fontSize:14.5,fontWeight:700,cursor:valid?"pointer":"not-allowed",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:valid?`0 6px 20px ${V.primary}40`:"none"}}><Archive size={17}/> Créer la politique</button></div></Modal>);}


export default function BibliothequePage() {
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
  const [docs, setDocs]           = useState(INIT_DOCUMENTS);
  const [emprunts, setEmprunts]   = useState(INIT_EMPRUNTS);
  const [archives, setArchives]   = useState(INIT_ARCHIVES);

  useEffect(() => {
    docAPI.getAll()
      .then(d => { const list = d?.data || d; if (Array.isArray(list) && list.length > 0) setDocs(list); })
      .catch(() => {});
    empruntAPI.getAll()
      .then(d => { const list = d?.data || d; if (Array.isArray(list) && list.length > 0) setEmprunts(list); })
      .catch(() => {});
  }, []);

  const [activeTab, setActiveTab] = useState("catalogue");
  const [search, setSearch]       = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDispo, setFilterDispo] = useState("all");
  const [filterDomaine, setFilterDomaine] = useState("all");
  const [filterEmprunt, setFilterEmprunt] = useState("all");
  const [modal, setModal]         = useState(null);
  const [toast, setToast]         = useState(null);

  const notify = (msg) => { setToast({msg}); setTimeout(()=>setToast(null),3000); };
  const addDoc = (d) => { setDocs(p=>[d,...p]); notify("📚 Document ajouté au catalogue"); };
  const addEmprunt = (e) => {
    setDocs(p=>p.map(d=>d.id===e.docId?{...d,dispo:d.dispo-1}:d));
    setEmprunts(p=>[e,...p]); notify("📖 Emprunt enregistré");
  };

  const addArchive = (a) => { setArchives(p=>[a,...p]); notify("🗃️ Politique d'archivage créée"); };
  const handleDemandeEmprunt = () => notify("📬 Demande envoyée à la bibliothèque");

  const filteredDocs = useMemo(()=>docs.filter(d=>{
    const q=search.toLowerCase();
    const matchQ=d.titre.toLowerCase().includes(q)||d.auteurs.join(" ").toLowerCase().includes(q)||d.domaine.toLowerCase().includes(q);
    const matchT=filterType==="all"||d.type===filterType;
    const matchDispo=filterDispo==="all"||(filterDispo==="dispo"&&d.dispo>0)||(filterDispo==="indispo"&&d.dispo===0);
    const matchDom=filterDomaine==="all"||d.domaine===filterDomaine;
    return matchQ&&matchT&&matchDispo&&matchDom&&!d.archive;
  }),[docs,search,filterType,filterDispo,filterDomaine]);

  const filteredEmprunts = useMemo(()=>emprunts.filter(e=>{
    const q=search.toLowerCase();
    return (e.emprunteur.toLowerCase().includes(q)||e.docTitre.toLowerCase().includes(q))&&(filterEmprunt==="all"||e.statut===filterEmprunt);
  }),[emprunts,search,filterEmprunt]);

  const stats = useMemo(()=>({
    totalDocs:docs.length,
    disponibles:docs.reduce((a,d)=>a+d.dispo,0),
    enCours:emprunts.filter(e=>e.statut==="en_cours"||e.statut==="en_retard").length,
    enRetard:emprunts.filter(e=>e.statut==="en_retard").length,
    retardsTotal:emprunts.filter(e=>e.statut==="en_retard").length,
  }),[docs,emprunts]);

  const TABS=[
    {id:"catalogue",label:"Catalogue",    icon:Library},
    {id:"emprunts", label:"Emprunts",     icon:BookOpen, badge:stats.enRetard},
    {id:"archivage",label:"Archivage",    icon:Archive},
    {id:"stats",    label:"Statistiques", icon:BarChart2},
  ];

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#faf5ff 0%,#f5f3ff 40%,#f8faff 100%)",fontFamily:"'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{opacity:0,y:-28}} animate={{opacity:1,y:0}}
            exit={{opacity:0,y:-28}}
            style={{ position:"fixed", top:18, right:18, zIndex:999,
              background:"white", border:"1px solid #ddd6fe",
              borderRadius:12, padding:"11px 18px",
              display:"flex", alignItems:"center", gap:8,
              boxShadow:"0 8px 24px rgba(0,0,0,0.1)",
              fontSize:13.5, fontWeight:600, color:"#4c1d95" }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}}
        transition={{duration:0.55,ease:[0.22,1,0.36,1]}}
        style={{ height:62, background:"rgba(255,255,255,0.92)",
          backdropFilter:"blur(18px)", borderBottom:"1px solid #ddd6fe55",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 32px", position:"sticky", top:0, zIndex:100,
          boxShadow:"0 2px 20px rgba(139,92,246,0.08)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <motion.button onClick={()=>navigate("/teacher")}
            whileHover={{scale:1.04,x:-2}} whileTap={{scale:0.96}}
            style={{ display:"flex", alignItems:"center", gap:7,
              background:"#f5f3ff", border:"1px solid #ddd6fe",
              borderRadius:10, padding:"7px 13px", cursor:"pointer",
              color:"#8b5cf6", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
            <ArrowLeft size={15}/> Retour
          </motion.button>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Accueil</span>
            <ChevronRight size={13} color="#cbd5e1"/>
            <span style={{ fontSize:13, fontWeight:700, color:"#8b5cf6" }}>Bibliothèque</span>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ display:"flex", alignItems:"center", background:"#f1f5f9",
            borderRadius:10, padding:"0 13px", gap:7, width:260 }}>
            <Search size={14} color="#94a3b8"/>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Titre, auteur, domaine…"
              style={{ border:"none", outline:"none", background:"transparent",
                fontSize:13, color:"#0f172a", padding:"9px 0",
                fontFamily:"inherit", width:"100%" }}/>
            {search && (
              <button onClick={()=>setSearch("")}
                style={{ background:"none",border:"none",cursor:"pointer",color:"#94a3b8",padding:0 }}>
                <X size={13}/>
              </button>
            )}
          </div>
          {activeTab==="catalogue" && (
            <motion.button onClick={()=>setModal("addDoc")}
              whileHover={{scale:1.03}} whileTap={{scale:0.97}}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
                color:"white", fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"inherit", boxShadow:"0 2px 12px rgba(139,92,246,0.35)" }}>
              <Plus size={14}/> Ajouter document
            </motion.button>
          )}
          {activeTab==="emprunts" && (
            <motion.button onClick={()=>setModal("newEmprunt")}
              whileHover={{scale:1.03}} whileTap={{scale:0.97}}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
                color:"white", fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"inherit", boxShadow:"0 2px 12px rgba(139,92,246,0.35)" }}>
              <BookOpen size={14}/> Nouvel emprunt
            </motion.button>
          )}
          {activeTab==="archivage" && (
            <motion.button onClick={()=>setModal("newArchive")}
              whileHover={{scale:1.03}} whileTap={{scale:0.97}}
              style={{ display:"flex", alignItems:"center", gap:6, padding:"9px 16px",
                borderRadius:10, border:"none", background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
                color:"white", fontSize:13, fontWeight:700, cursor:"pointer",
                fontFamily:"inherit", boxShadow:"0 2px 12px rgba(139,92,246,0.35)" }}>
              <Archive size={14}/> Nouvelle politique
            </motion.button>
          )}
          <button style={{ width:36, height:36, borderRadius:10, background:"#f1f5f9",
            border:"none", cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", position:"relative" }}>
            <Bell size={16} color="#64748b"/>
            {stats.enRetard>0 && <span style={{ position:"absolute", top:7, right:7,
              width:7, height:7, borderRadius:"50%",
              background:"#ef4444", border:"1.5px solid white" }}/>}
          </button>
          <div style={{ position:"relative" }}>
            <div onClick={()=>setProfileOpen(o=>!o)} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8,
            background:"#f5f3ff", border:"1.5px solid #ddd6fe",
            borderRadius:10, padding:"5px 12px 5px 6px" }}>
            <div style={{ width:28, height:28, borderRadius:8,
              background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"white", fontSize:13, fontWeight:800 }}>{_initials}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", lineHeight:1 }}>{_isProf?"Prof. ":""}{_displayName}</div>
              <div style={{ fontSize:10.5, color:"#8b5cf6", fontWeight:600, marginTop:1 }}>{_roleLabel}</div>
            </div>
          </div>
            {profileOpen&&<ProfilePanel onClose={()=>setProfileOpen(false)}/>
            }
          </div>
        </div>
      </motion.nav>

      <div style={{ maxWidth:1300, margin:"0 auto", padding:"28px 32px 60px" }}>

        {/* Hero */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
          transition={{duration:0.6,delay:0.1}}
          style={{ borderRadius:20, background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
            padding:"26px 34px", marginBottom:26,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160,
            borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:7,
              background:"rgba(255,255,255,0.18)", borderRadius:20,
              padding:"4px 13px", marginBottom:10 }}>
              <Library size={13} color="white"/>
              <span style={{ fontSize:12, color:"white", fontWeight:600 }}>
                Bibliothèque Universitaire UMI
              </span>
            </div>
            <h1 style={{ fontSize:24, fontWeight:800, color:"white",
              letterSpacing:"-0.4px", margin:"0 0 5px" }}>
              Gestion de la Bibliothèque
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:0 }}>
              Catalogue, emprunts, archivage et recherche documentaire
            </p>
          </div>
          <div style={{ display:"flex", gap:10, position:"relative", zIndex:1 }}>
            {[
              { v:stats.totalDocs,   l:"Documents",   icon:"📚" },
              { v:stats.disponibles, l:"Disponibles", icon:"✅" },
              { v:stats.enCours,     l:"En cours",    icon:"📖" },
              { v:stats.enRetard,    l:"En retard",   icon:"⚠️" },
            ].map(s=>(
              <div key={s.l} style={{ background:"rgba(255,255,255,0.15)",
                backdropFilter:"blur(8px)", border:"1px solid rgba(255,255,255,0.25)",
                borderRadius:13, padding:"11px 16px",
                display:"flex", flexDirection:"column", alignItems:"center", minWidth:76 }}>
                <span style={{ fontSize:18, marginBottom:4 }}>{s.icon}</span>
                <div style={{ fontSize:20, fontWeight:800, color:"white", lineHeight:1 }}>{s.v}</div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, borderBottom:"2px solid #ede9fe", marginBottom:20 }}>
          {TABS.map(t=>{
            const Icon=t.icon; const active=activeTab===t.id;
            return (
              <button key={t.id} onClick={()=>{ setActiveTab(t.id); setSearch(""); }}
                style={{ display:"flex", alignItems:"center", gap:7,
                  padding:"10px 18px", borderRadius:"10px 10px 0 0",
                  border:"none", cursor:"pointer",
                  background:active?"white":"transparent",
                  color:active?"#8b5cf6":"#64748b",
                  fontSize:13.5, fontWeight:active?700:500, fontFamily:"inherit",
                  borderBottom:active?"2px solid #8b5cf6":"2px solid transparent",
                  marginBottom:-2,
                  boxShadow:active?"0 -2px 12px rgba(139,92,246,0.1)":"none",
                  transition:"all .2s" }}>
                <Icon size={15}/>{t.label}
                {t.badge>0&&<span style={{ background:"#ef4444",color:"white",
                  fontSize:10,fontWeight:700,borderRadius:10,padding:"1px 6px" }}>
                  {t.badge}</span>}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">

          {/* ══ CATALOGUE ══ */}
          {activeTab==="catalogue" && (
            <motion.div key="cat" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              {/* filters */}
              <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
                {/* type pills */}
                <button onClick={()=>setFilterType("all")}
                  style={{ padding:"7px 14px", borderRadius:20, border:"none",
                    background:filterType==="all"?"linear-gradient(135deg,#8b5cf6,#7c3aed)":"white",
                    color:filterType==="all"?"white":"#64748b",
                    fontSize:12.5, fontWeight:filterType==="all"?700:500,
                    cursor:"pointer", fontFamily:"inherit",
                    boxShadow:filterType==="all"?"0 2px 8px rgba(139,92,246,0.4)":"0 1px 3px rgba(0,0,0,0.06)" }}>
                  Tous types
                </button>
                {TYPES_DOC.map(t=>(
                  <button key={t.id} onClick={()=>setFilterType(t.id)}
                    style={{ padding:"7px 12px", borderRadius:20, border:"none",
                      background:filterType===t.id?t.bg:"white",
                      color:filterType===t.id?t.color:"#64748b",
                      fontSize:12.5, fontWeight:filterType===t.id?700:500,
                      cursor:"pointer", fontFamily:"inherit",
                      border:`1.5px solid ${filterType===t.id?t.color+"55":"#e2e8f0"}` }}>
                    {t.icon} {t.label}
                  </button>
                ))}
                <div style={{ flex:1 }}/>
                <select value={filterDomaine} onChange={e=>setFilterDomaine(e.target.value)}
                  style={{ padding:"8px 12px", borderRadius:10,
                    border:"1.5px solid #ddd6fe", background:"#f5f3ff",
                    fontSize:13, color:"#4c1d95", fontFamily:"inherit", outline:"none" }}>
                  <option value="all">Tous domaines</option>
                  {DOMAINES.map(d=><option key={d}>{d}</option>)}
                </select>
                <select value={filterDispo} onChange={e=>setFilterDispo(e.target.value)}
                  style={{ padding:"8px 12px", borderRadius:10,
                    border:"1.5px solid #ddd6fe", background:"#f5f3ff",
                    fontSize:13, color:"#4c1d95", fontFamily:"inherit", outline:"none" }}>
                  <option value="all">Toutes disponibilités</option>
                  <option value="dispo">✅ Disponibles</option>
                  <option value="indispo">❌ Indisponibles</option>
                </select>
              </div>

              <div style={{ fontSize:13, color:"#64748b", marginBottom:12 }}>
                <strong style={{ color:"#0f172a" }}>{filteredDocs.length}</strong> document{filteredDocs.length>1?"s":""} trouvé{filteredDocs.length>1?"s":""}
              </div>

              {/* grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:16 }}>
                {filteredDocs.map((doc,i)=>{
                  const ti = getTypeInfo(doc.type);
                  return (
                    <motion.div key={doc.id}
                      initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
                      transition={{delay:i*0.05}}
                      whileHover={{y:-4, boxShadow:"0 14px 36px rgba(139,92,246,0.14)"}}
                      onClick={()=>setModal({type:"docDetail",doc})}
                      style={{ background:"white", borderRadius:17,
                        border:`1px solid ${doc.dispo===0?"#fecaca":"#e2e8f0"}`,
                        overflow:"hidden", cursor:"pointer",
                        boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                        transition:"all .2s" }}>
                      <div style={{ height:5,
                        background:`linear-gradient(90deg,${ti.color},${ti.color}88)` }}/>
                      <div style={{ padding:"18px 20px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"flex-start", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <div style={{ width:44, height:44, borderRadius:12,
                              background:ti.bg, border:`1.5px solid ${ti.color}30`,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              fontSize:22, flexShrink:0 }}>{ti.icon}</div>
                            <div>
                              <span style={{ background:ti.bg, color:ti.color,
                                fontSize:11, fontWeight:700, borderRadius:20,
                                padding:"2px 8px" }}>{ti.label}</span>
                              <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>{doc.annee}</div>
                            </div>
                          </div>
                          <span style={{ background:doc.dispo>0?"#ecfdf5":"#fef2f2",
                            color:doc.dispo>0?"#10b981":"#ef4444",
                            fontSize:11.5, fontWeight:700, borderRadius:20,
                            padding:"3px 9px", flexShrink:0 }}>
                            {doc.dispo}/{doc.exemplaires}
                          </span>
                        </div>

                        <div style={{ fontSize:14, fontWeight:800, color:"#0f172a",
                          marginBottom:5, lineHeight:1.3,
                          display:"-webkit-box", WebkitLineClamp:2,
                          WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                          {doc.titre}
                        </div>
                        <div style={{ fontSize:12.5, color:"#64748b", marginBottom:12 }}>
                          {doc.auteurs.join(", ")}
                        </div>

                        <div style={{ display:"flex", justifyContent:"space-between",
                          alignItems:"center" }}>
                          <span style={{ background:"#f5f3ff", color:"#7c3aed",
                            fontSize:11, fontWeight:700, borderRadius:8,
                            padding:"2px 9px", border:"1px solid #ddd6fe" }}>
                            {doc.domaine}
                          </span>
                          <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                            {doc.fichier && (
                              <div style={{ width:22, height:22, borderRadius:6,
                                background:"#ecfdf5", display:"flex",
                                alignItems:"center", justifyContent:"center" }}>
                                <Download size={12} color="#10b981"/>
                              </div>
                            )}
                            <div style={{ width:28, height:28, borderRadius:8,
                              background:"#f5f3ff",
                              display:"flex", alignItems:"center", justifyContent:"center" }}>
                              <ChevronRight size={14} color="#8b5cf6"/>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ EMPRUNTS ══ */}
          {activeTab==="emprunts" && (
            <motion.div key="emp" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              {/* summary pills */}
              <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
                {[{v:"all",l:"Tous"},{v:"en_cours",l:"En cours"},{v:"en_retard",l:"En retard"},{v:"retourne",l:"Retournés"}].map(f=>(
                  <button key={f.v} onClick={()=>setFilterEmprunt(f.v)}
                    style={{ padding:"7px 14px", borderRadius:20, border:"none",
                      background:filterEmprunt===f.v?"linear-gradient(135deg,#8b5cf6,#7c3aed)":"white",
                      color:filterEmprunt===f.v?"white":"#64748b",
                      fontSize:12.5, fontWeight:filterEmprunt===f.v?700:500,
                      cursor:"pointer", fontFamily:"inherit",
                      boxShadow:filterEmprunt===f.v?"0 2px 8px rgba(139,92,246,0.4)":"0 1px 3px rgba(0,0,0,0.06)" }}>
                    {f.l}
                  </button>
                ))}
                <div style={{ flex:1 }}/>
                <div style={{ display:"flex", alignItems:"center", gap:7,
                  background:"#f5f3ff", border:"1px solid #ddd6fe",
                  borderRadius:20, padding:"6px 14px" }}>
                  <span style={{ fontSize:12.5, color:"#7c3aed", fontWeight:600 }}>
                    🛡️ Prolongations & sanctions → décision exclusive de l'administration
                  </span>
                </div>
              </div>

              <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)" }}>
                <table style={{ width:"100%", borderCollapse:"collapse" }}>
                  <thead>
                    <tr style={{ background:"#f8fafc" }}>
                      {["Document","Emprunteur","Emprunt","Retour prévu","Renouvellements","Statut"].map(h=>(
                        <th key={h} style={{ padding:"11px 14px", textAlign:"left",
                          fontSize:11.5, fontWeight:700, color:"#64748b",
                          borderBottom:"1px solid #e2e8f0", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmprunts.map((e,i)=>{
                      const sc = empruntStatutCfg[e.statut];
                      const doc = docs.find(d=>d.id===e.docId);
                      const ti = doc ? getTypeInfo(doc.type) : TYPES_DOC[0];
                      return (
                        <motion.tr key={e.id}
                          initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                          transition={{delay:i*0.04}}
                          style={{ borderBottom:i<filteredEmprunts.length-1?"1px solid #f1f5f9":"none",
                            background:e.statut==="en_retard"?"#fffbfb":"white" }}>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <span style={{ fontSize:18 }}>{ti.icon}</span>
                              <div style={{ minWidth:0 }}>
                                <div style={{ fontSize:12.5, fontWeight:700, color:"#0f172a",
                                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
                                  maxWidth:180 }}>{e.docTitre}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                              <div style={{ width:28, height:28, borderRadius:8,
                                background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
                                color:"white", fontSize:11, fontWeight:800,
                                display:"flex", alignItems:"center", justifyContent:"center",
                                flexShrink:0 }}>{e.emprunteur[0]}</div>
                              <div>
                                <div style={{ fontSize:12.5, fontWeight:700, color:"#0f172a" }}>{e.emprunteur}</div>
                                <div style={{ fontSize:11, color:"#94a3b8" }}>
                                  {e.emprunteurType==="etudiant"?"🎓":e.emprunteurType==="prof"?"👨‍🏫":"🏛️"}
                                  {" "}{e.emprunteurType}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"12px 14px", fontSize:12, color:"#64748b" }}>{e.dateEmprunt}</td>
                          <td style={{ padding:"12px 14px", fontSize:12,
                            color:e.statut==="en_retard"?"#ef4444":"#64748b",
                            fontWeight:e.statut==="en_retard"?700:400 }}>{e.dateRetour}</td>
                          <td style={{ padding:"12px 14px", textAlign:"center" }}>
                            {e.renouvellements>0
                              ? <span style={{ background:"#fffbeb", color:"#d97706",
                                  fontSize:11.5, fontWeight:700, borderRadius:20,
                                  padding:"2px 8px" }}>×{e.renouvellements}</span>
                              : <span style={{ color:"#94a3b8", fontSize:12 }}>—</span>}
                          </td>
                          
                          <td style={{ padding:"12px 14px" }}>
                            <span style={{ background:sc.bg, color:sc.color,
                              fontSize:11.5, fontWeight:700, borderRadius:20,
                              padding:"3px 10px", display:"inline-flex",
                              alignItems:"center", gap:4 }}>
                              <sc.Icon size={10}/>{sc.label}
                            </span>
                          </td>

                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredEmprunts.length===0 && (
                  <div style={{ textAlign:"center", padding:"48px", color:"#94a3b8" }}>
                    <BookOpen size={34} style={{ margin:"0 auto 10px", opacity:0.3 }}/>
                    <div style={{ fontSize:14, fontWeight:600 }}>Aucun emprunt trouvé</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ══ ARCHIVAGE ══ */}
          {activeTab==="archivage" && (
            <motion.div key="arch" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {archives.map((a,i)=>{
                  const sc = archiveStatutCfg[a.statut];
                  const actionCfg = {
                    conserver:  { icon:"🗃️", color:"#3b82f6", label:"Conserver" },
                    anonymiser: { icon:"🔒", color:"#f59e0b", label:"Anonymiser" },
                    supprimer:  { icon:"🗑️", color:"#ef4444", label:"Supprimer" },
                  }[a.action];
                  return (
                    <motion.div key={a.id}
                      initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                      transition={{delay:i*0.06}}
                      whileHover={{x:4}}
                      style={{ background:"white", borderRadius:15,
                        border:`1px solid ${a.statut==="expire"?"#fecaca":"#e2e8f0"}`,
                        padding:"18px 22px",
                        display:"flex", alignItems:"center", gap:16,
                        boxShadow:a.statut==="expire"?"0 0 0 2px #fee2e2":"0 1px 8px rgba(0,0,0,0.04)" }}>
                      <div style={{ width:48, height:48, borderRadius:13,
                        background:`${V.primary}18`, border:`1.5px solid ${V.border}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:22, flexShrink:0 }}>
                        {a.type==="Livre"?"📚":a.type==="Thèse"?"🎓":a.type==="PFE"?"📋":a.type==="Article"?"📄":"📊"}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:5 }}>
                          <div style={{ fontSize:14.5, fontWeight:800, color:"#0f172a" }}>{a.libelle}</div>
                          <span style={{ background:sc.bg, color:sc.color,
                            fontSize:11, fontWeight:700, borderRadius:20, padding:"2px 9px" }}>
                            {sc.label}
                          </span>
                        </div>
                        <div style={{ display:"flex", gap:14, fontSize:12.5, color:"#64748b",
                          flexWrap:"wrap" }}>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <Archive size={12}/> Type : {a.type}
                          </span>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <Clock size={12}/> Conservation : {a.duree}
                          </span>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <Calendar size={12}/> Depuis : {a.dateDebut}
                          </span>
                          <span style={{ display:"flex", alignItems:"center", gap:4 }}>
                            <FileText size={12}/> {a.nbDocs} document{a.nbDocs>1?"s":""}
                          </span>
                        </div>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:8 }}>
                        <span style={{ background:actionCfg.color+"18",
                          color:actionCfg.color, fontSize:12, fontWeight:700,
                          borderRadius:20, padding:"4px 12px",
                          display:"flex", alignItems:"center", gap:5 }}>
                          <span>{actionCfg.icon}</span>{actionCfg.label}
                        </span>
                        {a.statut==="expire" && (
                          <button onClick={()=>{
                            setArchives(p=>p.filter(x=>x.id!==a.id));
                            notify("🗑️ Politique supprimée");
                          }}
                            style={{ display:"flex", alignItems:"center", gap:5,
                              padding:"6px 12px", borderRadius:9,
                              border:"1px solid #fecaca", background:"#fef2f2",
                              color:"#ef4444", fontSize:12, fontWeight:700,
                              cursor:"pointer", fontFamily:"inherit" }}>
                            <Trash2 size={12}/> Supprimer
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ══ STATISTIQUES ══ */}
          {activeTab==="stats" && (
            <motion.div key="stats" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
              exit={{opacity:0}} transition={{duration:0.25}}>

              <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:22 }}>
                {[
                  { l:"Total documents",  v:stats.totalDocs,   Icon:Library,      color:"#8b5cf6" },
                  { l:"Disponibles",      v:stats.disponibles, Icon:CheckCircle,   color:"#10b981" },
                  { l:"Emprunts en cours",v:stats.enCours,     Icon:BookOpen,      color:"#3b82f6" },
                  { l:"Rappels envoyés", v:stats.retardsTotal, Icon:Send, color:"#f59e0b" },
                ].map(s=>(
                  <motion.div key={s.l} whileHover={{y:-3}}
                    style={{ background:"white", borderRadius:16, padding:"20px",
                      border:`1px solid ${s.color}18`,
                      boxShadow:"0 2px 10px rgba(0,0,0,0.05)",
                      display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:44, height:44, borderRadius:13,
                      background:`${s.color}18`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      flexShrink:0 }}>
                      <s.Icon size={22} color={s.color} strokeWidth={2}/>
                    </div>
                    <div>
                      <div style={{ fontSize:26, fontWeight:800, color:"#0f172a", lineHeight:1 }}>{s.v}</div>
                      <div style={{ fontSize:12, color:"#64748b", marginTop:3 }}>{s.l}</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                {/* répartition par type */}
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Répartition par type
                  </div>
                  {TYPES_DOC.map(t=>{
                    const cnt = docs.filter(d=>d.type===t.id).length;
                    const pct = docs.length ? Math.round((cnt/docs.length)*100) : 0;
                    return (
                      <div key={t.id} style={{ marginBottom:11 }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          fontSize:13, marginBottom:5 }}>
                          <span style={{ fontWeight:600, color:"#0f172a" }}>{t.icon} {t.label}</span>
                          <span style={{ color:t.color, fontWeight:700 }}>{cnt} ({pct}%)</span>
                        </div>
                        <div style={{ height:8, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{duration:0.8}}
                            style={{ height:"100%", background:t.color, borderRadius:99 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* top domaines */}
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:16 }}>
                    Documents par domaine
                  </div>
                  {DOMAINES.slice(0,6).map(dom=>{
                    const cnt = docs.filter(d=>d.domaine===dom).length;
                    const pct = docs.length ? Math.round((cnt/docs.length)*100) : 0;
                    if (!cnt) return null;
                    return (
                      <div key={dom} style={{ marginBottom:10 }}>
                        <div style={{ display:"flex", justifyContent:"space-between",
                          fontSize:12.5, marginBottom:4 }}>
                          <span style={{ fontWeight:600, color:"#0f172a" }}>{dom}</span>
                          <span style={{ color:V.primary, fontWeight:700 }}>{cnt}</span>
                        </div>
                        <div style={{ height:7, background:"#e2e8f0", borderRadius:99, overflow:"hidden" }}>
                          <motion.div initial={{width:0}} animate={{width:`${pct}%`}}
                            transition={{duration:0.7}}
                            style={{ height:"100%",
                              background:"linear-gradient(135deg,#8b5cf6,#7c3aed)",
                              borderRadius:99 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* emprunts par statut & retards */}
                <div style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                  padding:"22px", boxShadow:"0 2px 10px rgba(0,0,0,0.04)", gridColumn:"span 2" }}>
                  <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:14 }}>
                    Emprunts en cours & retards
                  </div>
                  <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:16 }}>
                    {Object.entries(empruntStatutCfg).map(([k,v])=>{
                      const cnt = emprunts.filter(e=>e.statut===k).length;
                      return (
                        <div key={k} style={{ flex:1, minWidth:120,
                          background:v.bg, border:`1px solid ${v.color}30`,
                          borderRadius:12, padding:"14px 16px", textAlign:"center" }}>
                          <v.Icon size={20} color={v.color} style={{ margin:"0 auto 6px" }}/>
                          <div style={{ fontSize:22, fontWeight:800, color:v.color }}>{cnt}</div>
                          <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{v.label}</div>
                        </div>
                      );
                    })}
                  </div>
                  {/* emprunteurs en retard */}
                  {emprunts.filter(e=>e.statut==="en_retard").length>0 && (
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:"#991b1b", marginBottom:10 }}>
                        ⚠️ Emprunteurs en retard
                      </div>
                      {emprunts.filter(e=>e.statut==="en_retard").map(e=>(
                        <div key={e.id} style={{ display:"flex", alignItems:"center", gap:12,
                          background:"#fef2f2", borderRadius:10, padding:"10px 13px",
                          marginBottom:8, border:"1px solid #fecaca" }}>
                          <div style={{ width:30, height:30, borderRadius:8,
                            background:"#ef4444", color:"white", fontSize:12,
                            fontWeight:800, display:"flex", alignItems:"center",
                            justifyContent:"center", flexShrink:0 }}>{e.emprunteur[0]}</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:"#0f172a" }}>{e.emprunteur}</div>
                            <div style={{ fontSize:12, color:"#64748b" }}>{e.docTitre}</div>
                          </div>
                          <div style={{ textAlign:"right" }}>
                            <div style={{ fontSize:12, fontWeight:700, color:"#f59e0b",
                                background:"#fffbeb", borderRadius:8, padding:"3px 10px" }}>
                                ⏰ En retard
                              </div>
                            <div style={{ fontSize:11, color:"#94a3b8", marginTop:3 }}>Retour : {e.dateRetour}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal==="addDoc" && (
          <AddDocModal onClose={()=>setModal(null)} onSave={addDoc}/>
        )}
        {modal==="newEmprunt" && (
          <NewEmpruntModal docs={docs} onClose={()=>setModal(null)} onSave={addEmprunt}/>
        )}
        {modal==="newArchive" && (
          <ArchivePolicyModal onClose={()=>setModal(null)} onSave={addArchive}/>
        )}
        {modal?.type==="docDetail" && (
          <DocDetailModal doc={modal.doc} emprunts={emprunts}
            onClose={()=>setModal(null)} onEmprunt={handleDemandeEmprunt}/>
        )}
      </AnimatePresence>
    </div>
  );
}