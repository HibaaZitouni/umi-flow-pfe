import { clubs as clubsAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Calendar, MapPin, Award, Users, User,
  Mail, Phone, Clock, Sparkles, X, CheckCircle, Send,
  Star, Heart, Zap, Target, Eye, BookOpen, Code,
  Music, Palette, Dumbbell, Cpu, Globe, Leaf, Camera, Trophy,
  ChevronRight,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette orange (thème principal #f59e0b) ── */
const O = {
  primary: "#f59e0b",
  dark: "#b45309",
  mid: "#d97706",
  light: "#fef3c7",
  lighter: "#fffbeb",
  border: "#fde68a",
  grad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  gradHero: "linear-gradient(135deg, #b45309 0%, #f59e0b 55%, #fbbf24 100%)",
};

/* ── Styles de couleurs par club ── */
const CLUB_COLORS = {
  blue: { primary: "#3b82f6", dark: "#1d4ed8", mid: "#2563eb", light: "#dbeafe", lighter: "#eff6ff", border: "#bfdbfe", grad: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)" },
  purple: { primary: "#8b5cf6", dark: "#6d28d9", mid: "#7c3aed", light: "#ede9fe", lighter: "#f5f3ff", border: "#c4b5fd", grad: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)" },
  green: { primary: "#10b981", dark: "#064e3b", mid: "#059669", light: "#d1fae5", lighter: "#ecfdf5", border: "#a7f3d0", grad: "linear-gradient(135deg, #10b981 0%, #059669 100%)" },
  orange: { primary: "#f59e0b", dark: "#b45309", mid: "#d97706", light: "#fef3c7", lighter: "#fffbeb", border: "#fde68a", grad: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" },
  indigo: { primary: "#6366f1", dark: "#4338ca", mid: "#4f46e5", light: "#e0e7ff", lighter: "#eef2ff", border: "#c7d2fe", grad: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" },
  pink: { primary: "#ec4899", dark: "#be185d", mid: "#db2777", light: "#fce7f3", lighter: "#fdf2f8", border: "#fbcfe8", grad: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)" },
  red: { primary: "#ef4444", dark: "#b91c1c", mid: "#dc2626", light: "#fecaca", lighter: "#fef2f2", border: "#fca5a5", grad: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)" },
};

const getClubColor = (couleur) => CLUB_COLORS[couleur] || CLUB_COLORS.orange;

/* ── Données des clubs ── */
const CLUBS_DATA = [
  {
    id: 1, nom: "Club Informatique", theme: "tech", couleur: "blue", membres: 45, dateCreation: "2020",
    responsable: "Pr. Ahmed Benali", email: "club.info@umi.ac.ma", telephone: "05xx-123456",
    description: "Club dédié aux nouvelles technologies, programmation et innovations numériques.",
    resume: "💻 Rejoignez le club le plus dynamique de l'université ! Participez à des hackathons, ateliers coding, conférences tech et projets open-source. Une opportunité unique pour développer vos compétences et votre réseau professionnel.",
    icon: Code,
    bureau: [
      { nom: "Yassine Amrani", role: "Président", email: "y.amrani@umi.ac.ma" },
      { nom: "Sara Benkirane", role: "Vice-présidente", email: "s.benkirane@umi.ac.ma" },
      { nom: "Mehdi Tazi", role: "Trésorier", email: "m.tazi@umi.ac.ma" }
    ],
    evenements: [
      { nom: "Hackathon Green Tech", date: "2026-02-13", lieu: "Labo Innovation", description: "24h pour créer une solution environnementale.", isPast: true, report: { summary: "18 équipes, 72 participants. L'équipe EcoSense remporte la première place.", highlights: ["18 équipes", "72 participants"], attendance: 72 } },
      { nom: "Atelier React Native", date: "2026-06-15", lieu: "Labo Info", description: "Développez des apps mobiles cross-platform.", isPast: false },
      { nom: "Conférence IA & Santé", date: "2026-07-08", lieu: "Amphi A", description: "Applications de l'IA dans le diagnostic médical.", isPast: false }
    ]
  },
  {
    id: 2, nom: "Club Arts & Culture", theme: "art", couleur: "pink", membres: 32, dateCreation: "2019",
    responsable: "Mme Leila Alaoui", email: "club.art@umi.ac.ma", telephone: "05xx-234567",
    description: "Promotion des arts visuels, théâtre, musique et expression culturelle.",
    resume: "🎨 Vous êtes passionné d'art ? Rejoignez-nous pour des expositions, ateliers de peinture, soirées théâtrales et concerts. Un espace d'expression et de créativité pour tous les talents !",
    icon: Palette,
    bureau: [
      { nom: "Leila Idrissi", role: "Présidente", email: "l.idrissi@umi.ac.ma" },
      { nom: "Omar Tazi", role: "Trésorier", email: "o.tazi@umi.ac.ma" }
    ],
    evenements: [
      { nom: "Exposition de peinture", date: "2026-03-10", lieu: "Galerie UMI", description: "Œuvres des étudiants.", isPast: true, report: { summary: "40 œuvres exposées, 150 visiteurs.", highlights: ["40 œuvres", "150 visiteurs"], attendance: 150 } },
      { nom: "Soirée théâtrale", date: "2026-06-20", lieu: "Amphi B", description: "Pièce jouée par les étudiants.", isPast: false }
    ]
  },
  {
    id: 3, nom: "Club Sportif", theme: "sport", couleur: "green", membres: 68, dateCreation: "2018",
    responsable: "M. Karim El Fassi", email: "club.sport@umi.ac.ma", telephone: "05xx-345678",
    description: "Football, basketball, natation, fitness et événements sportifs.",
    resume: "⚽ Envie de bouger et de rencontrer d'autres sportifs ? Rejoignez nos équipes, participez aux tournois inter-universitaires et restez en forme ! Tous niveaux acceptés.",
    icon: Dumbbell,
    bureau: [
      { nom: "Karim El Fassi", role: "Président", email: "k.elfassi@umi.ac.ma" },
      { nom: "Nadia Berrada", role: "Secrétaire", email: "n.berrada@umi.ac.ma" }
    ],
    evenements: [
      { nom: "Tournoi de football", date: "2026-02-20", lieu: "Terrain central", description: "Tournoi inter-filières.", isPast: true, report: { summary: "8 équipes, 120 participants.", highlights: ["8 équipes", "120 participants"], attendance: 120 } },
      { nom: "Marathon UMI", date: "2026-06-25", lieu: "Campus", description: "Course ouverte à tous.", isPast: false }
    ]
  },
  {
    id: 4, nom: "Club Environnement", theme: "eco", couleur: "green", membres: 28, dateCreation: "2021",
    responsable: "Dr. Fatima Zahra", email: "club.eco@umi.ac.ma", telephone: "05xx-456789",
    description: "Sensibilisation à l'écologie, recyclage et développement durable.",
    resume: "🌱 Agissez pour la planète ! Rejoignez nos campagnes de nettoyage, ateliers recyclage et conférences sur le développement durable. Ensemble, faisons la différence.",
    icon: Leaf,
    bureau: [
      { nom: "Fatima Zahra", role: "Présidente", email: "f.zahra@umi.ac.ma" }
    ],
    evenements: [
      { nom: "Journée de nettoyage", date: "2026-03-05", lieu: "Campus", description: "Nettoyage des espaces verts.", isPast: true, report: { summary: "50 bénévoles, 200kg de déchets collectés.", highlights: ["50 bénévoles", "200kg déchets"], attendance: 50 } },
      { nom: "Atelier recyclage", date: "2026-07-10", lieu: "Salle 101", description: "Apprenez à recycler vos déchets.", isPast: false }
    ]
  },
  {
    id: 5, nom: "Club Musique", theme: "music", couleur: "orange", membres: 35, dateCreation: "2019",
    responsable: "M. Youssef Rachidi", email: "club.music@umi.ac.ma", telephone: "05xx-567890",
    description: "Pratique musicale, concerts, ateliers et jam sessions.",
    resume: "🎵 Passionné de musique ? Que vous jouiez d'un instrument, chantiez ou aimiez simplement écouter, rejoignez-nous pour des jam sessions, concerts et ateliers musicaux !",
    icon: Music,
    bureau: [
      { nom: "Youssef Rachidi", role: "Président", email: "y.rachidi@umi.ac.ma" },
      { nom: "Sofia El Mansouri", role: "Trésorière", email: "s.elmansouri@umi.ac.ma" }
    ],
    evenements: [
      { nom: "Concert de printemps", date: "2026-04-15", lieu: "Amphi A", description: "Concert des étudiants.", isPast: true, report: { summary: "200 spectateurs, 8 groupes.", highlights: ["200 spectateurs", "8 groupes"], attendance: 200 } },
      { nom: "Jam session", date: "2026-06-30", lieu: "Salle polyvalente", description: "Session ouverte à tous.", isPast: false }
    ]
  }
];

/* ── NavBar (thème orange #f59e0b) ── */
function NavBar({ navigate, notifOpen, setNotifOpen, profileOpen, setProfileOpen }) {
  const u = (() => { try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; } })();
  const initials = (u.prenom?.[0] || "E").toUpperCase() + (u.nom?.[0] || "").toUpperCase();
  const name = u.prenom && u.nom ? `${u.prenom} ${u.nom}` : "Étudiant";
  return (
    <motion.nav initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: 64, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${O.border}`, display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "0 36px",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 24px rgba(245,158,11,0.08)",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: O.lighter,
            border: `1px solid ${O.border}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", color: O.primary, fontSize: 13, fontWeight: 600,
          }}>
          <ArrowLeft size={15} /> Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: O.primary }}>Clubs</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={() => setNotifOpen(o => !o)} style={{
          width: 38, height: 38, borderRadius: 10,
          background: notifOpen ? O.lighter : "#f1f5f9",
          border: `1px solid ${notifOpen ? O.border : "transparent"}`,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}><Bell size={16} color={notifOpen ? O.primary : "#64748b"} /></button>
        {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        <div onClick={() => setProfileOpen(o => !o)} style={{
          cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
          background: O.lighter, border: `1.5px solid ${O.border}`, borderRadius: 10,
          padding: "5px 12px 5px 6px",
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: O.grad,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontSize: 13, fontWeight: 800 }}>{initials}</div>
          <div><div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{name}</div>
          <div style={{ fontSize: 10.5, color: O.primary, fontWeight: 600 }}>Étudiant</div></div>
        </div>
        {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
      </div>
    </motion.nav>
  );
}

/* ── PAGE DÉTAIL CLUB ── */
function ClubDetailPage({ club, onBack }) {
  const colors = getClubColor(club.couleur);
  const IconComponent = club.icon;
  const [inscrit, setInscrit] = useState({});

  const handleInscription = (eventNom, clubId) => {
    setInscrit(prev => ({ ...prev, [eventNom]: true }));
    if (clubId) {
      clubsAPI.rejoindre(clubId).catch(()=>{});
    }
    alert(`✅ Vous êtes inscrit à "${eventNom}" !`);
  };

  const evenementsFuturs = club.evenements.filter(e => !e.isPast);
  const evenementsPasses = club.evenements.filter(e => e.isPast);

  return (
    <div style={{ padding: "28px 40px 60px" }}>
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 7, background: O.lighter,
        border: `1px solid ${O.border}`, borderRadius: 10, padding: "7px 14px",
        cursor: "pointer", color: O.primary, fontSize: 13, fontWeight: 600,
        marginBottom: 24,
      }}>
        <ArrowLeft size={15} /> Retour à la liste des clubs
      </button>

      {/* Hero */}
      <div style={{
        borderRadius: 20, background: colors.grad, padding: "32px 36px", marginBottom: 28,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ fontSize: 64, background: "rgba(255,255,255,0.2)", padding: 16, borderRadius: 20 }}><IconComponent size={48} color="white" /></div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "white", marginBottom: 8 }}>{club.nom}</h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.9)", marginBottom: 16 }}>{club.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20, fontSize: 13 }}><Users size={14} /> {club.membres} membres</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20, fontSize: 13 }}><Calendar size={14} /> Depuis {club.dateCreation}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bloc résumé "Pourquoi rejoindre ?" */}
      <div style={{ background: colors.lighter, borderRadius: 18, border: `1px solid ${colors.border}`, padding: "24px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Sparkles size={22} color={colors.primary} />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>Pourquoi rejoindre ce club ?</h2>
        </div>
        <p style={{ color: "#475569", lineHeight: 1.7, fontSize: 14 }}>{club.resume}</p>
        <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: colors.primary }}><Star size={14} /> Expérience unique</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: colors.primary }}><Users size={14} /> Rencontres enrichissantes</span>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: colors.primary }}><Zap size={14} /> Développement personnel</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Colonne gauche - Événements */}
        <div>
          {/* Événements à venir */}
          {evenementsFuturs.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Sparkles size={18} color={colors.primary} /> Événements à venir</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {evenementsFuturs.map((evt, idx) => (
                  <div key={idx} style={{ background: "white", borderRadius: 16, border: `1px solid ${colors.border}`, padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>{evt.nom}</h3>
                      <span style={{ background: colors.lighter, color: colors.primary, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{evt.date}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#64748b" }}><MapPin size={12} /> {evt.lieu}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{evt.description}</p>
                    {inscrit[evt.nom] ? (
                      <div style={{ background: "#d1fae5", padding: "10px", borderRadius: 10, textAlign: "center" }}>
                        <CheckCircle size={16} color="#10b981" style={{ marginBottom: 4 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#065f46" }}>Vous êtes inscrit !</span>
                      </div>
                    ) : (
                      <button onClick={() => handleInscription(evt.nom)} style={{ background: colors.grad, color: "white", border: "none", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>S'inscrire</button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Événements passés */}
          {evenementsPasses.length > 0 && (
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Clock size={18} color="#64748b" /> Événements passés</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {evenementsPasses.map((evt, idx) => (
                  <div key={idx} style={{ background: "#f8fafc", borderRadius: 16, border: "1px solid #e2e8f0", padding: "20px", opacity: 0.85 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#64748b" }}>{evt.nom}</h3>
                      <span style={{ background: "#e2e8f0", color: "#64748b", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{evt.date}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#94a3b8" }}><MapPin size={12} /> {evt.lieu}</span>
                    </div>
                    <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 12 }}>{evt.description}</p>
                    {evt.report && (
                      <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: 10, marginTop: 8 }}>
                        <p style={{ fontSize: 12, color: "#166534", marginBottom: 8 }}>{evt.report.summary}</p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {evt.report.highlights.map((h, i) => (<span key={i} style={{ background: "#dcfce7", padding: "2px 8px", borderRadius: 20, fontSize: 10, color: "#15803d" }}>✓ {h}</span>))}
                        </div>
                        {evt.report.attendance && <p style={{ fontSize: 11, color: "#166534", marginTop: 8 }}>👥 {evt.report.attendance} participants</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Colonne droite - Infos club */}
        <div>
          <div style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><User size={16} color={colors.primary} /> Responsable</h3>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 8 }}>{club.responsable}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <a href={`mailto:${club.email}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: colors.primary, textDecoration: "none" }}><Mail size={14} /> {club.email}</a>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b" }}><Phone size={14} /> {club.telephone}</span>
            </div>
          </div>

          <div style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}><Award size={16} color={colors.primary} /> Bureau</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {club.bureau.map((m, idx) => (
                <div key={idx} style={{ borderBottom: idx < club.bureau.length - 1 ? "1px solid #f1f5f9" : "none", paddingBottom: idx < club.bureau.length - 1 ? 12 : 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{m.nom}</p>
                  <p style={{ fontSize: 12, color: colors.primary, marginTop: 2 }}>{m.role}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{m.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Widget "À venir" */}
          {evenementsFuturs.length > 0 && (
            <div style={{ background: colors.lighter, borderRadius: 18, border: `1.5px solid ${colors.border}`, padding: "24px", textAlign: "center" }}>
              <Sparkles size={32} color={colors.primary} style={{ marginBottom: 12 }} />
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Prochain événement</h4>
              <p style={{ fontSize: 14, fontWeight: 600, color: colors.primary }}>{evenementsFuturs[0].nom}</p>
              <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{evenementsFuturs[0].date} • {evenementsFuturs[0].lieu}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── PAGE LISTE DES CLUBS ── */
function ClubsList({ clubs, onClubClick }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
      {clubs.map((club, idx) => {
        const colors = getClubColor(club.couleur);
        const IconComponent = club.icon;
        return (
          <motion.div key={club.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, boxShadow: `0 20px 25px -12px ${colors.primary}40` }}
            onClick={() => onClubClick(club)} style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", overflow: "hidden", cursor: "pointer" }}>
            <div style={{ height: 4, background: colors.grad }} />
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: colors.lighter, display: "flex", alignItems: "center", justifyContent: "center" }}><IconComponent size={24} color={colors.primary} /></div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{club.nom}</h3>
              </div>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12, lineHeight: 1.5 }}>{club.description.substring(0, 80)}...</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#94a3b8" }}><Users size={12} /> {club.membres}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.primary }}>Voir détails →</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function StudentClubsPage() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedClub, setSelectedClub] = useState(null);
  const [clubs] = useState(CLUBS_DATA);

  if (selectedClub) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 30%, #fffbeb 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <NavBar navigate={navigate} notifOpen={notifOpen} setNotifOpen={setNotifOpen} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
        <ClubDetailPage club={selectedClub} onBack={() => setSelectedClub(null)} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fffbeb 0%, #fef3c7 30%, #fffbeb 100%)",
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <NavBar navigate={navigate} notifOpen={notifOpen} setNotifOpen={setNotifOpen} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />

      {/* Hero Band */}
<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
  style={{ margin: "28px 40px 0", borderRadius: 20, background: O.primary, padding: "28px 36px", position: "relative", overflow: "hidden" }}>
  <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
  <div style={{ position: "relative", zIndex: 1 }}>
    <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(255,255,255,0.18)", borderRadius: 20, padding: "4px 13px", marginBottom: 12 }}>
      <Users size={13} color="white" />
      <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Espace Étudiant</span>
    </div>
    <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", margin: "0 0 6px" }}>Clubs Universitaires </h1>
    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>Découvrez les clubs et leurs activités</p>
  </div>
</motion.div>

      {/* Contenu principal */}
      <div style={{ padding: "28px 40px 60px" }}>
        <ClubsList clubs={clubs} onClubClick={setSelectedClub} />
      </div>
    </div>
  );
}