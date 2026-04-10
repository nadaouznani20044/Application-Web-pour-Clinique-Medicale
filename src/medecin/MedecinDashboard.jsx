import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight, Calendar, Clock3, FileText, Users } from 'lucide-react';
import {
  getMedecinStats,
  getOwnedPatients,
  getPendingAppointments,
  getTodayAppointments,
  loadMedecinState,
} from './medecinStore';
import '../styles/Dashboard.css';

const MedecinDashboard = ({ doctorId, serviceId, serviceLabel }) => {
  const state = useMemo(
    () => loadMedecinState(doctorId, serviceId, serviceLabel || ''),
    [doctorId, serviceId, serviceLabel]
  );

  const stats = useMemo(() => getMedecinStats(state, doctorId), [state, doctorId]);
  const todayAppointments = useMemo(() => getTodayAppointments(state), [state]);
  const pendingAppointments = useMemo(() => getPendingAppointments(state), [state]);
  const ownedPatients = useMemo(() => getOwnedPatients(state, doctorId), [state, doctorId]);

  const serviceName = state.doctor.serviceLabel || 'Service';

  const statCards = [
    {
      label: "RDV aujourd'hui",
      value: stats.todayAppointments,
      hint: 'Consultations du jour',
      icon: Calendar,
      tone: 'teal',
    },
    {
      label: 'Mes patients',
      value: stats.assignedPatients,
      hint: 'Patients scopes par identifiant',
      icon: Users,
      tone: 'teal',
    },
    {
      label: 'En attente',
      value: stats.pendingAppointments,
      hint: 'Rendez-vous a valider ou suivre',
      icon: Clock3,
      tone: 'orange',
    },
    {
      label: 'Consultations',
      value: stats.consultations,
      hint: 'Historique enregistre dans le dossier',
      icon: FileText,
      tone: 'violet',
    },
  ];

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Medecin traitant</span>
          <h1 className="dashboard-title">{serviceName}</h1>
          <p className="dashboard-subtitle">
            Identifiant medecin: {doctorId || '--'} - Lecture de tes patients et de ton agenda.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        {statCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <Panel title="Rendez-vous du jour" subtitle="Liste triee par heure">
            <div className="dashboard-list">
              {todayAppointments.length === 0 ? (
                <div className="role-empty">Aucun rendez-vous enregistre pour aujourd'hui.</div>
              ) : (
                todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--teal">
                        <Calendar size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">
                          {appointment.time} - {appointment.patientName || appointment.patient || 'Patient'}
                        </div>
                        <div className="dashboard-list-meta">
                          {appointment.reason || 'Consultation'} - {appointment.status || 'upcoming'}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`dashboard-chip ${
                        appointment.status === 'pending'
                          ? 'dashboard-chip--warning'
                          : appointment.status === 'confirmed'
                            ? 'dashboard-chip--success'
                            : 'dashboard-chip--neutral'
                      }`}
                    >
                      {appointment.status || 'upcoming'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>

        <div className="dashboard-stack">
          <Panel title="En attente" subtitle="Priorite aux rendez-vous non confirmes">
            <div className="dashboard-list">
              {pendingAppointments.length === 0 ? (
                <div className="role-empty">Aucun rendez-vous en attente.</div>
              ) : (
                pendingAppointments.map((appointment) => (
                  <div key={appointment.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--orange">
                        <Clock3 size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">
                          {appointment.patientName || appointment.patient || 'Patient'}
                        </div>
                        <div className="dashboard-list-meta">
                          {appointment.date} - {appointment.time}
                        </div>
                      </div>
                    </div>
                    <span className="dashboard-chip dashboard-chip--warning">Pending</span>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Acces rapide" subtitle="Pages ouvertes pour le medecin">
            <div className="dashboard-list">
              {[
                { to: '/patients', label: 'Mes patients', meta: 'Liste scopes par doctorId' },
                { to: '/appointments', label: 'Rendez-vous', meta: 'Consultations du jour' },
                { to: '/calendar', label: 'Calendrier', meta: 'Agenda et planning lecture seule' },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="dashboard-list-item dashboard-list-link">
                  <div className="dashboard-list-main">
                    <div className="dashboard-list-icon dashboard-icon--teal">
                      <ArrowRight size={18} />
                    </div>
                    <div>
                      <div className="dashboard-list-title">{item.label}</div>
                      <div className="dashboard-list-meta">{item.meta}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <Panel title="Mes patients" subtitle="Comptage des dossiers assignes">
            {ownedPatients.length === 0 ? (
              <div className="role-empty">Aucun patient assigne pour le moment.</div>
            ) : (
              <div className="dashboard-list">
                {ownedPatients.slice(0, 5).map((patient) => (
                  <div key={patient.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--teal">
                        <Activity size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">{patient.fullName || patient.name || patient.id}</div>
                        <div className="dashboard-list-meta">
                          Derniere consultation: {patient.lastConsultationDate || '--'}
                        </div>
                      </div>
                    </div>
                    <Link className="dashboard-button dashboard-button--ghost" to={`/record/${patient.id}`}>
                      Ouvrir
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
};

const Panel = ({ title, subtitle, children }) => (
  <section className="dashboard-panel">
    <div className="dashboard-panel-header">
      <div>
        <h2 className="dashboard-panel-title">{title}</h2>
        {subtitle && <p className="dashboard-panel-subtitle">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
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

export default MedecinDashboard;
