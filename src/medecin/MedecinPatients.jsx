import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Activity, Pill, TestTube2 } from 'lucide-react';
import { getMedecinStats, getOwnedPatients, loadMedecinState } from './medecinStore';
import '../styles/Dashboard.css';

const formatDateLabel = (value) => {
  if (!value) return '--';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

const MedecinPatients = ({ doctorId, serviceId, serviceLabel }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [consultationDate, setConsultationDate] = useState('');
  const state = useMemo(
    () => loadMedecinState(doctorId, serviceId, serviceLabel || ''),
    [doctorId, serviceId, serviceLabel]
  );
  const patients = useMemo(() => getOwnedPatients(state, doctorId), [state, doctorId]);
  const stats = useMemo(() => getMedecinStats(state, doctorId), [state, doctorId]);

  const filteredPatients = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();
    return patients.filter((patient) => {
      const fullName = (patient.fullName || patient.name || '').toLowerCase();
      const lastConsultationDate = patient.lastConsultationDate || '';
      const matchesSearch = !search || fullName.includes(search);
      const matchesDate = !consultationDate || lastConsultationDate === consultationDate;
      return matchesSearch && matchesDate;
    });
  }, [consultationDate, patients, searchTerm]);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Mes patients</span>
          <h1 className="dashboard-title">Dossiers assignes</h1>
          <p className="dashboard-subtitle">
            Recherche par nom et filtrage par date de derniere consultation.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={FileText} label="Patients" value={stats.assignedPatients} hint="Dossiers scoppes" tone="teal" />
        <MetricCard icon={Activity} label="Consultations" value={stats.consultations} hint="Historique enregistre" tone="violet" />
        <MetricCard icon={Pill} label="Medicaments" value={0} hint="Mise a jour apres consultation" tone="orange" />
        <MetricCard icon={TestTube2} label="Tests" value={0} hint="Resultats rattaches au dossier" tone="teal" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Liste des patients</h2>
              <p className="dashboard-panel-subtitle">
                {filteredPatients.length} dossier(s) affiche(s) sur {patients.length} dossier(s) assigne(s).
              </p>
            </div>
            <div className="chef-toolbar">
              <label className="chef-search">
                <Search size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Rechercher un patient"
                />
              </label>
              <label className="settings-field" style={{ minWidth: 220 }}>
                <span>Date derniere consultation</span>
                <input
                  type="date"
                  value={consultationDate}
                  onChange={(event) => setConsultationDate(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Derniere consultation</th>
                  <th>Constantes</th>
                  <th>Allergies</th>
                  <th>Medicaments</th>
                  <th>Tests</th>
                  <th>Acces</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="role-empty">Aucun patient assigne ne correspond au filtre.</div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>{patient.fullName || patient.name || patient.id}</td>
                      <td>{formatDateLabel(patient.lastConsultationDate)}</td>
                      <td>
                        {patient.vitals
                          ? [patient.vitals.weight, patient.vitals.height, patient.vitals.bloodPressure]
                              .filter(Boolean)
                              .join(' | ')
                          : '--'}
                      </td>
                      <td>{(patient.allergies || []).length}</td>
                      <td>{(patient.activeMedications || []).length}</td>
                      <td>{(patient.tests || []).length}</td>
                      <td>
                        <Link className="dashboard-button dashboard-button--ghost" to={`/record/${patient.id}`}>
                          Ouvrir
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

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

export default MedecinPatients;
