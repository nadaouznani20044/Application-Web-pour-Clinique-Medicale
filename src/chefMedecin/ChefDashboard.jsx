import React, { useMemo } from 'react';
import { Activity, Calendar, Hospital, Users, ArrowRight, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  getServiceStats,
  getUpcomingAppointments,
  loadServiceState,
  getServiceLabel,
} from './chefStore';
import '../styles/Dashboard.css';

const ChefDashboard = ({ serviceId }) => {
  const state = useMemo(() => loadServiceState(serviceId), [serviceId]);
  const stats = useMemo(() => getServiceStats(state), [state]);
  const pendingAppointments = useMemo(
    () => getUpcomingAppointments(state).filter((appointment) => appointment.status === 'pending').slice(0, 6),
    [state]
  );
  const serviceDetails = [state.service.location, state.service.specialty].filter(Boolean).join(' - ');

  const statCards = [
    {
      label: 'Médecins',
      value: stats.doctors,
      hint: 'Équipe médicale active',
      icon: Users,
      tone: 'teal',
    },
    { label: 'Patients actifs', value: stats.activePatients, hint: 'Patients suivis dans le service', icon: Activity, tone: 'teal' },
    { label: 'RDV semaine', value: stats.weeklyAppointments, hint: 'Rendez-vous du service', icon: Calendar, tone: 'violet' },
    { label: 'Taux d\'occupation', value: `${stats.occupancyRate}%`, hint: 'Occupation des lits du service', icon: Hospital, tone: 'orange' },
  ];

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Médecin chef</span>
          <h1 className="dashboard-title">Service: {state.service.name || getServiceLabel(serviceId)}</h1>
          {serviceDetails && <p className="dashboard-subtitle">{serviceDetails}</p>}
        </div>
      </section>

      <section className="dashboard-stat-grid">
        {statCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <Panel title="Rendez-vous en attente" subtitle="Priorisés pour validation immédiate">
            <div className="dashboard-list">
              {pendingAppointments.length === 0 ? (
                <div className="role-empty">Aucun rendez-vous en attente pour ce service.</div>
              ) : (
                pendingAppointments.map((appointment) => (
                  <div key={appointment.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--orange">
                        <Clock3 size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">{appointment.patient}</div>
                        <div className="dashboard-list-meta">
                          {appointment.dayLabel} {appointment.date} - {appointment.time} - {appointment.doctorName}
                        </div>
                      </div>
                    </div>
                    <span className="dashboard-chip dashboard-chip--warning">En attente</span>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>

        <Panel title="Raccourcis métier" subtitle="Accès rapide aux pages du médecin chef">
          <div className="dashboard-list">
            {[
              { to: '/dashboard', label: 'Dashboard service', meta: 'Stats et alertes du service' },
              { to: '/planning', label: 'Planning hebdomadaire', meta: 'Créneaux, absences et semaine courante' },
              { to: '/calendar', label: 'Calendrier des RDV', meta: 'Validation des rendez-vous' },
              { to: '/patients', label: 'Dossiers patients', meta: 'Consultation en lecture seule' },
              { to: '/services', label: 'Gestion du service', meta: 'Médecins, infirmiers et chambres' },
              { to: '/analytics', label: 'Analytics', meta: 'Courbes par mois et par médecin' },
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

export default ChefDashboard;
