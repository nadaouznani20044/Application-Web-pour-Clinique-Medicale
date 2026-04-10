import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import {
  getWeekPlanning,
  getWeekPlanningCounts,
  getWeekRangeLabel,
  getWeekStart,
  loadInfirmierState,
} from './infirmierStore';
import '../styles/Dashboard.css';

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));

const STATUS_LABELS = {
  consultation: 'Consultation',
  occupation: 'Occupé',
  absence: 'Absence',
};

const InfirmierCalendar = ({ nurseId, serviceId, serviceLabel }) => {
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart());
  const state = useMemo(
    () => loadInfirmierState(nurseId, serviceId, serviceLabel || ''),
    [nurseId, serviceId, serviceLabel]
  );
  const weekPlanning = useMemo(() => getWeekPlanning(state, currentWeek), [state, currentWeek]);
  const weekCounts = useMemo(() => getWeekPlanningCounts(state, currentWeek), [state, currentWeek]);
  const weekRangeLabel = useMemo(() => getWeekRangeLabel(currentWeek), [currentWeek]);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Calendrier</span>
          <h1 className="dashboard-title">Planning du service</h1>
          <p className="dashboard-subtitle">
            Vue en lecture stricte pour préparer les patients avant les consultations.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={Calendar} label="Semaine" value={weekPlanning.length} hint={weekRangeLabel} tone="teal" />
        <MetricCard icon={CheckCircle2} label="Consultations" value={weekCounts.consultation} hint="Créneaux prévus" tone="teal" />
        <MetricCard icon={Clock3} label="Occupés" value={weekCounts.occupation} hint="Consultations et soins" tone="orange" />
        <MetricCard icon={XCircle} label="Absences" value={weekCounts.absence} hint="Congé, maladie, formation" tone="violet" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Semaine courante</h2>
                <p className="dashboard-panel-subtitle">
                  Navigation hebdomadaire sans possibilité de modification.
                </p>
              </div>
              <div className="chef-week-nav">
                <button
                  type="button"
                  className="dashboard-button dashboard-button--ghost"
                  onClick={() => {
                    const prev = new Date(currentWeek);
                    prev.setDate(currentWeek.getDate() - 7);
                    setCurrentWeek(prev);
                  }}
                >
                  <ArrowLeft size={16} />
                  Précédent
                </button>
                <button
                  type="button"
                  className="dashboard-button dashboard-button--ghost"
                  onClick={() => {
                    const next = new Date(currentWeek);
                    next.setDate(currentWeek.getDate() + 7);
                    setCurrentWeek(next);
                  }}
                >
                  Suivant
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Note</th>
                    <th>État</th>
                  </tr>
                </thead>
                <tbody>
                  {weekPlanning.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="role-empty">Aucun créneau planifié pour cette semaine.</div>
                      </td>
                    </tr>
                  ) : (
                    weekPlanning.map((entry) => {
                      const status = entry.status || entry.type || 'consultation';
                      return (
                        <tr key={entry.id}>
                          <td>{formatDateLabel(entry.date)}</td>
                          <td>{entry.time || '--'}</td>
                          <td>{entry.patientName || entry.title || '--'}</td>
                          <td>{entry.type || 'consultation'}</td>
                          <td>{entry.note || entry.reason || '--'}</td>
                          <td>
                            <span
                              className={`dashboard-chip ${
                                status === 'absence'
                                  ? 'dashboard-chip--warning'
                                  : status === 'occupation'
                                    ? 'dashboard-chip--success'
                                    : 'dashboard-chip--neutral'
                              }`}
                            >
                              {STATUS_LABELS[status] || status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
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
                <h2 className="dashboard-panel-title">Aide à la préparation</h2>
                <p className="dashboard-panel-subtitle">
                  Lecture des créneaux pour préparer les patients avant le passage médical.
                </p>
              </div>
            </div>

            <div className="dashboard-list">
              <div className="dashboard-list-item">
                <div className="dashboard-list-main">
                  <div className="dashboard-list-icon dashboard-icon--teal">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="dashboard-list-title">Consultations</div>
                    <div className="dashboard-list-meta">Créneaux visibles pour la préparation des patients</div>
                  </div>
                </div>
                <span className="dashboard-chip dashboard-chip--success">{weekCounts.consultation}</span>
              </div>

              <div className="dashboard-list-item">
                <div className="dashboard-list-main">
                  <div className="dashboard-list-icon dashboard-icon--orange">
                    <Clock3 size={18} />
                  </div>
                  <div>
                    <div className="dashboard-list-title">Occupés</div>
                    <div className="dashboard-list-meta">Périodes actives du service</div>
                  </div>
                </div>
                <span className="dashboard-chip dashboard-chip--warning">{weekCounts.occupation}</span>
              </div>

              <div className="dashboard-list-item">
                <div className="dashboard-list-main">
                  <div className="dashboard-list-icon dashboard-icon--violet">
                    <XCircle size={18} />
                  </div>
                  <div>
                    <div className="dashboard-list-title">Absences</div>
                    <div className="dashboard-list-meta">Congé, maladie ou formation</div>
                  </div>
                </div>
                <span className="dashboard-chip dashboard-chip--neutral">{weekCounts.absence}</span>
              </div>
            </div>
          </section>
        </div>
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

export default InfirmierCalendar;
