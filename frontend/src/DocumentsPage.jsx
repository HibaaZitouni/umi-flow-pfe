import { documents as docAPI, notes as notesAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Search, Upload, Download, FileText,
  BookOpen, FolderOpen, GraduationCap, MessageSquare,
  Plus, Eye, Clock, CheckCircle, AlertCircle,
  ChevronRight, X, Star, Users, BookMarked,
  Paperclip, Send, Bell, Sparkles, TrendingUp,
  Calendar, Hash,
} from "lucide-react";

/* -- palette --------------------------------------------------- */
const B = {
  primary:  "#3b82f6",
  dark:     "#1e3a8a",
  mid:      "#2563eb",
  light:    "#dbeafe",
  lighter:  "#eff6ff",
  muted:    "#93c5fd",
  grad:     "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  gradSoft: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
  gradHero: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #0ea5e9 100%)",
};

/* -- mock data ------------------------------------------------- */
const TABS = [
  { id: "cours",    label: "Mes Cours",    icon: BookOpen },
  { id: "supports", label: "Supports",     icon: FolderOpen },
  { id: "pfe",      label: "Thèses & PFE", icon: GraduationCap },
  { id: "partages", label: "Ressources",   icon: BookMarked },
];

const FILIERES = ["L1 Informatique","L2 Informatique","L3 Informatique","M1 Informatique","M1 Génie Logiciel","M2 Informatique","M2 Sécurité Informatique"];
const COULEURS = ["#3b82f6","#6366f1","#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899"];

const initCours = [
  { id:1, code:"INF301", titre:"Algorithmique Avancée",        filiere:"L3 Informatique", etudiants:42, docs:8,  couleur:"#3b82f6" },
  { id:2, code:"INF402", titre:"Base de Données",              filiere:"L3 Informatique", etudiants:38, docs:5,  couleur:"#6366f1" },
  { id:3, code:"INF205", titre:"Programmation Orientée Objet", filiere:"L2 Informatique", etudiants:55, docs:12, couleur:"#0ea5e9" },
  { id:4, code:"INF501", titre:"Intelligence Artificielle",    filiere:"M1 Informatique", etudiants:28, docs:6,  couleur:"#8b5cf6" },
];

const initSupports = [
  { id:1, nom:"Cours_Algo_Chap1.pdf",           type:"PDF",  taille:"2.4 MB", cours:"INF301", date:"12 Jan 2025", vues:34 },
  { id:2, nom:"TD_Algorithmique_S1.pdf",         type:"PDF",  taille:"1.1 MB", cours:"INF301", date:"15 Jan 2025", vues:41 },
  { id:3, nom:"Cours_BD_Relationnel.pdf",        type:"PDF",  taille:"3.8 MB", cours:"INF402", date:"10 Jan 2025", vues:29 },
  { id:4, nom:"TP_SQL_Exercices.pdf",            type:"PDF",  taille:"0.9 MB", cours:"INF402", date:"18 Jan 2025", vues:52 },
  { id:5, nom:"POO_Heritage_Polymorphisme.pdf",  type:"PDF",  taille:"2.1 MB", cours:"INF205", date:"08 Jan 2025", vues:67 },
  { id:6, nom:"IA_Introduction_ML.pdf",          type:"PDF",  taille:"4.2 MB", cours:"INF501", date:"20 Jan 2025", vues:18 },
  { id:7, nom:"Slides_Reseaux_Neurones.pptx",   type:"PPTX", taille:"6.7 MB", cours:"INF501", date:"22 Jan 2025", vues:15 },
];

// initPFE follows
const initPFE = [
  { id:1, titre:"Système de détection d'intrusions par ML",       etudiant:"Yassine Amrani",         filiere:"M2 Sécurité Informatique", statut:"en_cours",   remarques:2, deadline:"15 Mars 2025", note:null },
  { id:2, titre:"Application mobile de gestion universitaire",    etudiant:"Salma Benchekroun",      filiere:"M1 Génie Logiciel",        statut:"revision",   remarques:5, deadline:"01 Mars 2025", note:null },
  { id:3, titre:"Optimisation des algorithmes de tri distribués", etudiant:"Mehdi Tazi",             filiere:"M2 Informatique",          statut:"valide",     remarques:3, deadline:"10 Fév 2025",  note:16.5 },
  { id:4, titre:"Plateforme e-learning avec recommandations IA",  etudiant:"Fatima Zahra El Idrissi",filiere:"M1 Informatique",          statut:"en_attente", remarques:0, deadline:"28 Mars 2025", note:null },
];

const RESSOURCES = [
  { id:1, nom:"Guide Rédaction PFE UMI.pdf",      cat:"Méthodologie",  taille:"1.2 MB", auteur:"Dept. Informatique", date:"2025" },
  { id:2, nom:"Normes APA Références.pdf",         cat:"Rédaction",     taille:"0.6 MB", auteur:"Bibliothèque UMI",  date:"2024" },
  { id:3, nom:"Template Rapport Stage.docx",       cat:"Modèles",       taille:"0.3 MB", auteur:"Scolarité",         date:"2025" },
  { id:4, nom:"Calendrier Académique 2024-25.pdf", cat:"Administratif", taille:"0.8 MB", auteur:"Direction",         date:"2025" },
  { id:5, nom:"Charte Plagiat UMI.pdf",            cat:"Réglementation",taille:"0.4 MB", auteur:"Dept. Qualité",     date:"2024" },
];

const statutConfig = {
  en_cours:  { label:"En cours",   color:"#3b82f6", bg:"#dbeafe", icon:Clock },
  revision:  { label:"À réviser",  color:"#f59e0b", bg:"#fef3c7", icon:AlertCircle },
  valide:    { label:"Validé",     color:"#10b981", bg:"#d1fae5", icon:CheckCircle },
  en_attente:{ label:"En attente", color:"#6b7280", bg:"#f3f4f6", icon:Clock },
};

const typeColor = { PDF:"#ef4444", PPTX:"#f97316", DOCX:"#3b82f6" };

const DOC_CONTENT = {
  "Cours_Algo_Chap1.pdf": `UNIVERSITÉ MOULAY ISMAIL — MEKNÈS
Département Informatique

ALGORITHMIQUE AVANCÉE — INF301
Chapitre 1 : Introduction aux Algorithmes

Prof. Ahmed Benali | L3 Informatique | Semestre 1 — 2024/2025

================================================

1. DÉFINITION D'UN ALGORITHME
Un algorithme est une suite finie et non ambiguë d'opérations permettant de résoudre un problème.
Propriétés fondamentales : Finitude · Précision · Entrées/Sorties · Effectivité

2. COMPLEXITÉ ALGORITHMIQUE
- Complexité temporelle : O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ)
- Complexité spatiale : espace mémoire utilisé

3. STRUCTURES DE DONNÉES DE BASE
• Tableaux : accès O(1), insertion O(n)
• Listes chaînées : accès O(n), insertion O(1)
• Piles (Stack) : LIFO — push/pop en O(1)
• Files (Queue) : FIFO — enqueue/dequeue en O(1)
• Arbres binaires : recherche O(log n) si équilibré
• Tables de hachage : accès moyen O(1)

4. ALGORITHMES DE TRI
+-------------------+--------------+--------------+-----------+
| Algorithme        | Meilleur cas | Pire cas     | Stable ?  |
+-------------------+--------------+--------------+-----------+
| Tri bulles        | O(n)         | O(n2)        | Oui       |
| Tri insertion     | O(n)         | O(n2)        | Oui       |
| Tri selection     | O(n2)        | O(n2)        | Non       |
| Tri rapide        | O(n log n)   | O(n2)        | Non       |
| Tri fusion        | O(n log n)   | O(n log n)   | Oui       |
| Tri par tas       | O(n log n)   | O(n log n)   | Non       |
+-------------------+--------------+--------------+-----------+

5. EXERCICES
Ex 1 : Implémenter le tri rapide en Python et analyser sa complexité.
Ex 2 : Comparer tri fusion et tri rapide sur un tableau de 10⁶ éléments.
Ex 3 : Implémenter une pile avec une liste chaînée.

================================================
© UMI Meknès 2024/2025 — Document pédagogique`,

  "TD_Algorithmique_S1.pdf": `UNIVERSITÉ MOULAY ISMAIL — MEKNÈS
INF301 — ALGORITHMIQUE AVANCÉE
TD N°1 — Complexité et Structures de données

================================================

EXERCICE 1 : Analyse de complexité
Donner la complexité temporelle des fonctions suivantes :

def f1(n):
    for i in range(n):           # O(n)
        for j in range(n):       # O(n)
            print(i*j)           # O(1)
# Complexité : O(n²)

def f2(n):
    i = 1
    while i < n:                 # O(log n)
        i = i * 2
    return i
# Complexité : O(log n)

EXERCICE 2 : Implémentation d'une pile
class Stack:
    def __init__(self): self.data = []
    def push(self, x): self.data.append(x)
    def pop(self): return self.data.pop() if self.data else None
    def peek(self): return self.data[-1] if self.data else None
    def is_empty(self): return len(self.data) == 0

EXERCICE 3 : Tri fusion
def merge_sort(arr):
    if len(arr) <= 1: return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]: result.append(left[i]); i+=1
        else: result.append(right[j]); j+=1
    return result + left[i:] + right[j:]

CORRECTION : merge_sort([5,2,8,1,9]) → [1,2,5,8,9]

================================================
À rendre avant le 25 Jan 2025 | Prof. A. Benali`,

  "Cours_BD_Relationnel.pdf": `UNIVERSITÉ MOULAY ISMAIL — MEKNÈS
INF402 — BASE DE DONNÉES
Chapitre 2 : Modèle Relationnel & SQL

================================================

1. MODÈLE ENTITÉ-ASSOCIATION (E/A)
Entités : objets du monde réel (ÉTUDIANT, COURS, INSCRIPTION)
Associations : relations entre entités (s'inscrit, enseigne)
Cardinalités : 1-1, 1-N, M-N

2. ALGÈBRE RELATIONNELLE
σ (Sélection) : σ_condition(Relation)
π (Projection) : π_attributs(Relation)
⋈ (Jointure) : R ⋈ S
∪ (Union), ∩ (Intersection), - (Différence)

3. SQL — STRUCTURED QUERY LANGUAGE

Création de tables :
CREATE TABLE etudiants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  cne VARCHAR(20) UNIQUE,
  filiere VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Requêtes de base :
SELECT nom, prenom, filiere
FROM etudiants
WHERE filiere = 'GI-L3'
ORDER BY nom ASC;

Jointures :
SELECT e.nom, e.prenom, c.titre AS cours
FROM etudiants e
INNER JOIN inscriptions i ON e.id = i.etudiant_id
INNER JOIN cours c ON i.cours_id = c.id
WHERE c.code = 'INF402';

Fonctions d'agrégat :
SELECT filiere, COUNT(*) AS nb_etudiants, AVG(moyenne) AS moy
FROM etudiants
GROUP BY filiere
HAVING COUNT(*) > 10;

4. TRANSACTIONS & ACID
Atomicité · Cohérence · Isolation · Durabilité
BEGIN TRANSACTION;
UPDATE comptes SET solde = solde - 500 WHERE id = 1;
UPDATE comptes SET solde = solde + 500 WHERE id = 2;
COMMIT;

================================================
© UMI Meknès 2024/2025`,

  "IA_Introduction_ML.pdf": `UNIVERSITÉ MOULAY ISMAIL — MEKNÈS
INF501 — INTELLIGENCE ARTIFICIELLE
Introduction au Machine Learning

================================================

1. DÉFINITIONS FONDAMENTALES
Machine Learning : système apprenant automatiquement à partir des données.
Arthur Samuel (1959) : "Field of study that gives computers the ability to learn
without being explicitly programmed."

2. TYPES D'APPRENTISSAGE
+---------------------+----------------------------------------+
| Type                | Exemples d'algorithmes                 |
+---------------------+----------------------------------------+
| Supervise           | Regression lineaire, SVM, Arbre decision|
| Non supervise       | K-means, PCA, Autoencoders             |
| Par renforcement    | Q-Learning, PPO, AlphaGo               |
+---------------------+----------------------------------------+

3. PIPELINE ML STANDARD
Collecte données → Nettoyage → Feature Engineering →
Séparation train/test → Entraînement → Évaluation → Déploiement

4. RÉGRESSION LINÉAIRE
y = θ₀ + θ₁x₁ + θ₂x₂ + ... + θₙxₙ
Fonction de coût : J(θ) = (1/2m) Σ(hθ(xⁱ) - yⁱ)²
Gradient descent : θⱼ := θⱼ - α ∂J/∂θⱼ

5. CLASSIFICATION — RÉGRESSION LOGISTIQUE
hθ(x) = g(θᵀx) où g(z) = 1/(1+e⁻ᶻ) (sigmoïde)
Seuil de décision : si hθ(x) ≥ 0.5 → classe 1, sinon → classe 0

6. RÉSEAUX DE NEURONES
Couche d'entrée → Couches cachées → Couche de sortie
Activation : ReLU, Sigmoid, Tanh, Softmax
Rétropropagation : calcul du gradient par la règle de la chaîne

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LogisticRegression()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)

================================================
© UMI Meknès 2024/2025 | Prof. A. Benali`,
};

// ── Générateur PDF minimaliste ────────────────────────────────
function makePdf(titre, contenu) {
  // Encode text to PDF-safe format
  const escape = (s) => s
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x00-\x7E]/g, (c) => {
      // transliterate common accented chars
      const map = {
        'é':'e','è':'e','ê':'e','ë':'e','É':'E','È':'E','Ê':'E',
        'à':'a','â':'a','ä':'a','À':'A','Â':'A',
        'ô':'o','ö':'o','Ô':'O',
        'ù':'u','û':'u','ü':'u','Ù':'U','Û':'U',
        'î':'i','ï':'i','Î':'I',
        'ç':'c','Ç':'C','ñ':'n',
        '\u2014':'-','\u2013':'-','\u00b2':'2','\u00b3':'3',
        '\u00e0':'a','\u2019':"'",'\u00ab':'"','\u00bb':'"',
      };
      return map[c] || '?';
    });

  // Split content into lines, max 85 chars
  const rawLines = contenu.split('\n');
  const lines = [];
  rawLines.forEach(raw => {
    if (raw.length <= 85) { lines.push(raw); return; }
    let rem = raw;
    while (rem.length > 85) {
      let cut = rem.lastIndexOf(' ', 85);
      if (cut < 0) cut = 85;
      lines.push(rem.slice(0, cut));
      rem = rem.slice(cut + 1);
    }
    if (rem) lines.push(rem);
  });

  const lineH = 14;   // pts per line
  const marginLeft = 60;
  const pageH = 841;  // A4 in pts
  const pageW = 595;
  const usableH = pageH - 120; // top+bottom margin
  const linesPerPage = Math.floor(usableH / lineH);

  // Build page streams
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  if (pages.length === 0) pages.push([]);

  // PDF objects
  const objs = [];
  const push = (s) => { objs.push(s); return objs.length; };

  // Object 1 — catalog placeholder
  push('');
  // Object 2 — page tree placeholder
  push('');
  // Object 3 — font
  push('<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>');
  // Object 4 — bold font
  push('<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding>>');

  const pageObjIds = [];
  const contentObjIds = [];

  pages.forEach((pageLines, pi) => {
    // Build stream
    let stream = 'BT\n';
    // Header bar
    stream += `q 0.24 0.38 0.78 rg 0 ${pageH - 50} ${pageW} 50 re f Q\n`;
    // Header text white
    stream += `BT /F2 13 Tf 1 1 1 rg ${marginLeft} ${pageH - 32} Td (${escape(titre)}) Tj ET\n`;
    // UMI logo text
    stream += `BT /F1 8 Tf 1 1 1 rg ${pageW - 140} ${pageH - 32} Td (Universite Moulay Ismail) Tj ET\n`;
    stream += `BT /F1 7 Tf 1 1 1 rg ${pageW - 120} ${pageH - 44} Td (Departement Informatique) Tj ET\n`;
    // Page number
    const pageNum = `Page ${pi + 1} / ${pages.length}`;
    stream += `BT /F1 8 Tf 0.5 0.5 0.5 rg ${pageW - 90} 25 Td (${escape(pageNum)}) Tj ET\n`;
    // Footer line
    stream += `q 0.9 0.9 0.9 rg 0 40 ${pageW} 1 re f Q\n`;
    // Body text
    stream += `BT\n/F1 9.5 Tf\n0 0 0 rg\n${marginLeft} ${pageH - 75} Td\n${lineH} TL\n`;
    pageLines.forEach(line => {
      const isBold = /^[0-9]+\.|^={3}|^-{3}|^[A-Z ]{4,}$/.test(line.trim());
      if (isBold) {
        stream += `ET\nBT /F2 9.5 Tf 0 0 0 rg ${marginLeft} `;
        // We can't change font mid-BT easily in minimaliste mode, just keep regular
        stream += `ET\nBT /F1 9.5 Tf 0 0 0 rg ${marginLeft} `;
      }
      stream += `(${escape(line)}) '\n`;
    });
    stream += 'ET\n';

    const streamBytes = stream.length;
    const contentId = push(`<</Length ${streamBytes}>>\nstream\n${stream}\nendstream`);
    contentObjIds.push(contentId);

    const pageId = push(`<</Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageW} ${pageH}] /Contents ${contentId} 0 R /Resources <</Font <</F1 3 0 R /F2 4 0 R>>>>>>`);
    pageObjIds.push(pageId);
  });

  // Fill catalog and page tree
  objs[0] = `<</Type /Catalog /Pages 2 0 R>>`;
  objs[1] = `<</Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pages.length}>>`;

  // Build xref and assemble
  let out = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((obj, i) => {
    offsets.push(out.length);
    out += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefOffset = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach(o => { out += String(o).padStart(10, '0') + ' 00000 n \n'; });
  out += `trailer\n<</Size ${objs.length + 1} /Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`;
  return out;
}

function downloadMock(nom, fileObj = null) {
  // Fichier réel uploadé → téléchargement direct
  if (fileObj) {
    const url = URL.createObjectURL(fileObj);
    const a = document.createElement("a");
    a.href = url; a.download = fileObj.name; a.click();
    URL.revokeObjectURL(url);
    return;
  }
  // Documents de démonstration → générer un vrai PDF
  const contenu = DOC_CONTENT[nom] ||
`UNIVERSITE MOULAY ISMAIL - MEKNES
Departement Informatique
2024/2025
================================================

Document : ${nom}

Ce document contient le contenu pedagogique du cours.
Referez-vous a l'enseignant pour la version complete.

Plan du document :
1. Introduction et objectifs du cours
2. Concepts fondamentaux et definitions
3. Exemples detailles et applications pratiques
4. Exercices et travaux pratiques
5. References bibliographiques recommandees

================================================
Genere par Umi-Flow | portail.umi.ac.ma`;

  const pdfStr = makePdf(nom.replace(/\.(pdf|pptx|docx)$/i, ''), contenu);
  const bytes = new Uint8Array(pdfStr.length);
  for (let i = 0; i < pdfStr.length; i++) bytes[i] = pdfStr.charCodeAt(i) & 0xff;
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nom.endsWith('.pdf') ? nom : nom.replace(/\.[^.]+$/, '.pdf');
  a.click();
  URL.revokeObjectURL(url);
}

/* ----------- STAT CARD ----------- */
function StatCard({ icon:Icon, label, value, color, sub }) {
  return (
    <motion.div
      whileHover={{ y:-4, boxShadow:`0 16px 40px ${color}22` }}
      style={{
        background:"white", borderRadius:18,
        padding:"20px 24px",
        border:`1px solid ${color}18`,
        display:"flex", alignItems:"center", gap:16,
        flex:1, minWidth:150,
        boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
        transition:"box-shadow .2s",
        position:"relative", overflow:"hidden",
      }}
    >
      {/* bg decoration */}
      <div style={{
        position:"absolute", right:-16, top:-16,
        width:80, height:80, borderRadius:"50%",
        background: color + "0d",
      }} />
      <div style={{
        width:48, height:48, borderRadius:14,
        background:`linear-gradient(135deg, ${color}22, ${color}10)`,
        display:"flex", alignItems:"center", justifyContent:"center",
        flexShrink:0, border:`1px solid ${color}20`,
      }}>
        <Icon size={22} color={color} strokeWidth={2} />
      </div>
      <div>
        <div style={{ fontSize:26, fontWeight:800, color:"#0f172a", lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12.5, color:"#64748b", marginTop:4, fontWeight:500 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color:color, marginTop:3, fontWeight:600 }}>{sub}</div>}
      </div>
    </motion.div>
  );
}

/* ----------- PFE CARD ----------- */
function PFECard({ pfe, onRemark }) {
  const s = statutConfig[pfe.statut];
  const SIcon = s.icon;
  return (
    <motion.div
      whileHover={{ y:-2, boxShadow:"0 8px 28px rgba(59,130,246,0.1)" }}
      style={{
        background:"white", borderRadius:16,
        border:"1px solid #e2e8f0",
        padding:"20px 24px",
        boxShadow:"0 2px 8px rgba(0,0,0,0.04)",
        transition:"box-shadow .2s",
        position:"relative", overflow:"hidden",
      }}
    >
      {/* left accent bar */}
      <div style={{
        position:"absolute", left:0, top:0, bottom:0, width:4,
        background: pfe.statut === "valide" ? "#10b981"
          : pfe.statut === "revision" ? "#f59e0b"
          : pfe.statut === "en_cours" ? B.primary : "#94a3b8",
        borderRadius:"16px 0 0 16px",
      }} />

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:16, paddingLeft:12 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#0f172a", marginBottom:8, lineHeight:1.35 }}>
            {pfe.titre}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{
              width:28, height:28, borderRadius:"50%",
              background:B.grad, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, color:"white", fontWeight:800, flexShrink:0,
            }}>{pfe.etudiant[0]}</div>
            <span style={{ fontSize:13, color:"#334155", fontWeight:600 }}>{pfe.etudiant}</span>
            <span style={{ fontSize:11, color:"#cbd5e1" }}>·</span>
            <span style={{ fontSize:12, color:"#64748b" }}>{pfe.filiere}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:5,
              background:s.bg, color:s.color,
              fontSize:11.5, fontWeight:700, borderRadius:20, padding:"4px 11px",
            }}>
              <SIcon size={11} />{s.label}
            </span>
            <span style={{ fontSize:12, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
              <Clock size={11} />{pfe.deadline}
            </span>
            {pfe.note && (
              <span style={{
                display:"inline-flex", alignItems:"center", gap:4,
                background:"#d1fae5", color:"#065f46",
                fontSize:11.5, fontWeight:700, borderRadius:20, padding:"4px 11px",
              }}>
                <Star size={10} fill="#065f46" />{pfe.note}/20
              </span>
            )}
          </div>
        </div>
        <div style={{ display:"flex", gap:8, flexShrink:0 }}>
          <motion.button
            onClick={() => downloadMock(`PFE_${pfe.etudiant.replace(" ","_")}.pdf`)}
            whileHover={{ scale:1.08 }} whileTap={{ scale:0.93 }}
            style={{
              width:36, height:36, borderRadius:10,
              background:B.lighter, border:`1px solid ${B.light}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              cursor:"pointer",
            }}
          ><Download size={15} color={B.primary} /></motion.button>
          <motion.button
            onClick={() => onRemark(pfe)}
            whileHover={{ scale:1.03 }} whileTap={{ scale:0.96 }}
            style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"0 14px", height:36, borderRadius:10,
              background:B.grad, border:"none",
              color:"white", fontSize:12.5, fontWeight:700, cursor:"pointer",
              fontFamily:"inherit", boxShadow:"0 2px 10px rgba(59,130,246,0.3)",
            }}
          >
            <MessageSquare size={13} />
            Remarques {pfe.remarques > 0 && `(${pfe.remarques})`}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------- REMARKS MODAL ----------- */
function RemarksModal({ pfe, onClose }) {
  // Lire le vrai nom depuis localStorage
  const _u = (() => { try { return JSON.parse(localStorage.getItem("umi_user"))||{}; } catch{return{};} })();
  const _profNom = _u.prenom && _u.nom
    ? `Prof. ${_u.prenom} ${_u.nom}`
    : "Prof. Dupont";

  const [text, setText] = useState("");
  const [remarks, setRemarks] = useState(
    Array.from({ length: pfe.remarques }, (_, i) => ({
      id: i+1,
      auteur: _profNom,
      date: i === 0 ? "10 Jan" : "14 Jan",
      texte: i === 0
        ? "La problématique doit être mieux définie dans l'introduction."
        : "Ajoutez des références bibliographiques pour le chapitre 2.",
    }))
  );
  const send = () => {
    if (!text.trim()) return;
    setRemarks(r => [...r, { id:Date.now(), auteur:_profNom, date:"Maintenant", texte:text }]);
    setText("");
  };
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(15,23,42,0.55)", backdropFilter:"blur(6px)",
        display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.92, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:24 }}
        transition={{ type:"spring", stiffness:340, damping:28 }}
        onClick={e => e.stopPropagation()}
        style={{ background:"white", borderRadius:22, width:"100%", maxWidth:560,
          maxHeight:"82vh", display:"flex", flexDirection:"column",
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)", overflow:"hidden" }}
      >
        <div style={{ padding:"22px 26px 18px", borderBottom:"1px solid #f1f5f9",
          display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:16, fontWeight:800, color:"#0f172a", marginBottom:4 }}>
              Remarques — {pfe.etudiant}
            </div>
            <div style={{ fontSize:12.5, color:"#64748b", lineHeight:1.4, maxWidth:380 }}>{pfe.titre}</div>
          </div>
          <button onClick={onClose} style={{ background:"#f1f5f9", border:"none", cursor:"pointer",
            color:"#64748b", padding:8, borderRadius:10, display:"flex" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:"18px 26px", display:"flex", flexDirection:"column", gap:12 }}>
          {remarks.length === 0 && (
            <div style={{ textAlign:"center", color:"#94a3b8", fontSize:13, padding:"32px 0" }}>
              Aucune remarque pour l'instant.
            </div>
          )}
          {remarks.map(r => (
            <div key={r.id} style={{ background:B.lighter, borderRadius:14,
              border:`1px solid ${B.light}`, padding:"14px 18px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                <span style={{ fontSize:12.5, fontWeight:700, color:B.primary }}>{r.auteur}</span>
                <span style={{ fontSize:11, color:"#94a3b8" }}>{r.date}</span>
              </div>
              <p style={{ fontSize:13.5, color:"#334155", margin:0, lineHeight:1.6 }}>{r.texte}</p>
            </div>
          ))}
        </div>
        <div style={{ padding:"14px 26px 22px", borderTop:"1px solid #f1f5f9", display:"flex", gap:10 }}>
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Ajouter une remarque…" rows={2}
            style={{ flex:1, resize:"none", border:"1.5px solid #e2e8f0", borderRadius:12,
              padding:"10px 14px", fontSize:13.5, color:"#0f172a",
              fontFamily:"inherit", outline:"none", background:"#f8fafc" }} />
          <motion.button onClick={send} whileHover={{ scale:1.06 }} whileTap={{ scale:0.94 }}
            style={{ width:44, height:44, borderRadius:12, border:"none",
              background:B.grad, color:"white", display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer", alignSelf:"flex-end",
              boxShadow:"0 2px 10px rgba(59,130,246,0.35)" }}>
            <Send size={16} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----------- ADD COURSE MODAL ----------- */
function AddCourseModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ code:"", titre:"", filiere:FILIERES[0], etudiants:"" });
  const set = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const valid = form.code.trim() && form.titre.trim() && form.etudiants;

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(15,23,42,0.55)",
        backdropFilter:"blur(6px)", display:"flex", alignItems:"center",
        justifyContent:"center", padding:24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.92, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:24 }}
        transition={{ type:"spring", stiffness:340, damping:28 }}
        onClick={e => e.stopPropagation()}
        style={{ background:"white", borderRadius:22, width:"100%", maxWidth:500,
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)", overflow:"hidden" }}
      >
        {/* header */}
        <div style={{
          padding:"22px 26px 18px",
          background: B.gradHero,
          display:"flex", justifyContent:"space-between", alignItems:"center",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:"rgba(255,255,255,0.2)",
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:"white" }}>Nouveau cours</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.7)" }}>Ajouter à votre espace</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.2)", border:"none",
            cursor:"pointer", color:"white", padding:8, borderRadius:10, display:"flex" }}>
            <X size={16} />
          </button>
        </div>

        <div style={{ padding:"24px 26px 26px" }}>
          {/* code */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6, letterSpacing:"0.3px" }}>
              CODE DU COURS
            </label>
            <div style={{ display:"flex", alignItems:"center", background:"#f8fafc",
              border:"1.5px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
              <div style={{ padding:"0 12px", color:"#94a3b8" }}><Hash size={14} /></div>
              <input value={form.code} onChange={e => set("code", e.target.value.toUpperCase())}
                placeholder="INF301"
                style={{ flex:1, border:"none", outline:"none", background:"transparent",
                  fontSize:14, color:"#0f172a", padding:"10px 0", fontFamily:"inherit", fontWeight:700 }} />
            </div>
          </div>

          {/* titre */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6, letterSpacing:"0.3px" }}>
              INTITULÉ DU COURS
            </label>
            <input value={form.titre} onChange={e => set("titre", e.target.value)}
              placeholder="ex: Algorithmique Avancée"
              style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:10,
                padding:"11px 14px", fontSize:14, color:"#0f172a",
                fontFamily:"inherit", outline:"none", background:"#f8fafc", boxSizing:"border-box" }} />
          </div>

          {/* filiere + etudiants */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:22 }}>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6, letterSpacing:"0.3px" }}>
                FILIÈRE
              </label>
              <select value={form.filiere} onChange={e => set("filiere", e.target.value)}
                style={{ width:"100%", border:"1.5px solid #e2e8f0", borderRadius:10,
                  padding:"11px 14px", fontSize:13.5, color:"#0f172a",
                  fontFamily:"inherit", outline:"none", background:"#f8fafc" }}>
                {FILIERES.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6, letterSpacing:"0.3px" }}>
                NB. ÉTUDIANTS
              </label>
              <div style={{ display:"flex", alignItems:"center", background:"#f8fafc",
                border:"1.5px solid #e2e8f0", borderRadius:10, overflow:"hidden" }}>
                <div style={{ padding:"0 12px", color:"#94a3b8" }}><Users size={14} /></div>
                <input type="number" value={form.etudiants} onChange={e => set("etudiants", e.target.value)}
                  placeholder="0" min="0"
                  style={{ flex:1, border:"none", outline:"none", background:"transparent",
                    fontSize:14, color:"#0f172a", padding:"10px 0", fontFamily:"inherit" }} />
              </div>
            </div>
          </div>

          {/* preview */}
          {form.titre && (
            <motion.div initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }}
              style={{ marginBottom:20, borderRadius:12, border:`1.5px solid ${B.primary}33`,
                overflow:"hidden" }}>
              <div style={{ height:4, background:B.grad }} />
              <div style={{ padding:"12px 16px", background:B.lighter }}>
                <div style={{ fontSize:11, fontWeight:700, background:B.light,
                  color:B.primary, borderRadius:6, padding:"2px 8px",
                  display:"inline-block", marginBottom:6 }}>{form.code || "CODE"}</div>
                <div style={{ fontSize:14, fontWeight:800, color:"#0f172a" }}>{form.titre}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:2 }}>{form.filiere}</div>
              </div>
            </motion.div>
          )}

          {/* upload file */}
          <div style={{ marginBottom:16 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151", marginBottom:6, letterSpacing:"0.3px" }}>
              FICHIER DU COURS (optionnel)
            </label>
            <label style={{ display:"flex", alignItems:"center", gap:10,
              background:"#f8fafc", border:"1.5px dashed #cbd5e1",
              borderRadius:10, padding:"12px 14px", cursor:"pointer",
              transition:"border-color .2s" }}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#3b82f6"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#cbd5e1"}>
              <Upload size={18} color="#94a3b8" style={{flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{ fontSize:13.5, color:form.fichier ? "#0f172a" : "#94a3b8", fontWeight:form.fichier?600:400 }}>
                  {form.fichier ? form.fichier.name : "Glissez ou cliquez pour téléverser"}
                </div>
                <div style={{ fontSize:11.5, color:"#94a3b8", marginTop:2 }}>PDF, PPTX, DOCX — max 50 MB</div>
              </div>
              {form.fichier && (
                <span onClick={e=>{e.preventDefault();set("fichier",null);}}
                  style={{ color:"#94a3b8", cursor:"pointer", padding:4 }}>
                  <X size={14}/>
                </span>
              )}
              <input type="file" accept=".pdf,.pptx,.docx,.ppt,.doc"
                onChange={e=>set("fichier", e.target.files[0]||null)}
                style={{ display:"none" }}/>
            </label>
          </div>

          <motion.button
            onClick={() => { if (valid) { onAdd(form); onClose(); } }}
            whileHover={{ scale: valid ? 1.01 : 1 }}
            whileTap={{ scale: valid ? 0.98 : 1 }}
            style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
              background: valid ? B.grad : "#e2e8f0",
              color: valid ? "white" : "#94a3b8",
              fontSize:14, fontWeight:700, cursor: valid ? "pointer" : "not-allowed",
              fontFamily:"inherit",
              boxShadow: valid ? "0 4px 18px rgba(59,130,246,0.32)" : "none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Plus size={17} />
            Créer le cours
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----------- UPLOAD MODAL ----------- */
function UploadModal({ onClose, cours }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [selectedCours, setSelectedCours] = useState("");
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, zIndex:200, background:"rgba(15,23,42,0.55)",
        backdropFilter:"blur(6px)", display:"flex", alignItems:"center",
        justifyContent:"center", padding:24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.92, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:24 }}
        transition={{ type:"spring", stiffness:340, damping:28 }}
        onClick={e => e.stopPropagation()}
        style={{ background:"white", borderRadius:22, width:"100%", maxWidth:460,
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)" }}
      >
        <div style={{ padding:"22px 26px 18px", borderBottom:"1px solid #f1f5f9",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div style={{ fontSize:17, fontWeight:800, color:"#0f172a" }}>Téléverser un document</div>
          <button onClick={onClose} style={{ background:"#f1f5f9", border:"none", cursor:"pointer",
            color:"#64748b", padding:8, borderRadius:10, display:"flex" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding:"22px 26px 26px" }}>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); setFile(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById("fileInput").click()}
            style={{ border:`2px dashed ${dragging ? B.primary : "#cbd5e1"}`,
              borderRadius:14, padding:"32px 20px", textAlign:"center", cursor:"pointer",
              background: dragging ? B.lighter : "#f8fafc",
              transition:"all .2s", marginBottom:16 }}
          >
            <input id="fileInput" type="file" accept=".pdf,.pptx,.docx" style={{ display:"none" }}
              onChange={e => setFile(e.target.files[0])} />
            {file ? (
              <div>
                <div style={{ width:52, height:52, borderRadius:14, background:B.lighter,
                  display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px" }}>
                  <FileText size={26} color={B.primary} />
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:"#0f172a" }}>{file.name}</div>
                <div style={{ fontSize:12, color:"#64748b", marginTop:4 }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            ) : (
              <div>
                <div style={{ width:52, height:52, borderRadius:14, background:"#f1f5f9",
                  display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                  <Upload size={24} color="#94a3b8" />
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:"#0f172a" }}>Glissez un fichier ici</div>
                <div style={{ fontSize:12.5, color:"#94a3b8", marginTop:4 }}>PDF, PPTX, DOCX — max 20 MB</div>
              </div>
            )}
          </div>
          <div style={{ marginBottom:18 }}>
            <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#374151",
              marginBottom:7, letterSpacing:"0.3px" }}>ASSOCIER À UN COURS</label>
            <select value={selectedCours} onChange={e => setSelectedCours(e.target.value)}
              style={{ width:"100%", padding:"11px 14px", borderRadius:10,
                border:"1.5px solid #e2e8f0", fontSize:13.5, color:"#0f172a",
                fontFamily:"inherit", outline:"none", background:"white" }}>
              <option value="">— Sélectionner —</option>
              {cours.map(c => <option key={c.id} value={c.code}>{c.code} · {c.titre}</option>)}
            </select>
          </div>
          <motion.button whileHover={{ scale: file ? 1.01 : 1 }} whileTap={{ scale: file ? 0.98 : 1 }}
            onClick={onClose}
            style={{ width:"100%", padding:"13px", borderRadius:12, border:"none",
              background: file ? B.grad : "#e2e8f0",
              color: file ? "white" : "#94a3b8",
              fontSize:14, fontWeight:700, cursor: file ? "pointer" : "not-allowed",
              fontFamily:"inherit",
              boxShadow: file ? "0 4px 16px rgba(59,130,246,0.3)" : "none",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Upload size={16} />
            Téléverser
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ----------- COURS DETAIL MODAL ----------- */
function CoursDetailModal({ cours, supports, setSupports, onClose }) {
  const coursDocs = supports.filter(s => s.cours === cours.code);
  const [activeSection, setActiveSection] = useState("docs");

  const sections = [
    { id:"docs",     label:`Documents (${coursDocs.length})`,    icon:FileText },
    { id:"etudiants",label:`Étudiants (${cours.etudiants})`,     icon:Users },
    { id:"pfe",      label:`Thèses & PFE`,                        icon:GraduationCap },
  ];

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
        style={{ background:"white",borderRadius:22,width:"100%",maxWidth:620,
          maxHeight:"88vh",overflow:"auto",
          boxShadow:"0 32px 80px rgba(0,0,0,0.2)" }}>

        {/* header */}
        <div style={{ padding:"22px 26px 18px",
          background:`linear-gradient(135deg,${cours.couleur},${cours.couleur}cc)`,
          position:"sticky",top:0,zIndex:1,
          display:"flex",justifyContent:"space-between",alignItems:"flex-start" }}>
          <div>
            <div style={{ display:"inline-flex",alignItems:"center",gap:5,
              background:"rgba(255,255,255,0.2)",borderRadius:20,
              padding:"3px 11px",marginBottom:8,fontSize:11,fontWeight:700,color:"white" }}>
              <Hash size={10}/>{cours.code}
            </div>
            <div style={{ fontSize:20,fontWeight:800,color:"white",lineHeight:1.2,marginBottom:4 }}>
              {cours.titre}
            </div>
            <div style={{ fontSize:13,color:"rgba(255,255,255,0.75)" }}>{cours.filiere}</div>
          </div>
          <button onClick={onClose}
            style={{ background:"rgba(255,255,255,0.2)",border:"none",
              cursor:"pointer",color:"white",padding:8,borderRadius:9,
              display:"flex",flexShrink:0 }}>
            <X size={16}/>
          </button>
        </div>

        {/* stats band */}
        <div style={{ display:"flex",gap:0,borderBottom:"1px solid #e2e8f0" }}>
          {[
            { icon:Users,    v:cours.etudiants, l:"Étudiants" },
            { icon:FileText, v:cours.docs,       l:"Documents" },
            { icon:BookOpen, v:"—",              l:"Séances" },
          ].map(s=>(
            <div key={s.l} style={{ flex:1,padding:"14px 20px",textAlign:"center",
              borderRight:"1px solid #f1f5f9" }}>
              <div style={{ fontSize:22,fontWeight:800,color:"#0f172a" }}>{s.v}</div>
              <div style={{ fontSize:12,color:"#64748b",marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* section tabs */}
        <div style={{ display:"flex",gap:0,borderBottom:"1px solid #e2e8f0",
          padding:"0 20px" }}>
          {sections.map(sec=>{
            const Icon = sec.icon;
            return (
              <button key={sec.id} onClick={()=>setActiveSection(sec.id)}
                style={{ display:"flex",alignItems:"center",gap:6,
                  padding:"11px 14px",border:"none",cursor:"pointer",
                  background:"transparent",fontFamily:"inherit",
                  color:activeSection===sec.id?cours.couleur:"#64748b",
                  fontSize:13,fontWeight:activeSection===sec.id?700:500,
                  borderBottom:activeSection===sec.id?`2px solid ${cours.couleur}`:"2px solid transparent",
                  marginBottom:-1,transition:"all .15s" }}>
                <Icon size={14}/>{sec.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding:"20px 24px 26px" }}>

          {/* DOCUMENTS */}
          {activeSection==="docs" && (
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {coursDocs.length===0 ? (
                <div style={{ textAlign:"center",padding:"40px 20px",color:"#94a3b8" }}>
                  <FileText size={34} style={{ margin:"0 auto 10px",opacity:0.3 }}/>
                  <div style={{ fontSize:14,fontWeight:600 }}>Aucun document pour ce cours</div>
                </div>
              ) : coursDocs.map((doc,i)=>(
                <motion.div key={doc.id}
                  initial={{opacity:0,x:-6}} animate={{opacity:1,x:0}}
                  transition={{delay:i*0.05}}
                  style={{ display:"flex",alignItems:"center",gap:12,
                    background:"#f8fafc",borderRadius:11,padding:"12px 15px",
                    border:"1px solid #e2e8f0" }}>
                  <div style={{ width:38,height:38,borderRadius:10,
                    background:typeColor[doc.type]+"18",
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <FileText size={18} color={typeColor[doc.type]}/>
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:13.5,fontWeight:700,color:"#0f172a",
                      overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                      {doc.nom}
                    </div>
                    <div style={{ fontSize:12,color:"#94a3b8",marginTop:2,
                      display:"flex",gap:10 }}>
                      <span style={{ background:typeColor[doc.type]+"18",color:typeColor[doc.type],
                        fontSize:10.5,fontWeight:700,borderRadius:6,padding:"1px 7px" }}>
                        {doc.type}
                      </span>
                      <span>{doc.taille}</span>
                      <span>{doc.date}</span>
                      <span>👁 {doc.vues}</span>
                    </div>
                  </div>
                  <button onClick={()=>downloadMock(doc.nom, doc.fileObj||null)}
                    style={{ width:32,height:32,borderRadius:9,border:"none",
                      background:cours.couleur+"18",cursor:"pointer",
                      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                    <Download size={14} color={cours.couleur}/>
                  </button>
                </motion.div>
              ))}

              {/* upload inside detail */}
              <motion.label
                whileHover={{borderColor:cours.couleur}}
                style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:8,
                  padding:"14px",borderRadius:11,
                  border:"1.5px dashed #cbd5e1",background:"#fafafa",
                  cursor:"pointer",marginTop:4,transition:"border-color .2s" }}>
                <Upload size={16} color="#94a3b8"/>
                <span style={{ fontSize:13.5,color:"#94a3b8",fontWeight:500 }}>
                  Ajouter un document à ce cours
                </span>
                <input type="file" accept=".pdf,.pptx,.docx,.ppt,.doc"
                  style={{ display:"none" }}
                  onChange={e=>{
                    const f = e.target.files[0];
                    if (!f) return;
                    const ext = f.name.split('.').pop().toUpperCase();
                    const size = `${(f.size/(1024*1024)).toFixed(1)} MB`;
                    setSupports(prev=>[...prev,{
                      id:Date.now(), nom:f.name,
                      type:["PDF","PPTX","DOCX","PPT","DOC"].includes(ext)?ext:"PDF",
                      taille:size, cours:cours.code,
                      date:new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}),
                      vues:0, fileObj:f,
                    }]);
                  }}/>
              </motion.label>
            </div>
          )}

          {/* ÉTUDIANTS */}
          {activeSection==="etudiants" && (
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              <div style={{ background:cours.couleur+"0d",border:`1px solid ${cours.couleur}22`,
                borderRadius:12,padding:"14px 16px",
                display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:22,fontWeight:800,color:"#0f172a" }}>{cours.etudiants}</div>
                  <div style={{ fontSize:12.5,color:"#64748b",marginTop:2 }}>
                    Étudiants inscrits — {cours.filiere}
                  </div>
                </div>
                <div style={{ fontSize:36 }}>🎓</div>
              </div>
              <div style={{ background:"#f8fafc",borderRadius:11,padding:"13px 16px",
                border:"1px solid #e2e8f0",
                display:"flex",alignItems:"center",gap:8,
                fontSize:13,color:"#64748b" }}>
                <Users size={14} color={cours.couleur}/>
                La liste détaillée des étudiants est disponible dans le module
                <span style={{ fontWeight:700,color:cours.couleur }}> Étudiants →</span>
              </div>
            </div>
          )}

          {/* PFE */}
          {activeSection==="pfe" && (
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {initPFE.filter(p=>p.filiere.includes(cours.filiere.split(" ")[0])).length===0 ? (
                <div style={{ textAlign:"center",padding:"40px 20px",color:"#94a3b8" }}>
                  <GraduationCap size={34} style={{ margin:"0 auto 10px",opacity:0.3 }}/>
                  <div style={{ fontSize:14,fontWeight:600 }}>Aucun PFE lié à ce cours</div>
                </div>
              ) : initPFE.filter(p=>p.filiere.includes("Informatique")).slice(0,3).map((p,i)=>{
                const sc = statutConfig[p.statut];
                return (
                  <div key={p.id} style={{ display:"flex",alignItems:"center",gap:12,
                    background:"#f8fafc",borderRadius:11,padding:"12px 15px",
                    border:"1px solid #e2e8f0" }}>
                    <div style={{ width:36,height:36,borderRadius:10,
                      background:sc.bg,display:"flex",alignItems:"center",
                      justifyContent:"center",flexShrink:0 }}>
                      <GraduationCap size={17} color={sc.color}/>
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:13,fontWeight:700,color:"#0f172a",
                        overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
                        {p.titre}
                      </div>
                      <div style={{ fontSize:12,color:"#94a3b8",marginTop:2 }}>
                        {p.etudiant} · {p.deadline}
                      </div>
                    </div>
                    <span style={{ background:sc.bg,color:sc.color,
                      fontSize:11.5,fontWeight:700,borderRadius:20,
                      padding:"3px 10px",flexShrink:0 }}>{sc.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ================================================---------------
   MAIN PAGE
================================================--------------- */
export default function DocumentsPage() {
  const navigate = useNavigate();
  // ── Guard : rediriger vers login si pas de token ──────────
  useEffect(() => {
    const token = localStorage.getItem("umi_token");
    const user  = localStorage.getItem("umi_user");
    if (!token || !user) navigate("/");
  }, []);

  // -- Utilisateur connecté ----------------------------------
  const _u = (() => { try { return JSON.parse(localStorage.getItem("umi_user"))||{}; } catch{return{};} })();
  const _displayName = _u.prenom && _u.nom ? `${_u.prenom} ${_u.nom}` : "Utilisateur";
  const _roleLabel = {PROFESSEUR:"Enseignant",ETUDIANT:"Étudiant",SUPER_ADMIN:"Super Admin",ADMIN_ATTEST:"Admin Scolarité",ADMIN_BIB:"Admin Bibliothèque",ADMIN_EDT:"Admin EDT"}[_u.db_role]||"Utilisateur";
  const _initials = (_u.prenom?.[0]||"U").toUpperCase()+(_u.nom?.[0]||"").toUpperCase();
  const _isProf = _u.db_role === "PROFESSEUR";
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tab, setTab]           = useState("cours");
  const [search, setSearch]     = useState("");
  const [remarksPFE, setRemarksPFE] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [coursDetail, setCoursDetail] = useState(null);
  const [cours, setCours]       = useState(initCours);
  const [supports, setSupports]   = useState(initSupports);
  const [filterCours, setFilterCours] = useState("all");

  const AUTO_COLORS = ["#3b82f6","#6366f1","#0ea5e9","#8b5cf6","#10b981","#f59e0b","#ef4444","#ec4899"];
  const addCourse = (form) => {
    const autoColor = AUTO_COLORS[cours.length % AUTO_COLORS.length];
    const newId = Date.now();
    const hasFichier = form.fichier && form.fichier.name;
    const newCours = {
      id: newId,
      code: form.code,
      titre: form.titre,
      filiere: form.filiere,
      etudiants: parseInt(form.etudiants) || 0,
      docs: hasFichier ? 1 : 0,
      couleur: autoColor,
    };
    setCours(prev => [newCours, ...prev]);
    // Ajouter le fichier uploadé aux supports
    if (hasFichier) {
      const ext = form.fichier.name.split('.').pop().toUpperCase();
      const size = form.fichier.size
        ? `${(form.fichier.size / (1024*1024)).toFixed(1)} MB`
        : "—";
      setSupports(prev => [...prev, {
        id: newId,
        nom: form.fichier.name,
        type: ["PDF","PPTX","DOCX","PPT","DOC"].includes(ext) ? ext : "PDF",
        taille: size,
        cours: form.code,
        date: new Date().toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"}),
        vues: 0,
        fileObj: form.fichier,  // référence au File object pour téléchargement réel
      }]);
    }
  };

  const filteredSupports = supports.filter(s =>
    (filterCours === "all" || s.cours === filterCours) &&
    s.nom.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPFE = initPFE.filter(p =>
    p.titre.toLowerCase().includes(search.toLowerCase()) ||
    p.etudiant.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg, #f0f7ff 0%, #eff6ff 50%, #f8faff 100%)",
      fontFamily:"'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* -- NAVBAR -- */}
      <motion.nav
        initial={{ y:-50, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:0.55, ease:[0.22,1,0.36,1] }}
        style={{
          height:64, background:"rgba(255,255,255,0.9)",
          backdropFilter:"blur(20px)",
          borderBottom:"1px solid rgba(59,130,246,0.1)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"0 36px", position:"sticky", top:0, zIndex:100,
          boxShadow:"0 2px 24px rgba(59,130,246,0.07)",
        }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <motion.button onClick={() => navigate("/teacher")}
            whileHover={{ scale:1.04, x:-2 }} whileTap={{ scale:0.96 }}
            style={{ display:"flex", alignItems:"center", gap:7,
              background:B.lighter, border:`1px solid ${B.light}`,
              borderRadius:10, padding:"7px 14px", cursor:"pointer",
              color:B.primary, fontSize:13, fontWeight:600, fontFamily:"inherit" }}>
            <ArrowLeft size={15} />Retour
          </motion.button>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ fontSize:13, color:"#94a3b8" }}>Accueil</span>
            <ChevronRight size={13} color="#cbd5e1" />
            <span style={{ fontSize:13, fontWeight:700, color:B.primary }}>Documents</span>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <button style={{ width:38, height:38, borderRadius:10, background:"#f1f5f9",
            border:"none", cursor:"pointer", display:"flex", alignItems:"center",
            justifyContent:"center", position:"relative" }}>
            <Bell size={16} color="#64748b" />
            <span style={{ position:"absolute", top:8, right:8, width:7, height:7,
              borderRadius:"50%", background:"#f97316", border:"1.5px solid white" }} />
          </button>
          <div style={{ position:"relative" }}>
            <div onClick={()=>setProfileOpen(o=>!o)} style={{ cursor:"pointer", display:"flex", alignItems:"center", gap:8,
            background:B.lighter, border:`1.5px solid ${B.light}`,
            borderRadius:10, padding:"5px 12px 5px 6px" }}>
            <div style={{ width:28, height:28, borderRadius:8, background:B.grad,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"white", fontSize:13, fontWeight:800 }}>{_initials}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:"#0f172a", lineHeight:1 }}>{_isProf?"Prof. ":""}{_displayName}</div>
              <div style={{ fontSize:10.5, color:B.primary, fontWeight:600, marginTop:1 }}>{_roleLabel}</div>
            </div>
          </div>
            {profileOpen&&<ProfilePanel onClose={()=>setProfileOpen(false)}/>
            }
          </div>
        </div>
      </motion.nav>

      {/* -- HERO BAND -- */}
      <motion.div
        initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, delay:0.1 }}
        style={{
          margin:"28px 40px 0",
          borderRadius:20,
          background: B.gradHero,
          padding:"28px 36px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          overflow:"hidden", position:"relative",
        }}
      >
        {/* bg circles */}
        <div style={{ position:"absolute", right:-40, top:-40, width:200, height:200,
          borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", right:80, bottom:-60, width:160, height:160,
          borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:7,
            background:"rgba(255,255,255,0.18)", borderRadius:20,
            padding:"4px 13px", marginBottom:12 }}>
            <FolderOpen size={13} color="white" />
            <span style={{ fontSize:12, color:"white", fontWeight:600 }}>Espace Documents</span>
          </div>
          <h1 style={{ fontSize:26, fontWeight:800, color:"white",
            letterSpacing:"-0.5px", margin:"0 0 6px" }}>
            Documents & Ressources
          </h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.75)", margin:0 }}>
            Gérez vos cours, supports pédagogiques et thèses PFE
          </p>
        </div>

        {/* stat pills in hero */}
        <div style={{ display:"flex", gap:10, position:"relative", zIndex:1, flexWrap:"wrap" }}>
          {[
            { icon:BookOpen,      v:cours.length,      l:"Cours" },
            { icon:FileText,      v:supports.length,   l:"Fichiers" },
            { icon:GraduationCap, v:initPFE.length,    l:"PFE" },
            { icon:Users,         v:163,               l:"Étudiants" },
          ].map(({ icon:Icon, v, l }) => (
            <div key={l} style={{
              background:"rgba(255,255,255,0.15)",
              backdropFilter:"blur(8px)",
              border:"1px solid rgba(255,255,255,0.25)",
              borderRadius:14, padding:"12px 18px",
              display:"flex", flexDirection:"column", alignItems:"center", minWidth:80,
            }}>
              <Icon size={18} color="white" style={{ marginBottom:6 }} />
              <div style={{ fontSize:20, fontWeight:800, color:"white", lineHeight:1 }}>{v}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.75)", marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* -- TABS -- */}
      <div style={{ padding:"24px 40px 0" }}>
        <div style={{ display:"flex", gap:4, borderBottom:`2px solid ${B.light}` }}>
          {TABS.map(t => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <motion.button key={t.id} onClick={() => setTab(t.id)} whileTap={{ scale:0.97 }}
                style={{
                  display:"flex", alignItems:"center", gap:7,
                  padding:"11px 20px",
                  borderRadius:"11px 11px 0 0",
                  border:"none", cursor:"pointer",
                  background: active ? "white" : "transparent",
                  color: active ? B.primary : "#64748b",
                  fontSize:13.5, fontWeight: active ? 700 : 500,
                  fontFamily:"inherit",
                  borderBottom: active ? `2px solid ${B.primary}` : "2px solid transparent",
                  marginBottom:-2,
                  boxShadow: active ? "0 -2px 14px rgba(59,130,246,0.09)" : "none",
                  transition:"all .2s",
                }}>
                <Icon size={15} />{t.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* -- CONTENT -- */}
      <div style={{ padding:"24px 40px 60px" }}>
        <AnimatePresence mode="wait">

          {/* --- COURS --- */}
          {tab === "cours" && (
            <motion.div key="cours"
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.28 }}
            >
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:18 }}>
                {cours.map((c, i) => (
                  <motion.div key={c.id}
                    initial={{ opacity:0, y:18 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:i * 0.07 }}
                    whileHover={{ y:-5, boxShadow:`0 16px 40px ${c.couleur}22` }}
                    onClick={() => setCoursDetail(c)}
                    style={{ background:"white", borderRadius:18, border:"1px solid #e2e8f0",
                      overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
                      cursor:"pointer", transition:"box-shadow .2s" }}
                  >
                    {/* gradient top bar */}
                    <div style={{ height:6, background:`linear-gradient(90deg, ${c.couleur}, ${c.couleur}66)` }} />
                    <div style={{ padding:"20px 22px" }}>
                      <div style={{
                        display:"inline-flex", alignItems:"center", gap:5,
                        background:`${c.couleur}18`, color:c.couleur,
                        fontSize:11, fontWeight:700, borderRadius:8,
                        padding:"4px 10px", marginBottom:12, letterSpacing:"0.4px",
                      }}>
                        <Hash size={10} />{c.code}
                      </div>
                      <div style={{ fontSize:15.5, fontWeight:800, color:"#0f172a",
                        marginBottom:5, lineHeight:1.3 }}>{c.titre}</div>
                      <div style={{ fontSize:12.5, color:"#64748b", marginBottom:18 }}>{c.filiere}</div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <div style={{ display:"flex", gap:16 }}>
                          <span style={{ fontSize:12, color:"#64748b", display:"flex", alignItems:"center", gap:5 }}>
                            <Users size={12} color={c.couleur} />{c.etudiants}
                          </span>
                          <span style={{ fontSize:12, color:"#64748b", display:"flex", alignItems:"center", gap:5 }}>
                            <FileText size={12} color={c.couleur} />{c.docs} docs
                          </span>
                        </div>
                        <div style={{ width:30, height:30, borderRadius:9,
                          background:`${c.couleur}18`,
                          display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <ChevronRight size={15} color={c.couleur} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* add card */}
                <motion.div
                  onClick={() => setShowAddCourse(true)}
                  whileHover={{ y:-5, borderColor:B.primary }}
                  whileTap={{ scale:0.98 }}
                  style={{ background:"white", borderRadius:18,
                    border:"2px dashed #cbd5e1",
                    display:"flex", flexDirection:"column",
                    alignItems:"center", justifyContent:"center",
                    gap:12, padding:"36px 20px",
                    cursor:"pointer", minHeight:170,
                    transition:"border-color .2s",
                  }}
                >
                  <motion.div
                    whileHover={{ rotate:90 }}
                    transition={{ type:"spring", stiffness:300 }}
                    style={{ width:48, height:48, borderRadius:14,
                      background:B.lighter, border:`1.5px solid ${B.light}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Plus size={24} color={B.primary} />
                  </motion.div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#334155", textAlign:"center" }}>
                      Ajouter un cours
                    </div>
                    <div style={{ fontSize:12, color:"#94a3b8", textAlign:"center", marginTop:3 }}>
                      Créer un nouvel espace
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* --- SUPPORTS --- */}
          {tab === "supports" && (
            <motion.div key="supports"
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.28 }}
            >
              <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
                {["all", ...cours.map(c => c.code)].map(code => (
                  <motion.button key={code} onClick={() => setFilterCours(code)} whileTap={{ scale:0.96 }}
                    style={{ padding:"6px 16px", borderRadius:20,
                      border:`1.5px solid ${filterCours === code ? B.primary : "#e2e8f0"}`,
                      background: filterCours === code ? B.lighter : "white",
                      color: filterCours === code ? B.primary : "#64748b",
                      fontSize:12.5, fontWeight: filterCours === code ? 700 : 500,
                      cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>
                    {code === "all" ? "Tous" : code}
                  </motion.button>
                ))}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {filteredSupports.map((s, i) => (
                  <motion.div key={s.id}
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:i * 0.06 }}
                    whileHover={{ x:5, boxShadow:"0 4px 20px rgba(59,130,246,0.1)" }}
                    style={{ background:"white", borderRadius:14, border:"1px solid #e2e8f0",
                      padding:"14px 20px", display:"flex", alignItems:"center", gap:14,
                      boxShadow:"0 1px 6px rgba(0,0,0,0.04)", transition:"box-shadow .2s" }}
                  >
                    <div style={{ width:44, height:44, borderRadius:12,
                      background:`${typeColor[s.type] || B.primary}15`,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <FileText size={20} color={typeColor[s.type] || B.primary} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:4,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{s.nom}</div>
                      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                        <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.4px",
                          background:`${typeColor[s.type] || B.primary}18`,
                          color:typeColor[s.type] || B.primary,
                          borderRadius:6, padding:"2px 8px" }}>{s.type}</span>
                        <span style={{ fontSize:12, color:"#94a3b8" }}>{s.taille}</span>
                        <span style={{ fontSize:12, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                          <Hash size={10} />{s.cours}
                        </span>
                        <span style={{ fontSize:12, color:"#94a3b8", display:"flex", alignItems:"center", gap:3 }}>
                          <Eye size={11} />{s.vues} vues
                        </span>
                      </div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
                      <span style={{ fontSize:11.5, color:"#94a3b8", display:"flex", alignItems:"center", gap:4 }}>
                        <Calendar size={11} />{s.date}
                      </span>
                      <motion.button onClick={() => downloadMock(s.nom)}
                        whileHover={{ scale:1.08 }} whileTap={{ scale:0.92 }}
                        style={{ width:36, height:36, borderRadius:10, background:B.grad, border:"none",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          cursor:"pointer", boxShadow:"0 2px 10px rgba(59,130,246,0.28)" }}>
                        <Download size={15} color="white" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- PFE --- */}
          {tab === "pfe" && (
            <motion.div key="pfe"
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.28 }}
            >
              <div style={{ display:"flex", gap:10, marginBottom:22, flexWrap:"wrap" }}>
                {Object.entries(statutConfig).map(([key, val]) => {
                  const count = initPFE.filter(p => p.statut === key).length;
                  if (!count) return null;
                  return (
                    <div key={key} style={{ display:"flex", alignItems:"center", gap:7,
                      background:val.bg, borderRadius:20, padding:"5px 14px",
                      border:`1px solid ${val.color}22` }}>
                      <val.icon size={12} color={val.color} />
                      <span style={{ fontSize:12.5, fontWeight:600, color:val.color }}>
                        {count} {val.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {filteredPFE.map((pfe, i) => (
                  <motion.div key={pfe.id}
                    initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                    transition={{ delay:i * 0.08 }}>
                    <PFECard pfe={pfe} onRemark={setRemarksPFE} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* --- RESSOURCES --- */}
          {tab === "partages" && (
            <motion.div key="partages"
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
              exit={{ opacity:0, y:-8 }} transition={{ duration:0.28 }}
            >
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {RESSOURCES.filter(r => r.nom.toLowerCase().includes(search.toLowerCase())).map((r, i) => (
                  <motion.div key={r.id}
                    initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:i * 0.07 }}
                    whileHover={{ x:5, boxShadow:"0 4px 20px rgba(59,130,246,0.1)" }}
                    style={{ background:"white", borderRadius:14, border:"1px solid #e2e8f0",
                      padding:"16px 22px", display:"flex", alignItems:"center", gap:14,
                      boxShadow:"0 1px 6px rgba(0,0,0,0.04)", transition:"box-shadow .2s" }}
                  >
                    <div style={{ width:46, height:46, borderRadius:13, background:B.lighter,
                      border:`1px solid ${B.light}`,
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Paperclip size={21} color={B.primary} />
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:14, fontWeight:700, color:"#0f172a", marginBottom:5 }}>{r.nom}</div>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ fontSize:11.5, fontWeight:600, background:B.lighter,
                          color:B.primary, borderRadius:7, padding:"2px 9px",
                          border:`1px solid ${B.light}` }}>{r.cat}</span>
                        <span style={{ fontSize:12, color:"#94a3b8" }}>{r.taille}</span>
                        <span style={{ fontSize:12, color:"#94a3b8" }}>· {r.auteur} · {r.date}</span>
                      </div>
                    </div>
                    <motion.button onClick={() => downloadMock(r.nom)}
                      whileHover={{ scale:1.04 }} whileTap={{ scale:0.96 }}
                      style={{ display:"flex", alignItems:"center", gap:7,
                        padding:"9px 16px", borderRadius:10, border:"none",
                        background:B.grad, color:"white",
                        fontSize:13, fontWeight:700, cursor:"pointer",
                        fontFamily:"inherit", flexShrink:0,
                        boxShadow:"0 2px 10px rgba(59,130,246,0.28)" }}>
                      <Download size={14} />Télécharger
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* -- MODALS -- */}
      <AnimatePresence>
        {remarksPFE && <RemarksModal pfe={remarksPFE} onClose={() => setRemarksPFE(null)} />}
        {showUpload  && <UploadModal onClose={() => setShowUpload(false)} cours={cours} />}
        {coursDetail && <CoursDetailModal cours={coursDetail} supports={supports} setSupports={setSupports} onClose={() => setCoursDetail(null)} />}
        {showAddCourse && <AddCourseModal onClose={() => setShowAddCourse(false)} onAdd={addCourse} />}
      </AnimatePresence>
    </div>
  );
}