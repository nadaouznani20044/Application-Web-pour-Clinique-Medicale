import { useState } from "react";
import "../styles/Chirurgie.css";

const operationsData = [];

const medecins      = ["Tous les chirurgiens", "Dr. A. Fournier", "Dr. J. Chen", "Dr. M. Blanc", "Dr. S. Karim"];
const specialites   = ["Toutes les spÃ©cialitÃ©s", "OrthopÃ©die", "GÃ©nÃ©rale", "Cardiaque", "Neurologique", "Plastique"];
const statuts       = ["Tous les statuts", "preparation", "programmee", "en-cours", "post-op", "recuperation", "urgent"];
const salles        = ["Toutes les salles", "Salle 1", "Salle 2", "Salle 3", "Salle 4"];

const statutLabels = {
  "preparation":  { label: "PrÃ©paration",   color: "#0369a1", bg: "#f0f9ff" },
  "programmee":   { label: "ProgrammÃ©e",    color: "#6d28d9", bg: "#faf5ff" },
  "en-cours":     { label: "En cours",      color: "#059669", bg: "#ecfdf5" },
  "post-op":      { label: "Post-opÃ©ratoire", color: "#b45309", bg: "#fffbeb" },
  "recuperation": { label: "RÃ©cupÃ©ration",  color: "#0e7490", bg: "#ecfeff" },
  "urgent":       { label: "Urgent",        color: "#dc2626", bg: "#fef2f2" },
};

const specialiteConfig = {
  "OrthopÃ©die":    { icon: "ðŸ¦´", color: "#0369a1", bg: "#f0f9ff" },
  "GÃ©nÃ©rale":      { icon: "ðŸ¥", color: "#059669", bg: "#ecfdf5" },
  "Cardiaque":     { icon: "â¤ï¸", color: "#dc2626", bg: "#fef2f2" },
  "Neurologique":  { icon: "ðŸ§ ", color: "#6d28d9", bg: "#faf5ff" },
  "Plastique":     { icon: "âœ¨", color: "#b45309", bg: "#fffbeb" },
};

const avatarColors = [
  "#374151", "#1f2937", "#111827", "#1e3a5f",
  "#1a1a2e", "#16213e", "#0f3460", "#2d3561",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function Chirurgie() {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedMedecin,  setSelectedMedecin]  = useState("Tous les chirurgiens");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [selectedSpec,     setSelectedSpec]     = useState("Toutes les spÃ©cialitÃ©s");
  const [selectedStatut,   setSelectedStatut]   = useState("Tous les statuts");
  const [selectedSalle,    setSelectedSalle]    = useState("Toutes les salles");
  const [showModal,        setShowModal]        = useState(false);
  const [selectedOp,       setSelectedOp]       = useState(null);
  const [activePhase,      setActivePhase]      = useState("preparation");

  const filtered = operationsData.filter((o) => {
    const matchSearch  = o.nom.toLowerCase().includes(searchQuery.toLowerCase()) || o.typeOp.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les chirurgiens"     || o.chirurgien  === selectedMedecin;
    const matchSpec    = selectedSpec    === "Toutes les spÃ©cialitÃ©s"   || o.specialite  === selectedSpec;
    const matchStatut  = selectedStatut  === "Tous les statuts"         || o.statut      === selectedStatut;
    const matchSalle   = selectedSalle   === "Toutes les salles"        || o.salle       === selectedSalle;
    return matchSearch && matchMedecin && matchSpec && matchStatut && matchSalle;
  });

  const openModal  = (o) => { setSelectedOp(o); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);

  const countBy = (key, val) => operationsData.filter(o => o[key] === val).length;

  const phases = [
    {
      key: "preparation",
      label: "PrÃ©-opÃ©ratoire",
      icon: "ðŸ“‹",
      steps: ["Bilan prÃ©opÃ©ratoire complet", "Consultation anesthÃ©siste", "JeÃ»ne 6â€“8h avant", "DÃ©pilation et antisepsie", "Pose de voie veineuse", "PrÃ©mÃ©dication si prescrite"],
    },
    {
      key: "operation",
      label: "Bloc opÃ©ratoire",
      icon: "ðŸ”ª",
      steps: ["Installation en salle d'opÃ©ration", "AnesthÃ©sie gÃ©nÃ©rale / locale", "Intervention chirurgicale", "ContrÃ´le hÃ©mostatique", "Fermeture et sutures", "RÃ©veil en SSPI"],
    },
    {
      key: "postop",
      label: "Post-opÃ©ratoire",
      icon: "ðŸ©¹",
      steps: ["Surveillance paramÃ¨tres vitaux", "Gestion de la douleur", "Soins de la plaie opÃ©ratoire", "KinÃ©sithÃ©rapie prÃ©coce", "Suivi biologique", "Planification sortie / transfert"],
    },
  ];

  return (
    <>
      <div className="chi-wrapper">

        
        <div className="chi-header">
          <div>
            <h1 className="chi-title">
              Gestion des OpÃ©rations : <span>Service de Chirurgie</span>
              <span className="chi-badge">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
                Actif
              </span>
            </h1>
            <p className="chi-subtitle">PrÃ©paration Â· Bloc opÃ©ratoire Â· Suivi post-opÃ©ratoire</p>
          </div>
          <button className="chi-btn-add" onClick={() => alert("Formulaire d'opÃ©ration Ã  intÃ©grer")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Planifier une OpÃ©ration
          </button>
        </div>

        
        <div className="chi-stats">
          {[
            { label: "Total OpÃ©rations",  value: operationsData.length,                   cls: "total",   icon: "ðŸ¥" },
            { label: "ProgrammÃ©es",       value: countBy("statut", "programmee"),          cls: "prog",    icon: "ðŸ“…" },
            { label: "En cours",          value: countBy("statut", "en-cours"),            cls: "encours", icon: "âš¡" },
            { label: "Post-opÃ©ratoire",   value: countBy("statut", "post-op"),             cls: "postop",  icon: "ðŸ©¹" },
            { label: "RÃ©cupÃ©ration",      value: countBy("statut", "recuperation"),        cls: "recup",   icon: "ðŸ’Š" },
            { label: "Urgents",           value: countBy("statut", "urgent"),              cls: "urgent",  icon: "ðŸš¨" },
          ].map((s) => (
            <div key={s.cls} className={`chi-stat-card ${s.cls}`}>
              <div className="chi-stat-icon">{s.icon}</div>
              <div>
                <div className="chi-stat-label">{s.label}</div>
                <div className="chi-stat-value">{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        
        <div className="chi-salles">
          <div className="chi-salles-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M12 6v6"/></svg>
            Salles d'opÃ©ration
          </div>
          <div className="chi-salles-grid">
            {["Salle 1", "Salle 2", "Salle 3", "Salle 4"].map((salle) => {
              const occupied = operationsData.filter(o => o.salle === salle && o.statut === "en-cours").length > 0;
              return (
                <div key={salle} className={`chi-salle-card ${occupied ? "occupied" : "libre"}`}>
                  <div className="chi-salle-name">{salle}</div>
                  <div className="chi-salle-status">{occupied ? "âš¡ OccupÃ©e" : "âœ… Libre"}</div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="chi-protocole">
          <div className="chi-protocole-header">
            <span className="chi-protocole-title">Protocole chirurgical</span>
            <div className="chi-phase-tabs">
              {phases.map((p) => (
                <button
                  key={p.key}
                  className={`chi-phase-tab ${activePhase === p.key ? "active" : ""}`}
                  onClick={() => setActivePhase(p.key)}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="chi-steps">
            {phases.find(p => p.key === activePhase)?.steps.map((step, i) => (
              <div key={i} className="chi-step">
                <div className="chi-step-num">{i + 1}</div>
                <div className="chi-step-text">{step}</div>
              </div>
            ))}
          </div>
        </div>

        
        <div className="chi-filters">
          <select className="chi-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="chi-select" value={selectedSpec} onChange={(e) => setSelectedSpec(e.target.value)}>
            {specialites.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="chi-select" value={selectedSalle} onChange={(e) => setSelectedSalle(e.target.value)}>
            {salles.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select className="chi-select" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
            {statuts.map((s) => <option key={s}>{s}</option>)}
          </select>
          <input type="date" className="chi-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <div className="chi-search-wrap">
            <svg className="chi-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="chi-search"
              placeholder="Rechercher un patient ou opÃ©ration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="chi-table-wrap">
          <table className="chi-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Ã‚ge</th>
                <th>Chirurgien</th>
                <th>SpÃ©cialitÃ©</th>
                <th>Type d'OpÃ©ration</th>
                <th>Salle</th>
                <th>Date / Heure</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="chi-empty">
                      <div className="chi-empty-icon">ðŸ¥</div>
                      <div className="chi-empty-title">Aucune opÃ©ration planifiÃ©e</div>
                      <div className="chi-empty-sub">Les interventions chirurgicales apparaÃ®tront ici</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((o) => {
                const chip    = statutLabels[o.statut];
                const specCfg = specialiteConfig[o.specialite];
                return (
                  <tr key={o.id} onClick={() => openModal(o)}>
                    <td>
                      <div className="chi-patient-cell">
                        <div className="chi-avatar" style={{ background: getAvatarColor(o.initiale) }}>
                          {o.initiale}
                        </div>
                        <span className="chi-patient-name">{o.nom}</span>
                      </div>
                    </td>
                    <td>{o.age}</td>
                    <td>{o.chirurgien}</td>
                    <td>
                      <span className="chi-spec-chip" style={{ background: specCfg?.bg, color: specCfg?.color }}>
                        {specCfg?.icon} {o.specialite}
                      </span>
                    </td>
                    <td>{o.typeOp}</td>
                    <td><span className="chi-salle-tag">{o.salle}</span></td>
                    <td>{o.dateHeure}</td>
                    <td>
                      <span className="chi-statut-chip" style={{ background: chip.bg, color: chip.color }}>
                        <span className="chi-dot" style={{ background: chip.color }} />
                        {chip.label}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="chi-actions">
                        <button className="chi-action-btn view" onClick={() => openModal(o)}>Voir</button>
                        <button className="chi-action-btn edit" onClick={() => alert(`Modifier ${o.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="chi-footer">
            <span>Affichage de <span className="chi-count">{filtered.length}</span> sur <span className="chi-count">{operationsData.length}</span> opÃ©rations</span>
            <span>Service de Chirurgie â€” MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedOp && (
        <div className="chi-modal-overlay" onClick={closeModal}>
          <div className="chi-modal" onClick={(e) => e.stopPropagation()}>
            <div className="chi-modal-header">
              <div className="chi-avatar chi-modal-avatar" style={{ background: getAvatarColor(selectedOp.initiale) }}>
                {selectedOp.initiale}
              </div>
              <div>
                <div className="chi-modal-title">{selectedOp.nom}</div>
                <div className="chi-modal-subtitle">Dossier opÃ©ratoire â€” Chirurgie</div>
              </div>
              <button className="chi-modal-close" onClick={closeModal}>âœ•</button>
            </div>
            <div className="chi-modal-grid">
              {[
                { label: "Ã‚ge",              value: selectedOp.age        },
                { label: "Date / Heure",     value: selectedOp.dateHeure  },
                { label: "Chirurgien",       value: selectedOp.chirurgien },
                { label: "SpÃ©cialitÃ©",       value: selectedOp.specialite },
                { label: "Type d'OpÃ©ration", value: selectedOp.typeOp     },
                { label: "Salle",            value: selectedOp.salle      },
                { label: "Statut",           value: statutLabels[selectedOp.statut]?.label },
                { label: "Notes",            value: selectedOp.notes || "â€”" },
              ].map((f) => (
                <div key={f.label} className="chi-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>
            <div className="chi-modal-actions">
              <button className="chi-action-btn view chi-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="chi-action-btn edit chi-modal-btn" onClick={() => alert(`Modifier ${selectedOp.nom}`)}>Modifier le dossier</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
