import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Auth ──────────────────────────────────────────────────────
import LoginPage            from "./UMILoginPage";
import RegisterPage         from "./RegisterPage";

// ── Enseignant ────────────────────────────────────────────────
import HomePage             from "./HomePage";           // /teacher
import DocumentsPage        from "./DocumentsPage";
import EmploiDuTempsPage    from "./EmploiDuTempsPage";
import ClubsPage            from "./ClubsPage";
import EvenementsPage       from "./EvenementsPage";
import BibliothequePage     from "./BibliothequePage";
import EtudiantsPage        from "./Etudiantspage";

// ── Étudiant ──────────────────────────────────────────────────
import StudentHomePage      from "./Studenthomepage";    // /student
import AttestationsPage     from "./Attestationspage";
import StagesPage           from "./Stagespage";
import NotesPage            from "./Notespage";
import StudentBibliotheque  from "./StudentBibliotheque";
import StudentEmploiPage    from "./StudentEmploiPage";
import StudentEventsPage    from "./StudentEventsPage";
import StudentClubsPage     from "./StudentClubsPage";

// ── Administration ────────────────────────────────────────────
import SuperAdminDashboard  from "./SuperAdminDashboard";
import AdminDashboard       from "./AdminDashboard";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("umi_token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/"        element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Enseignant */}
        <Route path="/teacher"         element={<HomePage />} />
        <Route path="/documents"       element={<DocumentsPage />} />
        <Route path="/emploi-du-temps" element={<PrivateRoute>{<EmploiDuTempsPage />}</PrivateRoute>} />
        <Route path="/clubs"           element={<ClubsPage />} />
        <Route path="/evenements"      element={<EvenementsPage />} />
        <Route path="/bibliotheque"    element={<BibliothequePage />} />
        <Route path="/etudiants"       element={<EtudiantsPage />} />

        {/* Étudiant */}
        <Route path="/student"              element={<StudentHomePage />} />
        <Route path="/attestations"         element={<AttestationsPage />} />
        <Route path="/stages"               element={<StagesPage />} />
        <Route path="/notes"                element={<NotesPage />} />
        <Route path="/student-bibliotheque" element={<PrivateRoute>{<StudentBibliotheque />}</PrivateRoute>} />
        <Route path="/student-emploi"       element={<StudentEmploiPage />} />
        <Route path="/student-events"       element={<StudentEventsPage />} />
        <Route path="/events/:id"           element={<StudentEventsPage />} />
        <Route path="/student-clubs"        element={<StudentClubsPage />} />
        <Route path="/clubs/:id"            element={<StudentClubsPage />} />

        {/* Administration */}
        <Route path="/super-admin" element={<PrivateRoute>{<SuperAdminDashboard />}</PrivateRoute>} />
        <Route path="/admin"       element={<AdminDashboard />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}