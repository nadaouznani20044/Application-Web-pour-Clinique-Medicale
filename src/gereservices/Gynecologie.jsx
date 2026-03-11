import { useState } from "react";
import AdmissionPatientModal from "../components/AdmissionPatientModal";
import "../styles/Gynecologie.css";

const patientesData = [
];
const medecins  = ["Tous les mÃ©decins",];
const casTypes  = ["Tous les cas", "grossesse", "echographie", "examen", "postpartum"];

const casTypeLabels = {
  grossesse:   { label: "Grossesse",    color: "#6b21a8", bg: "#faf5ff" },
  echographie: { label: "Ã‰chographie",  color: "#0369a1", bg: "#f0f9ff" },
  examen:      { label: "Examen",       color: "#0f766e", bg: "#f0fdfa" },
  postpartum:  { label: "Post-Partum",  color: "#b45309", bg: "#fffbeb" },
};

const avatarColors = [
  "#7c3aed", "#6d28d9", "#9333ea", "#a855f7",
  "#0891b2", "#0e7490", "#0f766e", "#047857",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function Gynecologie() {
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedMedecin, setSelectedMedecin] = useState("Tous les mÃ©decins");
  const [selectedDate,    setSelectedDate]    = useState("");
  const [selectedCas,     setSelectedCas]     = useState("Tous les cas");
  const [showAdmission,   setShowAdmission]   = useState(false);
  const [showModal,       setShowModal]       = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filtered = patientesData.filter((p) => {
    const matchSearch  = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.motif.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les mÃ©decins" || p.medecin === selectedMedecin;
    const matchCas     = selectedCas     === "Tous les cas"      || p.casType === selectedCas;
    return matchSearch && matchMedecin && matchCas;
  });

  const openModal  = (p) => { setSelectedPatient(p); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);

  return (
    <>
      <div className="gyn-wrapper">

        
        <div className="gyn-header">
          <h1 className="gyn-title">
            Gestion de Patientes : <span>Service de GynÃ©cologie</span>
            <span className="gyn-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
              Actif
            </span>
          </h1>
          <button className="gyn-btn-add" onClick={() => setShowAdmission(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Admettre une Patiente
          </button>
        </div>

        
        <div className="gyn-stats">
          {[
            { label: "Total Patientes",  value: patientesData.length,                                          cls: "total"      },
            { label: "Grossesses",       value: patientesData.filter(p => p.casType === "grossesse").length,   cls: "grossesse"  },
            { label: "Ã‰chographies",     value: patientesData.filter(p => p.casType === "echographie").length, cls: "echographie"},
            { label: "Post-Partum",      value: patientesData.filter(p => p.casType === "postpartum").length,  cls: "postpartum" },
          ].map((s) => (
            <div key={s.cls} className={`gyn-stat-card ${s.cls}`}>
              <div className="gyn-stat-label">{s.label}</div>
              <div className="gyn-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        
        <div className="gyn-filters">
          <select className="gyn-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <input type="date" className="gyn-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <select className="gyn-select" value={selectedCas} onChange={(e) => setSelectedCas(e.target.value)}>
            {casTypes.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="gyn-search-wrap">
            <svg className="gyn-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="gyn-search"
              placeholder="Rechercher une patiente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="gyn-table-wrap">
          <table className="gyn-table">
            <thead>
              <tr>
                <th>Nom du patient</th>
                <th>Date de Naissance / Ã‚ge</th>
                <th>MÃ©decin AssignÃ©</th>
                <th>Type d'Examen / Cas</th>
                <th>DÃ©tails SpÃ©cifiques</th>
                <th>Date d'admission</th>
                <th>Cas TraitÃ© / Motif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="gyn-empty">
                      <div className="gyn-empty-icon">ðŸ”</div>
                      <div>Aucune patiente trouvÃ©e</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const chip = casTypeLabels[p.casType];
                return (
                  <tr key={p.id} onClick={() => openModal(p)}>
                    <td>
                      <div className="gyn-patient-cell">
                        <div className="gyn-avatar" style={{ background: getAvatarColor(p.initiale) }}>
                          {p.initiale}
                        </div>
                        <span className="gyn-patient-name">{p.nom}</span>
                      </div>
                    </td>
                    <td>{p.age}</td>
                    <td>{p.medecin}</td>
                    <td>{p.typeExamen}</td>
                    <td>
                      <span className="gyn-detail-tag">{p.details}</span>
                    </td>
                    <td>{p.dateAdmission}</td>
                    <td>
                      <span className="gyn-cas-chip" style={{ background: chip.bg, color: chip.color }}>
                        <span className="gyn-dot" style={{ background: chip.color }} />
                        {p.motif}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="gyn-actions">
                        <button className="gyn-action-btn view" onClick={() => openModal(p)}>Voir</button>
                        <button className="gyn-action-btn edit" onClick={() => alert(`Modifier ${p.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="gyn-footer">
            <span>Affichage de <span className="gyn-count">{filtered.length}</span> sur <span className="gyn-count">{patientesData.length}</span> patientes</span>
            <span>Service de GynÃ©cologie â€” MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedPatient && (
        <div className="gyn-modal-overlay" onClick={closeModal}>
          <div className="gyn-modal" onClick={(e) => e.stopPropagation()}>
            <div className="gyn-modal-header">
              <div className="gyn-avatar gyn-modal-avatar" style={{ background: getAvatarColor(selectedPatient.initiale) }}>
                {selectedPatient.initiale}
              </div>
              <div>
                <div className="gyn-modal-title">{selectedPatient.nom}</div>
                <div className="gyn-modal-subtitle">Dossier patiente â€” GynÃ©cologie</div>
              </div>
              <button className="gyn-modal-close" onClick={closeModal}>âœ•</button>
            </div>

            <div className="gyn-modal-grid">
              {[
                { label: "Ã‚ge",                value: selectedPatient.age           },
                { label: "Date d'admission",      value: selectedPatient.dateAdmission },
                { label: "MÃ©decin AssignÃ©",     value: selectedPatient.medecin       },
                { label: "Type d'Examen",       value: selectedPatient.typeExamen    },
                { label: "DÃ©tails SpÃ©cifiques", value: selectedPatient.details       },
                { label: "Motif / Cas",         value: selectedPatient.motif         },
              ].map((f) => (
                <div key={f.label} className="gyn-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>

            <div className="gyn-modal-actions">
              <button className="gyn-action-btn view gyn-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="gyn-action-btn edit gyn-modal-btn" onClick={() => alert(`Modifier ${selectedPatient.nom}`)}>Modifier le dossier</button>
            </div>
          </div>
        </div>
      )}

      <AdmissionPatientModal
        isOpen={showAdmission}
        onClose={() => setShowAdmission(false)}
        defaultService="gynecologie"
      />
    </>
  );
}


