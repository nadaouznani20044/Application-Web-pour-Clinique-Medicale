import React, { useMemo } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { CalendarRange, ClipboardList, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import { LANGUAGE_OPTIONS } from '../config/languages';
import InfirmierCalendar from './InfirmierCalendar';
import InfirmierDashboard from './InfirmierDashboard';
import InfirmierForbidden from './InfirmierForbidden';
import InfirmierPatients from './InfirmierPatients';
import { loadInfirmierState } from './infirmierStore';
import '../styles/ChefMedecin.css';
import '../styles/UnifiedPages.css';
import '../styles/Dashboard.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: UserRound },
  { to: '/calendrier', label: 'Calendrier', icon: CalendarRange },
];

const ALLOWED_PATHS = ['/dashboard', '/patients', '/calendrier'];

const InfirmierApp = ({ user, onLogout, language, onLanguageChange }) => {
  const isAuthenticated = Boolean(user);
  const userRole = user?.role;
  const guardProps = {
    isAuthenticated,
    userRole,
    allowedRoles: ['infirmier'],
    allowedPaths: ALLOWED_PATHS,
    forbiddenRedirectTo: '/403',
    unauthorizedRedirectTo: '/403',
  };

  const nurseState = useMemo(
    () => loadInfirmierState(user?.nurseId, user?.serviceId, user?.serviceLabel || ''),
    [user?.nurseId, user?.serviceId, user?.serviceLabel]
  );
  const serviceName = nurseState?.nurse?.serviceLabel || user?.serviceLabel || 'Service';

  return (
    <BrowserRouter>
      <div className="chef-app">
        <aside className="chef-sidebar">
          <div className="chef-sidebar-header">
            <div>
              <span className="chef-sidebar-kicker">Infirmier</span>
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
              <label className="topbar-language" htmlFor="infirmier-language-select">
                <span className="topbar-language-label">Langue</span>
                <select
                  id="infirmier-language-select"
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute {...guardProps}>
                    <InfirmierDashboard
                      nurseId={user?.nurseId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <PrivateRoute {...guardProps}>
                    <InfirmierPatients
                      nurseId={user?.nurseId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendrier"
                element={
                  <PrivateRoute {...guardProps}>
                    <InfirmierCalendar
                      nurseId={user?.nurseId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route path="/403" element={<InfirmierForbidden />} />
              <Route path="*" element={<Navigate to="/403" replace />} />
            </Routes>
          </section>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default InfirmierApp;
