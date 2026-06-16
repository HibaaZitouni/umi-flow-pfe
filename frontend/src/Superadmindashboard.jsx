import { users as usersAPI } from "./api.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Shield,
  BookOpen,
  LogOut,
  Eye,
  Plus,
  Search,
  Download,
  Upload,
  Mail,
  Key,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  Bell,
  Check,
  X,
  BarChart2,
  TrendingUp,
  FileSpreadsheet,
  Send,
  UserCheck,
  Zap,
  Copy,
} from "lucide-react";

const C = {
  grad: "linear-gradient(135deg, #f97316 0%, #9333ea 100%)",
  orange: "#f97316",
  violet: "#9333ea",
  dark: "#0f172a",
  muted: "#64748b",
  border: "#e2e8f0",
};

const ROLES = {
  SUPER_ADMIN: {
    label: "Super Admin",
    color: "#ef4444",
    bg: "#fef2f2",
    Icon: Shield,
  },
  PROFESSEUR: {
    label: "Professeur",
    color: "#9333ea",
    bg: "#f5f3ff",
    Icon: BookOpen,
  },
  ADMIN_EDT: {
    label: "Admin EDT",
    color: "#3b82f6",
    bg: "#eff6ff",
    Icon: Clock,
  },
  ADMIN_BIB: {
    label: "Admin Biblio.",
    color: "#10b981",
    bg: "#ecfdf5",
    Icon: BookOpen,
  },
  ADMIN_ATTEST: {
    label: "Admin Scolarité",
    color: "#f59e0b",
    bg: "#fffbeb",
    Icon: CheckCircle,
  },
};

const DEPARTEMENTS = [
  "Informatique",
  "Génie Électrique & Énergies",
  "Génie Civil & Mécanique",
  "Techniques de Management",
  "Communication & Multimédia",
  "Bibliothèque",
  "Scolarité",
  "Direction",
  "Emploi du temps",
  "Service Informatique",
];

const INIT_USERS = [
  {
    id: 1,
    nom: "Ahmed Benali",
    email: "ahmed.benali@umi.ac.ma",
    service: "Informatique",
    role: "PROFESSEUR",
    statut: "actif",
    firstLogin: false,
    createdAt: "2025-01-10",
  },
  {
    id: 2,
    nom: "Sara El Amrani",
    email: "sara.amrani@umi.ac.ma",
    service: "Bibliothèque",
    role: "ADMIN_BIB",
    statut: "actif",
    firstLogin: false,
    createdAt: "2025-01-12",
  },
  {
    id: 3,
    nom: "Youssef Kaddouri",
    email: "youssef.kaddouri@umi.ac.ma",
    service: "Emploi du temps",
    role: "ADMIN_EDT",
    statut: "actif",
    firstLogin: true,
    createdAt: "2025-01-15",
  },
  {
    id: 4,
    nom: "Lina Moujahid",
    email: "lina.moujahid@umi.ac.ma",
    service: "Scolarité",
    role: "ADMIN_ATTEST",
    statut: "actif",
    firstLogin: false,
    createdAt: "2025-01-08",
  },
  {
    id: 5,
    nom: "Karim Tazi",
    email: "karim.tazi@umi.ac.ma",
    service: "Informatique",
    role: "PROFESSEUR",
    statut: "inactif",
    firstLogin: true,
    createdAt: "2025-01-20",
  },
  {
    id: 6,
    nom: "Nadia Berrada",
    email: "nadia.berrada@umi.ac.ma",
    service: "Informatique",
    role: "PROFESSEUR",
    statut: "actif",
    firstLogin: false,
    createdAt: "2025-01-05",
  },
  {
    id: 7,
    nom: "Hassan Ouali",
    email: "hassan.ouali@umi.ac.ma",
    service: "Direction",
    role: "ADMIN_EDT",
    statut: "suspendu",
    firstLogin: false,
    createdAt: "2025-01-18",
  },
  {
    id: 8,
    nom: "Fatima Ziani",
    email: "fatima.ziani@umi.ac.ma",
    service: "Scolarité",
    role: "ADMIN_ATTEST",
    statut: "actif",
    firstLogin: false,
    createdAt: "2025-01-22",
  },
];

function genPwd() {
  const c = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#";
  return Array.from(
    { length: 12 },
    () => c[Math.floor(Math.random() * c.length)],
  ).join("");
}

function RoleBadge({ role, small }) {
  const cfg = ROLES[role] || {
    label: role,
    color: "#64748b",
    bg: "#f1f5f9",
    Icon: Shield,
  };
  const Icon = cfg.Icon;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: cfg.bg,
        color: cfg.color,
        fontSize: small ? 11 : 12,
        fontWeight: 700,
        borderRadius: 20,
        padding: small ? "2px 8px" : "4px 10px",
        border: `1px solid ${cfg.color}30`,
      }}
    >
      <Icon size={small ? 10 : 11} strokeWidth={2.5} />
      {cfg.label}
    </span>
  );
}

function StatutBadge({ statut }) {
  const cfg = {
    actif: { color: "#10b981", bg: "#ecfdf5", label: "Actif" },
    inactif: { color: "#94a3b8", bg: "#f1f5f9", label: "Inactif" },
    suspendu: { color: "#ef4444", bg: "#fef2f2", label: "Suspendu" },
  }[statut] || { color: "#94a3b8", bg: "#f1f5f9", label: statut };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: cfg.bg,
        color: cfg.color,
        fontSize: 11,
        fontWeight: 700,
        borderRadius: 20,
        padding: "3px 9px",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: cfg.color,
          display: "inline-block",
        }}
      />
      {cfg.label}
    </span>
  );
}

function ActionBtn({ icon: Icon, color, title, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: "none",
        background: hov ? color + "18" : "#f8fafc",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all .15s",
      }}
    >
      <Icon size={14} color={hov ? color : "#94a3b8"} />
    </button>
  );
}

/* ══ ADD USER MODAL ══════════════════════════════════════════ */
function AddUserModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    service: DEPARTEMENTS[0],
    role: "PROFESSEUR",
  });
  const [pwd, setPwd] = useState("");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const s = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const gen = () => {
    setPwd(genPwd());
    setSent(false);
  };
  const copy = () => {
    try {
      navigator.clipboard.writeText(pwd);
    } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const valid = form.nom && form.email.includes("@") && pwd;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 22,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            background: "linear-gradient(135deg,#f97316,#9333ea)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <UserCheck size={18} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>
                Créer un compte
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Nouvel utilisateur
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              color: "white",
              padding: 8,
              borderRadius: 9,
              display: "flex",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div
          style={{
            padding: "22px 24px 26px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <label style={LS}>Nom complet *</label>
            <input
              value={form.nom}
              onChange={(e) => s("nom", e.target.value)}
              placeholder="ex: Ahmed Benali"
              style={IS}
            />
          </div>
          <div>
            <label style={LS}>Email académique *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => s("email", e.target.value)}
              placeholder="prenom.nom@umi.ac.ma"
              style={IS}
            />
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={LS}>Service *</label>
              <select
                value={form.service}
                onChange={(e) => s("service", e.target.value)}
                style={IS}
              >
                {DEPARTEMENTS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={LS}>Rôle *</label>
              <select
                value={form.role}
                onChange={(e) => s("role", e.target.value)}
                style={IS}
              >
                {Object.entries(ROLES)
                  .filter(([k]) => k !== "SUPER_ADMIN")
                  .map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label style={LS}>Mot de passe initial</label>
            <div style={{ display: "flex", gap: 8 }}>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "0 12px",
                  overflow: "hidden",
                }}
              >
                <Key
                  size={15}
                  color="#94a3b8"
                  style={{ flexShrink: 0, marginRight: 8 }}
                />
                <input
                  readOnly
                  value={pwd}
                  placeholder="Cliquez sur Générer →"
                  style={{
                    flex: 1,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13,
                    color: "#0f172a",
                    padding: "10px 0",
                    fontFamily: "monospace",
                    letterSpacing: "1px",
                  }}
                />
                {pwd && (
                  <button
                    onClick={copy}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: copied ? "#10b981" : "#94a3b8",
                      padding: "0 4px",
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                )}
              </div>
              <button
                onClick={gen}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: C.grad,
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  whiteSpace: "nowrap",
                  boxShadow: "0 2px 10px rgba(147,51,234,0.25)",
                }}
              >
                <Zap size={14} /> Générer
              </button>
            </div>
          </div>

          {pwd && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f0f9ff",
                border: "1px solid #bae6fd",
                borderRadius: 10,
                padding: "11px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Mail size={14} color="#0ea5e9" />
                <span
                  style={{ fontSize: 12.5, color: "#0369a1", fontWeight: 500 }}
                >
                  Envoyer les identifiants par email
                </span>
              </div>
              <button
                onClick={() => setSent(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "7px 13px",
                  borderRadius: 8,
                  border: "none",
                  background: sent ? "#10b981" : "#0ea5e9",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {sent ? (
                  <>
                    <Check size={12} />
                    Envoyé
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    Envoyer
                  </>
                )}
              </button>
            </motion.div>
          )}

          <button
            onClick={() => {
              if (!valid) return;
              onAdd({
                ...form,
                id: Date.now(),
                statut: "inactif",
                firstLogin: true,
                createdAt: new Date().toISOString().slice(0, 10),
              });
              onClose();
            }}
            disabled={!valid}
            style={{
              padding: "13px",
              borderRadius: 12,
              border: "none",
              background: valid ? C.grad : "#e2e8f0",
              color: valid ? "white" : "#94a3b8",
              fontSize: 14.5,
              fontWeight: 700,
              cursor: valid ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: valid ? "0 6px 20px rgba(147,51,234,0.28)" : "none",
            }}
          >
            <UserCheck size={17} /> Créer le compte
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ IMPORT MODAL ═════════════════════════════════════════════ */
function ImportModal({ onClose, onImport }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const fakeRows = [
    {
      nom: "Mohammed Alaoui",
      email: "m.alaoui@umi.ac.ma",
      service: "Informatique",
      role: "PROFESSEUR",
    },
    {
      nom: "Aicha Benmoussa",
      email: "a.benmoussa@umi.ac.ma",
      service: "Scolarité",
      role: "ADMIN_ATTEST",
    },
    {
      nom: "Rachid Filali",
      email: "r.filali@umi.ac.ma",
      service: "Bibliothèque",
      role: "ADMIN_BIB",
    },
  ];

  const handleFile = (f) => {
    setFile(f);
    setPreview(fakeRows);
  };

  const dlTemplate = () => {
    const csv =
      "Nom complet,Email académique,Service / Département,Rôle\nAhmed Benali,ahmed.benali@umi.ac.ma,Informatique,PROFESSEUR\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "template_utilisateurs_umi.csv";
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 22,
          width: "100%",
          maxWidth: 580,
          maxHeight: "88vh",
          overflow: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileSpreadsheet size={18} color="#10b981" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: C.dark }}>
                Importer via Excel
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>
                Colonnes : Nom, Email, Service, Rôle
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              cursor: "pointer",
              color: C.muted,
              padding: 8,
              borderRadius: 9,
              display: "flex",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px 26px" }}>
          {!file && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById("xlsIn").click()}
              style={{
                border: `2px dashed ${dragging ? "#10b981" : "#cbd5e1"}`,
                borderRadius: 14,
                padding: "36px 20px",
                textAlign: "center",
                cursor: "pointer",
                background: dragging ? "#ecfdf5" : "#f8fafc",
                transition: "all .2s",
                marginBottom: 14,
              }}
            >
              <input
                id="xlsIn"
                type="file"
                accept=".xlsx,.xls,.csv"
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              <FileSpreadsheet
                size={40}
                color={dragging ? "#10b981" : "#94a3b8"}
                style={{ margin: "0 auto 12px" }}
              />
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: C.dark,
                  marginBottom: 4,
                }}
              >
                Glissez votre fichier Excel ici
              </div>
              <div style={{ fontSize: 12.5, color: C.muted }}>
                .xlsx, .xls ou .csv
              </div>
            </div>
          )}

          <button
            onClick={dlTemplate}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "10px",
              borderRadius: 10,
              border: "1.5px dashed #10b981",
              background: "#f0fdf4",
              color: "#10b981",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 16,
            }}
          >
            <Download size={15} /> Télécharger le modèle Excel
          </button>

          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.dark,
                  marginBottom: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <CheckCircle size={15} color="#10b981" />
                {preview.length} utilisateurs détectés — {file?.name}
              </div>
              <div
                style={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      {["Nom", "Email", "Service", "Rôle"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "9px 13px",
                            textAlign: "left",
                            fontSize: 11.5,
                            fontWeight: 700,
                            color: C.muted,
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((u, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom:
                            i < preview.length - 1
                              ? "1px solid #f1f5f9"
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            padding: "9px 13px",
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.dark,
                          }}
                        >
                          {u.nom}
                        </td>
                        <td
                          style={{
                            padding: "9px 13px",
                            fontSize: 12,
                            color: C.muted,
                          }}
                        >
                          {u.email}
                        </td>
                        <td
                          style={{
                            padding: "9px 13px",
                            fontSize: 12,
                            color: C.muted,
                          }}
                        >
                          {u.service}
                        </td>
                        <td style={{ padding: "9px 13px" }}>
                          <RoleBadge role={u.role} small />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button
                onClick={() => {
                  onImport(preview);
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg,#10b981,#059669)",
                  color: "white",
                  fontSize: 14.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
                }}
              >
                <Upload size={16} /> Importer {preview.length} comptes
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ RESET MODAL ══════════════════════════════════════════════ */
function ResetModal({ user, onClose }) {
  const [pwd] = useState(genPwd);
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard.writeText(pwd);
    } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 20,
          width: "100%",
          maxWidth: 440,
          padding: "26px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 18,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 800, color: C.dark }}>
            Réinitialiser le mot de passe
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#f1f5f9",
              border: "none",
              cursor: "pointer",
              color: C.muted,
              padding: 8,
              borderRadius: 9,
              display: "flex",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <AlertCircle size={14} color="#ef4444" />
          <span style={{ fontSize: 12.5, color: "#991b1b", fontWeight: 500 }}>
            Nouveau mot de passe pour <strong>{user.nom}</strong>
          </span>
        </div>
        <div
          style={{
            background: "#f8fafc",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            padding: "11px 14px",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Key size={15} color="#94a3b8" />
          <span
            style={{
              flex: 1,
              fontFamily: "monospace",
              fontSize: 15,
              letterSpacing: "2px",
              color: C.dark,
              fontWeight: 700,
            }}
          >
            {pwd}
          </span>
          <button
            onClick={copy}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: copied ? "#10b981" : "#94a3b8",
            }}
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setSent(true)}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 10,
              border: sent ? "1px solid #a7f3d0" : "1px solid #bfdbfe",
              background: sent ? "#ecfdf5" : "#eff6ff",
              color: sent ? "#10b981" : "#3b82f6",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            {sent ? (
              <>
                <Check size={13} />
                Envoyé
              </>
            ) : (
              <>
                <Mail size={13} />
                Envoyer email
              </>
            )}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 10,
              border: "none",
              background: C.grad,
              color: "white",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: "0 2px 10px rgba(147,51,234,0.25)",
            }}
          >
            <Check size={13} />
            Confirmer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ USER DETAIL MODAL ══════════════════════════════════════ */
function UserDetailModal({ user, onClose, onReset, onToggle }) {
  const cfg = ROLES[user.role] || {
    label: user.role,
    color: "#64748b",
    bg: "#f1f5f9",
    Icon: Shield,
  };
  const Icon = cfg.Icon;
  const sc = {
    actif: { color: "#10b981", bg: "#ecfdf5", label: "Actif" },
    inactif: { color: "#94a3b8", bg: "#f1f5f9", label: "Inactif" },
    suspendu: { color: "#ef4444", bg: "#fef2f2", label: "Suspendu" },
  }[user.statut] || { color: "#64748b", bg: "#f1f5f9", label: user.statut };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 22,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "22px 26px 18px",
            background: `linear-gradient(135deg,${cfg.color},${cfg.color}cc)`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 22,
                fontWeight: 800,
              }}
            >
              {user.nom
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "white",
                  marginBottom: 4,
                }}
              >
                {user.nom}
              </div>
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                <span
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    borderRadius: 20,
                    padding: "3px 10px",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Icon size={11} />
                  {cfg.label}
                </span>
                <span
                  style={{
                    background: sc.bg,
                    color: sc.color,
                    fontSize: 12,
                    fontWeight: 700,
                    borderRadius: 20,
                    padding: "3px 10px",
                  }}
                >
                  {sc.label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              color: "white",
              padding: 8,
              borderRadius: 9,
              display: "flex",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* info grid */}
        <div style={{ padding: "20px 24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              border: "1px solid #e2e8f0",
              borderRadius: 13,
              overflow: "hidden",
              marginBottom: 18,
            }}
          >
            {[
              { label: "Email", value: user.email, icon: "✉️" },
              { label: "Service", value: user.service, icon: "🏛️" },
              { label: "Rôle", value: cfg.label, icon: "🏷️" },
              { label: "Statut", value: sc.label, icon: "⚡" },
              {
                label: "1ère connexion",
                value: user.firstLogin ? "En attente ⚠️" : "Complétée ✅",
                icon: "🔑",
              },
              { label: "Créé le", value: user.createdAt, icon: "📅" },
            ].map((r, i, arr) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 16px",
                  borderBottom:
                    i < arr.length - 1 ? "1px solid #f1f5f9" : "none",
                  background: i % 2 === 0 ? "white" : "#fafafa",
                }}
              >
                <span
                  style={{
                    fontSize: 16,
                    width: 24,
                    textAlign: "center",
                    flexShrink: 0,
                  }}
                >
                  {r.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    {r.label.toUpperCase()}
                  </div>
                  <div
                    style={{
                      fontSize: 13.5,
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {r.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => onReset(user)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 11,
                  border: "none",
                  background: "#fffbeb",
                  color: "#d97706",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  border: "1px solid #fde68a",
                }}
              >
                🔑 Réinitialiser MDP
              </button>
              <button
                onClick={() => onToggle(user.id)}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 11,
                  border: "none",
                  background: user.statut === "actif" ? "#fef2f2" : "#ecfdf5",
                  color: user.statut === "actif" ? "#ef4444" : "#10b981",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                  border: `1px solid ${user.statut === "actif" ? "#fecaca" : "#a7f3d0"}`,
                }}
              >
                {user.statut === "actif" ? "🚫 Suspendre" : "✅ Réactiver"}
              </button>
            </div>
            {user.firstLogin && (
              <div
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 11,
                  padding: "12px 15px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 18 }}>📧</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1e40af",
                      marginBottom: 2,
                    }}
                  >
                    MDP initial non envoyé
                  </div>
                  <div style={{ fontSize: 12, color: "#3b82f6" }}>
                    Cliquez "Réinitialiser MDP" pour générer et envoyer le mot
                    de passe initial.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ CONFIRM DELETE MODAL ══════════════════════════════════════ */
function ConfirmDeleteModal({ user, onClose, onConfirm }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        background: "rgba(15,23,42,0.55)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 20,
          width: "100%",
          maxWidth: 420,
          padding: "28px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 8,
            }}
          >
            Supprimer ce compte ?
          </div>
          <div style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
            Le compte de{" "}
            <strong style={{ color: "#0f172a" }}>{user.nom}</strong> (
            <code
              style={{
                background: "#f1f5f9",
                padding: "1px 6px",
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              {user.email}
            </code>
            ) sera supprimé définitivement. Cette action est irréversible.
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 11,
              border: "1.5px solid #e2e8f0",
              background: "white",
              color: "#374151",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 11,
              border: "none",
              background: "linear-gradient(135deg,#ef4444,#dc2626)",
              color: "white",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              boxShadow: "0 4px 14px rgba(239,68,68,0.35)",
            }}
          >
            🗑️ Supprimer définitivement
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══ MAIN ════════════════════════════════════════════════════ */

/* ── Super Admin Notifications ─────────────────────────────── */

/* ── SA Notif Panel ─────────────────────────────────────────── */
/* ══ SA MDP MODAL ════════════════════════════════════════════ */
function SAMdpModal({ notif, onClose, onSent }) {
  const nomUser = notif.titre.split("—")[1]?.trim() || "l\'utilisateur";
  const emailUser = nomUser.toLowerCase().replace(/ /g, ".") + "@umi.ac.ma";
  const [pwd] = useState(genPwd);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const copy = () => {
    try {
      navigator.clipboard.writeText(pwd);
    } catch (_) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const send = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 22,
          width: "100%",
          maxWidth: 440,
          padding: "28px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
        }}
      >
        {!sent ? (
          <>
            {/* header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fff7ed",
                  border: "1px solid #fed7aa",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                🔑
              </div>
              <div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}
                >
                  Envoyer le MDP initial
                </div>
                <div style={{ fontSize: 12.5, color: "#64748b" }}>
                  {nomUser}
                </div>
              </div>
            </div>

            {/* recipient */}
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 11,
                padding: "11px 15px",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 9,
              }}
            >
              <span style={{ fontSize: 16 }}>✉️</span>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    fontWeight: 600,
                    marginBottom: 2,
                  }}
                >
                  DESTINATAIRE
                </div>
                <div
                  style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}
                >
                  {emailUser}
                </div>
              </div>
            </div>

            {/* generated password */}
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#374151",
                  marginBottom: 7,
                }}
              >
                MOT DE PASSE GÉNÉRÉ
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 11,
                  padding: "12px 16px",
                }}
              >
                <Key size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
                <span
                  style={{
                    flex: 1,
                    fontFamily: "monospace",
                    fontSize: 16,
                    letterSpacing: "3px",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {pwd}
                </span>
                <button
                  onClick={copy}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: copied ? "#10b981" : "#94a3b8",
                    transition: "color .2s",
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 6 }}>
                L'utilisateur devra changer ce mot de passe à la 1ère connexion.
              </div>
            </div>

            {/* info */}
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 10,
                padding: "11px 14px",
                marginBottom: 18,
                display: "flex",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
              <span
                style={{ fontSize: 12.5, color: "#1e40af", lineHeight: 1.5 }}
              >
                Le mot de passe sera envoyé chiffré. Le compte passera en statut
                "1ère connexion en attente".
              </span>
            </div>

            {/* actions */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: 11,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  color: "#374151",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Annuler
              </button>
              <button
                onClick={send}
                disabled={sending}
                style={{
                  flex: 2,
                  padding: "12px",
                  borderRadius: 11,
                  border: "none",
                  background: C.grad,
                  color: "white",
                  fontSize: 13.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: "0 4px 14px rgba(147,51,234,0.3)",
                }}
              >
                {sending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "white",
                      }}
                    />
                    Envoi…
                  </>
                ) : (
                  <>📧 Envoyer le MDP</>
                )}
              </button>
            </div>
          </>
        ) : (
          /* sent state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
              textAlign: "center",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 20,
                delay: 0.1,
              }}
              style={{
                width: 68,
                height: 68,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#10b981,#059669)",
                fontSize: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 28px rgba(16,185,129,0.35)",
              }}
            >
              ✅
            </motion.div>
            <div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                MDP envoyé !
              </div>
              <div
                style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.6 }}
              >
                Le mot de passe initial a été envoyé à<br />
                <strong style={{ color: "#0f172a" }}>{emailUser}</strong>
              </div>
            </div>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: "12px 18px",
                width: "100%",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#64748b",
                  marginBottom: 6,
                }}
              >
                Prochaines étapes
              </div>
              {[
                "L'utilisateur reçoit le MDP par email",
                "À la 1ère connexion, il doit le changer",
                "Le statut passera à 'Actif' automatiquement",
              ].map((s, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 7,
                    marginBottom: 4,
                    fontSize: 12.5,
                    color: "#374151",
                  }}
                >
                  <span style={{ color: "#10b981", fontWeight: 700 }}>✓</span>
                  {s}
                </div>
              ))}
            </div>
            <button
              onClick={onSent}
              style={{
                padding: "12px 32px",
                borderRadius: 11,
                border: "none",
                background: C.grad,
                color: "white",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(147,51,234,0.28)",
              }}
            >
              Fermer
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ══ SA GÉRER MODAL (Import Excel accounts) ═══════════════════ */
function SAGererModal({ onClose, onDone }) {
  const [step, setStep] = useState("list"); // "list" | "sending"
  const [sent, setSent] = useState([]);
  const [sending, setSending] = useState(false);

  const accounts = [
    {
      nom: "Mohammed Alaoui",
      email: "m.alaoui@umi.ac.ma",
      role: "PROFESSEUR",
      mdpSent: false,
    },
    {
      nom: "Aicha Benmoussa",
      email: "a.benmoussa@umi.ac.ma",
      role: "ADMIN_ATTEST",
      mdpSent: false,
    },
    {
      nom: "Rachid Filali",
      email: "r.filali@umi.ac.ma",
      role: "ADMIN_BIB",
      mdpSent: false,
    },
  ];

  const sendAll = () => {
    setSending(true);
    let i = 0;
    const interval = setInterval(() => {
      setSent((p) => [...p, accounts[i].email]);
      i++;
      if (i >= accounts.length) {
        clearInterval(interval);
        setSending(false);
        setTimeout(
          () => onDone(`📧 MDP envoyés à ${accounts.length} nouveaux comptes`),
          800,
        );
      }
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(15,23,42,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.93, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: 22,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "20px 24px 16px",
            background: C.grad,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 11,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              👥
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "white" }}>
                Gérer les nouveaux comptes
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
                Import Excel — 3 comptes
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              cursor: "pointer",
              color: "white",
              padding: 8,
              borderRadius: 9,
              display: "flex",
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginBottom: 18,
            }}
          >
            {accounts.map((a, i) => {
              const isSent = sent.includes(a.email);
              const cfg = ROLES[a.role] || {
                label: a.role,
                color: "#64748b",
                bg: "#f1f5f9",
                Icon: Shield,
              };
              return (
                <div
                  key={a.email}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: isSent ? "#ecfdf5" : "#f8fafc",
                    border: `1px solid ${isSent ? "#a7f3d0" : "#e2e8f0"}`,
                    borderRadius: 12,
                    padding: "12px 15px",
                    transition: "all .3s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: C.grad,
                      color: "white",
                      fontSize: 13,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {a.nom
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {a.nom}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}
                    >
                      {a.email}
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        background: cfg.bg,
                        color: cfg.color,
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 20,
                        padding: "2px 9px",
                      }}
                    >
                      {cfg.label}
                    </span>
                    {isSent ? (
                      <span style={{ fontSize: 18 }}>✅</span>
                    ) : (
                      <span style={{ fontSize: 18, opacity: 0.3 }}>⏳</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 11,
              padding: "11px 15px",
              marginBottom: 18,
              display: "flex",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
            <span style={{ fontSize: 12.5, color: "#78350f", lineHeight: 1.5 }}>
              Un MDP auto-généré sera envoyé à chaque adresse. Les utilisateurs
              devront le changer à la 1ère connexion.
            </span>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 11,
                border: "1.5px solid #e2e8f0",
                background: "white",
                color: "#374151",
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Annuler
            </button>
            <button
              onClick={sendAll}
              disabled={sending || sent.length === accounts.length}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 11,
                border: "none",
                background:
                  !sending && sent.length < accounts.length
                    ? C.grad
                    : "#e2e8f0",
                color:
                  !sending && sent.length < accounts.length
                    ? "white"
                    : "#94a3b8",
                fontSize: 13.5,
                fontWeight: 700,
                cursor:
                  !sending && sent.length < accounts.length
                    ? "pointer"
                    : "not-allowed",
                fontFamily: "inherit",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow:
                  !sending && sent.length < accounts.length
                    ? "0 4px 14px rgba(147,51,234,0.3)"
                    : "none",
              }}
            >
              {sending ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                    }}
                  />
                  Envoi en cours…
                </>
              ) : (
                <>📧 Envoyer tous les MDP ({accounts.length})</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SANotifPanel({
  notifs,
  setNotifs,
  onClose,
  onMdpRequest,
  onGererRequest,
}) {
  const [toast, setToast] = useState(null);
  const unread = notifs.filter((n) => !n.lu).length;

  const markDone = (n) =>
    setNotifs((p) =>
      p.map((x) => (x.id === n.id ? { ...x, lu: true, action: null } : x)),
    );

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const act = (n) => {
    if (n.action?.label === "Envoyer MDP") {
      markDone(n);
      if (onMdpRequest) onMdpRequest(n);
      return;
    }
    if (n.action?.label === "Gérer") {
      markDone(n);
      if (onGererRequest) onGererRequest();
      return;
    }
    markDone(n);
    notify("✅ Action effectuée");
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 9998 }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ type: "spring", stiffness: 360, damping: 30 }}
        style={{
          position: "fixed",
          top: 72,
          right: 16,
          width: 380,
          maxHeight: 520,
          background: "white",
          borderRadius: 18,
          zIndex: 9999,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* header */}
        <div
          style={{
            padding: "14px 18px 10px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>
                Notifications
              </div>
              {unread > 0 && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    borderRadius: 20,
                    padding: "2px 8px",
                  }}
                >
                  {unread}
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
              {unread > 0 && (
                <button
                  onClick={() =>
                    setNotifs((p) => p.map((n) => ({ ...n, lu: true })))
                  }
                  style={{
                    fontSize: 11.5,
                    color: C.orange,
                    fontWeight: 600,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Tout lu
                </button>
              )}
              <button
                onClick={onClose}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 7,
                  border: "none",
                  background: "#f1f5f9",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  color: "#64748b",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <AnimatePresence>
            {toast && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  background: "#ecfdf5",
                  border: "1px solid #a7f3d0",
                  borderRadius: 9,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#065f46",
                }}
              >
                {toast}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* list */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {notifs.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                borderBottom: "1px solid #f8fafc",
                background: n.lu ? "white" : "#fffcf5",
                padding: "12px 16px",
              }}
            >
              <div
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: n.lu ? "#f1f5f9" : "#fff7ed",
                    border: `1px solid ${n.lu ? "#e2e8f0" : "#fed7aa"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                    flexShrink: 0,
                  }}
                >
                  {n.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 6,
                      marginBottom: 3,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: n.lu ? 600 : 700,
                        color: "#0f172a",
                        lineHeight: 1.3,
                      }}
                    >
                      {n.titre}
                    </div>
                    {!n.lu && (
                      <div
                        style={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background:
                            n.priorite === "haute" ? "#ef4444" : "#f59e0b",
                          flexShrink: 0,
                          marginTop: 4,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      lineHeight: 1.4,
                      marginBottom: 6,
                    }}
                  >
                    {n.corps}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {n.date}
                    </span>
                    {n.action && (
                      <motion.button
                        onClick={() => act(n)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "5px 12px",
                          borderRadius: 8,
                          border: "none",
                          background: C.grad,
                          color: "white",
                          fontSize: 11.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: "0 2px 8px rgba(249,115,22,0.35)",
                        }}
                      >
                        {n.action.label} →
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div
          style={{
            padding: "10px 16px",
            borderTop: "1px solid #f1f5f9",
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: "#94a3b8",
            flexShrink: 0,
          }}
        >
          <span>
            {notifs.filter((n) => n.action && !n.lu).length} action(s) en
            attente
          </span>
          <button
            onClick={() => setNotifs((p) => p.map((n) => ({ ...n, lu: true })))}
            style={{
              fontSize: 12,
              color: C.orange,
              fontWeight: 600,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Tout marquer lu
          </button>
        </div>
      </motion.div>
    </>
  );
}

const SA_NOTIFS = [
  {
    id: 1,
    lu: false,
    icon: "🔑",
    titre: "MDP initial — Karim Tazi",
    corps:
      "Compte enseignant créé le 20/01. Le mot de passe initial n\'a pas encore été envoyé.",
    date: "Il y a 1h",
    priorite: "haute",
    action: { label: "Envoyer MDP" },
  },
  {
    id: 2,
    lu: false,
    icon: "🔑",
    titre: "MDP initial — Youssef Kaddouri",
    corps: "Compte Admin EDT créé. En attente de la 1ère connexion.",
    date: "Il y a 3h",
    priorite: "haute",
    action: { label: "Envoyer MDP" },
  },
  {
    id: 3,
    lu: false,
    icon: "👤",
    titre: "Import Excel — 3 nouveaux comptes",
    corps: "3 comptes importés le 20/01. MDP initiaux à distribuer.",
    date: "Il y a 5h",
    priorite: "normale",
    action: { label: "Gérer" },
  },
  {
    id: 4,
    lu: false,
    icon: "⚠️",
    titre: "Compte suspendu — Hassan Ouali",
    corps: "Compte Admin EDT suspendu manuellement. Motif à documenter.",
    date: "Il y a 2j",
    priorite: "normale",
    action: null,
  },
  {
    id: 5,
    lu: true,
    icon: "✅",
    titre: "Réinitialisation réussie — Sara El Amrani",
    corps: "Mot de passe réinitialisé et envoyé avec succès.",
    date: "Il y a 3j",
    priorite: "normale",
    action: null,
  },
];

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [saNotifs, setSaNotifs] = useState(SA_NOTIFS);
  const [saMdpModal, setSaMdpModal] = useState(null);
  const [saGererModal, setSaGererModal] = useState(false);
  const [users, setUsers] = useState(INIT_USERS);

  useEffect(() => {
    usersAPI
      .getAll()
      .then((d) => {
        const list = d?.data || d;
        if (Array.isArray(list) && list.length > 0) setUsers(list);
      })
      .catch(() => {});
  }, []);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatut, setFilterStatut] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [viewUser, setViewUser] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [activeTab, setActiveTab] = useState("users");
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addUser = (u) => {
    setUsers((p) => [u, ...p]);
    usersAPI.create(u).catch(() => {});
    notify(`Compte créé pour ${u.nom}`);
  };
  const importU = (list) => {
    setUsers((p) => [
      ...list.map((u, i) => ({
        ...u,
        id: Date.now() + i,
        statut: "inactif",
        firstLogin: true,
        createdAt: new Date().toISOString().slice(0, 10),
      })),
      ...p,
    ]);
    notify(`${list.length} comptes importés`);
  };
  const toggleStat = (id) => {
    setUsers((p) =>
      p.map((u) =>
        u.id === id
          ? { ...u, statut: u.statut === "actif" ? "suspendu" : "actif" }
          : u,
      ),
    );
    usersAPI.toggleStatut(id).catch(() => {});
  };
  const delUser = (id) => {
    setUsers((p) => p.filter((u) => u.id !== id));
    usersAPI.delete(id).catch(() => {});
    setConfirmDel(null);
    notify("Utilisateur supprimé", "error");
  };

  const exportCSV = () => {
    const hdr =
      "Nom complet,Email académique,Service,Rôle,Statut,Date création\n";
    const rows = users
      .map(
        (u) =>
          `${u.nom},${u.email},${u.service},${u.role},${u.statut},${u.createdAt}`,
      )
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([hdr + rows], { type: "text/csv" }));
    a.download = "utilisateurs_umi_flow.csv";
    a.click();
    notify("Export téléchargé");
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      (u.nom.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.service.toLowerCase().includes(q)) &&
      (filterRole === "all" || u.role === filterRole) &&
      (filterStatut === "all" || u.statut === filterStatut)
    );
  });

  const stats = {
    total: users.length,
    actifs: users.filter((u) => u.statut === "actif").length,
    firstLogin: users.filter((u) => u.firstLogin).length,
    profs: users.filter((u) => u.role === "PROFESSEUR").length,
  };

  const TABS = [
    { id: "users", label: "Utilisateurs", icon: Users },
    { id: "activity", label: "Activité récente", icon: BarChart2 },
  ];

  const ACTIVITY = [
    {
      action: "Compte créé",
      user: "Karim Tazi",
      time: "Il y a 2h",
      col: "#10b981",
      Icon: Plus,
    },
    {
      action: "MDP réinitialisé",
      user: "Youssef Kaddouri",
      time: "Il y a 4h",
      col: "#f59e0b",
      Icon: Key,
    },
    {
      action: "Rôle modifié",
      user: "Nadia Berrada",
      time: "Hier 14:30",
      col: "#3b82f6",
      Icon: Edit2,
    },
    {
      action: "Import Excel (8 cptes)",
      user: "Super Admin",
      time: "Hier 10:00",
      col: "#8b5cf6",
      Icon: FileSpreadsheet,
    },
    {
      action: "Compte suspendu",
      user: "Hassan Ouali",
      time: "Il y a 3j",
      col: "#ef4444",
      Icon: XCircle,
    },
    {
      action: "Email activation envoyé",
      user: "Sara El Amrani",
      time: "Il y a 5j",
      col: "#0ea5e9",
      Icon: Mail,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8faff",
        fontFamily: "'Plus Jakarta Sans','Segoe UI',system-ui,sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -28 }}
            style={{
              position: "fixed",
              top: 18,
              right: 18,
              zIndex: 999,
              background: toast.type === "error" ? "#fef2f2" : "#ecfdf5",
              border: `1px solid ${toast.type === "error" ? "#fecaca" : "#a7f3d0"}`,
              borderRadius: 12,
              padding: "11px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              color: toast.type === "error" ? "#991b1b" : "#065f46",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            {toast.type === "error" ? (
              <XCircle size={15} color="#ef4444" />
            ) : (
              <CheckCircle size={15} color="#10b981" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* navbar */}
      <nav
        style={{
          height: 62,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 32px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: C.grad,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              boxShadow: "0 2px 10px rgba(147,51,234,0.3)",
            }}
          >
            🎓
          </div>
          <div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: C.dark,
                lineHeight: 1,
              }}
            >
              Umi-Flow
            </div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              SUPER ADMIN
            </div>
          </div>
          <div
            style={{
              width: 1,
              height: 26,
              background: "#e2e8f0",
              margin: "0 6px",
            }}
          />
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 20,
              padding: "4px 12px",
            }}
          >
            <Shield size={11} color="#ef4444" />
            <span style={{ fontSize: 11.5, color: "#ef4444", fontWeight: 700 }}>
              Omar Raji
            </span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setNotifOpen((o) => !o)}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: notifOpen ? "#fff7ed" : "#f1f5f9",
                border: notifOpen ? "1px solid #fed7aa" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                transition: "all .2s",
              }}
            >
              <Bell size={16} color={notifOpen ? C.orange : "#64748b"} />
              {saNotifs.filter((n) => !n.lu).length > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#ef4444",
                    border: "2px solid white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 9,
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  {saNotifs.filter((n) => !n.lu).length}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <SANotifPanel
                  notifs={saNotifs}
                  setNotifs={setSaNotifs}
                  onClose={() => setNotifOpen(false)}
                  onMdpRequest={(n) => {
                    setSaMdpModal(n);
                    setNotifOpen(false);
                  }}
                  onGererRequest={() => {
                    setSaGererModal(true);
                    setNotifOpen(false);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 14px",
              borderRadius: 10,
              border: "none",
              background: C.grad,
              color: "white",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 2px 10px rgba(234,88,12,0.22)",
            }}
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </nav>

      <div
        style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px 60px" }}
      >
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 26 }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: C.dark,
              letterSpacing: "-0.5px",
              margin: "0 0 5px",
            }}
          >
            Tableau de bord Super Admin
          </h1>
          <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>
            Gestion centralisée des comptes, rôles et accès — Université Moulay
            Ismail
          </p>
        </motion.div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 16,
            marginBottom: 26,
          }}
        >
          {[
            {
              label: "Total utilisateurs",
              value: stats.total,
              Icon: Users,
              color: "#9333ea",
            },
            {
              label: "Comptes actifs",
              value: stats.actifs,
              Icon: CheckCircle,
              color: "#10b981",
            },
            {
              label: "1ère connexion att.",
              value: stats.firstLogin,
              Icon: AlertCircle,
              color: "#f59e0b",
            },
            {
              label: "Enseignants",
              value: stats.profs,
              Icon: BookOpen,
              color: "#3b82f6",
            },
          ].map((s) => {
            const Icon = s.Icon;
            return (
              <motion.div
                key={s.label}
                whileHover={{ y: -3, boxShadow: `0 12px 32px ${s.color}18` }}
                style={{
                  background: "white",
                  borderRadius: 18,
                  padding: "20px 22px",
                  border: `1px solid ${s.color}18`,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  transition: "box-shadow .2s",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    right: -10,
                    top: -10,
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: s.color + "0d",
                  }}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 12,
                      background: s.color + "18",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: `1px solid ${s.color}20`,
                    }}
                  >
                    <Icon size={20} color={s.color} strokeWidth={2} />
                  </div>
                  <TrendingUp size={13} color={s.color + "88"} />
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: C.dark,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: C.muted,
                    marginTop: 4,
                    fontWeight: 500,
                  }}
                >
                  {s.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* tabs */}
        <div
          style={{
            display: "flex",
            gap: 4,
            borderBottom: `2px solid #e2e8f0`,
            marginBottom: 20,
          }}
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "10px 18px",
                  borderRadius: "10px 10px 0 0",
                  border: "none",
                  cursor: "pointer",
                  background: active ? "white" : "transparent",
                  color: active ? C.violet : C.muted,
                  fontSize: 13.5,
                  fontWeight: active ? 700 : 500,
                  fontFamily: "inherit",
                  borderBottom: active
                    ? `2px solid ${C.violet}`
                    : "2px solid transparent",
                  marginBottom: -2,
                  boxShadow: active
                    ? "0 -2px 12px rgba(147,51,234,0.08)"
                    : "none",
                  transition: "all .2s",
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* USERS TAB */}
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* toolbar */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 16,
                flexWrap: "wrap",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "white",
                  border: "1.5px solid #e2e8f0",
                  borderRadius: 10,
                  padding: "0 13px",
                  gap: 8,
                  flex: 1,
                  minWidth: 220,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                }}
              >
                <Search size={14} color="#94a3b8" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Nom, email, service…"
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    fontSize: 13.5,
                    color: C.dark,
                    padding: "10px 0",
                    fontFamily: "inherit",
                    width: "100%",
                  }}
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                style={{
                  padding: "10px 13px",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  fontSize: 13,
                  color: C.dark,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="all">Tous les rôles</option>
                {Object.entries(ROLES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
                style={{
                  padding: "10px 13px",
                  borderRadius: 10,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  fontSize: 13,
                  color: C.dark,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                <option value="all">Tous les statuts</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
                <option value="suspendu">Suspendu</option>
              </select>
              <button
                onClick={() => setShowImport(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #a7f3d0",
                  background: "#ecfdf5",
                  color: "#10b981",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <FileSpreadsheet size={14} /> Importer Excel
              </button>
              <button
                onClick={exportCSV}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #bfdbfe",
                  background: "#eff6ff",
                  color: "#3b82f6",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <Download size={14} /> Exporter
              </button>
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: C.grad,
                  color: "white",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 12px rgba(147,51,234,0.28)",
                }}
              >
                <Plus size={14} /> Nouveau compte
              </button>
            </div>

            <div style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>
              <strong style={{ color: C.dark }}>{filtered.length}</strong>{" "}
              utilisateur{filtered.length > 1 ? "s" : ""} affiché
              {filtered.length > 1 ? "s" : ""}
            </div>

            {/* table */}
            <div
              style={{
                background: "white",
                borderRadius: 18,
                border: "1px solid #e2e8f0",
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              }}
            >
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {[
                      "Utilisateur",
                      "Email",
                      "Service",
                      "Rôle",
                      "Statut",
                      "1ère cnx",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "11px 15px",
                          textAlign: "left",
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: C.muted,
                          borderBottom: "1px solid #e2e8f0",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u.id}
                      style={{
                        borderBottom:
                          i < filtered.length - 1
                            ? "1px solid #f1f5f9"
                            : "none",
                      }}
                    >
                      <td style={{ padding: "12px 15px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <div
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 10,
                              background: C.grad,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: 12,
                              fontWeight: 800,
                              flexShrink: 0,
                            }}
                          >
                            {u.nom
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 700,
                                color: C.dark,
                              }}
                            >
                              {u.nom}
                            </div>
                            <div style={{ fontSize: 11, color: C.muted }}>
                              {u.createdAt}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: 12,
                          color: C.muted,
                        }}
                      >
                        {u.email}
                      </td>
                      <td
                        style={{
                          padding: "12px 15px",
                          fontSize: 12.5,
                          color: C.dark,
                          fontWeight: 500,
                        }}
                      >
                        {u.service}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <RoleBadge role={u.role} />
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <StatutBadge statut={u.statut} />
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        {u.firstLogin ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: "#fffbeb",
                              color: "#92400e",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 20,
                              padding: "3px 9px",
                              border: "1px solid #fde68a",
                            }}
                          >
                            <AlertCircle size={10} /> En attente
                          </span>
                        ) : (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                              background: "#ecfdf5",
                              color: "#065f46",
                              fontSize: 11,
                              fontWeight: 600,
                              borderRadius: 20,
                              padding: "3px 9px",
                            }}
                          >
                            <Check size={10} /> Complété
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "12px 15px" }}>
                        <div style={{ display: "flex", gap: 5 }}>
                          <ActionBtn
                            icon={Eye}
                            color="#3b82f6"
                            title="Voir le compte"
                            onClick={() => setViewUser(u)}
                          />
                          <ActionBtn
                            icon={Key}
                            color="#f59e0b"
                            title="Réinitialiser MDP"
                            onClick={() => setResetUser(u)}
                          />
                          <ActionBtn
                            icon={u.statut === "actif" ? XCircle : CheckCircle}
                            color={u.statut === "actif" ? "#ef4444" : "#10b981"}
                            title={
                              u.statut === "actif" ? "Suspendre" : "Activer"
                            }
                            onClick={() => toggleStat(u.id)}
                          />
                          <ActionBtn
                            icon={Trash2}
                            color="#ef4444"
                            title="Supprimer"
                            onClick={() => setConfirmDel(u)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "48px",
                    color: C.muted,
                  }}
                >
                  <Users
                    size={34}
                    style={{ margin: "0 auto 10px", opacity: 0.3 }}
                  />
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    Aucun utilisateur trouvé
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ACTIVITY TAB */}
        {activeTab === "activity" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            {ACTIVITY.map((a, i) => {
              const Icon = a.Icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    background: "white",
                    borderRadius: 14,
                    padding: "14px 18px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 11,
                      background: a.col + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={a.col} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 13.5, fontWeight: 700, color: C.dark }}
                    >
                      {a.action}
                    </div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                      {a.user}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.time}</div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <AddUserModal onClose={() => setShowAdd(false)} onAdd={addUser} />
        )}
        {showImport && (
          <ImportModal
            onClose={() => setShowImport(false)}
            onImport={importU}
          />
        )}
        {resetUser && (
          <ResetModal user={resetUser} onClose={() => setResetUser(null)} />
        )}
        {viewUser && (
          <UserDetailModal
            user={viewUser}
            onClose={() => setViewUser(null)}
            onReset={(u) => {
              setViewUser(null);
              setResetUser(u);
            }}
            onToggle={(id) => {
              toggleStat(id);
              setViewUser(null);
            }}
          />
        )}
        {confirmDel && (
          <ConfirmDeleteModal
            user={confirmDel}
            onClose={() => setConfirmDel(null)}
            onConfirm={() => delUser(confirmDel.id)}
          />
        )}
        {saMdpModal && (
          <SAMdpModal
            notif={saMdpModal}
            onClose={() => setSaMdpModal(null)}
            onSent={() => {
              setSaMdpModal(null);
            }}
          />
        )}
        {saGererModal && (
          <SAGererModal
            onClose={() => setSaGererModal(false)}
            onDone={() => setSaGererModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

const LS = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: "#374151",
  marginBottom: 6,
};
const IS = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1.5px solid #e2e8f0",
  fontSize: 13.5,
  color: "#0f172a",
  fontFamily: "inherit",
  outline: "none",
  background: "#f8fafc",
  boxSizing: "border-box",
  cursor: "pointer",
};
