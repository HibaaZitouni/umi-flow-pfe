// src/syncStore.js — Umi-Flow shared sync store
// Pure localStorage bus — no React hooks at module level

const KEYS = {
  EDT:          "umi_edt_seances",
  ATTESTATIONS: "umi_attestations",
  NOTIFS:       "umi_notifs",
};

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}
function writeLS(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  // Notify other tabs
  window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(data) }));
}

// ── Notifications ─────────────────────────────────────────────
export const notifStore = {
  push(userId, notif) {
    const all = readLS(KEYS.NOTIFS);
    const n = { id: Date.now() + Math.random(), userId, lu: false,
      date: new Date().toLocaleString("fr-FR"), ...notif };
    writeLS(KEYS.NOTIFS, [...all, n]);
    return n;
  },
  getFor(userId) {
    return readLS(KEYS.NOTIFS).filter(n => n.userId === userId || n.userId === String(userId));
  },
  markRead(notifId) {
    writeLS(KEYS.NOTIFS, readLS(KEYS.NOTIFS).map(n =>
      n.id === notifId ? { ...n, lu: true } : n));
  },
  markAllRead(userId) {
    writeLS(KEYS.NOTIFS, readLS(KEYS.NOTIFS).map(n =>
      n.userId === userId ? { ...n, lu: true } : n));
  },
};

// ── EDT ───────────────────────────────────────────────────────
export const edtStore = {
  getAll() { return readLS(KEYS.EDT); },
  add(seance, adminNom) {
    const all = readLS(KEYS.EDT);
    const s = { ...seance, id: seance.id || Date.now(), addedBy: adminNom || "Admin" };
    writeLS(KEYS.EDT, [...all, s]);
    // Notify the prof
    notifStore.push("PROF_" + seance.enseignant, {
      type: "edt_update", icon: "🗓️",
      titre: "Nouvelle séance — " + seance.matiere,
      corps: seance.jour + " " + seance.slot + " · " + seance.groupe + " · " + seance.salle,
    });
    return s;
  },
  remove(id, seance, adminNom) {
    writeLS(KEYS.EDT, readLS(KEYS.EDT).filter(s => s.id !== id));
    if (seance) {
      notifStore.push("PROF_" + seance.enseignant, {
        type: "edt_delete", icon: "🗓️",
        titre: "Séance supprimée — " + seance.matiere,
        corps: seance.jour + " " + seance.slot + " · " + seance.groupe,
      });
    }
  },
};

// ── Attestations ──────────────────────────────────────────────
export const attestStore = {
  getAll() { return readLS(KEYS.ATTESTATIONS); },

  submit(attest, demandeur) {
    const all = readLS(KEYS.ATTESTATIONS);
    const ref = "ATT-UMI-" + Math.random().toString(36).slice(2,9).toUpperCase() + "-2025";
    const n = {
      ...attest, id: Date.now(), reference: ref, statut: "en_attente",
      demandeur: (demandeur?.prenom || "") + " " + (demandeur?.nom || ""),
      demandeurId: demandeur?.id || demandeur?.email || "",
      date: new Date().toLocaleDateString("fr-FR"),
    };
    writeLS(KEYS.ATTESTATIONS, [...all, n]);
    // Notify admin scolarité
    notifStore.push("ADMIN_ATTEST", {
      type: "attest_pending", icon: "📋",
      titre: "Attestation a signer — " + n.demandeur,
      corps: (n.type || "") + " · " + (n.motif || "") + ". En attente de signature.",
      action: { label: "Signer", key: "sign_attest_" + n.id },
      attestId: n.id,
    });
    return n;
  },

  sign(attestId, signatureDataUrl, adminUser) {
    const NL = "\n";
    const all = readLS(KEYS.ATTESTATIONS);
    const attest = all.find(a => a.id === attestId);
    if (!attest) return null;

    // Generate PDF
    const ref = attest.reference || "ATT-REF";
    const today = new Date().toLocaleDateString("fr-FR");
    const W = 595, H = 841, mL = 60;
    const esc = str => (str || "").replace(/\\/g,"\\\\").replace(/\(/g,"\\(").replace(/\)/g,"\\)")
      .replace(/[^\x20-\x7E]/g, c => ({"é":"e","è":"e","ê":"e","à":"a","â":"a","ù":"u","û":"u","î":"i","ç":"c","É":"E"}[c] || "?"));

    const bodyLines = [
      "UNIVERSITE MOULAY ISMAIL - MEKNES",
      "================================================",
      "ATTESTATION - " + (attest.type || "").toUpperCase(),
      "================================================",
      "",
      "Reference : " + ref,
      "",
      "Nous soussignes, l'administration de",
      "l'Universite Moulay Ismail, attestons que :",
      "",
      "Beneficiaire : " + (attest.demandeur || attest.nomBeneficiaire || ""),
      "",
      "Motif : " + (attest.motif || ""),
      "",
      "Cette attestation est delivree pour servir",
      "et valoir ce que de droit.",
      "",
      "Emise le : " + today,
      "Signe par : " + (adminUser?.prenom || "") + " " + (adminUser?.nom || ""),
      "",
      "================================================",
      "Verifiable : portail.umi.ac.ma/verif/" + ref,
    ];

    let s = "q 0.12 0.23 0.54 rg 0 " + (H-70) + " " + W + " 70 re f Q" + NL;
    s += "BT /F2 14 Tf 1 1 1 rg " + mL + " " + (H-42) + " Td (UNIVERSITE MOULAY ISMAIL) Tj ET" + NL;
    s += "BT /F1 8 Tf 0.8 0.8 0.8 rg " + (W-160) + " " + (H-38) + " Td (" + esc(ref) + ") Tj ET" + NL;
    s += "BT /F1 10 Tf 0 0 0 rg " + mL + " " + (H-100) + " Td 14 TL" + NL;
    bodyLines.forEach(l => { s += "(" + esc(l) + ") '" + NL; });
    s += "ET" + NL;
    s += "q 0.12 0.23 0.54 rg 0 24 " + W + " 5 re f Q" + NL;
    s += "BT /F1 8 Tf 1 1 1 rg " + mL + " 28 Td (Universite Moulay Ismail - Document officiel) Tj ET" + NL;

    const objs = [];
    const push = x => { objs.push(x); return objs.length; };
    push(""); push("");
    push("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding>>");
    push("<</Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding>>");
    const cId = push("<</Length " + s.length + ">>" + NL + "stream" + NL + s + NL + "endstream");
    const pId = push("<</Type /Page /Parent 2 0 R /MediaBox [0 0 " + W + " " + H + "] /Contents " + cId + " 0 R /Resources <</Font <</F1 3 0 R /F2 4 0 R>>>>>>");
    objs[0] = "<</Type /Catalog /Pages 2 0 R>>";
    objs[1] = "<</Type /Pages /Kids [" + pId + " 0 R] /Count 1>>";

    let out = "%PDF-1.4" + NL;
    const offs = [];
    objs.forEach((o, i) => { offs.push(out.length); out += (i+1) + " 0 obj" + NL + o + NL + "endobj" + NL; });
    const xo = out.length;
    out += "xref" + NL + "0 " + (objs.length+1) + NL + "0000000000 65535 f " + NL;
    offs.forEach(o => { out += String(o).padStart(10,"0") + " 00000 n " + NL; });
    out += "trailer" + NL + "<</Size " + (objs.length+1) + " /Root 1 0 R>>" + NL + "startxref" + NL + xo + NL + "%%EOF";

    const bytes = new Uint8Array(out.length);
    for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
    const pdfBlob = new Blob([bytes], { type: "application/pdf" });
    const pdfUrl  = URL.createObjectURL(pdfBlob);

    const updated = { ...attest, statut: "signee",
      signedBy: (adminUser?.prenom||"") + " " + (adminUser?.nom||""),
      signedAt: today, pdfUrl };

    writeLS(KEYS.ATTESTATIONS, all.map(a => a.id === attestId ? updated : a));

    // Notify sender
    const demandeurId = attest.demandeurId || attest.demandeur;
    notifStore.push(demandeurId, {
      type: "attest_signed", icon: "✅",
      titre: "Attestation signee — " + ref,
      corps: "Votre attestation a ete signee. Cliquez pour telecharger le PDF.",
      action: { label: "Telecharger PDF", key: "dl_" + attestId },
      attestId, pdfUrl,
    });

    return { ...updated, pdfBlob, pdfUrl };
  },

  downloadPdf(attestId) {
    const all = readLS(KEYS.ATTESTATIONS);
    const attest = all.find(a => a.id === attestId);
    if (!attest?.pdfUrl) return false;
    const a = document.createElement("a");
    a.href = attest.pdfUrl;
    a.download = (attest.reference || "attestation") + ".pdf";
    a.click();
    return true;
  },
};

export default { notifStore, edtStore, attestStore };