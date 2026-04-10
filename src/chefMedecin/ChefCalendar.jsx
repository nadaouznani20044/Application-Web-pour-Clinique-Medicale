import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, CheckCircle2, Clock3, CircleDashed, Plus, XCircle, Trash2 } from 'lucide-react';
import {
  getActiveWeekRange,
  getServiceLabel,
  getServiceStats,
  getWeekStart,
  getUpcomingAppointments,
  loadServiceState,
  saveServiceState,
} from './chefStore';
import '../styles/Dashboard.css';

const buildDraft = (state) => ({
  patient: '',
  doctorId: '',
  date: getWeekStart().toISOString().slice(0, 10),
  time: '09:00',
  reason: '',
});

const STATUS_LABELS = {
  all: 'Tous',
  pending: 'En attente',
  confirmed: 'Confirmés',
  refused: 'Refusés',
};

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));

const ChefCalendar = ({ serviceId }) => {
  const [state, setState] = useState(() => loadServiceState(serviceId));
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart());
  const [statusFilter, setStatusFilter] = useState('all');
  const [draft, setDraft] = useState(() => buildDraft(loadServiceState(serviceId)));

  const summary = useMemo(() => getServiceStats(state), [state]);
  const weekRange = useMemo(() => getActiveWeekRange(currentWeek), [currentWeek]);

  const weekAppointments = useMemo(() => {
    const start = getWeekStart(currentWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return getUpcomingAppointments(state)
      .filter((appointment) => {
        const date = new Date(`${appointment.date}T00:00:00`);
        const inWeek = date >= start && date <= end;
        const byStatus = statusFilter === 'all' || appointment.status === statusFilter;
        return inWeek && byStatus;
      })
      .sort((left, right) => {
        const statusRank = (value) => (value === 'pending' ? 0 : value === 'confirmed' ? 1 : 2);
        const byStatus = statusRank(left.status) - statusRank(right.status);
        if (byStatus !== 0) return byStatus;
        return `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`);
      });
  }, [currentWeek, state, statusFilter]);

  const counts = useMemo(
    () => ({
      pending: weekAppointments.filter((appointment) => appointment.status === 'pending').length,
      confirmed: weekAppointments.filter((appointment) => appointment.status === 'confirmed').length,
      refused: weekAppointments.filter((appointment) => appointment.status === 'refused').length,
    }),
    [weekAppointments]
  );

  const persist = (nextState) => {
    setState(nextState);
    saveServiceState(serviceId, nextState);
  };

  const handleStatusChange = (appointmentId, status) => {
    const nextAppointments = state.appointments.map((appointment) =>
      appointment.id === appointmentId ? { ...appointment, status } : appointment
    );
    persist({ ...state, appointments: nextAppointments });
  };

  const handleDelete = (appointmentId) => {
    persist({
      ...state,
      appointments: state.appointments.filter((appointment) => appointment.id !== appointmentId),
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextAppointment = {
      id: `${serviceId}-appointment-${Date.now()}`,
      date: draft.date,
      dayLabel: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(new Date(`${draft.date}T00:00:00`)),
      time: draft.time,
      patient: draft.patient,
      doctorId: draft.doctorId,
      doctorName: '',
      reason: draft.reason,
      status: 'pending',
      priority: 'high',
    };

    persist({
      ...state,
      appointments: [nextAppointment, ...state.appointments],
    });
    setDraft(buildDraft(state));
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Calendrier</span>
          <h1 className="dashboard-title">Rendez-vous du service - {state.service.name || getServiceLabel(serviceId)}</h1>
          <p className="dashboard-subtitle">
            Les rendez-vous en attente apparaissent d'abord, puis les rendez-vous confirmés.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={CircleDashed} label="En attente" value={counts.pending} hint="Validation prioritaire" tone="orange" />
        <MetricCard icon={CheckCircle2} label="Confirmés" value={counts.confirmed} hint="RDV validés" tone="teal" />
        <MetricCard icon={XCircle} label="Refusés" value={counts.refused} hint="RDV annulés ou refusés" tone="violet" />
        <MetricCard icon={Clock3} label="Total semaine" value={weekAppointments.length} hint={weekRange.label} tone="teal" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Semaine courante</h2>
                <p className="dashboard-panel-subtitle">Navigation par semaine et filtrage des statuts.</p>
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

            <div className="chef-toolbar">
              {['all', 'pending', 'confirmed', 'refused'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`dashboard-chip ${statusFilter === status ? 'dashboard-chip--success' : 'dashboard-chip--neutral'}`}
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
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Patient</th>
                    <th>Médecin</th>
                    <th>Motif</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {weekAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={7}>
                        <div className="role-empty">Aucun rendez-vous sur cette semaine.</div>
                      </td>
                    </tr>
                  ) : (
                    weekAppointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td>{formatDateLabel(appointment.date)}</td>
                        <td>{appointment.time}</td>
                        <td>{appointment.patient}</td>
                        <td>{appointment.doctorName}</td>
                        <td>{appointment.reason}</td>
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
                            {STATUS_LABELS[appointment.status] || appointment.status}
                          </span>
                        </td>
                        <td>
                          <div className="dashboard-row-actions">
                            {appointment.status === 'pending' && (
                              <>
                                <button
                                  type="button"
                                  className="dashboard-button dashboard-button--ghost"
                                  onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                                >
                                  Confirmer
                                </button>
                                <button
                                  type="button"
                                  className="dashboard-button dashboard-button--ghost"
                                  onClick={() => handleStatusChange(appointment.id, 'refused')}
                                >
                                  Refuser
                                </button>
                              </>
                            )}
                            <button
                              type="button"
                              className="dashboard-button dashboard-button--ghost"
                              onClick={() => handleDelete(appointment.id)}
                            >
                              <Trash2 size={14} />
                              Supprimer
                            </button>
                          </div>
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
              <h2 className="dashboard-panel-title">Nouveau rendez-vous</h2>
              <p className="dashboard-panel-subtitle">Création d'un RDV avec statut initial en attente.</p>
            </div>
          </div>

          <form className="settings-language-card" onSubmit={handleSubmit}>
            <label className="settings-field">
              <span>Patient</span>
              <input
                type="text"
                value={draft.patient}
                onChange={(event) => setDraft((current) => ({ ...current, patient: event.target.value }))}
                placeholder="Nom du patient"
              />
            </label>

            <label className="settings-field">
              <span>Médecin</span>
              <select
                value={draft.doctorId}
                onChange={(event) => setDraft((current) => ({ ...current, doctorId: event.target.value }))}
              >
                {state.staff.doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="chef-form-grid">
              <label className="settings-field">
                <span>Date</span>
                <input
                  type="date"
                  value={draft.date}
                  onChange={(event) => setDraft((current) => ({ ...current, date: event.target.value }))}
                />
              </label>

              <label className="settings-field">
                <span>Heure</span>
                <input
                  type="time"
                  value={draft.time}
                  onChange={(event) => setDraft((current) => ({ ...current, time: event.target.value }))}
                />
              </label>
            </div>

            <label className="settings-field">
              <span>Motif</span>
              <textarea
                rows={4}
                value={draft.reason}
                onChange={(event) => setDraft((current) => ({ ...current, reason: event.target.value }))}
              />
            </label>

            <button type="submit" className="dashboard-button dashboard-button--primary">
              <Plus size={16} />
              Ajouter le RDV
            </button>
          </form>
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

export default ChefCalendar;
