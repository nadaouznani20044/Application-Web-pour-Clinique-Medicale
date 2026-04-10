import React, { useMemo, useState } from 'react';
import { FileText, Activity, Pill, TestTube2, Search, Eye } from 'lucide-react';
import { getServiceLabel, getServiceStats, loadServiceState } from './chefStore';
import '../styles/Dashboard.css';

const ChefPatients = ({ serviceId }) => {
  const [state] = useState(() => loadServiceState(serviceId));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const stats = useMemo(() => getServiceStats(state), [state]);

  const patients = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return (state.patients || []).filter((patient) => {
      if (!search) return true;
      return (
        patient.name.toLowerCase().includes(search) ||
        patient.assignedDoctorName.toLowerCase().includes(search) ||
        patient.status.toLowerCase().includes(search)
      );
    });
  }, [searchTerm, state.patients]);

  const selectedPatient =
    patients.find((patient) => patient.id === selectedPatientId) ||
    patients[0] ||
    null;

  const consultationCount = state.patients.reduce(
    (sum, patient) => sum + (patient.consultations?.length || 0),
    0
  );
  const prescriptionCount = state.patients.reduce(
    (sum, patient) => sum + (patient.prescriptions?.length || 0),
    0
  );
  const testsCount = state.patients.reduce((sum, patient) => sum + (patient.tests?.length || 0), 0);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Dossiers patients</span>
          <h1 className="dashboard-title">Patients du service - {state.service.name || getServiceLabel(serviceId)}</h1>
          <p className="dashboard-subtitle">
            Accès en lecture seule aux consultations, prescriptions et résultats de tests.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={FileText} label="Patients actifs" value={stats.activePatients} hint="Volume du service" tone="teal" />
        <MetricCard icon={Activity} label="Consultations" value={consultationCount} hint="Historique visible" tone="teal" />
        <MetricCard icon={Pill} label="Prescriptions" value={prescriptionCount} hint="Médicaments prescrits" tone="violet" />
        <MetricCard icon={TestTube2} label="Tests" value={testsCount} hint="Résultats et bilans" tone="orange" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Liste des patients</h2>
                <p className="dashboard-panel-subtitle">
                  {patients.length} fiche(s) affichée(s) sur le service {state.service.name || getServiceLabel(serviceId)}.
                </p>
              </div>
              <label className="chef-search">
                <Search size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Rechercher un patient"
                />
              </label>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Âge</th>
                    <th>Sexe</th>
                    <th>Médecin</th>
                    <th>Consultations</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="role-empty">Aucun patient ne correspond au filtre.</div>
                      </td>
                    </tr>
                  ) : (
                    patients.map((patient) => (
                      <tr
                        key={patient.id}
                        className={selectedPatientId === patient.id ? 'is-selected' : ''}
                        onClick={() => setSelectedPatientId(patient.id)}
                      >
                        <td>{patient.name}</td>
                        <td>{patient.age}</td>
                        <td>{patient.sex}</td>
                        <td>{patient.assignedDoctorName}</td>
                        <td>{patient.consultations?.length || 0}</td>
                        <td>
                          <span className="dashboard-chip dashboard-chip--neutral">{patient.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Détail patient</h2>
              <p className="dashboard-panel-subtitle">Historique clinique en lecture seule.</p>
            </div>
          </div>

          {!selectedPatient ? (
            <div className="role-empty">Sélectionne une ligne pour voir le dossier.</div>
          ) : (
            <div className="settings-language-card">
              <div className="settings-language-summary">
                <div className="settings-language-badge">{selectedPatient.name.charAt(0)}</div>
                <div>
                  <div className="dashboard-list-title">{selectedPatient.name}</div>
                  <div className="dashboard-list-meta">
                    {selectedPatient.age} ans - {selectedPatient.sex} - {selectedPatient.status}
                  </div>
                </div>
              </div>

              <div className="dashboard-list">
                <MiniSection label="Médecin assigné" value={selectedPatient.assignedDoctorName} />
                <MiniSection label="Consultations" value={selectedPatient.consultations.length} />
                <MiniSection label="Prescriptions" value={selectedPatient.prescriptions.length} />
                <MiniSection label="Tests" value={selectedPatient.tests.length} />
              </div>

              <div className="dashboard-list">
                <div className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-title">Historique des consultations</div>
                    <div className="dashboard-list-meta">
                      {selectedPatient.consultations.map((consultation) => consultation.summary).join(' | ')}
                    </div>
                  </div>
                </div>
                <div className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-title">Prescriptions</div>
                    <div className="dashboard-list-meta">
                      {selectedPatient.prescriptions.join(' | ')}
                    </div>
                  </div>
                </div>
                <div className="dashboard-list-item">
                  <div>
                    <div className="dashboard-list-title">Résultats de tests</div>
                    <div className="dashboard-list-meta">
                      {selectedPatient.tests.map((test) => `${test.name}: ${test.result}`).join(' | ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const MiniSection = ({ label, value }) => (
  <div className="dashboard-list-item">
    <div>
      <div className="dashboard-list-title">{label}</div>
      <div className="dashboard-list-meta">{value}</div>
    </div>
  </div>
);

const MetricCard = ({ icon: Icon, label, value, hint, tone }) => (
  <article className="dashboard-stat-card">
    <div className="dashboard-stat-top">
      <div>
        <span className="dashboard-stat-label">{label}</span>
        <div className="dashboard-stat-value">{value}</div>
      </div>
      <div className={`dashboard-stat-icon dashboard-icon--${tone}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="dashboard-stat-hint">{hint}</p>
  </article>
);

export default ChefPatients;
