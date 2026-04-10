import React from 'react';
import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Hospital,
  Users,
  ShieldCheck,
} from 'lucide-react';
import '../styles/Dashboard.css';

const HOSPITAL_STATS = [
  {
    label: 'Patients hospitalisés',
    value: '',
    hint: '',
    icon: Hospital,
    tone: 'violet',
  },
  {
    label: 'Occupation moyenne',
    value: '',
    hint: '',
    icon: Activity,
    tone: 'teal',
  },
  {
    label: 'Lits disponibles',
    value: '',
    hint: '',
    icon: ClipboardList,
    tone: 'teal',
  },
  {
    label: 'Admissions du jour',
    value: '',
    hint: '',
    icon: Users,
    tone: 'orange',
  },
];

const WARD_STATS = [];

const INPATIENTS = [];

const HOSPITAL_ALERTS = [];

const Hospitalization = () => {
  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-badge">Administration</span>
          <h1 className="dashboard-title">Hospitalisations</h1>
          <p className="dashboard-subtitle">
            Vue centralisée des patients hospitalisés, de l’occupation des services et des
            alertes de suivi.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        {HOSPITAL_STATS.map((stat) => (
          <MetricCard key={stat.label} {...stat} />
        ))}
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <Panel title="Occupation des services" subtitle="Répartition des lits et du personnel">
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Patients</th>
                    <th>Occupation</th>
                    <th>Personnel</th>
                  </tr>
                </thead>
                <tbody>
                  {WARD_STATS.map((ward) => (
                    <tr key={ward.service}>
                      <td>{ward.service}</td>
                      <td>{ward.patients}</td>
                      <td>
                        <div className="dashboard-meter">
                          <div className="dashboard-meter-label">
                            <span>{ward.occupancy}%</span>
                            <span>{ward.status}</span>
                          </div>
                          <div className="dashboard-meter-bar">
                            <span
                              className={`dashboard-meter-fill dashboard-meter-fill--${ward.tone}`}
                              style={{ width: `${ward.occupancy}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>{ward.staff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <Panel title="Alertes d'hospitalisation" subtitle="Cas nécessitant une attention particulière">
            <div className="dashboard-list">
              {HOSPITAL_ALERTS.map((alert) => (
                <div key={alert.label} className={`dashboard-list-item dashboard-alert dashboard-alert--${alert.tone}`}>
                  <div className="dashboard-list-main">
                    <div className={`dashboard-list-icon dashboard-icon--${alert.tone}`}>
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <div className="dashboard-list-title">{alert.label}</div>
                      <div className="dashboard-list-meta">{alert.meta}</div>
                    </div>
                  </div>
                  <span className={`dashboard-chip dashboard-chip--${alert.tone}`}>
                    Surveillance
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="Patients hospitalisés" subtitle="Admissions et suivi en cours">
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Chambre</th>
                  <th>Service</th>
                  <th>Statut</th>
                  <th>Mise à jour</th>
                </tr>
              </thead>
              <tbody>
                {INPATIENTS.map((patient) => (
                  <tr key={patient.patient}>
                    <td>{patient.patient}</td>
                    <td>{patient.room}</td>
                    <td>{patient.service}</td>
                    <td>
                      <span className={`dashboard-chip dashboard-chip--${patient.tone}`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>{patient.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="dashboard-metrics-grid" style={{ marginTop: '1rem' }}>
            <MetricCard
              label="Surveillance critique"
              value="2"
              hint="Cas nécessitant une ronde rapprochée"
              icon={ShieldCheck}
              tone="danger"
            />
            <MetricCard
              label="Sorties prévues"
              value="3"
              hint="Patients prêts pour le transfert"
              icon={ClipboardList}
              tone="success"
            />
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

export default Hospitalization;
