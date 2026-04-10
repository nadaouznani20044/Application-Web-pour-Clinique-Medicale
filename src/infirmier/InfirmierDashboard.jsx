import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock3, Hospital, ArrowRight, Users, Pill, ClipboardList } from 'lucide-react';
import {
  getAssignedPatients,
  getDashboardStats,
  getPendingMedicationTasks,
  getTodayPlanning,
  loadInfirmierState,
} from './infirmierStore';
import '../styles/Dashboard.css';

const InfirmierDashboard = ({ nurseId, serviceId, serviceLabel }) => {
  const state = useMemo(
    () => loadInfirmierState(nurseId, serviceId, serviceLabel || ''),
    [nurseId, serviceId, serviceLabel]
  );

  const stats = useMemo(() => getDashboardStats(state, nurseId, serviceId), [state, nurseId, serviceId]);
  const patients = useMemo(() => getAssignedPatients(state, nurseId, serviceId), [state, nurseId, serviceId]);
  const pendingMedicationTasks = useMemo(
    () => getPendingMedicationTasks(state, nurseId, serviceId),
    [state, nurseId, serviceId]
  );
  const todayPlanning = useMemo(() => getTodayPlanning(state), [state]);

  const statCards = [
    {
      label: 'Patients assignés',
      value: stats.assignedPatients,
      hint: 'Patients sous ta responsabilité',
      icon: Users,
      tone: 'teal',
    },
    {
      label: "Consultations aujourd'hui",
      value: stats.todayConsultations,
      hint: 'Planning du service',
      icon: Calendar,
      tone: 'teal',
    },
    {
      label: 'Soins en attente',
      value: stats.pendingCare,
      hint: 'Médicaments et pansements',
      icon: Clock3,
      tone: 'orange',
    },
    {
      label: 'Service',
      value: stats.serviceLabel || serviceLabel || '--',
      hint: 'Périmètre du compte',
      icon: Hospital,
      tone: 'violet',
    },
  ];

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Infirmier</span>
          <h1 className="dashboard-title">{serviceLabel || 'Service'}</h1>
          <p className="dashboard-subtitle">
            Identifiant infirmier: {nurseId || '--'} - Vue limitée aux patients assignés et au planning du service.
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
          <Panel title="Patients assignés" subtitle="Patients hospitalisés et suivis par ton compte">
            <div className="dashboard-list">
              {patients.length === 0 ? (
                <div className="role-empty">Aucun patient assigné pour le moment.</div>
              ) : (
                patients.map((patient) => (
                  <div key={patient.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--teal">
                        <Users size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">{patient.fullName || patient.name || patient.id}</div>
                        <div className="dashboard-list-meta">
                          Chambre: {patient.room || patient.chambre || '--'} - État: {patient.status || '--'}
                        </div>
                      </div>
                    </div>
                    <span className="dashboard-chip dashboard-chip--neutral">
                      {patient.vitals?.bloodPressure || '--'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>

        <div className="dashboard-stack">
          <Panel title="Médicaments à administrer" subtitle="Prescriptions à confirmer par l’infirmier">
            <div className="dashboard-list">
              {pendingMedicationTasks.length === 0 ? (
                <div className="role-empty">Aucun médicament en attente.</div>
              ) : (
                pendingMedicationTasks.map((task) => (
                  <div key={task.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--orange">
                        <Pill size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">{task.patientName}</div>
                        <div className="dashboard-list-meta">
                          {task.medication} {task.dosage ? `- ${task.dosage}` : ''} {task.duration ? `- ${task.duration}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="dashboard-chip dashboard-chip--warning">En attente</span>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Planning du jour" subtitle="Consultations et soins à préparer">
            <div className="dashboard-list">
              {todayPlanning.length === 0 ? (
                <div className="role-empty">Aucun créneau planifié aujourd’hui.</div>
              ) : (
                todayPlanning.map((entry) => (
                  <div key={entry.id} className="dashboard-list-item">
                    <div className="dashboard-list-main">
                      <div className="dashboard-list-icon dashboard-icon--teal">
                        <ClipboardList size={18} />
                      </div>
                      <div>
                        <div className="dashboard-list-title">
                          {entry.time || '--'} - {entry.patientName || entry.title || 'Patient'}
                        </div>
                        <div className="dashboard-list-meta">
                          {entry.type || 'consultation'} - {entry.note || entry.reason || 'Aucune note'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="Accès rapides" subtitle="Navigation autorisée">
            <div className="dashboard-list">
              {[
                { to: '/patients', label: 'Patients', meta: 'Dossiers assignés' },
                { to: '/calendrier', label: 'Calendrier', meta: 'Planning du service' },
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

export default InfirmierDashboard;
