import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar as CalendarIcon, Clock3, Users, Trash2, Plus } from 'lucide-react';
import {
  getActiveWeekRange,
  getServiceLabel,
  getServiceStats,
  getWeekStart,
  loadServiceState,
  saveServiceState,
} from './chefStore';
import '../styles/Dashboard.css';

const createPlanningDraft = (serviceId, state) => {
  const weekStart = getWeekStart();
  return {
    id: null,
    date: weekStart.toISOString().slice(0, 10),
    time: '08:00',
    doctorId: '',
    type: 'presence',
    title: '',
    reason: '',
  };
};

const toTimeValue = (value) => {
  if (!value) return '08:00';
  return value.includes('-') ? value.split('-')[0].trim() : value;
};

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${value}T00:00:00`));

const ChefPlanning = ({ serviceId }) => {
  const [state, setState] = useState(() => loadServiceState(serviceId));
  const [currentWeek, setCurrentWeek] = useState(() => getWeekStart());
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(() => createPlanningDraft(serviceId, loadServiceState(serviceId)));

  const summary = useMemo(() => getServiceStats(state), [state]);
  const weekRange = useMemo(() => getActiveWeekRange(currentWeek), [currentWeek]);

  const filteredPlanning = useMemo(() => {
    const start = getWeekStart(currentWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return [...(state.planning || [])]
      .filter((entry) => {
        const date = new Date(`${entry.date}T00:00:00`);
        return date >= start && date <= end;
      })
      .sort((left, right) => {
        const byDate = `${left.date} ${left.time}`.localeCompare(`${right.date} ${right.time}`);
        if (byDate !== 0) return byDate;
        return left.type === 'absence' ? -1 : 1;
      });
  }, [currentWeek, state.planning]);

  const doctorOptions = state?.staff?.doctors || [];

  const absencesCount = filteredPlanning.filter((entry) => entry.type === 'absence').length;

  const persist = (nextState) => {
    setState(nextState);
    saveServiceState(serviceId, nextState);
  };

  const resetDraft = () => {
    setEditingId(null);
    setDraft(createPlanningDraft(serviceId, state));
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    setDraft({
      id: entry.id,
      date: entry.date,
      time: toTimeValue(entry.time),
      doctorId: entry.doctorId,
      type: entry.type,
      title: entry.title,
      reason: entry.reason,
    });
  };

  const handleDelete = (entryId) => {
    const nextState = {
      ...state,
      planning: state.planning.filter((entry) => entry.id !== entryId),
    };
    persist(nextState);
    if (editingId === entryId) {
      resetDraft();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextEntry = {
      id: editingId || `${serviceId}-planning-${Date.now()}`,
      date: draft.date,
      dayLabel: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(new Date(`${draft.date}T00:00:00`)),
      doctorId: draft.doctorId,
      doctorName: '',
      time: draft.type === 'absence' ? 'Toute la journée' : draft.time,
      type: draft.type,
      title: draft.type === 'absence' ? '' : draft.title,
      reason: draft.reason,
    };

    const nextPlanning = editingId
      ? state.planning.map((entry) => (entry.id === editingId ? nextEntry : entry))
      : [nextEntry, ...state.planning];

    persist({ ...state, planning: nextPlanning });
    resetDraft();
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Planning</span>
          <h1 className="dashboard-title">Planning hebdomadaire - {state.service.name || getServiceLabel(serviceId)}</h1>
          <p className="dashboard-subtitle">
            Gère les créneaux du service, les absences et les plages de consultation.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={CalendarIcon} label="Créneaux" value={filteredPlanning.length} hint={weekRange.label} tone="teal" />
        <MetricCard icon={Clock3} label="Absences" value={absencesCount} hint="Congé, formation ou maladie" tone="orange" />
        <MetricCard icon={Users} label="Médecins" value={summary.doctors} hint="Équipe médicale du service" tone="teal" />
        <MetricCard icon={ArrowRight} label="Semaine" value={`${String(currentWeek.getDate()).padStart(2, '0')}`} hint="Navigation par semaine" tone="violet" />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <section className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2 className="dashboard-panel-title">Semaine courante</h2>
                <p className="dashboard-panel-subtitle">Utilise les boutons pour avancer ou revenir d'une semaine.</p>
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

            <div className="dashboard-list">
              {filteredPlanning.length === 0 ? (
                <div className="role-empty">Aucun créneau planifié sur cette semaine.</div>
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Heure</th>
                        <th>Médecin</th>
                        <th>Type</th>
                        <th>Motif</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlanning.map((entry) => (
                        <tr key={entry.id}>
                          <td>{formatDateLabel(entry.date)}</td>
                          <td>{entry.time}</td>
                          <td>{entry.doctorName}</td>
                          <td>
                            <span
                              className={`dashboard-chip ${
                                entry.type === 'absence'
                                  ? 'dashboard-chip--warning'
                                  : 'dashboard-chip--neutral'
                              }`}
                            >
                              {entry.type === 'absence' ? 'Absence' : 'Présence'}
                            </span>
                          </td>
                          <td>{entry.reason}</td>
                          <td>
                            <div className="dashboard-row-actions">
                              <button
                                type="button"
                                className="dashboard-button dashboard-button--ghost"
                                onClick={() => handleEdit(entry)}
                              >
                                Modifier
                              </button>
                              <button
                                type="button"
                                className="dashboard-button dashboard-button--ghost"
                                onClick={() => handleDelete(entry.id)}
                              >
                                <Trash2 size={14} />
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">
                {editingId ? 'Modifier un créneau' : 'Créer un créneau'}
              </h2>
              <p className="dashboard-panel-subtitle">
                Les absences sont gérées comme un type de créneau spécial.
              </p>
            </div>
          </div>

          <form className="settings-language-card" onSubmit={handleSubmit}>
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
                disabled={draft.type === 'absence'}
              />
            </label>

            <label className="settings-field">
              <span>Médecin</span>
              <select
                value={draft.doctorId}
                onChange={(event) => setDraft((current) => ({ ...current, doctorId: event.target.value }))}
              >
                {doctorOptions.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="settings-field">
              <span>Type</span>
              <select
                value={draft.type}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    type: event.target.value,
                    title: event.target.value === 'absence' ? '' : current.title,
                    time: event.target.value === 'absence' ? '00:00' : current.time,
                  }))
                }
              >
                <option value="presence">Présence</option>
                <option value="absence">Absence</option>
              </select>
            </label>

            <label className="settings-field">
              <span>Titre</span>
              <input
                type="text"
                value={draft.title}
                onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                disabled={draft.type === 'absence'}
              />
            </label>

            <label className="settings-field">
              <span>Motif / note</span>
              <textarea
                value={draft.reason}
                onChange={(event) => setDraft((current) => ({ ...current, reason: event.target.value }))}
                rows={4}
              />
            </label>

            <div className="dashboard-actions-row">
              <button type="submit" className="dashboard-button dashboard-button--primary">
                <Plus size={16} />
                {editingId ? 'Enregistrer' : 'Ajouter'}
              </button>
              <button type="button" className="dashboard-button dashboard-button--ghost" onClick={resetDraft}>
                Réinitialiser
              </button>
            </div>
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

export default ChefPlanning;
