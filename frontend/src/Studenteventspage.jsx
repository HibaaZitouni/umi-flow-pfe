import { evenements as evAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Bell, Calendar, MapPin, Award, ChevronLeft, ChevronRight,
  Users, Clock, CheckCircle, FileText, BookOpen, X, Sparkles,
  Send, TrendingUp, Star, Heart, Zap, Target, Eye,
} from "lucide-react";
import ProfilePanel from "./ProfilePanel";
import NotifPanel from "./NotifPanel";

/* ── palette rouge ── */
const R = {
  primary: "#ef4444",
  dark:    "#b91c1c",
  mid:     "#dc2626",
  light:   "#fecaca",
  lighter: "#fef2f2",
  border:  "#fca5a5",
  grad:    "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  gradHero:"linear-gradient(135deg, #b91c1c 0%, #ef4444 55%, #f87171 100%)",
};

/* ── Types d'événements ── */
const EVENT_STYLES = {
  Cérémonie: { icon: "🎓", color: R.primary, bg: "#fef2f2" },
  Conférence: { icon: "🎤", color: "#8b5cf6", bg: "#f5f3ff" },
  Atelier: { icon: "🔧", color: "#10b981", bg: "#ecfdf5" },
  Fête: { icon: "🎉", color: "#ec4899", bg: "#fdf2f8" },
  Sport: { icon: "⚽", color: "#3b82f6", bg: "#eff6ff" },
  Actualité: { icon: "📰", color: "#6b7280", bg: "#f9fafb" },
  default: { icon: "📌", color: "#ef4444", bg: "#fef2f2" },
};

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const MOIS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

/* ── Données des événements ── */
const EVENTS_DATA = [
  {
    id: 1, title: "Fête de l'université", type: "Fête", date: "2026-06-05",
    location: "Espace vert du campus", organizer: "Comité des fêtes",
    description: "Grande fête annuelle : concerts, food trucks, animations et feu d'artifice en clôture.",
    resume: "🎉 Ne manquez pas la plus grande fête de l'année ! Une soirée exceptionnelle vous attend avec des concerts live, des food trucks venus des 4 coins du Maroc, et un feu d'artifice grandiose pour clôturer la soirée. Venez célébrer la fin de l'année universitaire dans une ambiance festive et conviviale. Entrée gratuite pour tous les étudiants !",
    schedule: [
      { time: "18:00", activity: "Ouverture des portes" },
      { time: "19:00", activity: "Concert d'ouverture" },
      { time: "20:30", activity: "Food trucks" },
      { time: "22:00", activity: "Feu d'artifice" }
    ],
    speakers: [
      { name: "DJ RedOne", role: "Artiste principal", avatar: "🎧" },
      { name: "Groupe Local", role: "Concert live", avatar: "🎸" }
    ]
  },
  {
    id: 2, title: "Conférence marché de l'emploi", type: "Conférence", date: "2026-06-10",
    location: "Amphithéâtre B", organizer: "Service carrières",
    description: "Tendances du marché et conseils pour les jeunes diplômés.",
    resume: "💼 Vous cherchez un stage ou un emploi ? Cette conférence réunit les plus grands recruteurs du Maroc ! Découvrez les secteurs qui recrutent, les compétences recherchées, et repartez avec des conseils concrets pour réussir vos entretiens. Opportunité unique de networking avec les RH des plus grandes entreprises.",
    schedule: [
      { time: "09:00", activity: "Accueil et inscription" },
      { time: "10:00", activity: "Table ronde avec recruteurs" },
      { time: "12:00", activity: "Session networking" }
    ],
    speakers: [
      { name: "Mme Karima Benani", role: "RH Capgemini", avatar: "👩‍💼" },
      { name: "M. Omar Tazi", role: "Directeur HPS", avatar: "👨‍💼" },
      { name: "Mme Leila Alaoui", role: "Responsable recrutement", avatar: "👩‍💻" }
    ]
  },
  {
    id: 3, title: "Atelier préparation examens", type: "Atelier", date: "2026-06-15",
    location: "Salle 204", organizer: "Bureau des étudiants",
    description: "Méthodologie et conseils pour réussir vos examens.",
    resume: "📚 Stressé par les examens ? Rejoignez notre atelier de préparation animé par un psychologue spécialisé et des étudiants seniors. Techniques de mémorisation, gestion du stress, organisation du temps de révision… Repartez avec une méthode infaillible pour aborder vos examens sereinement !",
    schedule: [
      { time: "14:00", activity: "Techniques de révision" },
      { time: "15:30", activity: "Gestion du stress" },
      { time: "16:30", activity: "Q&A" }
    ],
    speakers: [
      { name: "Dr. Ahmed Benali", role: "Psychologue", avatar: "👨‍⚕️" },
      { name: "Yassine Amrani", role: "Major de promotion", avatar: "🎓" }
    ]
  },
  {
    id: 4, title: "Tournoi de football", type: "Sport", date: "2026-06-20",
    location: "Terrain de sport", organizer: "Club Sportif",
    description: "Tournoi inter-filières. Inscriptions sur place.",
    resume: "⚽ Montrez vos talents sur le terrain ! Le tournoi annuel de football inter-filières est de retour. Que vous soyez joueur ou spectateur, venez encourager votre filière. Lots à gagner pour les meilleures équipes. Inscriptions gratuites sur place, venez nombreux !",
    schedule: [
      { time: "09:00", activity: "Matches de poule" },
      { time: "14:00", activity: "Demi-finales" },
      { time: "16:00", activity: "Finale" }
    ],
    speakers: []
  },
  {
    id: 5, title: "Forum Emploi 2026", type: "Cérémonie", date: "2026-02-04",
    location: "Hall principal", organizer: "Relations Entreprises",
    description: "Rencontrez 30+ entreprises et décrochez votre stage.",
    report: {
      summary: "Le Forum Emploi 2026 a été un franc succès avec la participation de 32 entreprises partenaires. Plus de 450 étudiants ont déposé leur CV et 60 entretiens ont été réalisés sur place. 12 offres de stage ont été confirmées dès le forum.",
      highlights: ["32 entreprises participantes", "450+ CV déposés", "60 entretiens sur place", "12 stages confirmés"],
      attendance: 450,
      photos: ["📸", "📸", "📸"]
    },
    schedule: [
      { time: "09:00", activity: "Ouverture du forum" },
      { time: "10:00", activity: "Speed meetings" },
      { time: "14:00", activity: "Conférences" },
      { time: "17:00", activity: "Clôture" }
    ]
  },
  {
    id: 6, title: "Hackathon Green Tech 24h", type: "Atelier", date: "2026-02-13",
    location: "Labo Innovation", organizer: "Club Informatique",
    description: "24h pour créer une solution technologique environnementale.",
    report: {
      summary: "18 équipes se sont affrontées pendant 24h pour créer des solutions innovantes. L'équipe 'EcoSense' a remporté la première place avec un capteur IoT low-cost de qualité d'air. Mention spéciale pour l'équipe 'RecycleBot'.",
      highlights: ["18 équipes", "72 participants", "Prix : 5000 MAD", "Mentions spéciales"],
      attendance: 72,
      photos: ["💻", "🏆", "🌱"]
    },
    schedule: [
      { time: "09:00", activity: "Kick-off" },
      { time: "12:00", activity: "Brainstorming" },
      { time: "20:00", activity: "Développement" },
      { time: "09:00", activity: "Présentations finales" }
    ]
  }
];

/* ── NavBar ── */
function NavBar({ navigate, notifOpen, setNotifOpen, profileOpen, setProfileOpen }) {
  const u = (() => { try { return JSON.parse(localStorage.getItem("umi_user")) || {}; } catch { return {}; } })();
  const initials = (u.prenom?.[0] || "E").toUpperCase() + (u.nom?.[0] || "").toUpperCase();
  const name = u.prenom && u.nom ? `${u.prenom} ${u.nom}` : "Étudiant";
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      style={{
        height: 64, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)",
        borderBottom: `1px solid ${R.border}`, display: "flex",
        alignItems: "center", justifyContent: "space-between", padding: "0 36px",
        position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 24px rgba(239,68,68,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/student")}
          style={{
            display: "flex", alignItems: "center", gap: 7, background: R.lighter,
            border: `1px solid ${R.border}`, borderRadius: 10, padding: "7px 14px",
            cursor: "pointer", color: R.primary, fontSize: 13, fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={15} /> Retour
        </motion.button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, color: "#94a3b8" }}>Accueil</span>
          <ChevronRight size={13} color="#cbd5e1" />
          <span style={{ fontSize: 13, fontWeight: 700, color: R.primary }}>Événements</span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setNotifOpen(o => !o)}
            style={{
              width: 38, height: 38, borderRadius: 10,
              background: notifOpen ? R.lighter : "#f1f5f9",
              border: `1px solid ${notifOpen ? R.border : "transparent"}`,
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", position: "relative",
            }}
          >
            <Bell size={16} color={notifOpen ? R.primary : "#64748b"} />
            <span style={{
              position: "absolute", top: 8, right: 8, width: 7, height: 7,
              borderRadius: "50%", background: "#f97316", border: "1.5px solid white",
            }} />
          </button>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        </div>
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setProfileOpen(o => !o)}
            style={{
              cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              background: R.lighter, border: `1.5px solid ${R.border}`,
              borderRadius: 10, padding: "5px 12px 5px 6px",
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: 8, background: R.grad,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 13, fontWeight: 800,
            }}>
              {initials}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", lineHeight: 1 }}>{name}</div>
              <div style={{ fontSize: 10.5, color: R.primary, fontWeight: 600, marginTop: 1 }}>Étudiant</div>
            </div>
          </div>
          {profileOpen && <ProfilePanel onClose={() => setProfileOpen(false)} />}
        </div>
      </div>
    </motion.nav>
  );
}

/* ── PAGE DÉTAIL ÉVÉNEMENT ── */
function EventDetailPage({ event, onBack }) {
  const isPast = new Date(event.date) < new Date();
  const style = EVENT_STYLES[event.type] || EVENT_STYLES.default;
  const [inscrit, setInscrit] = useState(false);

  const handleInscription = () => {
    setInscrit(true);
    alert(`✅ Vous êtes inscrit à "${event.title}" !`);
  };

  return (
    <div style={{ padding: "28px 40px 60px" }}>
      {/* Bouton retour */}
      <button onClick={onBack} style={{
        display: "flex", alignItems: "center", gap: 7, background: R.lighter,
        border: `1px solid ${R.border}`, borderRadius: 10, padding: "7px 14px",
        cursor: "pointer", color: R.primary, fontSize: 13, fontWeight: 600,
        fontFamily: "inherit", marginBottom: 24,
      }}>
        <ArrowLeft size={15} /> Retour au calendrier
      </button>

      {/* Hero de l'événement */}
      <div style={{
        borderRadius: 20, background: isPast ? "linear-gradient(135deg, #6b7280, #4b5563)" : R.gradHero,
        padding: "32px 36px", marginBottom: 28, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ fontSize: 64, background: "rgba(255,255,255,0.2)", padding: 16, borderRadius: 20 }}>{style.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "white", margin: 0 }}>{event.title}</h1>
              {isPast && <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: 20, fontSize: 12 }}>📋 Terminé</span>}
            </div>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)", marginBottom: 16 }}>{event.description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20, fontSize: 13 }}>
                <Calendar size={14} /> {event.date}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20, fontSize: 13 }}>
                <MapPin size={14} /> {event.location}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 20, fontSize: 13 }}>
                <Award size={14} /> {event.organizer}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grille principale */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24 }}>
        {/* Colonne de gauche */}
        <div>
          {/* BLOC RÉSUMÉ POUR ÉVÉNEMENTS À VENIR */}
          {!isPast && event.resume && (
            <div style={{ 
              background: `linear-gradient(135deg, ${style.bg}, white)`, 
              borderRadius: 18, 
              border: `1px solid ${style.color}30`, 
              padding: "24px", 
              marginBottom: 24,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <Sparkles size={22} color={style.color} />
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>Pourquoi participer ?</h2>
              </div>
              <p style={{ color: "#475569", lineHeight: 1.7, fontSize: 14 }}>
                {event.resume}
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: style.color }}>
                  <Star size={14} /> Opportunité unique
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: style.color }}>
                  <Users size={14} /> Rencontres exclusives
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: style.color }}>
                  <Zap size={14} /> Expérience inoubliable
                </span>
              </div>
            </div>
          )}

          {/* Programme */}
          {event.schedule && event.schedule.length > 0 && (
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Clock size={18} /> {isPast ? "Déroulement de la journée" : "Programme"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {event.schedule.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 8, borderBottom: i < event.schedule.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <span style={{ minWidth: 80, fontWeight: 700, color: isPast ? "#94a3b8" : R.primary }}>{item.time}</span>
                    <span style={{ color: isPast ? "#64748b" : "#475569", textDecoration: isPast ? "line-through" : "none" }}>{item.activity}</span>
                    {isPast && <CheckCircle size={14} color="#10b981" style={{ marginLeft: "auto" }} />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Intervenants */}
          {event.speakers && event.speakers.length > 0 && (
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} /> Intervenants
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {event.speakers.map((speaker, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: R.lighter, borderRadius: 12 }}>
                    <span style={{ fontSize: 32 }}>{speaker.avatar}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: "#0f172a" }}>{speaker.name}</div>
                      <div style={{ fontSize: 12, color: "#64748b" }}>{speaker.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RÉCAPITULATIF COMPLET POUR ÉVÉNEMENTS PASSÉS */}
          {isPast && event.report && (
            <div style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", padding: "24px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <FileText size={18} color="#10b981" /> Récapitulatif de l'événement
              </h2>
              
              {/* Résumé */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>📋 Résumé</div>
                <p style={{ color: "#64748b", lineHeight: 1.6 }}>{event.report.summary}</p>
              </div>
              
              {/* Points clés */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>⭐ Points clés</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {event.report.highlights.map((h, i) => (
                    <span key={i} style={{ background: "#d1fae5", color: "#065f46", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>✓ {h}</span>
                  ))}
                </div>
              </div>
              
              {/* Chiffres clés */}
              {event.report.attendance && (
                <div style={{ background: "#f0fdf4", padding: "16px", borderRadius: 12, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{event.report.attendance}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Participants</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>{event.report.highlights?.length || 0}</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Points marquants</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color: "#10b981" }}>✅</div>
                    <div style={{ fontSize: 12, color: "#64748b" }}>Succès</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Colonne de droite - Sidebar */}
        <div>
          <div style={{ background: "white", borderRadius: 18, border: "1px solid #e2e8f0", padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", marginBottom: 16 }}>Informations</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>DATE</div><div style={{ fontSize: 14, fontWeight: 600 }}>{event.date}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>LIEU</div><div style={{ fontSize: 14, fontWeight: 600 }}>{event.location}</div></div>
              <div><div style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", marginBottom: 4 }}>ORGANISATEUR</div><div style={{ fontSize: 14, fontWeight: 600 }}>{event.organizer}</div></div>
            </div>
          </div>

          {/* Bouton inscription (pour événements futurs) */}
          {!isPast && (
            <div style={{ background: R.lighter, borderRadius: 18, border: `1.5px solid ${R.border}`, padding: "24px", textAlign: "center" }}>
              <Sparkles size={32} color={R.primary} style={{ marginBottom: 12 }} />
              <h4 style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>Ne manquez pas cet événement !</h4>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Inscrivez-vous maintenant pour y participer.</p>
              {inscrit ? (
                <div style={{ background: "#d1fae5", padding: "12px", borderRadius: 12 }}>
                  <CheckCircle size={20} color="#10b981" style={{ marginBottom: 6 }} />
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#065f46" }}>Vous êtes inscrit !</span>
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleInscription}
                  style={{
                    width: "100%", padding: "12px", borderRadius: 10, border: "none",
                    background: R.grad, color: "white", fontSize: 14, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}>
                  <Send size={16} /> S'inscrire
                </motion.button>
              )}
            </div>
          )}

          {/* Badge pour événements passés */}
          {isPast && (
            <div style={{ background: "#fef2f2", borderRadius: 18, border: "1px solid #fecaca", padding: "24px", textAlign: "center" }}>
              <p className="text-4xl mb-2">📋</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: R.dark }}>Événement terminé</p>
              <p style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>Consultez le récapitulatif ci-contre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── COMPOSANT CALENDRIER ── */
function CalendarView({ events, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const getEventsForDate = (date) => {
    const str = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return events.filter(e => e.date === str);
  };

  const monthEventCount = events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  }).length;

  const calendarDays = [];
  const prevLast = new Date(year, month, 0).getDate();
  for (let i = startOffset - 1; i >= 0; i--) calendarDays.push({ day: prevLast - i, current: false, date: new Date(year, month - 1, prevLast - i) });
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ day: i, current: true, date: new Date(year, month, i) });
  for (let i = calendarDays.length; i < 42; i++) calendarDays.push({ day: i - calendarDays.length + 1, current: false, date: new Date(year, month + 1, i - calendarDays.length + 1) });

  return (
    <div style={{ background: "white", borderRadius: 20, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
      <div style={{ padding: "18px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}><ChevronLeft size={18} /></button>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}>{MOIS[month]} {year}</h2>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", background: "white", cursor: "pointer" }}><ChevronRight size={18} /></button>
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: R.lighter, padding: "4px 12px", borderRadius: 20 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: R.primary }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: R.primary }}>{monthEventCount} événement{monthEventCount > 1 ? "s" : ""}</span>
        </div>
      </div>

      <div style={{ padding: "0 24px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
          {JOURS.map(d => <div key={d} style={{ padding: "10px", textAlign: "center", fontSize: 13, fontWeight: 700, color: "#94a3b8" }}>{d}</div>)}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDate(day.date);
            const hasEvents = dayEvents.length > 0;
            const firstEvent = dayEvents[0];
            const eventStyle = firstEvent ? (EVENT_STYLES[firstEvent.type] || EVENT_STYLES.default) : null;
            const isToday = day.date.toDateString() === new Date().toDateString();
            const isPast = day.date < new Date();

            return (
              <div key={idx} onClick={() => hasEvents && onEventClick(firstEvent)}
                style={{
                  background: hasEvents && day.current ? eventStyle?.bg : "white",
                  border: `1px solid ${hasEvents && day.current ? R.border : "#e2e8f0"}`,
                  borderRadius: 12, padding: "10px", minHeight: 90, cursor: hasEvents ? "pointer" : "default",
                  opacity: day.current ? 1 : 0.5, position: "relative", transition: "all 0.2s",
                }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isToday ? R.primary : "#64748b", marginBottom: 6 }}>{day.day}</div>
                {hasEvents && day.current && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 28 }}>{eventStyle?.icon}</span>
                    <div style={{ fontSize: 10, fontWeight: 600, color: eventStyle?.color, textAlign: "center", lineHeight: 1.2 }}>
                      {firstEvent.title.length > 15 ? firstEvent.title.substring(0, 12) + "..." : firstEvent.title}
                    </div>
                  </div>
                )}
                {isPast && hasEvents && day.current && (
                  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#fca5a5" strokeWidth="2" strokeDasharray="4 4" />
                  </svg>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
export default function StudentEventsPage() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState(EVENTS_DATA);

  useEffect(() => {
    evAPI.getAll()
      .then(d => {
        const list = Array.isArray(d) ? d : (d?.data || []);
        if (list.length > 0) {
          setEvents(list.map(e => ({
            ...e,
            title: e.titre || e.title,
            location: e.lieu || e.location,
            organizer: e.organisateur || e.organizer,
            date: e.date,
            type: e.type,
            description: e.description,
            resume: e.description,
            schedule: [],
            speakers: [],
          })));
        }
      })
      .catch(() => {});
  }, []);

  if (selectedEvent) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fef2f2 0%, #fecaca 30%, #fef2f2 100%)",
        fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <NavBar navigate={navigate} notifOpen={notifOpen} setNotifOpen={setNotifOpen} profileOpen={profileOpen} setProfileOpen={setProfileOpen} />
        <EventDetailPage event={selectedEvent} onBack={() => setSelectedEvent(null)} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #fef2f2 0%, #fecaca 30%, #fef2f2 100%)",
      fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />

      <NavBar
        navigate={navigate}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      {/* Hero Band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          margin: "28px 40px 0", borderRadius: 20, background: R.gradHero,
          padding: "28px 36px", overflow: "hidden", position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -40, top: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
        <div style={{ position: "absolute", right: 80, bottom: -60, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: "rgba(255,255,255,0.18)", borderRadius: 20,
            padding: "4px 13px", marginBottom: 12,
          }}>
            <Calendar size={13} color="white" />
            <span style={{ fontSize: 12, color: "white", fontWeight: 600 }}>Espace Étudiant</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "white", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
            Calendrier des Événements 🎉
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", margin: 0 }}>
            Explorez tous les événements universitaires et cliquez pour plus de détails
          </p>
        </div>
      </motion.div>

      {/* Contenu principal */}
      <div style={{ padding: "28px 40px 60px" }}>
        <CalendarView events={events} onEventClick={setSelectedEvent} />
      </div>
    </div>
  );
}