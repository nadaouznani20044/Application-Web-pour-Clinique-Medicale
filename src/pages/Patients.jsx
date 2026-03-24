import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AdmissionPatientModal from '../components/AdmissionPatientModal';
import Toast from '../components/Toast';
import '../styles/Patients.css';

const createPatientId = (sequence) => {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `PA-${year}${month}-${String(sequence).padStart(4, '0')}`;
};

const formatDate = (value) => {
  if (!value) return '--';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

const isCreatedThisMonth = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;

  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showAdmission, setShowAdmission] = useState(false);
  const [toast, setToast] = useState(null);

  const totalPatients = patients.length;
  const monthlyPatients = patients.filter((patient) => isCreatedThisMonth(patient.createdAt)).length;
  const activeEmergencies = patients.filter((patient) => patient.serviceValue === 'urgence').length;
  const nextPatientId = createPatientId(totalPatients + 1);

  const handleCreatePatient = (formData) => {
    const newPatient = {
      id: nextPatientId,
      fullName: formData.fullName.trim(),
      birthDate: formData.birthDate,
      gender: formData.gender,
      phone: formData.phone.trim(),
      service: formData.serviceLabel,
      serviceValue: formData.service,
      bloodType: formData.bloodType,
      medicalHistory: formData.medicalHistory.trim(),
      emergencyName: formData.emergencyName.trim(),
      emergencyRelation: formData.emergencyRelation.trim(),
      emergencyPhone: formData.emergencyPhone.trim(),
      status: 'Actif',
      createdAt: new Date().toISOString(),
    };

    setPatients((current) => [newPatient, ...current]);
    setShowAdmission(false);
    setToast({ message: 'Dossier patient enregistre avec succes', type: 'success' });
  };

  return (
    <div className="patients-container">
      <div className="patients-header">
        <h2 className="patients-title">Gestion des Dossiers Patients</h2>
        <button className="btn-add-patient" onClick={() => setShowAdmission(true)}>
          <Plus size={18} />
          Ajouter un Dossier Patient
        </button>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total dossiers" value={totalPatients} />
        <StatsCard title="Nouveaux patients (mois)" value={monthlyPatients} />
        <StatsCard title="Urgences actives" value={activeEmergencies} />
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
            {patients.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="patients-empty-row">
                    <div className="patients-empty-title">Aucun dossier patient</div>
                    <div className="patients-empty-text">
                      Ajoutez un dossier pour remplacer les donnees d'exemple par des fiches
                      reelles.
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} onClick={() => setSelectedPatient(patient)}>
                  <td className="patient-id">{patient.id}</td>
                  <td className="patient-name">{patient.fullName}</td>
                  <td className="patient-birthdate">{formatDate(patient.birthDate)}</td>
                  <td className="patient-service">{patient.service}</td>
                  <td>
                    <span className="status-active">{patient.status}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <h3>Fiche Patient</h3>
                <p>{selectedPatient.fullName}</p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="modal-close"
                aria-label="Fermer la fiche patient"
              >
                x
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="modal-section-title">Informations personnelles</div>
                <div className="modal-section-grid">
                  <DetailField label="Patient ID" value={selectedPatient.id} />
                  <DetailField label="Date de naissance" value={formatDate(selectedPatient.birthDate)} />
                  <DetailField label="Sexe" value={selectedPatient.gender} />
                  <DetailField label="Telephone" value={selectedPatient.phone} />
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">Details medicaux</div>
                <div className="modal-section-grid">
                  <DetailField label="Service" value={selectedPatient.service} />
                  <DetailField label="Groupe sanguin" value={selectedPatient.bloodType} />
                </div>
                <div className="modal-info-box">
                  <div className="modal-info-label">Antecedents</div>
                  <div className="modal-info-value">
                    {selectedPatient.medicalHistory || 'Aucun antecedent renseigne'}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <div className="modal-section-title">Contact d'urgence</div>
                <div className="modal-section-grid">
                  <DetailField label="Nom du contact" value={selectedPatient.emergencyName} />
                  <DetailField
                    label="Lien de parente"
                    value={selectedPatient.emergencyRelation}
                  />
                  <DetailField
                    label="Telephone du contact"
                    value={selectedPatient.emergencyPhone || '--'}
                  />
                  <DetailField label="Statut du dossier" value={selectedPatient.status} />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedPatient(null)} className="modal-btn modal-btn-primary">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <AdmissionPatientModal
        isOpen={showAdmission}
        onClose={() => setShowAdmission(false)}
        onSubmit={handleCreatePatient}
        patientIdPreview={nextPatientId}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const StatsCard = ({ title, value }) => (
  <div className="stat-card">
    <span className="stat-label">{title}</span>
    <span className="stat-value">{value}</span>
  </div>
);

const DetailField = ({ label, value }) => (
  <div className="modal-field">
    <span className="modal-field-label">{label}</span>
    <span className="modal-field-value">{value}</span>
  </div>
);

export default Patients;
