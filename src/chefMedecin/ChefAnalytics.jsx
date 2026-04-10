import React, { useMemo, useState } from 'react';
import { Activity, BarChart3, Calendar, Hospital, Users } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import { getServiceStats, getServiceLabel, loadServiceState } from './chefStore';
import '../styles/Dashboard.css';

const COLORS = ['#0f766e', '#0d9488', '#14b8a6', '#5eead4', '#115e59', '#2dd4bf'];

const ChefAnalytics = ({ serviceId }) => {
  const [state] = useState(() => loadServiceState(serviceId));

  const stats = useMemo(() => getServiceStats(state), [state]);

  const monthlyData = state.analytics.monthly;
  const doctorData = state.staff.doctors.map((doctor, index) => ({
    doctor: doctor.name,
    consultations: doctor.consultationsThisMonth,
    patients: doctor.patientsAssigned,
    color: COLORS[index % COLORS.length],
  }));
  const roomData = state.staff.rooms.map((room) => ({
    room: `S${room.number}`,
    fill: room.capacity ? Math.round((room.occupied / room.capacity) * 100) : 0,
  }));
  const hasMonthlyData = monthlyData.length > 0;
  const hasDoctorData = doctorData.length > 0;
  const hasRoomData = roomData.length > 0;

  const statusBreakdown = useMemo(
    () => [
      { name: 'En attente', value: state.appointments.filter((appointment) => appointment.status === 'pending').length, color: '#0f766e' },
      { name: 'Confirmés', value: state.appointments.filter((appointment) => appointment.status === 'confirmed').length, color: '#0d9488' },
      { name: 'Refusés', value: state.appointments.filter((appointment) => appointment.status === 'refused').length, color: '#14b8a6' },
    ],
    [state.appointments]
  );
  const hasStatusData = statusBreakdown.some((entry) => entry.value > 0);

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Analytics</span>
          <h1 className="dashboard-title">Statistiques - {state.service.name || getServiceLabel(serviceId)}</h1>
          <p className="dashboard-subtitle">
            Occupation mensuelle, activité médicale par médecin et remplissage des salles.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard icon={Activity} label="Occupation" value={`${stats.occupancyRate}%`} hint="Taux global du service" tone="teal" />
        <MetricCard icon={Users} label="Médecins" value={stats.doctors} hint="Équipe active" tone="teal" />
        <MetricCard icon={Calendar} label="RDV semaine" value={stats.weeklyAppointments} hint="Volume hebdomadaire" tone="violet" />
        <MetricCard icon={Hospital} label="Patients" value={stats.activePatients} hint="Dossiers suivis" tone="orange" />
      </section>

      <div className="dashboard-grid dashboard-grid--analytics">
        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Évolution mensuelle</h2>
              <p className="dashboard-panel-subtitle">Occupation et activité du service.</p>
            </div>
          </div>
          {hasMonthlyData ? (
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="occupancy" name="Occupation %" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="consultations" name="Consultations" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="role-empty">Aucune donnée mensuelle à afficher pour le moment.</div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Consultations par médecin</h2>
              <p className="dashboard-panel-subtitle">Répartition de l'activité médicale.</p>
            </div>
          </div>
          {hasDoctorData ? (
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={doctorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="doctor" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="consultations" name="Consultations" radius={[8, 8, 0, 0]}>
                    {doctorData.map((entry, index) => (
                      <Cell key={entry.doctor || index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="role-empty">Aucun médecin ajouté pour le moment.</div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Remplissage des salles</h2>
              <p className="dashboard-panel-subtitle">Taux de remplissage par chambre.</p>
            </div>
          </div>
          {hasRoomData ? (
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={roomData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="room" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Bar dataKey="fill" name="Remplissage %" radius={[8, 8, 0, 0]} fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="role-empty">Aucune chambre ajoutée pour le moment.</div>
          )}
        </section>

        <section className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2 className="dashboard-panel-title">Statut des rendez-vous</h2>
              <p className="dashboard-panel-subtitle">Répartition des RDV du service.</p>
            </div>
          </div>
          {hasStatusData ? (
            <div className="dashboard-chart">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Tooltip />
                  <Pie data={statusBreakdown} dataKey="value" nameKey="name" outerRadius={110} innerRadius={70} paddingAngle={4}>
                    {statusBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="role-empty">Aucun rendez-vous ajouté pour le moment.</div>
          )}
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

export default ChefAnalytics;
