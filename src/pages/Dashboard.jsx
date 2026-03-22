import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import '../styles/Dashboard.css';

const ROLE_MEDECIN = 'Médecin';
const ROLE_MEDECIN_CHEF = 'Médecin Chef';
const ROLE_RECEPTION = 'Réceptionniste';

const Dashboard = ({ role }) => {
  const isAdmin = role === 'Administrateur';
  const isDoctor = role === ROLE_MEDECIN || role === ROLE_MEDECIN_CHEF;
  const isNurse = role === 'Infirmier';
  const isReception = role === ROLE_RECEPTION;

  const consultationData = [
    { day: 'Lun', 'Pédiatrie': 12, 'Médecine interne': 8 },
    { day: 'Mar', 'Pédiatrie': 14, 'Médecine interne': 9 },
    { day: 'Mer', 'Pédiatrie': 10, 'Médecine interne': 7 },
    { day: 'Jeu', 'Pédiatrie': 16, 'Médecine interne': 11 },
    { day: 'Ven', 'Pédiatrie': 9, 'Médecine interne': 6 },
  ];

  const serviceFrequencyData = [
    { name: 'Pédiatrie', 'Pédiatrie': 42, 'Gynécologie': 26, 'Médecine interne': 34 },
    { name: 'Gynécologie', 'Pédiatrie': 28, 'Gynécologie': 31, 'Médecine interne': 19 },
    { name: 'Médecine interne', 'Pédiatrie': 21, 'Gynécologie': 18, 'Médecine interne': 29 },
  ];

  const alerts = [
    { type: 'ALERTE', text: 'Résultats labo en attente', time: '10:24', class: 'alerte' },
    { type: 'ACTION', text: 'Nouveau service à valider', time: '09:40', class: 'action' },
    { type: 'STATUT', text: 'Sauvegarde terminée', time: '08:12', class: 'statut' },
  ];

  const todaysAppointments = [
    { label: '08:30 - Consultation pédiatrie', meta: 'Salle 2' },
    { label: '10:00 - Suivi post-op', meta: 'Salle 1' },
    { label: '11:15 - Visite de contrôle', meta: 'Salle 3' },
  ];

  const assignedPatients = [
    { label: 'A. Diallo', meta: 'Chambre 12' },
    { label: 'M. Bernard', meta: 'Chambre 08' },
    { label: 'S. Nguyen', meta: 'Chambre 05' },
  ];

  const nurseTasks = [
    { label: 'Prise de constantes', meta: 'Urgent' },
    { label: 'Préparation des pansements', meta: 'Bloc B' },
    { label: 'Suivi des médicaments', meta: 'Service A' },
  ];

  const frontDeskSchedule = [
    { label: '08:00 - Accueil consultations', meta: '12 RDV' },
    { label: '10:30 - Vaccinations', meta: '5 RDV' },
    { label: '14:00 - Consultations spéc.', meta: '8 RDV' },
  ];

  const waitingRoom = [
    { label: '5 patients en attente', meta: 'Priorité normale' },
    { label: '2 urgences', meta: 'Priorité haute' },
  ];

  return (
    <div className="dashboard-container">
      {isAdmin && (
        <>
          <div className="kpi-grid">
            <KPICard title="Utilisateurs actifs" value="128" icon="US" />
            <KPICard title="Total des services" value="14" icon="SV" />
            <KPICard title="Patients aujourd'hui" value="96" icon="PT" />
            <KPICard title="Analyses en attente" value="7" icon="LB" />
          </div>
          <div className="charts-grid">
            <div className="chart-container">
              <h3 className="chart-title">Tendance des consultations</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={consultationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Pédiatrie" stroke="#0d9488" strokeWidth={2} />
                  <Line type="monotone" dataKey="Médecine interne" stroke="#d97706" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-container">
              <h3 className="chart-title">Fréquentation par service</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Pédiatrie" fill="#0d9488" />
                  <Bar dataKey="Gynécologie" fill="#d97706" />
                  <Bar dataKey="Médecine interne" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="alerts-container">
            <h3 className="alerts-title">Activités récentes / Alertes</h3>
            <div className="alerts-list">
              {alerts.map((alert, idx) => (
                <div key={idx} className="alert-item">
                  <div className="alert-content">
                    <span className={`alert-badge ${alert.class}`}>{alert.type}</span>
                    <span className="alert-text">{alert.text}</span>
                  </div>
                  <span className="alert-time">{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(isDoctor || isNurse) && (
        <div className="role-grid">
          <RoleCard title="RDV du jour">
            <RoleList items={todaysAppointments} />
          </RoleCard>
          <RoleCard title="Patients assignés">
            <RoleList items={assignedPatients} />
          </RoleCard>
          {isNurse && (
            <RoleCard title="Tâches infirmières">
              <RoleList items={nurseTasks} />
            </RoleCard>
          )}
        </div>
      )}

      {isReception && (
        <div className="role-grid">
          <RoleCard title="Calendrier du jour">
            <RoleList items={frontDeskSchedule} />
          </RoleCard>
          <RoleCard title="Salle d'attente">
            <RoleList items={waitingRoom} />
          </RoleCard>
        </div>
      )}

      {!isAdmin && !isDoctor && !isNurse && !isReception && (
        <div className="role-empty">Rôle non reconnu.</div>
      )}
    </div>
  );
};

const KPICard = ({ title, value, icon }) => (
  <div className="kpi-card">
    <span className="kpi-label">{title}</span>
    <div className="kpi-header">
      <p className="kpi-value">{value}</p>
      <span className="kpi-icon">{icon}</span>
    </div>
  </div>
);

const RoleCard = ({ title, children }) => (
  <div className="role-card">
    <div className="role-card-title">{title}</div>
    <div className="role-card-body">{children}</div>
  </div>
);

const RoleList = ({ items }) => (
  <div className="role-list">
    {items.map((item, idx) => (
      <div key={`${item.label}-${idx}`} className="role-list-item">
        <span className="role-item-label">{item.label}</span>
        {item.meta && <span className="role-tag">{item.meta}</span>}
      </div>
    ))}
  </div>
);

export default Dashboard;
