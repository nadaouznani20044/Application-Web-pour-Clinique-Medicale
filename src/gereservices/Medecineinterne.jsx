import { useState } from "react";
import "../styles/Medecineinterne.css";

const patientsData = [];

const medecins    = ["Tous les médecins", "Dr. A. Fournier", "Dr. J. Chen", "Dr. M. Blanc"];
const pathologies = ["Toutes les pathologies", "Diabète", "Hypertension", "Insuffisance cardiaque", "BPCO", "Insuffisance rénale", "Autre"];
const statuts     = ["Tous les statuts", "hospitalise", "consultation", "suivi", "stable", "decompense"];

const statutLabels = {
  "hospitalise":  { label: "Hospitalisé",    color: "#0369a1", bg: "#f0f9ff" },
  "consultation": { label: "Consultation",   color: "#6d28d9", bg: "#faf5ff" },
  "suivi":        { label: "Suivi régulier", color: "#059669", bg: "#ecfdf5" },
  "stable":       { label: "Stable",         color: "#374151", bg: "#f3f4f6" },
  "decompense":   { label: "Décompensé",     color: "#dc2626", bg: "#fef2f2" },
};

const pathologieConfig = {
  "Diabète":               { icon: "🩸", color: "#b45309", bg: "#fffbeb" },
  "Hypertension":          { icon: "💓", color: "#dc2626", bg: "#fef2f2" },
  "Insuffisance cardiaque":{ icon: "❤️", color: "#be123c", bg: "#fff1f2" },
  "BPCO":                  { icon: "🫁", color: "#0369a1", bg: "#f0f9ff" },
  "Insuffisance rénale":   { icon: "🫘", color: "#6d28d9", bg: "#faf5ff" },
  "Autre":                 { icon: "⚕️",  color: "#374151", bg: "#f3f4f6" },
};

const maladiesChroniques = {
  "Diabète":               ["Glycémie à jeun", "HbA1c", "Fond d'œil annuel", "Bilan rénal", "Neuropathie", "Pied diabétique"],
  "Hypertension":          ["Tension artérielle", "ECG", "Bilan lipidique", "Créatinine", "Fond d'œil", "Échocardiographie"],
  "Insuffisance cardiaque":["BNP / NT-proBNP", "Échocardiographie", "Rx thorax", "Ionogramme", "Poids quotidien", "Diurèse"],
  "BPCO":                  ["EFR / Spirométrie", "Gaz du sang", "Rx thorax", "Oxymétrie", "Tabacologie", "Réhabilitation"],
  "Insuffisance rénale":   ["Créatinine / DFG", "Ionogramme", "Uricémie", "Protéinurie", "Échographie rénale", "Dialyse"],
};

const avatarColors = [
  "#0f4c75", "#1b6ca8", "#0d7377", "#14a085",
  "#1a535c", "#0e6655", "#145a32", "#1a3c6e",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function MedecineInterne() {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedMedecin,  setSelectedMedecin]  = useState("Tous les médecins");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [selectedPath,     setSelectedPath]     = useState("Toutes les pathologies");
  const [selectedStatut,   setSelectedStatut]   = useState("Tous les statuts");
  const [showModal,        setShowModal]        = useState(false);
  const [selectedPatient,  setSelectedPatient]  = useState(null);
  const [activePathTab,    setActivePathTab]    = useState("Diabète");

  const filtered = patientsData.filter((p) => {
    const matchSearch  = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.pathologie.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les médecins"        || p.medecin    === selectedMedecin;
    const matchPath    = selectedPath    === "Toutes les pathologies"   || p.pathologie === selectedPath;
    const matchStatut  = selectedStatut  === "Tous les statuts"         || p.statut     === selectedStatut;
    return matchSearch && matchMedecin && matchPath && matchStatut;
  });

  const openModal  = (p) => { setSelectedPatient(p); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);
  const countBy    = (key, val) => patientsData.filter(p => p[key] === val).length;

  return (
    <>
      <div className="med-wrapper">

        {/* Header */}
        <div className="med-header">
          <div>
            <h1 className="med-title">
              Gestion des Patients : <span>Médecine Interne</span>
              <span className="med-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                Actif
              </span>
            </h1>
            <p className="med-subtitle">Maladies chroniques · Suivi régulier · Patients adultes non chirurgicaux</p>
          </div>
          <button className="med-btn-add" onClick={() => alert("Formulaire d'admission à intégrer")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Admettre un Patient
          </button>
        </div>

        {/* Stats */}
        <div className="med-stats">
          {[
            { label: "Total Patients",    value: patientsData.length,                    cls: "total",  icon: "👤" },
            { label: "Diabète",           value: countBy("pathologie", "Diabète"),        cls: "diab",   icon: "🩸" },
            { label: "Hypertension",      value: countBy("pathologie", "Hypertension"),   cls: "hta",    icon: "💓" },
            { label: "Hospitalisés",      value: countBy("statut",    "hospitalise"),     cls: "hosp",   icon: "🏥" },
            { label: "Suivi régulier",    value: countBy("statut",    "suivi"),           cls: "suivi",  icon: "📅" },
            { label: "Décompensés",       value: countBy("statut",    "decompense"),      cls: "decomp", icon: "⚠️"  },
          ].map((s) => (
            <div key={s.cls} className={`med-stat-card ${s.cls}`}>
              <div className="med-stat-icon">{s.icon}</div>
              <div>
                <div className="med-stat-label">{s.label}</div>
                <div className="med-stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Suivi maladies chroniques */}
        <div className="med-chronic">
          <div className="med-chronic-header">
            <span className="med-chronic-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              Suivi maladies chroniques
            </span>
            <div className="med-path-tabs">
              {Object.keys(maladiesChroniques).map((tab) => {
                const cfg = pathologieConfig[tab] || pathologieConfig["Autre"];
                return (
                  <button
                    key={tab}
                    className={`med-path-tab ${activePathTab === tab ? "active" : ""}`}
                    onClick={() => setActivePathTab(tab)}
                    style={activePathTab === tab ? { background: cfg.color, color: "white", borderColor: cfg.color } : {}}
                  >
                    {cfg.icon} {tab}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="med-chronic-steps">
            {maladiesChroniques[activePathTab].map((step, i) => (
              <div key={i} className="med-chronic-step" style={{ borderColor: (pathologieConfig[activePathTab] || pathologieConfig["Autre"]).color + "33" }}>
                <div className="med-step-dot" style={{ background: (pathologieConfig[activePathTab] || pathologieConfig["Autre"]).color }} />
                <div className="med-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="med-filters">
          <select className="med-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="med-select" value={selectedPath} onChange={(e) => setSelectedPath(e.target.value)}>
            {pathologies.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select className="med-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
            {statuts.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" className="med-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <div className="med-search-wrap">
            <svg className="med-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="med-search"
              placeholder="Rechercher un patient ou pathologie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="med-table-wrap">
          <table className="med-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Âge</th>
                <th>Médecin Référent</th>
                <th>Pathologie Chronique</th>
                <th>Depuis</th>
                <th>Dernier Contrôle</th>
                <th>Prochain RDV</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="med-empty">
                      <div className="med-empty-icon">⚕️</div>
                      <div className="med-empty-title">Aucun patient enregistré</div>
                      <div className="med-empty-sub">Les patients en suivi de médecine interne apparaîtront ici</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const pathCfg = pathologieConfig[p.pathologie] || pathologieConfig["Autre"];
                const statut  = statutLabels[p.statut];
                return (
                  <tr key={p.id} onClick={() => openModal(p)}>
                    <td>
                      <div className="med-patient-cell">
                        <div className="med-avatar" style={{ background: getAvatarColor(p.initiale) }}>
                          {p.initiale}
                        </div>
                        <span className="med-patient-name">{p.nom}</span>
                      </div>
                    </td>
                    <td>{p.age}</td>
                    <td>{p.medecin}</td>
                    <td>
                      <span className="med-path-chip" style={{ background: pathCfg.bg, color: pathCfg.color }}>
                        {pathCfg.icon} {p.pathologie}
                      </span>
                    </td>
                    <td>{p.depuis}</td>
                    <td>{p.dernierControle}</td>
                    <td>
                      <span className="med-rdv-tag">{p.prochainRdv}</span>
                    </td>
                    <td>
                      <span className="med-statut-chip" style={{ background: statut.bg, color: statut.color }}>
                        <span className="med-dot" style={{ background: statut.color }}/>
                        {statut.label}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="med-actions">
                        <button className="med-action-btn view" onClick={() => openModal(p)}>Voir</button>
                        <button className="med-action-btn edit" onClick={() => alert(`Modifier ${p.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="med-footer">
            <span>Affichage de <span className="med-count">{filtered.length}</span> sur <span className="med-count">{patientsData.length}</span> patients</span>
            <span>Médecine Interne — MedGest Connect</span>
          </div>
        </div>

      </div>

      {/* Modal */}
      {showModal && selectedPatient && (
        <div className="med-modal-overlay" onClick={closeModal}>
          <div className="med-modal" onClick={(e) => e.stopPropagation()}>
            <div className="med-modal-header">
              <div className="med-avatar med-modal-avatar" style={{ background: getAvatarColor(selectedPatient.initiale) }}>
                {selectedPatient.initiale}
              </div>
              <div>
                <div className="med-modal-title">{selectedPatient.nom}</div>
                <div className="med-modal-subtitle">Dossier patient — Médecine Interne</div>
              </div>
              <button className="med-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="med-modal-grid">
              {[
                { label: "Âge",                value: selectedPatient.age            },
                { label: "Pathologie",         value: selectedPatient.pathologie     },
                { label: "Médecin Référent",   value: selectedPatient.medecin        },
                { label: "Suivi depuis",       value: selectedPatient.depuis         },
                { label: "Dernier contrôle",   value: selectedPatient.dernierControle},
                { label: "Prochain RDV",       value: selectedPatient.prochainRdv    },
                { label: "Statut",             value: statutLabels[selectedPatient.statut]?.label },
                { label: "Notes",              value: selectedPatient.notes || "—"   },
              ].map((f) => (
                <div key={f.label} className="med-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>
            <div className="med-modal-actions">
              <button className="med-action-btn view med-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="med-action-btn edit med-modal-btn" onClick={() => alert(`Modifier ${selectedPatient.nom}`)}>Modifier le dossier</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}