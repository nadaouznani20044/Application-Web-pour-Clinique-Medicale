import React, { useMemo } from 'react';
import { BrowserRouter, Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { CalendarRange, ClipboardList, LayoutDashboard, LogOut, UserRound } from 'lucide-react';
import PrivateRoute from '../components/PrivateRoute';
import { LANGUAGE_OPTIONS } from '../config/languages';
import MedecinAppointments from './MedecinAppointments';
import MedecinCalendar from './MedecinCalendar';
import MedecinDashboard from './MedecinDashboard';
import MedecinForbidden from './MedecinForbidden';
import MedecinPatients from './MedecinPatients';
import MedecinRecord from './MedecinRecord';
import { loadMedecinState } from './medecinStore';
import '../styles/ChefMedecin.css';
import '../styles/UnifiedPages.css';
import '../styles/Dashboard.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Mes patients', icon: UserRound },
  { to: '/appointments', label: 'Rendez-vous', icon: ClipboardList },
  { to: '/calendar', label: 'Calendrier', icon: CalendarRange },
];

const FORBIDDEN_PATHS = ['/admin', '/services/manage', '/analytics/global', '/planning/manage'];

const MedecinApp = ({ user, onLogout, language, onLanguageChange }) => {
  const isAuthenticated = Boolean(user);
  const userRole = user?.role;
  const sharedGuardProps = {
    isAuthenticated,
    userRole,
    allowedRoles: ['medecin'],
    forbiddenPaths: FORBIDDEN_PATHS,
  };

  const doctorState = useMemo(
    () => loadMedecinState(user?.doctorId, user?.serviceId, user?.serviceLabel || ''),
    [user?.doctorId, user?.serviceId, user?.serviceLabel]
  );

  const serviceName = doctorState?.doctor?.serviceLabel || user?.serviceLabel || 'Service';

  return (
    <BrowserRouter>
      <div className="chef-app">
        <aside className="chef-sidebar">
          <div className="chef-sidebar-header">
            <div>
              <span className="chef-sidebar-kicker">Medecin traitant</span>
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
            Deconnexion
          </button>
        </aside>

        <main className="chef-main">
          <header className="chef-topbar">
            <div className="chef-topbar-copy">
              <span className="chef-topbar-badge">Service actif</span>
              <strong>{serviceName}</strong>
            </div>

            <div className="chef-topbar-actions">
              <label className="topbar-language" htmlFor="medecin-language-select">
                <span className="topbar-language-label">Langue</span>
                <select
                  id="medecin-language-select"
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
                  <PrivateRoute {...sharedGuardProps}>
                    <MedecinDashboard
                      doctorId={user?.doctorId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/patients"
                element={
                  <PrivateRoute {...sharedGuardProps}>
                    <MedecinPatients
                      doctorId={user?.doctorId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/appointments"
                element={
                  <PrivateRoute {...sharedGuardProps}>
                    <MedecinAppointments
                      doctorId={user?.doctorId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <PrivateRoute {...sharedGuardProps}>
                    <MedecinCalendar
                      doctorId={user?.doctorId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              <Route
                path="/record/:patientId"
                element={
                  <PrivateRoute {...sharedGuardProps}>
                    <MedecinRecord
                      doctorId={user?.doctorId}
                      serviceId={user?.serviceId}
                      serviceLabel={user?.serviceLabel}
                    />
                  </PrivateRoute>
                }
              />
              {FORBIDDEN_PATHS.map((path) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <PrivateRoute {...sharedGuardProps}>
                      <Navigate to="/403" replace />
                    </PrivateRoute>
                  }
                />
              ))}
              <Route path="/403" element={<MedecinForbidden />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </section>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default MedecinApp;
