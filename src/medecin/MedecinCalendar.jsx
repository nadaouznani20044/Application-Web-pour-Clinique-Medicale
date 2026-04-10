import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle2, Clock3, XCircle } from 'lucide-react';
import { getWeekRangeLabel, getWeekStart, getWeeklyPlanning, loadMedecinState } from './medecinStore';
import '../styles/Dashboard.css';

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));

const STATUS_LABELS = {
  free: 'Libre',
  occupied: 'Occupe',
  absence: 'Absence',
};

const MedecinCalendar = ({ doctorId, serviceId, serviceLabel }) => {
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart());
  const state = useMemo(
    () => loadMedecinState(doctorId, serviceId, serviceLabel || ''),
    [doctorId, serviceId, serviceLabel]
  );
  const weekPlanning = useMemo(() => getWeeklyPlanning(state, currentWeek), [state, currentWeek]);
  const weekRangeLabel = useMemo(() => getWeekRangeLabel(currentWeek), [currentWeek]);

  const planningCounts = useMemo(
    () => ({
      free: weekPlanning.filter((entry) => (entry.status || entry.type) === 'free').length,
      occupied: weekPlanning.filter((entry) => (entry.status || entry.type) === 'occupied' || (entry.status || entry.type) === 'presence').length,
      absence: weekPlanning.filter((entry) => (entry.status || entry.type) === 'absence').length,
    }),
    [weekPlanning]
  );

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Calendrier</span>
          <h1 className="dashboard-title">Agenda hebdomadaire</h1>
          <p className="dashboard-subtitle">
            Lecture seule de ton planning, des creneaux occupes et des absences.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={Calendar} label="Semaine" value={weekPlanning.length} hint={weekRangeLabel} tone="teal" />
        <MetricCard icon={CheckCircle2} label="Libres" value={planningCounts.free} hint="Creaneaux libres" tone="teal" />
        <MetricCard icon={Clock3} label="Occupes" value={planningCounts.occupied} hint="Consultations et actes" tone="orange" />
        <MetricCard icon={XCircle} label="Absences" value={planningCounts.absence} hint="Conge, formation, maladie" tone="violet" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Semaine courante</h2>
              <p className="dashboard-panel-subtitle">Navigation par semaine sans edition du planning.</p>
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
                Precedent
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
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Etat</th>
                </tr>
              </thead>
              <tbody>
                {weekPlanning.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="role-empty">Aucun creaneau enregistre pour cette semaine.</div>
                    </td>
                  </tr>
                ) : (
                  weekPlanning.map((entry) => {
                    const status = entry.status || entry.type || 'occupied';
                    return (
                      <tr key={entry.id}>
                        <td>{formatDateLabel(entry.date)}</td>
                        <td>{entry.time || '--'}</td>
                        <td>{entry.title || entry.reason || '--'}</td>
                        <td>{entry.type || 'occupied'}</td>
                        <td>
                          <span
                            className={`dashboard-chip ${
                              status === 'absence'
                                ? 'dashboard-chip--warning'
                                : status === 'free'
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

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Lecture rapide</h2>
              <p className="dashboard-panel-subtitle">Controle visuel des etats du planning.</p>
            </div>
          </div>

          <div className="dashboard-list">
            <div className="dashboard-list-item">
              <div className="dashboard-list-main">
                <div className="dashboard-list-icon dashboard-icon--teal">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div className="dashboard-list-title">Creneaux libres</div>
                  <div className="dashboard-list-meta">Slots disponibles dans la semaine courante</div>
                </div>
              </div>
              <span className="dashboard-chip dashboard-chip--success">{planningCounts.free}</span>
            </div>

            <div className="dashboard-list-item">
                <div className="dashboard-list-main">
                  <div className="dashboard-list-icon dashboard-icon--orange">
                    <Clock3 size={18} />
                  </div>
                  <div>
                  <div className="dashboard-list-title">Creneaux occupes</div>
                  <div className="dashboard-list-meta">Consultations et activites planifiees</div>
                </div>
              </div>
              <span className="dashboard-chip dashboard-chip--warning">{planningCounts.occupied}</span>
            </div>

            <div className="dashboard-list-item">
              <div className="dashboard-list-main">
                <div className="dashboard-list-icon dashboard-icon--violet">
                  <XCircle size={18} />
                </div>
                <div>
                  <div className="dashboard-list-title">Absences</div>
                  <div className="dashboard-list-meta">Conge, formation ou maladie</div>
                </div>
              </div>
              <span className="dashboard-chip dashboard-chip--neutral">{planningCounts.absence}</span>
            </div>
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

export default MedecinCalendar;
