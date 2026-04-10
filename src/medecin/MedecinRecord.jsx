import React, { useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ClipboardList, FileText, FlaskConical, Pill, ShieldAlert, TestTube2, Users } from 'lucide-react';
import {
  applyConsultationToState,
  applyReferralToState,
  createConsultationEntry,
  createReferralEntry,
  getOwnedPatients,
  loadMedecinState,
  receiveReferralResult,
  saveMedecinState,
} from './medecinStore';
import '../styles/Dashboard.css';

const SERVICE_OPTIONS = [
  { value: 'radiologie', label: 'Radiologie' },
  { value: 'laboratoire', label: 'Laboratoire' },
  { value: 'chirurgie', label: 'Chirurgie' },
  { value: 'gynecologie', label: 'Gynecologie' },
  { value: 'pediatrie', label: 'Pediatrie' },
  { value: 'medecineinterne', label: 'Medecine interne' },
  { value: 'ophtalmologie', label: 'Ophtalmologie' },
  { value: 'urgence', label: 'Urgence' },
];

const URGENCY_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'critical', label: 'Critique' },
];

const createPrescriptionRow = () => ({
  medication: '',
  dosage: '',
  duration: '',
});

const createExamRow = () => ({
  name: '',
  note: '',
});

const createConsultationDraft = () => ({
  notes: '',
  diagnosis: '',
  prescriptions: [createPrescriptionRow()],
  exams: [createExamRow()],
});

const createReferralDraft = () => ({
  targetService: 'radiologie',
  reason: '',
  urgency: 'normal',
});

const MedecinRecord = ({ doctorId, serviceId, serviceLabel }) => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState(() => loadMedecinState(doctorId, serviceId, serviceLabel || ''));
  const [consultationDraft, setConsultationDraft] = useState(createConsultationDraft);
  const [referralDraft, setReferralDraft] = useState(createReferralDraft);
  const [resultDrafts, setResultDrafts] = useState({});

  const patients = useMemo(() => getOwnedPatients(state, doctorId), [state, doctorId]);
  const patient = useMemo(
    () => patients.find((entry) => entry.id === patientId) || null,
    [patients, patientId]
  );

  if (!patient) {
    return <Navigate to="/403" replace />;
  }

  const consultationHistory = patient.consultations || [];
  const referrals = patient.referrals || [];
  const tests = patient.tests || [];

  const persist = (nextState) => {
    setState(nextState);
    saveMedecinState(doctorId, serviceId, nextState);
  };

  const handlePrescriptionChange = (index, key, value) => {
    setConsultationDraft((current) => ({
      ...current,
      prescriptions: current.prescriptions.map((row, rowIndex) =>
        rowIndex === index ? { ...row, [key]: value } : row
      ),
    }));
  };

  const handleExamChange = (index, key, value) => {
    setConsultationDraft((current) => ({
      ...current,
      exams: current.exams.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
    }));
  };

  const handleSubmitConsultation = (event) => {
    event.preventDefault();

    const consultation = createConsultationEntry({
      patientId: patient.id,
      doctorId,
      notes: consultationDraft.notes,
      diagnosis: consultationDraft.diagnosis,
      prescriptions: consultationDraft.prescriptions,
      exams: consultationDraft.exams,
    });

    const nextState = applyConsultationToState(state, patient.id, consultation);
    persist(nextState);
    setConsultationDraft(createConsultationDraft());
  };

  const handleSubmitReferral = (event) => {
    event.preventDefault();

    const referral = createReferralEntry({
      patientId: patient.id,
      doctorId,
      targetService: referralDraft.targetService,
      reason: referralDraft.reason,
      urgency: referralDraft.urgency,
    });

    const nextState = applyReferralToState(state, patient.id, referral);
    persist(nextState);
    setReferralDraft(createReferralDraft());
  };

  const handleReceiveResult = (referralId) => {
    const result = (resultDrafts[referralId] || '').trim();
    if (!result) return;

    const nextState = receiveReferralResult(state, patient.id, referralId, result);
    persist(nextState);
    setResultDrafts((current) => ({ ...current, [referralId]: '' }));
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Dossier patient</span>
          <h1 className="dashboard-title">{patient.fullName || patient.name || patient.id}</h1>
          <p className="dashboard-subtitle">
            Lecture seule des constantes et historique, avec saisie des consultations et references.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard
          icon={Users}
          label="Allergies"
          value={(patient.allergies || []).length}
          hint="Informations medicales visibles"
          tone="teal"
        />
        <MetricCard
          icon={Pill}
          label="Medicaments"
          value={(patient.activeMedications || []).length}
          hint="Traitements en cours"
          tone="orange"
        />
        <MetricCard
          icon={ClipboardList}
          label="Consultations"
          value={consultationHistory.length}
          hint="Historique patient"
          tone="teal"
        />
        <MetricCard
          icon={TestTube2}
          label="Tests"
          value={tests.length}
          hint="Resultats et bilans"
          tone="violet"
        />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Informations cliniques</h2>
                <p className="dashboard-panel-subtitle">Constantes, problemes medicaux et historique.</p>
              </div>
              <button type="button" className="dashboard-button dashboard-button--ghost" onClick={() => navigate('/patients')}>
                Retour aux patients
              </button>
            </div>

            <div className="settings-language-card">
              <div className="dashboard-list">
                <InfoRow label="Patient ID" value={patient.id} />
                <InfoRow label="Derniere consultation" value={patient.lastConsultationDate || '--'} />
                <InfoRow label="Poids" value={patient.vitals?.weight || '--'} />
                <InfoRow label="Taille" value={patient.vitals?.height || '--'} />
                <InfoRow label="Tension arterielle" value={patient.vitals?.bloodPressure || '--'} />
              </div>

              <div className="dashboard-list">
                <MiniSection
                  icon={ShieldAlert}
                  title="Allergies"
                  value={(patient.allergies || []).length === 0 ? 'Aucune allergie enregistree' : patient.allergies.join(' | ')}
                />
                <MiniSection
                  icon={Pill}
                  title="Medicaments actifs"
                  value={
                    (patient.activeMedications || []).length === 0
                      ? 'Aucun traitement en cours'
                      : patient.activeMedications.join(' | ')
                  }
                />
                <MiniSection
                  icon={FileText}
                  title="Problemes medicaux"
                  value={
                    (patient.medicalProblems || []).length === 0
                      ? 'Aucun probleme medical renseigne'
                      : patient.medicalProblems.join(' | ')
                  }
                />
              </div>

              <div className="dashboard-panel" style={{ marginTop: 24 }}>
                <div className="dashboard-panel-header">
                  <div>
                    <h3 className="dashboard-panel-title">Historique des consultations</h3>
                    <p className="dashboard-panel-subtitle">Lecture seule des entrees deja enregistrees.</p>
                  </div>
                </div>
                <div className="dashboard-list">
                  {consultationHistory.length === 0 ? (
                    <div className="role-empty">Aucune consultation enregistree pour ce patient.</div>
                  ) : (
                    consultationHistory.map((entry) => (
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
              </div>
            </div>
          </section>
        </div>

        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Saisie consultation</h2>
                <p className="dashboard-panel-subtitle">
                  Notes cliniques, prescriptions, examens et diagnostic.
                </p>
              </div>
            </div>

            <form className="settings-language-card" onSubmit={handleSubmitConsultation}>
              <label className="settings-field">
                <span>Notes cliniques</span>
                <textarea
                  rows={4}
                  value={consultationDraft.notes}
                  onChange={(event) =>
                    setConsultationDraft((current) => ({ ...current, notes: event.target.value }))
                  }
                />
              </label>

              <label className="settings-field">
                <span>Diagnostic</span>
                <input
                  type="text"
                  value={consultationDraft.diagnosis}
                  onChange={(event) =>
                    setConsultationDraft((current) => ({ ...current, diagnosis: event.target.value }))
                  }
                />
              </label>

              <div className="dashboard-panel" style={{ marginTop: 8 }}>
                <div className="dashboard-panel-header">
                  <div>
                    <h3 className="dashboard-panel-title">Prescriptions</h3>
                    <p className="dashboard-panel-subtitle">Medicaments, posologie et duree.</p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-button dashboard-button--ghost"
                    onClick={() =>
                      setConsultationDraft((current) => ({
                        ...current,
                        prescriptions: [...current.prescriptions, createPrescriptionRow()],
                      }))
                    }
                  >
                    Ajouter
                  </button>
                </div>

                <div className="dashboard-list">
                  {consultationDraft.prescriptions.map((row, index) => (
                    <div key={`${index}-${row.medication}`} className="dashboard-list-item" style={{ flexWrap: 'wrap' }}>
                      <div className="chef-form-grid" style={{ width: '100%' }}>
                        <label className="settings-field">
                          <span>Medicament</span>
                          <input
                            type="text"
                            value={row.medication}
                            onChange={(event) => handlePrescriptionChange(index, 'medication', event.target.value)}
                            placeholder="Nom du medicament"
                          />
                        </label>
                        <label className="settings-field">
                          <span>Posologie</span>
                          <input
                            type="text"
                            value={row.dosage}
                            onChange={(event) => handlePrescriptionChange(index, 'dosage', event.target.value)}
                            placeholder=""
                          />
                        </label>
                        <label className="settings-field">
                          <span>Duree</span>
                          <input
                            type="text"
                            value={row.duration}
                            onChange={(event) => handlePrescriptionChange(index, 'duration', event.target.value)}
                            placeholder=""
                          />
                        </label>
                      </div>
                      {consultationDraft.prescriptions.length > 1 && (
                        <button
                          type="button"
                          className="dashboard-button dashboard-button--ghost"
                          onClick={() =>
                            setConsultationDraft((current) => ({
                              ...current,
                              prescriptions: current.prescriptions.filter((_, rowIndex) => rowIndex !== index),
                            }))
                          }
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-panel" style={{ marginTop: 8 }}>
                <div className="dashboard-panel-header">
                  <div>
                    <h3 className="dashboard-panel-title">Examens demandes</h3>
                    <p className="dashboard-panel-subtitle">Bilan, imagerie, analyse ou autre examen.</p>
                  </div>
                  <button
                    type="button"
                    className="dashboard-button dashboard-button--ghost"
                    onClick={() =>
                      setConsultationDraft((current) => ({
                        ...current,
                        exams: [...current.exams, createExamRow()],
                      }))
                    }
                  >
                    Ajouter
                  </button>
                </div>

                <div className="dashboard-list">
                  {consultationDraft.exams.map((row, index) => (
                    <div key={`${index}-${row.name}`} className="dashboard-list-item" style={{ flexWrap: 'wrap' }}>
                      <div className="chef-form-grid" style={{ width: '100%' }}>
                        <label className="settings-field">
                          <span>Examen</span>
                          <input
                            type="text"
                            value={row.name}
                            onChange={(event) => handleExamChange(index, 'name', event.target.value)}
                            placeholder="Nom de l'examen"
                          />
                        </label>
                        <label className="settings-field">
                          <span>Note</span>
                          <input
                            type="text"
                            value={row.note}
                            onChange={(event) => handleExamChange(index, 'note', event.target.value)}
                            placeholder="Contexte ou precision"
                          />
                        </label>
                      </div>
                      {consultationDraft.exams.length > 1 && (
                        <button
                          type="button"
                          className="dashboard-button dashboard-button--ghost"
                          onClick={() =>
                            setConsultationDraft((current) => ({
                              ...current,
                              exams: current.exams.filter((_, rowIndex) => rowIndex !== index),
                            }))
                          }
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="dashboard-button dashboard-button--primary">
                Enregistrer la consultation
              </button>
            </form>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Systeme de references</h2>
                <p className="dashboard-panel-subtitle">
                  Renvoi vers un autre service et ajout du resultat au dossier.
                </p>
              </div>
            </div>

            <form className="settings-language-card" onSubmit={handleSubmitReferral}>
              <label className="settings-field">
                <span>Service cible</span>
                <select
                  value={referralDraft.targetService}
                  onChange={(event) =>
                    setReferralDraft((current) => ({ ...current, targetService: event.target.value }))
                  }
                >
                  {SERVICE_OPTIONS.map((service) => (
                    <option key={service.value} value={service.value}>
                      {service.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="settings-field">
                <span>Urgence</span>
                <select
                  value={referralDraft.urgency}
                  onChange={(event) =>
                    setReferralDraft((current) => ({ ...current, urgency: event.target.value }))
                  }
                >
                  {URGENCY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="settings-field">
                <span>Motif</span>
                <textarea
                  rows={4}
                  value={referralDraft.reason}
                  onChange={(event) =>
                    setReferralDraft((current) => ({ ...current, reason: event.target.value }))
                  }
                />
              </label>

              <button type="submit" className="dashboard-button dashboard-button--primary">
                Ajouter la reference
              </button>
            </form>

            <div className="dashboard-panel" style={{ marginTop: 24 }}>
              <div className="dashboard-panel-header">
                <div>
                  <h3 className="dashboard-panel-title">References et resultats</h3>
                  <p className="dashboard-panel-subtitle">Les resultats peuvent etre rattaches au dossier.</p>
                </div>
              </div>

              <div className="dashboard-list">
                {referrals.length === 0 ? (
                  <div className="role-empty">Aucune reference enregistree.</div>
                ) : (
                  referrals.map((referral) => {
                    const resultValue = resultDrafts[referral.id] || '';
                    return (
                      <div key={referral.id} className="dashboard-list-item" style={{ flexWrap: 'wrap' }}>
                        <div className="dashboard-list-main" style={{ width: '100%' }}>
                          <div className="dashboard-list-icon dashboard-icon--teal">
                            <FlaskConical size={18} />
                          </div>
                          <div>
                            <div className="dashboard-list-title">
                              {referral.targetService} - {referral.urgency}
                            </div>
                            <div className="dashboard-list-meta">
                              {referral.reason || 'Motif non renseigne'} - {referral.status}
                            </div>
                          </div>
                        </div>

                        {referral.status === 'pending' ? (
                          <div className="chef-form-grid" style={{ width: '100%' }}>
                            <label className="settings-field">
                              <span>Resultat recu</span>
                              <input
                                type="text"
                                value={resultValue}
                                onChange={(event) =>
                                  setResultDrafts((current) => ({
                                    ...current,
                                    [referral.id]: event.target.value,
                                  }))
                                }
                                placeholder="Ajouter le resultat"
                              />
                            </label>
                            <button
                              type="button"
                              className="dashboard-button dashboard-button--ghost"
                              onClick={() => handleReceiveResult(referral.id)}
                            >
                              Ajouter au dossier
                            </button>
                          </div>
                        ) : (
                          <div className="dashboard-list" style={{ width: '100%' }}>
                            <div className="dashboard-list-item">
                              <div>
                                <div className="dashboard-list-title">Resultat</div>
                                <div className="dashboard-list-meta">{referral.result || 'Resultat vide'}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="dashboard-list-item">
    <div>
      <div className="dashboard-list-title">{label}</div>
      <div className="dashboard-list-meta">{value}</div>
    </div>
  </div>
);

const MiniSection = ({ icon: Icon, title, value }) => (
  <div className="dashboard-list-item">
    <div className="dashboard-list-main">
      <div className="dashboard-list-icon dashboard-icon--teal">
        <Icon size={18} />
      </div>
      <div>
        <div className="dashboard-list-title">{title}</div>
        <div className="dashboard-list-meta">{value}</div>
      </div>
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

export default MedecinRecord;
