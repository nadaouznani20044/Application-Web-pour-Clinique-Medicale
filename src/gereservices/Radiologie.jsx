import { useState } from "react";
import "../styles/Radiologie.css";

const examensData = [];

const medecins   = ["Tous les mÃ©decins", "Dr. A. Fournier", "Dr. J. Chen", "Dr. M. Blanc"];
const typeImages  = ["Tous les types", "Radio", "Scanner", "IRM", "Ã‰chographie"];
const statuts     = ["Tous les statuts", "en-attente", "en-cours", "termine", "urgent"];

const statutLabels = {
  "en-attente": { label: "En attente",  color: "#b45309", bg: "#fffbeb" },
  "en-cours":   { label: "En cours",    color: "#0369a1", bg: "#f0f9ff" },
  "termine":    { label: "TerminÃ©",     color: "#047857", bg: "#f0fdf4" },
  "urgent":     { label: "Urgent",      color: "#dc2626", bg: "#fef2f2" },
};

const typeImageIcons = {
  "Radio":        "ðŸ©»",
  "Scanner":      "ðŸ–¥ï¸",
  "IRM":          "ðŸ§²",
  "Ã‰chographie":  "ðŸ“¡",
};

const avatarColors = [
  "#0f4c75", "#1b6ca8", "#163a59", "#0d7377",
  "#14a085", "#1a535c", "#0e6655", "#145a32",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function Radiologie() {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedMedecin,  setSelectedMedecin]  = useState("Tous les mÃ©decins");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [selectedType,     setSelectedType]     = useState("Tous les types");
  const [selectedStatut,   setSelectedStatut]   = useState("Tous les statuts");
  const [showModal,        setShowModal]        = useState(false);
  const [selectedExamen,   setSelectedExamen]   = useState(null);

  const filtered = examensData.filter((e) => {
    const matchSearch  = e.nom.toLowerCase().includes(searchQuery.toLowerCase()) || e.typeExamen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les mÃ©decins" || e.medecin === selectedMedecin;
    const matchType    = selectedType    === "Tous les types"    || e.typeImage === selectedType;
    const matchStatut  = selectedStatut  === "Tous les statuts"  || e.statut === selectedStatut;
    return matchSearch && matchMedecin && matchType && matchStatut;
  });

  const openModal  = (e) => { setSelectedExamen(e); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);

  const countBy = (key, val) => examensData.filter(e => e[key] === val).length;

  return (
    <>
      <div className="rad-wrapper">

        
        <div className="rad-header">
          <div>
            <h1 className="rad-title">
              Gestion des Examens : <span>Service de Radiologie</span>
              <span className="rad-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                Actif
              </span>
            </h1>
            <p className="rad-subtitle">Imagerie mÃ©dicale â€” Diagnostic prÃ©-consultation & hospitalisation</p>
          </div>
          <button className="rad-btn-add" onClick={() => alert("Formulaire d'examen Ã  intÃ©grer")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvel Examen
          </button>
        </div>

        
        <div className="rad-stats">
          {[
            { label: "Total Examens",  value: examensData.length,              cls: "total",  icon: "ðŸ“‹" },
            { label: "Radio",          value: countBy("typeImage", "Radio"),    cls: "radio",  icon: "ðŸ©»" },
            { label: "Scanner",        value: countBy("typeImage", "Scanner"),  cls: "scanner",icon: "ðŸ–¥ï¸" },
            { label: "IRM",            value: countBy("typeImage", "IRM"),      cls: "irm",    icon: "ðŸ§²" },
            { label: "Ã‰chographie",    value: countBy("typeImage","Ã‰chographie"),cls:"echo",   icon: "ðŸ“¡" },
          ].map((s) => (
            <div key={s.cls} className={`rad-stat-card ${s.cls}`}>
              <div className="rad-stat-icon">{s.icon}</div>
              <div>
                <div className="rad-stat-label">{s.label}</div>
                <div className="rad-stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="rad-filters">
          <select className="rad-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="rad-select" value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            {typeImages.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select className="rad-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
            {statuts.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" className="rad-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <div className="rad-search-wrap">
            <svg className="rad-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="rad-search"
              placeholder="Rechercher un patient ou examen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="rad-table-wrap">
          <table className="rad-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Ã‚ge</th>
                <th>MÃ©decin Prescripteur</th>
                <th>Type d'Imagerie</th>
                <th>Zone / Organe</th>
                <th>Date Examen</th>
                <th>RÃ©sultat PrÃ©liminaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="rad-empty">
                      <div className="rad-empty-icon">ðŸ©»</div>
                      <div className="rad-empty-title">Aucun examen enregistrÃ©</div>
                      <div className="rad-empty-sub">Les examens d'imagerie apparaÃ®tront ici</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((e) => {
                const chip = statutLabels[e.statut];
                return (
                  <tr key={e.id} onClick={() => openModal(e)}>
                    <td>
                      <div className="rad-patient-cell">
                        <div className="rad-avatar" style={{ background: getAvatarColor(e.initiale) }}>
                          {e.initiale}
                        </div>
                        <span className="rad-patient-name">{e.nom}</span>
                      </div>
                    </td>
                    <td>{e.age}</td>
                    <td>{e.medecin}</td>
                    <td>
                      <span className="rad-type-chip">
                        {typeImageIcons[e.typeImage]} {e.typeImage}
                      </span>
                    </td>
                    <td>{e.zone}</td>
                    <td>{e.dateExamen}</td>
                    <td className="rad-resultat">{e.resultat || <span className="rad-pending">â€”</span>}</td>
                    <td>
                      <span className="rad-statut-chip" style={{ background: chip.bg, color: chip.color }}>
                        <span className="rad-dot" style={{ background: chip.color }} />
                        {chip.label}
                      </span>
                    </td>
                    <td onClick={(ev) => ev.stopPropagation()}>
                      <div className="rad-actions">
                        <button className="rad-action-btn view" onClick={() => openModal(e)}>Voir</button>
                        <button className="rad-action-btn edit" onClick={() => alert(`Modifier ${e.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="rad-footer">
            <span>Affichage de <span className="rad-count">{filtered.length}</span> sur <span className="rad-count">{examensData.length}</span> examens</span>
            <span>Service de Radiologie â€” MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedExamen && (
        <div className="rad-modal-overlay" onClick={closeModal}>
          <div className="rad-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rad-modal-header">
              <div className="rad-avatar rad-modal-avatar" style={{ background: getAvatarColor(selectedExamen.initiale) }}>
                {selectedExamen.initiale}
              </div>
              <div>
                <div className="rad-modal-title">{selectedExamen.nom}</div>
                <div className="rad-modal-subtitle">Dossier imagerie â€” Radiologie</div>
              </div>
              <button className="rad-modal-close" onClick={closeModal}>âœ•</button>
            </div>

            <div className="rad-modal-grid">
              {[
                { label: "Ã‚ge",                  value: selectedExamen.age        },
                { label: "Date Examen",           value: selectedExamen.dateExamen },
                { label: "MÃ©decin Prescripteur",  value: selectedExamen.medecin    },
                { label: "Type d'Imagerie",       value: selectedExamen.typeImage  },
                { label: "Zone / Organe",         value: selectedExamen.zone       },
                { label: "RÃ©sultat PrÃ©liminaire", value: selectedExamen.resultat || "En attente" },
              ].map((f) => (
                <div key={f.label} className="rad-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>

            <div className="rad-modal-actions">
              <button className="rad-action-btn view rad-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="rad-action-btn edit rad-modal-btn" onClick={() => alert(`Modifier ${selectedExamen.nom}`)}>Modifier le dossier</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
