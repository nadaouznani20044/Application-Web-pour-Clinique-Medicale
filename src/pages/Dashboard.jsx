import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../styles/dashboard.css';

const Dashboard = () => {
  // Données pour les graphiques
  const consultationData = [
  ];

  const serviceFrequencyData = [
   
  ];

  const alerts = [
    
  ];

  return (
    <div className="dashboard-container">
      <div className="kpi-grid">
        <KPICard 
          title="Utilisateurs Actifs"
          value=""
          icon="👥"
        />
        <KPICard 
          title="Total Patients Aujourd'hui"
          value=""
          icon="🏥"
        />
        <KPICard 
          title="Taux d'Occupation (Lits)"
          value=""
          icon="🛏️"
        />
        <KPICard 
          title="Analyses en Attente"
          value=""
          icon="🔬"
        />
      </div>
      <div className="charts-grid">
        <div className="chart-container">
          <h3 className="chart-title">Tendance Hebdomadaire des Consultations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consultationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Pédiatrie" stroke="#0d9488" strokeWidth={2} />
              <Line type="monotone" dataKey="Médecine Interne" stroke="#d97706" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3 className="chart-title">Fréquentation par Service (Top 5)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceFrequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pédiatrie" fill="#0d9488" />
              <Bar dataKey="Gynécologie" fill="#d97706" />
              <Bar dataKey="Médecine Interne" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      
      <div className="alerts-container">
        <h3 className="alerts-title">Activités Récentes / Alertes</h3>
        <div className="alerts-list">
          {alerts.map((alert, idx) => (
            <div key={idx} className="alert-item">
              <div className="alert-content">
                <span className={`alert-badge ${alert.class}`}>
                  {alert.type}
                </span>
                <span className="alert-text">{alert.text}</span>
              </div>
              <span className="alert-time">{alert.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const KPICard = ({ title, value, icon }) => (
  <div className="kpi-card">
    <span className="kpi-label">{title}</span>
    <div className="kpi-header">
      <p className="kpi-value">{value}</p>
      <span style={{ fontSize: '1.75rem' }}>{icon}</span>
    </div>
  </div>
);

export default Dashboard;