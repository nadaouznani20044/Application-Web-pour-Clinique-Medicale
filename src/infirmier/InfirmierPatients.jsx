import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ClipboardList,
  FileText,
  HeartPulse,
  Pill,
  Search,
  ShieldAlert,
  TestTube2,
  Thermometer,
  Users,
} from 'lucide-react';
import {
  administerMedication,
  applyAlertToState,
  applyCareNoteToState,
  applyVitalsToState,
  createAlertEntry,
  createCareNoteEntry,
  createMedicationAdministrationEntry,
  createVitalsEntry,
  getAssignedPatients,
  getPendingMedicationTasks,
  getPatientById,
  loadInfirmierState,
  saveInfirmierState,
} from './infirmierStore';
import '../styles/Dashboard.css';

const CARE_TYPES = ['Observation', 'Pansement', 'Soin', 'Transmission'];
const ALERT_TYPES = ['etat_change', 'refus_medicament', 'urgence'];

const formatDateLabel = (value) => {
  if (!value) return '--';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

const InfirmierPatients = ({ nurseId, serviceId, serviceLabel }) => {
  const [state, setState] = useState(() => loadInfirmierState(nurseId, serviceId, serviceLabel || ''));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [careNoteDraft, setCareNoteDraft] = useState({
    type: 'Observation',
    note: '',
  });
  const [vitalsDraft, setVitalsDraft] = useState({
    weight: '',
    height: '',
    bloodPressure: '',
    pulse: '',
    temperature: '',
    oxygen: '',
    notes: '',
  });
  const [alertDraft, setAlertDraft] = useState({
    type: 'etat_change',
    description: '',
  });
  const [administrationNotes, setAdministrationNotes] = useState({});

  const patients = useMemo(() => getAssignedPatients(state, nurseId, serviceId), [state, nurseId, serviceId]);
  const filteredPatients = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return patients.filter((patient) => {
      if (!search) return true;
      const label = (patient.fullName || patient.name || '').toLowerCase();
      return (
        label.includes(search) ||
        (patient.room || patient.chambre || '').toLowerCase().includes(search) ||
        (patient.status || '').toLowerCase().includes(search)
      );
    });
  }, [patients, searchTerm]);

  const selectedPatient =
    getPatientById(state, selectedPatientId, nurseId, serviceId) ||
    filteredPatients[0] ||
    null;

  const pendingMedicationTasks = useMemo(
    () => getPendingMedicationTasks(state, nurseId, serviceId),
    [state, nurseId, serviceId]
  );

  const persist = (nextState) => {
    setState(nextState);
    saveInfirmierState(nurseId, serviceId, nextState);
  };

  const resetCareDrafts = () => {
    setCareNoteDraft({
      type: 'Observation',
      note: '',
    });
    setVitalsDraft({
      weight: '',
      height: '',
      bloodPressure: '',
      pulse: '',
      temperature: '',
      oxygen: '',
      notes: '',
    });
    setAlertDraft({
      type: 'etat_change',
      description: '',
    });
  };

  const handleSaveCareNote = (event) => {
    event.preventDefault();
    if (!selectedPatient) return;

    const entry = createCareNoteEntry({
      patientId: selectedPatient.id,
      nurseId,
      type: careNoteDraft.type,
      note: careNoteDraft.note,
    });

    persist(applyCareNoteToState(state, selectedPatient.id, entry));
    setCareNoteDraft({ type: 'Observation', note: '' });
  };

  const handleSaveVitals = (event) => {
    event.preventDefault();
    if (!selectedPatient) return;

    const entry = createVitalsEntry({
      patientId: selectedPatient.id,
      nurseId,
      ...vitalsDraft,
    });

    persist(applyVitalsToState(state, selectedPatient.id, entry));
    setVitalsDraft({
      weight: '',
      height: '',
      bloodPressure: '',
      pulse: '',
      temperature: '',
      oxygen: '',
      notes: '',
    });
  };

  const handleSendAlert = (event) => {
    event.preventDefault();
    if (!selectedPatient) return;

    const entry = createAlertEntry({
      patientId: selectedPatient.id,
      nurseId,
      type: alertDraft.type,
      description: alertDraft.description,
    });

    persist(applyAlertToState(state, selectedPatient.id, entry));
    setAlertDraft({
      type: 'etat_change',
      description: '',
    });
  };

  const handleAdministerMedication = (patientId, prescriptionId) => {
    const note = (administrationNotes[prescriptionId] || '').trim();
    const entry = createMedicationAdministrationEntry({
      patientId,
      nurseId,
      prescriptionId,
      notes: note,
    });

    persist(administerMedication(state, patientId, prescriptionId, entry));
    setAdministrationNotes((current) => ({ ...current, [prescriptionId]: '' }));
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Patients</span>
          <h1 className="dashboard-title">Dossiers assignés</h1>
          <p className="dashboard-subtitle">
            Lecture seule des dossiers, avec actions de soins autorisées uniquement.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={Users} label="Patients" value={filteredPatients.length} hint="Résultats filtrés" tone="teal" />
        <MetricCard icon={FileText} label="Notes de soins" value={(state.careNotes || []).length} hint="Trace des soins" tone="violet" />
        <MetricCard icon={Thermometer} label="Constantes" value={(state.vitalsLog || []).length} hint="Poids, tension, etc." tone="teal" />
        <MetricCard icon={Pill} label="Médicaments" value={pendingMedicationTasks.length} hint="À administrer" tone="orange" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Liste des patients</h2>
                <p className="dashboard-panel-subtitle">
                  Service courant: {serviceLabel || '--'} - Recherche par nom ou chambre.
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
                    <th>Chambre</th>
                    <th>Constantes</th>
                    <th>Allergies</th>
                    <th>Médicaments</th>
                    <th>État</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="role-empty">Aucun patient assigné ne correspond au filtre.</div>
                      </td>
                    </tr>
                  ) : (
                    filteredPatients.map((patient) => (
                      <tr
                        key={patient.id}
                        className={selectedPatient?.id === patient.id ? 'is-selected' : ''}
                        onClick={() => setSelectedPatientId(patient.id)}
                      >
                        <td>{patient.fullName || patient.name || patient.id}</td>
                        <td>{patient.room || patient.chambre || '--'}</td>
                        <td>{patient.vitals?.bloodPressure || patient.vitals?.weight || '--'}</td>
                        <td>{(patient.allergies || []).length}</td>
                        <td>{(patient.prescriptions || []).length}</td>
                        <td>{patient.status || '--'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Dossier patient</h2>
                <p className="dashboard-panel-subtitle">Consultation des données cliniques assignées.</p>
              </div>
              <Link className="dashboard-button dashboard-button--ghost" to="/calendrier">
                Voir le calendrier
              </Link>
            </div>

            {!selectedPatient ? (
              <div className="role-empty">Sélectionnez un patient pour afficher son dossier.</div>
            ) : (
              <div className="settings-language-card">
                <div className="settings-language-summary">
                  <div className="settings-language-badge">
                    {(selectedPatient.fullName || selectedPatient.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="dashboard-list-title">{selectedPatient.fullName || selectedPatient.name || selectedPatient.id}</div>
                    <div className="dashboard-list-meta">
                      Chambre {selectedPatient.room || selectedPatient.chambre || '--'} - {selectedPatient.status || '--'}
                    </div>
                  </div>
                </div>

                <div className="dashboard-list">
                  <MiniSection label="Patient ID" value={selectedPatient.id} />
                  <MiniSection label="Poids" value={selectedPatient.vitals?.weight || '--'} />
                  <MiniSection label="Taille" value={selectedPatient.vitals?.height || '--'} />
                  <MiniSection label="Tension artérielle" value={selectedPatient.vitals?.bloodPressure || '--'} />
                  <MiniSection label="Allergies" value={(selectedPatient.allergies || []).join(' | ') || 'Aucune allergie'} />
                  <MiniSection
                    label="Médicaments en cours"
                    value={(selectedPatient.activeMedications || []).join(' | ') || 'Aucun médicament'}
                  />
                  <MiniSection
                    label="Problèmes médicaux"
                    value={(selectedPatient.medicalProblems || []).join(' | ') || 'Aucun problème renseigné'}
                  />
                </div>

                <section className="dashboard-panel" style={{ marginTop: 24 }}>
                  <div className="dashboard-panel-header">
                    <div>
                      <h3 className="dashboard-panel-title">Historique des consultations</h3>
                      <p className="dashboard-panel-subtitle">Lecture seule pour assurer la continuité des soins.</p>
                    </div>
                  </div>

                  <div className="dashboard-list">
                    {(selectedPatient.consultations || []).length === 0 ? (
                      <div className="role-empty">Aucune consultation enregistrée.</div>
                    ) : (
                      (selectedPatient.consultations || []).map((entry) => (
                        <div key={entry.id} className="dashboard-list-item">
                          <div className="dashboard-list-main">
                            <div className="dashboard-list-icon dashboard-icon--teal">
                              <ClipboardList size={18} />
                            </div>
                            <div>
                              <div className="dashboard-list-title">{entry.diagnosis || 'Consultation'}</div>
                              <div className="dashboard-list-meta">
                                {entry.createdAt} - {entry.notes || 'Aucune note'}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </section>
              </div>
            )}
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Soins et constantes</h2>
                <p className="dashboard-panel-subtitle">
                  Les seules écritures autorisées pour ce rôle.
                </p>
              </div>
            </div>

            {!selectedPatient ? (
              <div className="role-empty">Sélectionnez un patient pour saisir un soin ou une constante.</div>
            ) : (
              <>
                <form className="settings-language-card" onSubmit={handleSaveCareNote}>
                  <label className="settings-field">
                    <span>Type de soin</span>
                    <select
                      value={careNoteDraft.type}
                      onChange={(event) =>
                        setCareNoteDraft((current) => ({ ...current, type: event.target.value }))
                      }
                    >
                      {CARE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="settings-field">
                    <span>Note de soin</span>
                    <textarea
                      rows={4}
                      value={careNoteDraft.note}
                      onChange={(event) =>
                        setCareNoteDraft((current) => ({ ...current, note: event.target.value }))
                      }
                    />
                  </label>

                  <button type="submit" className="dashboard-button dashboard-button--primary">
                    Enregistrer la note
                  </button>
                </form>

                <form className="settings-language-card" onSubmit={handleSaveVitals} style={{ marginTop: 24 }}>
                  <div className="chef-form-grid">
                    <label className="settings-field">
                      <span>Poids</span>
                      <input
                        type="text"
                        value={vitalsDraft.weight}
                        onChange={(event) =>
                          setVitalsDraft((current) => ({ ...current, weight: event.target.value }))
                        }
                      />
                    </label>
                    <label className="settings-field">
                      <span>Taille</span>
                      <input
                        type="text"
                        value={vitalsDraft.height}
                        onChange={(event) =>
                          setVitalsDraft((current) => ({ ...current, height: event.target.value }))
                        }
                      />
                    </label>
                    <label className="settings-field">
                      <span>Tension artérielle</span>
                      <input
                        type="text"
                        value={vitalsDraft.bloodPressure}
                        onChange={(event) =>
                          setVitalsDraft((current) => ({ ...current, bloodPressure: event.target.value }))
                        }
                      />
                    </label>
                    <label className="settings-field">
                      <span>Pouls</span>
                      <input
                        type="text"
                        value={vitalsDraft.pulse}
                        onChange={(event) =>
                          setVitalsDraft((current) => ({ ...current, pulse: event.target.value }))
                        }
                      />
                    </label>
                    <label className="settings-field">
                      <span>Température</span>
                      <input
                        type="text"
                        value={vitalsDraft.temperature}
                        onChange={(event) =>
                          setVitalsDraft((current) => ({ ...current, temperature: event.target.value }))
                        }
                      />
                    </label>
                    <label className="settings-field">
                      <span>Saturation O₂</span>
                      <input
                        type="text"
                        value={vitalsDraft.oxygen}
                        onChange={(event) =>
                          setVitalsDraft((current) => ({ ...current, oxygen: event.target.value }))
                        }
                      />
                    </label>
                  </div>

                  <label className="settings-field">
                    <span>Observation complémentaire</span>
                    <textarea
                      rows={3}
                      value={vitalsDraft.notes}
                      onChange={(event) =>
                        setVitalsDraft((current) => ({ ...current, notes: event.target.value }))
                      }
                    />
                  </label>

                  <button type="submit" className="dashboard-button dashboard-button--primary">
                    Enregistrer les constantes
                  </button>
                </form>

                <div className="dashboard-panel" style={{ marginTop: 24 }}>
                  <div className="dashboard-panel-header">
                    <div>
                      <h3 className="dashboard-panel-title">Administration des médicaments</h3>
                      <p className="dashboard-panel-subtitle">
                        Confirmation de l&apos;administration avec horodatage.
                      </p>
                    </div>
                  </div>

                  <div className="dashboard-list">
                    {(selectedPatient.prescriptions || []).length === 0 ? (
                      <div className="role-empty">Aucune prescription à administrer.</div>
                    ) : (
                      (selectedPatient.prescriptions || []).map((prescription) => {
                        const prescriptionId = prescription.id || prescription.medication;
                        return (
                          <div key={prescriptionId} className="dashboard-list-item" style={{ flexWrap: 'wrap' }}>
                            <div className="dashboard-list-main" style={{ width: '100%' }}>
                              <div className="dashboard-list-icon dashboard-icon--orange">
                                <Pill size={18} />
                              </div>
                              <div>
                                <div className="dashboard-list-title">{prescription.medication || prescription.name || '--'}</div>
                                <div className="dashboard-list-meta">
                                  {prescription.dosage || ''} {prescription.duration ? `- ${prescription.duration}` : ''} {prescription.administeredAt ? `- administré le ${prescription.administeredAt}` : ''}
                                </div>
                              </div>
                            </div>

                            <label className="settings-field" style={{ width: '100%' }}>
                              <span>Note d&apos;administration</span>
                              <input
                                type="text"
                                value={administrationNotes[prescriptionId] || ''}
                                onChange={(event) =>
                                  setAdministrationNotes((current) => ({
                                    ...current,
                                    [prescriptionId]: event.target.value,
                                  }))
                                }
                                placeholder=""
                              />
                            </label>

                            <button
                              type="button"
                              className="dashboard-button dashboard-button--ghost"
                              onClick={() => handleAdministerMedication(selectedPatient.id, prescriptionId)}
                              disabled={Boolean(prescription.administeredAt)}
                            >
                              {prescription.administeredAt ? 'Déjà administré' : 'Confirmer l’administration'}
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <form className="settings-language-card" onSubmit={handleSendAlert} style={{ marginTop: 24 }}>
                  <label className="settings-field">
                    <span>Type d&apos;alerte</span>
                    <select
                      value={alertDraft.type}
                      onChange={(event) =>
                        setAlertDraft((current) => ({ ...current, type: event.target.value }))
                      }
                    >
                      {ALERT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="settings-field">
                    <span>Description</span>
                    <textarea
                      rows={4}
                      value={alertDraft.description}
                      onChange={(event) =>
                        setAlertDraft((current) => ({ ...current, description: event.target.value }))
                      }
                    />
                  </label>

                  <button type="submit" className="dashboard-button dashboard-button--primary">
                    Notifier le médecin
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
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

export default InfirmierPatients;
