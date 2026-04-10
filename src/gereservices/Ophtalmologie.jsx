import { useState } from "react";
import AdmissionPatientModal from "../components/AdmissionPatientModal";
import "../styles/Ophtalmologie.css";

const patientsData = [];

const medecins  = ["Tous les médecins"];
const casTypes  = ["Tous les cas", "examen", "traitement", "chirurgie", "depistage"];

const casTypeLabels = {
  examen:     { label: "Examen",      color: "#0f766e", bg: "#f0fdfa" },
  traitement: { label: "Traitement",  color: "#0f766e", bg: "#f0fdfa" },
  chirurgie:  { label: "Chirurgie",   color: "#b45309", bg: "#fffbeb" },
  depistage:  { label: "Dépistage",   color: "#6d28d9", bg: "#faf5ff" },
};

const avatarColors = [
  "#0f766e", "#0d9488", "#14b8a6", "#5eead4",
  "#047857", "#065f46", "#1e40af", "#3730a3",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function Ophtalmologie() {
  const [searchQuery,     setSearchQuery]     = useState("");
  const [selectedMedecin, setSelectedMedecin] = useState("Tous les médecins");
  const [selectedDate,    setSelectedDate]    = useState("");
  const [selectedCas,     setSelectedCas]     = useState("Tous les cas");
  const [showAdmission,    setShowAdmission]    = useState(false);
  const [showModal,       setShowModal]       = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filtered = patientsData.filter((p) => {
    const matchSearch  = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.motif.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin = selectedMedecin === "Tous les médecins" || p.medecin === selectedMedecin;
    const matchCas     = selectedCas     === "Tous les cas"      || p.casType === selectedCas;
    return matchSearch && matchMedecin && matchCas;
  });

  const openModal  = (p) => { setSelectedPatient(p); setShowModal(true); };
  const closeModal = ()  => setShowModal(false);

  return (
    <>
      <div className="oph-wrapper">

        
        <div className="oph-header">
          <h1 className="oph-title">
            Gestion de Patients : <span>Service d'Ophtalmologie</span>
            <span className="oph-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
              Actif
            </span>
          </h1>
          <button className="oph-btn-add" onClick={() => setShowAdmission(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Admettre un Patient
          </button>
        </div>

        
        <div className="oph-stats">
          {[
            { label: "Total Patients", value: patientsData.length,                                          cls: "total"     },
            { label: "Examens",        value: patientsData.filter(p => p.casType === "examen").length,      cls: "examen"    },
            { label: "Traitements",    value: patientsData.filter(p => p.casType === "traitement").length,  cls: "traitement"},
            { label: "Chirurgies",     value: patientsData.filter(p => p.casType === "chirurgie").length,   cls: "chirurgie" },
          ].map((s) => (
            <div key={s.cls} className={`oph-stat-card ${s.cls}`}>
              <div className="oph-stat-label">{s.label}</div>
              <div className="oph-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        
        <div className="oph-filters">
          <select className="oph-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <input type="date" className="oph-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <select className="oph-select" value={selectedCas} onChange={(e) => setSelectedCas(e.target.value)}>
            {casTypes.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="oph-search-wrap">
            <svg className="oph-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="oph-search"
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="oph-table-wrap">
          <table className="oph-table">
            <thead>
              <tr>
                <th>Nom du patient</th>
                <th>Date de Naissance / Âge</th>
                <th>Médecin Assigné</th>
                <th>Type d'Examen / Cas</th>
                <th>Résultats Clés / Dét.</th>
                <th>Date d'admission</th>
                <th>Cas Traité / Motif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="oph-empty">
                      <div className="oph-empty-icon">👁️</div>
                      <div>Aucun patient enregistré</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((p) => {
                const chip = casTypeLabels[p.casType];
                return (
                  <tr key={p.id} onClick={() => openModal(p)}>
                    <td>
                      <div className="oph-patient-cell">
                        <div className="oph-avatar" style={{ background: getAvatarColor(p.initiale) }}>
                          {p.initiale}
                        </div>
                        <span className="oph-patient-name">{p.nom}</span>
                      </div>
                    </td>
                    <td>{p.age}</td>
                    <td>{p.medecin}</td>
                    <td>{p.typeExamen}</td>
                    <td><span className="oph-detail-tag">{p.details}</span></td>
                    <td>{p.dateAdmission}</td>
                    <td>
                      <span className="oph-cas-chip" style={{ background: chip.bg, color: chip.color }}>
                        <span className="oph-dot" style={{ background: chip.color }} />
                        {p.motif}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="oph-actions">
                        <button className="oph-action-btn view" onClick={() => openModal(p)}>Voir</button>
                        <button className="oph-action-btn edit" onClick={() => alert(`Modifier ${p.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="oph-footer">
            <span>Affichage de <span className="oph-count">{filtered.length}</span> sur <span className="oph-count">{patientsData.length}</span> patients</span>
            <span>Service d'Ophtalmologie — MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedPatient && (
        <div className="oph-modal-overlay" onClick={closeModal}>
          <div className="oph-modal" onClick={(e) => e.stopPropagation()}>
            <div className="oph-modal-header">
              <div className="oph-avatar oph-modal-avatar" style={{ background: getAvatarColor(selectedPatient.initiale) }}>
                {selectedPatient.initiale}
              </div>
              <div>
                <div className="oph-modal-title">{selectedPatient.nom}</div>
                <div className="oph-modal-subtitle">Dossier patient — Ophtalmologie</div>
              </div>
              <button className="oph-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="oph-modal-grid">
              {[
                { label: "Âge",                 value: selectedPatient.age           },
                { label: "Date d'admission",       value: selectedPatient.dateAdmission },
                { label: "Médecin Assigné",      value: selectedPatient.medecin       },
                { label: "Type d'Examen",        value: selectedPatient.typeExamen    },
                { label: "Résultats / Détails",  value: selectedPatient.details       },
                { label: "Motif / Cas",          value: selectedPatient.motif         },
              ].map((f) => (
                <div key={f.label} className="oph-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>

            <div className="oph-modal-actions">
              <button className="oph-action-btn view oph-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="oph-action-btn edit oph-modal-btn" onClick={() => alert(`Modifier ${selectedPatient.nom}`)}>Modifier le dossier</button>
            </div>
          </div>
        </div>
      )}

      <AdmissionPatientModal
        isOpen={showAdmission}
        onClose={() => setShowAdmission(false)}
        defaultService="Ophtalmologie"
      />
    </>
  );
}


