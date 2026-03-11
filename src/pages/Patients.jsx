import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import '../styles/patients.css';

const Patients = () => {
  const [patients, setPatients] = useState([
    { id: 'PA-203-1456', name: 'Amina ', birthDate: '00/05/2023', service: 'PÃ©diatrie', status: 'Active', active: true },
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);

  return (
    <div className="patients-container">
      <div className="patients-header">
        <h2 className="patients-title">Gestion des Dossiers Patients</h2>
        <button className="btn-add-patient">
          <Plus size={18} />
          Ajouter un Dossier Patient
        </button>
      </div>

      
      <div className="stats-grid">
        <StatsCard title="Total Dossiers" value="" />
        <StatsCard title="Nouveaux Patients (Mois)" value="" />
        <StatsCard title="Urgences Actives" value="" />
      </div>

      
      <div className="patients-table-wrapper">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Patient ID</th>
              <th>Nom complet</th>
              <th>Date de naissance</th>
              <th>Service</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, idx) => (
              <tr 
                key={idx}
                onClick={() => setSelectedPatient(patient)}
              >
                <td className="patient-id">{patient.id}</td>
                <td className="patient-name">{patient.name}</td>
                <td className="patient-birthdate">{patient.birthDate}</td>
                <td className="patient-service">{patient.service}</td>
                <td>
                  <span className={patient.active ? 'status-active' : 'status-inactive'}>
                    {patient.status}
                  </span>
                </td>
              </tr> 
            ))}
          </tbody>
        </table>
      </div>

      
      {selectedPatient && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Fiche Patient</h3>
                <p>{selectedPatient.name}</p>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)} 
                className="modal-close"
                aria-label="Close modal"
              >
                âœ•
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section-grid">
                <div className="modal-field">
                  <span className="modal-field-label">ID Patient</span>
                  <span className="modal-field-value">{selectedPatient.id}</span>
                </div>
                <div className="modal-field">
                  <span className="modal-field-label">Date de naissance</span>
                  <span className="modal-field-value">{selectedPatient.birthDate}</span>
                </div>
              </div>

              <div className="modal-section-grid">
                <div className="modal-field">
                  <span className="modal-field-label">Service</span>
                  <span className="modal-field-value">{selectedPatient.service}</span>
                </div>
                <div className="modal-field">
                  <span className="modal-field-label">Statut</span>
                  <span className={selectedPatient.active ? 'status-active' : 'status-inactive'}>
                    {selectedPatient.status}
                  </span>
                </div>
              </div>

              <div className="modal-info-box">
                <div className="modal-info-label">Allergies</div>
                <div className="modal-info-value">None</div>
              </div>

              <div className="modal-info-box">
                <div className="modal-info-label">Type sang</div>
                <div className="modal-info-value">B</div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn modal-btn-secondary">
                Consulter
              </button>
              <button className="modal-btn modal-btn-primary">
                Modifier
              </button>
              <button 
                onClick={() => setSelectedPatient(null)}
                className="modal-btn modal-btn-tertiary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ title, value }) => (
  <div className="stat-card">
    <span className="stat-label">{title}</span>
    <span className="stat-value">{value}</span>
  </div>
);

export default Patients;
