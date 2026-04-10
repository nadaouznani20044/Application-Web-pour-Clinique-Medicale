import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { LayoutDashboard, CalendarRange, ClipboardList, UserRound, Activity, LogOut, Languages } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import { LANGUAGE_OPTIONS } from '../config/languages';
import ChefAnalytics from './ChefAnalytics';
import ChefCalendar from './ChefCalendar';
import ChefDashboard from './ChefDashboard';
import ChefPatients from './ChefPatients';
import ChefPlanning from './ChefPlanning';
import ChefServices from './ChefServices';
import { loadServiceState } from './chefStore';
import '../styles/ChefMedecin.css';
import '../styles/UnifiedPages.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/planning', label: 'Planning', icon: CalendarRange },
  { to: '/calendar', label: 'Calendrier', icon: ClipboardList },
  { to: '/patients', label: 'Patients', icon: UserRound },
  { to: '/services', label: 'Service', icon: Activity },
  { to: '/analytics', label: 'Analytics', icon: Activity },
];

const ChefMedecinApp = ({ user, onLogout, language, onLanguageChange }) => {
  const isAuthenticated = Boolean(user);
  const userRole = user?.role;
  const [serviceState, setServiceState] = useState(() => loadServiceState(user?.serviceId));
  const serviceName = serviceState?.service?.name || user?.serviceLabel || 'Service';

  useEffect(() => {
    const handleServiceUpdate = (event) => {
      if (!event?.detail?.serviceId || event.detail.serviceId === user?.serviceId) {
        setServiceState(loadServiceState(user?.serviceId));
      }
    };

    window.addEventListener('chef-service-updated', handleServiceUpdate);
    return () => window.removeEventListener('chef-service-updated', handleServiceUpdate);
  }, [user?.serviceId]);

  return (
    <BrowserRouter>
      <div className="chef-app">
        <aside className="chef-sidebar">
          <div className="chef-sidebar-header">
            <div>
              <span className="chef-sidebar-kicker">Médecin chef</span>
              <div className="chef-sidebar-title">{serviceName}</div>
            </div>
          </div>

          <nav className="chef-sidebar-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `chef-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <button type="button" className="chef-logout" onClick={onLogout}>
            <LogOut size={18} />
            Déconnexion
          </button>
        </aside>

        <main className="chef-main">
          <header className="chef-topbar">
            <div className="chef-topbar-copy">
              <span className="chef-topbar-badge">Service actif</span>
              <strong>{serviceName}</strong>
            </div>

            <div className="chef-topbar-actions">
              <label className="topbar-language" htmlFor="chef-language-select">
                <span className="topbar-language-label">Langue</span>
                <select
                  id="chef-language-select"
                  className="topbar-language-select"
                  value={language}
                  onChange={(event) => onLanguageChange?.(event.target.value)}
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.short}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>

          <section className="chef-content">
            <Routes>
              <Route
                path="/"
                element={<Navigate to="/dashboard" replace />}
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['chef_medecin']}>
                    <ChefDashboard serviceId={user?.serviceId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/planning"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['chef_medecin']}>
                    <ChefPlanning serviceId={user?.serviceId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['chef_medecin']}>
                    <ChefCalendar serviceId={user?.serviceId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['chef_medecin']}>
                    <ChefPatients serviceId={user?.serviceId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/services"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['chef_medecin']}>
                    <ChefServices serviceId={user?.serviceId} />
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute isAuthenticated={isAuthenticated} userRole={userRole} allowedRoles={['chef_medecin']}>
                    <ChefAnalytics serviceId={user?.serviceId} />
                  </PrivateRoute>
                }
              />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </section>
        </main>
      </div>
    </BrowserRouter>
  );
};

const Unauthorized = () => (
  <div className="dashboard-shell">
    <section className="dashboard-panel">
      <div className="dashboard-panel-header">
        <div>
          <h2 className="dashboard-panel-title">Accès refusé</h2>
          <p className="dashboard-panel-subtitle">Le rôle connecté n'a pas accès à cette page.</p>
        </div>
      </div>
    </section>
  </div>
);

export default ChefMedecinApp;
