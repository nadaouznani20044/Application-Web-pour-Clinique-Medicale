import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Calendar,
  Clock3,
  Database,
  FileText,
  Hospital,
  LayoutDashboard,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import '../styles/Dashboard.css';

const ROLE_MEDECIN = 'Médecin';
const ROLE_MEDECIN_CHEF = 'Médecin Chef';
const ROLE_RECEPTION = 'Réceptionniste';

const ADMIN_TABS = [
  { id: 'overview', label: "Vue d'ensemble", icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'logs', label: "Logs d'activité", icon: FileText },
  { id: 'access', label: 'Gestion des accès', icon: ShieldCheck },
];

const ADMIN_STATS = [
  {
    label: 'Utilisateurs',
    value: '',
    hint: '',
    icon: Users,
    tone: 'teal',
  },
  {
    label: 'Services',
    value: '',
    hint: '',
    icon: Hospital,
    tone: 'teal',
  },
  {
    label: 'Patients',
    value: '',
    hint: '',
    icon: Activity,
    tone: 'violet',
  },
  {
    label: 'Consultations',
    value: '',
    hint: '',
    icon: Calendar,
    tone: 'orange',
  },
];

const SYSTEM_ALERTS = [];

const RECENT_ACTIVITY = [];

const SERVICE_STATS = [];

const ROLE_DISTRIBUTION = [];

const PATIENT_BREAKDOWN = [];

const CONSULTATION_TRENDS = [];

const AUDIT_LOGS = [];

const ACCESS_ROWS = [];

const DASHBOARD_PERMISSION_LABELS = {
  dashboard: 'Tableau de bord',
  users: 'Utilisateurs',
  services: 'Services',
  patients: 'Patients',
  calendar: 'Calendrier',
  hospitalization: 'Hospitalisations',
  settings: 'Paramètres système',
};

const STAFF_APPOINTMENTS = [];

const ASSIGNED_PATIENTS = [];

const NURSE_TASKS = [];

const FRONT_DESK_SCHEDULE = [];

const WAITING_ROOM = [];

const Dashboard = ({ role }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = role === 'Administrateur';
  const isDoctor = role === ROLE_MEDECIN || role === ROLE_MEDECIN_CHEF;
  const isNurse = role === 'Infirmier';
  const isReception = role === ROLE_RECEPTION;

  const renderAdminContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="dashboard-grid dashboard-grid--analytics">
            <div className="dashboard-stack">
              <Panel title="Utilisateurs par rôle" subtitle="Répartition actuelle des comptes">
                <div className="dashboard-meter-list">
                  {ROLE_DISTRIBUTION.map((item) => (
                    <ProgressRow
                      key={item.role}
                      label={item.role}
                      value={item.percent}
                      meta={`${item.percent}% (${item.count} utilisateurs)`}
                      tone={item.tone}
                    />
                  ))}
                </div>
              </Panel>

              <Panel title="Répartition des patients" subtitle="Hospitalisés et ambulatoires">
                <div className="dashboard-meter-list">
                  {PATIENT_BREAKDOWN.map((item) => (
                    <ProgressRow
                      key={item.label}
                      label={item.label}
                      value={item.percent}
                      meta={`${item.percent}% (${item.count})`}
                      tone={item.tone}
                    />
                  ))}
                </div>
              </Panel>
            </div>

            <div className="dashboard-stack">
              <Panel title="Tendance des consultations" subtitle="Volume observé sur la semaine">
                <div className="dashboard-chart">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={CONSULTATION_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pediatrie"
                        name="Pédiatrie"
                        stroke="#0d9488"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="medecineInterne"
                        name="Médecine interne"
                        stroke="#ea580c"
                        strokeWidth={3}
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Panel>

              <Panel title="Indicateurs clés" subtitle="Synthèse de la période actuelle">
                <div className="dashboard-metrics-grid">
                  <MetricCard
                    label="Aujourd'hui"
                    value=""
                    hint=""
                    icon={Calendar}
                    tone="teal"
                  />
                  <MetricCard
                    label="Cette semaine"
                    value=""
                    hint=""
                    icon={BarChart3}
                    tone="teal"
                  />
                  <MetricCard
                    label="Ce mois"
                    value=""
                    hint=""
                    icon={Activity}
                    tone="violet"
                  />
                  <MetricCard
                    label="Moyenne / jour"
                    value=""
                    hint=""
                    icon={Clock3}
                    tone="orange"
                  />
                </div>
              </Panel>
            </div>
          </div>
        );

      case 'logs':
        return (
          <Panel title="Logs d'activité" subtitle="Historique des actions sensibles">
            <div className="dashboard-table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Date / heure</th>
                    <th>Utilisateur</th>
                    <th>Action</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {AUDIT_LOGS.map((log) => (
                    <tr key={`${log.date}-${log.user}-${log.action}`}>
                      <td>{log.date}</td>
                      <td>{log.user}</td>
                      <td>{log.action}</td>
                      <td>
                        <span className={`dashboard-chip dashboard-chip--${log.tone}`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        );

      case 'access':
        return (
          <div className="dashboard-grid dashboard-grid--access">
            <Panel title="Gestion des accès" subtitle="Aperçu des droits par rôle">
              <div className="dashboard-table-wrapper">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Rôle</th>
                      <th>Utilisateurs</th>
                      <th>Accès</th>
                      <th>Dernière connexion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACCESS_ROWS.map((row) => (
                      <tr key={row.role}>
                        <td>{row.role}</td>
                        <td>{row.users}</td>
                        <td>
                          <span className="dashboard-chip dashboard-chip--info">{row.access}</span>
                        </td>
                        <td>{row.lastConnection}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Permissions détaillées" subtitle="Fonctions disponibles pour chaque rôle">
              <div className="dashboard-access-grid">
                {ACCESS_ROWS.map((row) => (
                  <article key={row.role} className="dashboard-access-card">
                    <div className="dashboard-access-head">
                      <div>
                        <div className="dashboard-list-title">{row.role}</div>
                        <div className="dashboard-list-meta">{row.users} utilisateurs</div>
                      </div>
                      <span className="dashboard-chip dashboard-chip--neutral">{row.access}</span>
                    </div>
                    <div className="dashboard-chip-list">
                      {row.permissions.map((permission) => (
                        <span key={permission} className="dashboard-chip dashboard-chip--neutral">
                          {DASHBOARD_PERMISSION_LABELS[permission] || permission}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </Panel>
          </div>
        );

      case 'overview':
      default:
        return (
          <div className="dashboard-grid dashboard-grid--overview">
            <div className="dashboard-stack">
              <Panel title="Alertes système" subtitle="Points d'attention immédiats">
                <div className="dashboard-list">
                  {SYSTEM_ALERTS.map((alert) => (
                    <div
                      key={alert.title}
                      className={`dashboard-list-item dashboard-alert dashboard-alert--${alert.tone}`}
                    >
                      <div className="dashboard-list-main">
                        <div className={`dashboard-list-icon dashboard-icon--${alert.tone}`}>
                          <alert.icon size={18} />
                        </div>
                        <div>
                          <div className="dashboard-list-title">{alert.title}</div>
                          <div className="dashboard-list-meta">{alert.meta}</div>
                        </div>
                      </div>

                      <div className="dashboard-list-actions">
                        <span className={`dashboard-chip dashboard-chip--${alert.tone}`}>
                          {alert.level}
                        </span>
                        <button type="button" className="dashboard-link-button">
                          {alert.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Activité récente" subtitle="Dernières opérations enregistrées">
                <div className="dashboard-list">
                  {RECENT_ACTIVITY.map((item) => (
                    <div key={item.title} className="dashboard-list-item">
                      <div className="dashboard-list-main">
                        <div className={`dashboard-list-icon dashboard-icon--${item.tone}`}>
                          <item.icon size={18} />
                        </div>
                        <div>
                          <div className="dashboard-list-title">{item.title}</div>
                          <div className="dashboard-list-meta">{item.meta}</div>
                        </div>
                      </div>

                      <div className="dashboard-list-actions">
                        <span className="dashboard-muted">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <Panel title="Statistiques par service" subtitle="Occupation, patients et personnel">
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
                    {SERVICE_STATS.map((service) => (
                      <tr key={service.name}>
                        <td>{service.name}</td>
                        <td>{service.patients}</td>
                        <td>
                          <div className="dashboard-meter">
                            <div className="dashboard-meter-label">
                              <span>{service.occupancy}%</span>
                              <span>{service.status}</span>
                            </div>
                            <div className="dashboard-meter-bar">
                              <span
                                className={`dashboard-meter-fill dashboard-meter-fill--${service.tone}`}
                                style={{ width: `${service.occupancy}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{service.staff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        );
    }
  };

  const renderStaffDashboard = () => {
    const title = isDoctor
      ? 'Espace médical'
      : isNurse
        ? 'Espace infirmier'
        : isReception
          ? 'Accueil et rendez-vous'
          : 'Tableau de bord';

    const subtitle = isDoctor
      ? 'Suivi des patients, consultations et rendez-vous du jour.'
      : isNurse
        ? 'Suivi clinique, tâches prioritaires et patients assignés.'
        : isReception
          ? 'Planning du jour, accueil et gestion des rendez-vous.'
          : 'Vue simplifiée de votre activité quotidienne.';

    return (
      <>
        <section className="dashboard-hero dashboard-hero--compact">
          <div>
            <span className="dashboard-badge">Vue métier</span>
            <h1 className="dashboard-title">{title}</h1>
            <p className="dashboard-subtitle">{subtitle}</p>
          </div>
        </section>

        <div className="role-grid">
          <RoleCard title="RDV du jour">
            <RoleList items={STAFF_APPOINTMENTS} />
          </RoleCard>

          <RoleCard title="Patients assignés">
            <RoleList items={ASSIGNED_PATIENTS} />
          </RoleCard>

          {isNurse && (
            <RoleCard title="Tâches infirmières">
              <RoleList items={NURSE_TASKS} />
            </RoleCard>
          )}

          {isReception && (
            <>
              <RoleCard title="Calendrier du jour">
                <RoleList items={FRONT_DESK_SCHEDULE} />
              </RoleCard>

              <RoleCard title="Salle d'attente">
                <RoleList items={WAITING_ROOM} />
              </RoleCard>
            </>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="dashboard-shell">
      {isAdmin ? (
        <>
          <section className="dashboard-hero">
            <div>
              <span className="dashboard-badge">Administrateur global</span>
              <h1 className="dashboard-title">Dashboard Administrateur</h1>
              <p className="dashboard-subtitle">
                Vue d'ensemble globale du système avec les indicateurs, les alertes et les logs.
              </p>
            </div>

            <div className="dashboard-hero-actions">
              <button type="button" className="dashboard-button dashboard-button--ghost">
                <RefreshCw size={16} />
                Synchroniser
              </button>
              <button type="button" className="dashboard-button dashboard-button--primary">
                <Database size={16} />
                Sauvegarder
              </button>
            </div>
          </section>

          <section className="dashboard-stat-grid">
            {ADMIN_STATS.map((stat) => (
              <MetricCard key={stat.label} {...stat} />
            ))}
          </section>

          <section className="dashboard-tabs" role="tablist" aria-label="Sections administrateur">
            {ADMIN_TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`dashboard-tab ${active ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </section>

          {renderAdminContent()}

        </>
      ) : (
        renderStaffDashboard()
      )}
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

const ProgressRow = ({ label, value, meta, tone }) => (
  <div className="dashboard-meter">
    <div className="dashboard-meter-label">
      <span>{label}</span>
      <span>{meta}</span>
    </div>
    <div className="dashboard-meter-bar">
      <span
        className={`dashboard-meter-fill dashboard-meter-fill--${tone}`}
        style={{ width: `${value}%` }}
      />
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
    {items.map((item, index) => (
      <div key={`${item.label}-${index}`} className="role-list-item">
        <div>
          <div className="role-item-label">{item.label}</div>
          {item.meta && <div className="role-item-meta">{item.meta}</div>}
        </div>
        {item.time && <span className="role-tag">{item.time}</span>}
      </div>
    ))}
  </div>
);

export default Dashboard;
