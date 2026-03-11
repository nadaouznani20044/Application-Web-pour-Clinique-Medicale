import { useState, useEffect } from "react";
import "../styles/Urgence.css";

const urgencesData = [];

const medecins  = ["Tous les mÃ©decins", "Dr. A. Fournier", "Dr. J. Chen", "Dr. M. Blanc"];
const types     = ["Tous les types", "Traumatisme", "Cardiaque", "Respiratoire", "Neurologique", "Autre"];
const triages   = ["Tous les niveaux", "P1", "P2", "P3", "P4"];

const triageConfig = {
  P1: { label: "P1 â€” Critique",       color: "#ffffff", bg: "#dc2626", border: "#b91c1c", desc: "Urgence absolue" },
  P2: { label: "P2 â€” Urgent",         color: "#ffffff", bg: "#f97316", border: "#ea580c", desc: "Urgence relative" },
  P3: { label: "P3 â€” Moins urgent",   color: "#1a202c", bg: "#facc15", border: "#eab308", desc: "Semi-urgent" },
  P4: { label: "P4 â€” Non urgent",     color: "#ffffff", bg: "#22c55e", border: "#16a34a", desc: "Consultation" },
};

const statutLabels = {
  "admission":    { label: "Admission",       color: "#dc2626", bg: "#fef2f2" },
  "evaluation":   { label: "Ã‰valuation",      color: "#f97316", bg: "#fff7ed" },
  "traitement":   { label: "Traitement",      color: "#0369a1", bg: "#f0f9ff" },
  "stabilise":    { label: "StabilisÃ©",       color: "#059669", bg: "#ecfdf5" },
  "transfert":    { label: "Transfert",       color: "#6d28d9", bg: "#faf5ff" },
  "surveillance": { label: "Surveillance",    color: "#b45309", bg: "#fffbeb" },
};

const typeConfig = {
  "Traumatisme":   { icon: "ðŸ©¹", color: "#b45309" },
  "Cardiaque":     { icon: "â¤ï¸", color: "#dc2626" },
  "Respiratoire":  { icon: "ðŸ«", color: "#0369a1" },
  "Neurologique":  { icon: "ðŸ§ ", color: "#6d28d9" },
  "Autre":         { icon: "âš•ï¸",  color: "#374151" },
};

const orientations = [
  "Chirurgie", "MÃ©decine Interne", "Cardiologie", "Neurologie",
  "RÃ©animation", "PÃ©diatrie", "Retour Ã  domicile",
];

const avatarColors = [
  "#b91c1c", "#c2410c", "#b45309", "#15803d",
  "#0369a1", "#6d28d9", "#be123c", "#7e22ce",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
 
}

export default function Urgence() {
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedMedecin, setSelectedMedecin] = useState("Tous les mÃ©decins");
  const [selectedType,    setSelectedType]    = useState("Tous les types");
  const [selectedTriage,  setSelectedTriage]  = useState("Tous les niveaux");
  const [showModal,       setShowModal]       = useState(false);
  const [selectedCase,    setSelectedCase]    = useState(null);

  const filtered = urgencesData.filter((u) => {
    const matchSearch  = u.nom.toLowerCase().includes(searchQuery.toLowerCase()) || u.motif.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les mÃ©decins" || u.medecin === selectedMedecin;
    const matchType    = selectedType    === "Tous les types"    || u.type    === selectedType;
    const matchTriage  = selectedTriage  === "Tous les niveaux"  || u.triage  === selectedTriage;
    return matchSearch && matchMedecin && matchType && matchTriage;
  });

  const openModal  = (u) => { setSelectedCase(u); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);

  const countBy    = (key, val) => urgencesData.filter(u => u[key] === val).length;
  const countTriage = (t) => urgencesData.filter(u => u.triage === t).length;

  return (
    <>
      <div className="urg-wrapper">

        
        <div className="urg-header">
          <div>
            <h1 className="urg-title">
              <span className="urg-pulse">ðŸš¨</span>
              Service des <span>Urgences</span>
              <span className="urg-badge-live">
                <span className="urg-live-dot" />
                EN DIRECT
              </span>
            </h1>
            <p className="urg-subtitle">Admission immÃ©diate Â· Stabilisation Â· Orientation</p>
          </div>
          <div className="urg-header-right">
            <LiveClock />
            <button className="urg-btn-add" onClick={() => alert("Admission urgence Ã  intÃ©grer")}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Admettre en Urgence
            </button>
          </div>
        </div>

        
        <div className="urg-triage-banner">
          <div className="urg-triage-title">TRIAGE â€” NIVEAUX DE PRIORITÃ‰</div>
          <div className="urg-triage-cards">
            {Object.entries(triageConfig).map(([key, cfg]) => (
              <div key={key} className="urg-triage-card" style={{ background: cfg.bg, borderColor: cfg.border }}>
                <div className="urg-triage-code" style={{ color: cfg.color }}>{key}</div>
                <div className="urg-triage-desc" style={{ color: cfg.color }}>{cfg.desc}</div>
                <div className="urg-triage-count" style={{ color: cfg.color }}>{countTriage(key)} cas</div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="urg-stats">
          {[
            { label: "Total Cas",      value: urgencesData.length,                  cls: "total",    icon: "ðŸ“‹" },
            { label: "En Admission",   value: countBy("statut","admission"),         cls: "admit",    icon: "ðŸšª" },
            { label: "En Traitement",  value: countBy("statut","traitement"),        cls: "traite",   icon: "ðŸ’‰" },
            { label: "StabilisÃ©s",     value: countBy("statut","stabilise"),         cls: "stable",   icon: "âœ…" },
            { label: "Transferts",     value: countBy("statut","transfert"),         cls: "transfer", icon: "ðŸ”„" },
            { label: "Critiques P1",   value: countTriage("P1"),                     cls: "critical", icon: "ðŸš¨" },
          ].map((s) => (
            <div key={s.cls} className={`urg-stat-card ${s.cls}`}>
              <div className="urg-stat-icon">{s.icon}</div>
              <div>
                <div className="urg-stat-label">{s.label}</div>
                <div className="urg-stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="urg-filters">
          <select className="urg-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="urg-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {types.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="urg-select" value={selectedTriage} onChange={(e) => setSelectedTriage(e.target.value)}>
            {triages.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="urg-search-wrap">
            <svg className="urg-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="urg-search"
              placeholder="Rechercher un patient ou motif..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="urg-table-wrap">
          <table className="urg-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Ã‚ge</th>
                <th>MÃ©decin</th>
                <th>Triage</th>
                <th>Type</th>
                <th>Motif d'Admission</th>
                <th>Heure ArrivÃ©e</th>
                <th>Statut</th>
                <th>Orientation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="urg-empty">
                      <div className="urg-empty-icon">ðŸš‘</div>
                      <div className="urg-empty-title">Aucun cas en urgence</div>
                      <div className="urg-empty-sub">Les admissions apparaÃ®tront ici en temps rÃ©el</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((u) => {
                const triage  = triageConfig[u.triage];
                const statut  = statutLabels[u.statut];
                const typeCfg = typeConfig[u.type] || typeConfig["Autre"];
                return (
                  <tr key={u.id} className={`urg-row-${u.triage?.toLowerCase()}`} onClick={() => openModal(u)}>
                    <td>
                      <div className="urg-patient-cell">
                        <div className="urg-avatar" style={{ background: getAvatarColor(u.initiale) }}>
                          {u.initiale}
                        </div>
                        <span className="urg-patient-name">{u.nom}</span>
                      </div>
                    </td>
                    <td>{u.age}</td>
                    <td>{u.medecin}</td>
                    <td>
                      <span className="urg-triage-chip" style={{ background: triage.bg, color: triage.color, borderColor: triage.border }}>
                        {u.triage}
                      </span>
                    </td>
                    <td>
                      <span className="urg-type-chip" style={{ color: typeCfg.color }}>
                        {typeCfg.icon} {u.type}
                      </span>
                    </td>
                    <td className="urg-motif">{u.motif}</td>
                    <td className="urg-time">{u.heureArrivee}</td>
                    <td>
                      <span className="urg-statut-chip" style={{ background: statut.bg, color: statut.color }}>
                        <span className="urg-dot" style={{ background: statut.color }} />
                        {statut.label}
                      </span>
                    </td>
                    <td>
                      {u.orientation
                        ? <span className="urg-orient-tag">{u.orientation}</span>
                        : <span className="urg-pending">â€”</span>
                      }
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="urg-actions">
                        <button className="urg-action-btn view" onClick={() => openModal(u)}>Voir</button>
                        <button className="urg-action-btn edit" onClick={() => alert(`Modifier ${u.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="urg-footer">
            <span>Affichage de <span className="urg-count">{filtered.length}</span> sur <span className="urg-count">{urgencesData.length}</span> cas</span>
            <span>Service des Urgences â€” MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedCase && (
        <div className="urg-modal-overlay" onClick={closeModal}>
          <div className="urg-modal" onClick={(e) => e.stopPropagation()}>
            <div className="urg-modal-top" style={{ background: triageConfig[selectedCase.triage]?.bg }}>
              <div className="urg-modal-triage" style={{ color: triageConfig[selectedCase.triage]?.color }}>
                Niveau {selectedCase.triage} â€” {triageConfig[selectedCase.triage]?.desc}
              </div>
            </div>
            <div className="urg-modal-body">
              <div className="urg-modal-header">
                <div className="urg-avatar urg-modal-avatar" style={{ background: getAvatarColor(selectedCase.initiale) }}>
                  {selectedCase.initiale}
                </div>
                <div>
                  <div className="urg-modal-title">{selectedCase.nom}</div>
                  <div className="urg-modal-subtitle">Dossier urgence â€” Admission immÃ©diate</div>
                </div>
                <button className="urg-modal-close" onClick={closeModal}>âœ•</button>
              </div>
              <div className="urg-modal-grid">
                {[
                  { label: "Ã‚ge",             value: selectedCase.age          },
                  { label: "Heure ArrivÃ©e",   value: selectedCase.heureArrivee },
                  { label: "MÃ©decin",         value: selectedCase.medecin      },
                  { label: "Type",            value: selectedCase.type         },
                  { label: "Motif",           value: selectedCase.motif        },
                  { label: "Statut",          value: statutLabels[selectedCase.statut]?.label },
                  { label: "Orientation",     value: selectedCase.orientation || "En attente" },
                  { label: "Notes",           value: selectedCase.notes || "â€”" },
                ].map((f) => (
                  <div key={f.label} className="urg-modal-field">
                    <label>{f.label}</label>
                    <p>{f.value}</p>
                  </div>
                ))}
              </div>
              <div className="urg-modal-actions">
                <button className="urg-action-btn view urg-modal-btn" onClick={closeModal}>Fermer</button>
                <button className="urg-action-btn edit urg-modal-btn" onClick={() => alert(`Modifier ${selectedCase.nom}`)}>Modifier</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
