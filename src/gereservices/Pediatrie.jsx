import { useState } from "react";
import AdmissionPatientModal from "../components/AdmissionPatientModal";
import "../styles/Pediatrie.css";

const patientsData = [

];

const medecins = ["Tous les médecins"];
const casTypes  = ["Tous les cas", "urgent", "suivi", "chirurgie", "vaccin"];

const casTypeLabels = {
  urgent:    { label: "Urgent",    color: "#e53e3e", bg: "#fff5f5" },
  suivi:     { label: "Suivi",     color: "#2b6cb0", bg: "#ebf8ff" },
  chirurgie: { label: "Chirurgie", color: "#744210", bg: "#fffaf0" },
  vaccin:    { label: "Vaccin",    color: "#276749", bg: "#f0fff4" },
};

const avatarColors = [
  "#2D6A4F", "#1B4332", "#40916C", "#52B788",
  "#1A535C", "#4CC9F0", "#2B6CB0", "#553C9A",
];

function getAvatarColor(name) {
  return avatarColors[name.charCodeAt(0) % avatarColors.length];
}

export default function Pediatrie() {
  const [searchQuery,      setSearchQuery]      = useState("");
  const [selectedMedecin,  setSelectedMedecin]  = useState("Tous les médecins");
  const [selectedDate,     setSelectedDate]     = useState("");
  const [selectedCas,      setSelectedCas]      = useState("Tous les cas");
  const [showAdmission,    setShowAdmission]    = useState(false);
  const [showModal,        setShowModal]        = useState(false);
  const [selectedPatient,  setSelectedPatient]  = useState(null);

  const filtered = patientsData.filter((p) => {
    const matchSearch   = p.nom.toLowerCase().includes(searchQuery.toLowerCase()) || p.cas.toLowerCase().includes(searchQuery.toLowerCase());
    const matchMedecin  = selectedMedecin === "Tous les médecins" || p.medecin === selectedMedecin;
    const matchCas      = selectedCas     === "Tous les cas"      || p.casType === selectedCas;
    return matchSearch && matchMedecin && matchCas;
  });

  const openModal  = (patient) => { setSelectedPatient(patient); setShowModal(true);  };
  const closeModal = ()        => setShowModal(false);

  return (
    <>
      <div className="ped-wrapper">

        
        <div className="ped-header">
          <h1 className="ped-title">
            Gestion de Patients : <span>Service de Pédiatrie</span>
            <span className="ped-badge">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /></svg>
              Actif
            </span>
          </h1>
          <button className="ped-btn-add" onClick={() => setShowAdmission(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Admettre un Patient
          </button>
        </div>

        
        <div className="ped-stats">
          {[
            { label: "Total Patients", value: patientsData.length,                                     cls: "total"  },
            { label: "Cas Urgents",    value: patientsData.filter(p => p.casType === "urgent").length,  cls: "urgent" },
            { label: "En Suivi",       value: patientsData.filter(p => p.casType === "suivi").length,   cls: "suivi"  },
            { label: "Vaccinations",   value: patientsData.filter(p => p.casType === "vaccin").length,  cls: "vaccin" },
          ].map((s) => (
            <div key={s.cls} className={`ped-stat-card ${s.cls}`}>
              <div className="ped-stat-label">{s.label}</div>
              <div className="ped-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        
        <div className="ped-filters">
          <select className="ped-select" value={selectedMedecin} onChange={(e) => setSelectedMedecin(e.target.value)}>
            {medecins.map((m) => <option key={m}>{m}</option>)}
          </select>
          <input type="date" className="ped-select" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          <select className="ped-select" value={selectedCas} onChange={(e) => setSelectedCas(e.target.value)}>
            {casTypes.map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="ped-search-wrap">
            <svg className="ped-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="ped-search"
              placeholder="Rechercher un patient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        
        <div className="ped-table-wrap">
          <table className="ped-table">
            <thead>
              <tr>
                <th>Nom du patient</th>
                <th>Date de Naissance / Âge</th>
                <th>Médecin Assigné</th>
                <th>Infirmier Référent</th>
                <th>Date d'admission</th>
                <th>Cas Traité / Motif</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="ped-empty">
                      <div className="ped-empty-icon">🔍</div>
                      <div>Aucun patient trouvé</div>
                    </div>
                  </td>
                </tr>
              ) : filtered.map((patient) => {
                const chip = casTypeLabels[patient.casType];
                return (
                  <tr key={patient.id} onClick={() => openModal(patient)}>
                    <td>
                      <div className="ped-patient-cell">
                        <div className="ped-avatar" style={{ background: getAvatarColor(patient.initiale) }}>
                          {patient.initiale}
                        </div>
                        <span className="ped-patient-name">{patient.nom}</span>
                      </div>
                    </td>
                    <td>{patient.dateNaissance}</td>
                    <td>{patient.medecin}</td>
                    <td>{patient.infirmier}</td>
                    <td>{patient.dateAdmission}</td>
                    <td>
                      <span className="ped-cas-chip" style={{ background: chip.bg, color: chip.color }}>
                        <span className="ped-dot" style={{ background: chip.color }} />
                        {patient.cas}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="ped-actions">
                        <button className="ped-action-btn view" onClick={() => openModal(patient)}>Voir</button>
                        <button className="ped-action-btn edit" onClick={() => alert(`Modifier ${patient.nom}`)}>Modifier</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="ped-footer">
            <span>Affichage de <span className="ped-count">{filtered.length}</span> sur <span className="ped-count">{patientsData.length}</span> patients</span>
            <span>Service de Pédiatrie — MedGest Connect</span>
          </div>
        </div>

      </div>

      
      {showModal && selectedPatient && (
        <div className="ped-modal-overlay" onClick={closeModal}>
          <div className="ped-modal" onClick={(e) => e.stopPropagation()}>

            <div className="ped-modal-header">
              <div className="ped-avatar ped-modal-avatar" style={{ background: getAvatarColor(selectedPatient.initiale) }}>
                {selectedPatient.initiale}
              </div>
              <div>
                <div className="ped-modal-title">{selectedPatient.nom}</div>
                <div className="ped-modal-subtitle">Dossier patient — Pédiatrie</div>
              </div>
              <button className="ped-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="ped-modal-grid">
              {[
                { label: "Date de naissance / Âge", value: selectedPatient.dateNaissance },
                { label: "Date d'admission",     value: selectedPatient.dateAdmission },
                { label: "Médecin Assigné",    value: selectedPatient.medecin       },
                { label: "Infirmier Référent", value: selectedPatient.infirmier     },
                { label: "Motif / Cas",        value: selectedPatient.cas           },
                { label: "Statut",             value: casTypeLabels[selectedPatient.casType].label },
              ].map((f) => (
                <div key={f.label} className="ped-modal-field">
                  <label>{f.label}</label>
                  <p>{f.value}</p>
                </div>
              ))}
            </div>

            <div className="ped-modal-actions">
              <button className="ped-action-btn view ped-modal-btn" onClick={closeModal}>Fermer</button>
              <button className="ped-action-btn edit ped-modal-btn" onClick={() => alert(`Modifier ${selectedPatient.nom}`)}>Modifier le dossier</button>
            </div>

          </div>
        </div>
      )}

      <AdmissionPatientModal
        isOpen={showAdmission}
        onClose={() => setShowAdmission(false)}
        defaultService="pediatrie"
      />
    </>
  );
}


