import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock3, CircleDashed, CheckCircle2, Activity } from 'lucide-react';
import { getMedecinStats, getTodayAppointments, loadMedecinState } from './medecinStore';
import '../styles/Dashboard.css';

const STATUS_LABELS = {
  all: 'Tous',
  pending: 'En attente',
  confirmed: 'Confirme',
  in_progress: 'En cours',
  upcoming: 'A venir',
  refused: 'Refuse',
};

const formatDateLabel = (value) => {
  if (!value) return '--';
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date);
};

const MedecinAppointments = ({ doctorId, serviceId, serviceLabel }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const state = useMemo(
    () => loadMedecinState(doctorId, serviceId, serviceLabel || ''),
    [doctorId, serviceId, serviceLabel]
  );
  const stats = useMemo(() => getMedecinStats(state, doctorId), [state, doctorId]);
  const todayAppointments = useMemo(() => getTodayAppointments(state), [state]);

  const filteredAppointments = useMemo(() => {
    if (statusFilter === 'all') {
      return todayAppointments;
    }
    return todayAppointments.filter((appointment) => appointment.status === statusFilter);
  }, [statusFilter, todayAppointments]);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Rendez-vous</span>
          <h1 className="dashboard-title">Mes consultations du jour</h1>
          <p className="dashboard-subtitle">
            RDV classes par heure, avec les statuts visibles pour chaque patient.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={Calendar} label="Aujourd'hui" value={stats.todayAppointments} hint="Consultations du jour" tone="teal" />
        <MetricCard icon={CircleDashed} label="En attente" value={stats.pendingAppointments} hint="Priorite de suivi" tone="orange" />
        <MetricCard icon={CheckCircle2} label="Confirmes" value={todayAppointments.filter((appointment) => appointment.status === 'confirmed').length} hint="RDV validés" tone="teal" />
        <MetricCard icon={Activity} label="Total" value={todayAppointments.length} hint="Vue de la journee" tone="violet" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Rendez-vous du jour</h2>
              <p className="dashboard-panel-subtitle">Filtre par statut avant d'ouvrir un dossier.</p>
            </div>
          </div>

          <div className="chef-toolbar">
            {Object.keys(STATUS_LABELS).map((status) => (
              <button
                key={status}
                type="button"
                className={`dashboard-chip ${
                  statusFilter === status ? 'dashboard-chip--success' : 'dashboard-chip--neutral'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {STATUS_LABELS[status]}
              </button>
            ))}
          </div>

          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Heure</th>
                  <th>Patient</th>
                  <th>Motif</th>
                  <th>Statut</th>
                  <th>Acces dossier</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="role-empty">Aucun rendez-vous a afficher.</div>
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.time}</td>
                      <td>{appointment.patientName || appointment.patient || '--'}</td>
                      <td>{appointment.reason || 'Consultation'}</td>
                      <td>
                        <span
                          className={`dashboard-chip ${
                            appointment.status === 'pending'
                              ? 'dashboard-chip--warning'
                              : appointment.status === 'confirmed'
                                ? 'dashboard-chip--success'
                                : 'dashboard-chip--neutral'
                          }`}
                        >
                          {STATUS_LABELS[appointment.status] || appointment.status || 'upcoming'}
                        </span>
                      </td>
                      <td>
                        {appointment.patientId ? (
                          <Link className="dashboard-button dashboard-button--ghost" to={`/record/${appointment.patientId}`}>
                            Ouvrir
                          </Link>
                        ) : (
                          '--'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Lectures rapides</h2>
              <p className="dashboard-panel-subtitle">Acces direct a la fiche patient depuis le rendez-vous.</p>
            </div>
          </div>

          <div className="dashboard-list">
            {filteredAppointments.length === 0 ? (
              <div className="role-empty">Aucun rendez-vous selectionne.</div>
            ) : (
              filteredAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="dashboard-list-item">
                  <div className="dashboard-list-main">
                    <div className="dashboard-list-icon dashboard-icon--teal">
                      <Clock3 size={18} />
                    </div>
                    <div>
                      <div className="dashboard-list-title">
                        {formatDateLabel(appointment.date)} - {appointment.time}
                      </div>
                      <div className="dashboard-list-meta">
                        {appointment.patientName || appointment.patient || '--'} - {appointment.reason || 'Consultation'}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
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

export default MedecinAppointments;
