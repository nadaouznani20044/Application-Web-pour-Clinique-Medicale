import { useEffect, useRef, useState } from 'react';
import { Menu, Users as UsersIcon, BarChart3, FileText, Hospital, Settings, LogOut, Bell, HelpCircle, ChevronDown, Activity, Calendar as CalendarIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Patients from './pages/Patients';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Users from './pages/utilisateur';
import Chirurgie from './gereservices/Chirurgie';
import Gynecologie from './gereservices/Gynecologie';
import Laboratoire from './gereservices/Laboratoire';
import Medecineinterne from './gereservices/Medecineinterne';
import Ophtalmologie from './gereservices/Ophtalmologie';
import Pediatrie from './gereservices/Pediatrie';
import Radiologie from './gereservices/Radiologie';
import Urgence from './gereservices/Urgence';
import Gyneco from './gestionservices/Gyneco';
import { canAccess, getDefaultPage } from './auth/permissions';
import './styles/Global.css';
import './styles/App.css';
import './styles/Login.css';
import './styles/Users.css';
import './styles/Gyneco.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const currentUserRole = currentUser?.role;
  const contentRef = useRef(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
    setCurrentPage(getDefaultPage(userData?.role));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  const handleViewService = (serviceName) => {
    setSelectedService(serviceName);
    setCurrentPage('service-detail');
  };

  const handleBackFromService = () => {
    setSelectedService(null);
    setCurrentPage('services');
  };

  const getServiceDetailComponent = (serviceName) => {
    const name = (serviceName || '').toLowerCase();
    if (name.includes('chirurgie')) return <Chirurgie />;
    if (name.includes('gyn')) return <Gynecologie />;
    if (name.includes('laboratoire')) return <Laboratoire />;
    if (name.includes('interne')) return <Medecineinterne />;
    if (name.includes('ophtal')) return <Ophtalmologie />;
    if (name.includes('diatrie') || name.includes('pediat')) return <Pediatrie />;
    if (name.includes('radiologie')) return <Radiologie />;
    if (name.includes('urgence')) return <Urgence />;
    return null;
  };

  const renderServiceDetail = () => {
    if (currentUserRole === 'Administrateur') {
      return (
        <Gyneco
          service={{ name: selectedService, chef: '', location: '', phone: '', description: '', status: 'Active' }}
          onBack={handleBackFromService}
        />
      );
    }

    const detail = getServiceDetailComponent(selectedService);
    if (!detail) {
      return <div className="service-detail-empty">Détails du service indisponibles.</div>;
    }
    return (
      <div className="service-detail">
        <div className="service-detail-header">
          <button className="service-back-button" onClick={handleBackFromService}>
            Retour
          </button>
          <div className="service-detail-title">{selectedService || 'Service'}</div>
        </div>
        {detail}
      </div>
    );
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      contentRef.current.scrollLeft = 0;
    }
  }, [currentPage]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const isServiceDetail = currentPage === 'service-detail';
  const pageKey = isServiceDetail ? 'services' : currentPage;
  const hasAccess = canAccess(currentUserRole, pageKey);
  const canView = (key) => canAccess(currentUserRole, key);

  return (
    <div className="app-wrapper">
      
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          {sidebarOpen && <span className="sidebar-title">MedGest Connect</span>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            <Menu />
          </button>
        </div>
        <nav className="sidebar-nav">
          {canView('dashboard') && (
            <NavItem 
              icon={<BarChart3 />} 
              label="Tableau de bord" 
              active={currentPage === 'dashboard'}
              onClick={() => setCurrentPage('dashboard')}
              expanded={sidebarOpen}
            />
          )}
          {canView('users') && (
            <NavItem
              icon={<UsersIcon />}
              label="Gestion des utilisateurs"
              active={currentPage === 'users'}
              onClick={() => setCurrentPage('users')}
              expanded={sidebarOpen}
            />
          )}

          {canView('services') && (
            <NavItem
              icon={<Hospital />}
              label="Gérer les Services"
              active={currentPage === 'services'}
              onClick={() => setCurrentPage('services')}
              expanded={sidebarOpen}
            />
          )}
          {canView('patients') && (
            <NavItem
              icon={<FileText />}
              label="Dossiers patients"
              active={currentPage === 'patients'}
              onClick={() => setCurrentPage('patients')}
              expanded={sidebarOpen}
            />
          )}
          {canView('hospitalization') && (
            <NavItem
              icon={<Activity />}
              label="Gestion des hospitalisations"
              active={currentPage === 'hospitalization'}
              onClick={() => setCurrentPage('hospitalization')}
              expanded={sidebarOpen}
            />
          )}
          {canView('calendar') && (
            <NavItem
              icon={<CalendarIcon />}
              label="Calendrier"
              active={currentPage === 'calendar'}
              onClick={() => setCurrentPage('calendar')}
              expanded={sidebarOpen}
            />
          )}
          {canView('settings') && (
            <NavItem
              icon={<Settings />}
              label="Paramètres système"
              active={currentPage === 'settings'}
              onClick={() => setCurrentPage('settings')}
              expanded={sidebarOpen}
            />
          )}
        </nav>

        <div className="sidebar-footer">
          <NavItem
            icon={<LogOut />}
            label="Déconnexion"
            active={false}
            onClick={handleLogout}
            expanded={sidebarOpen}
          />
        </div>
      </div>

      
      <div className="main-content">
        
        <div className="topbar">
          <div className="topbar-left">
            <input
              type="text"
              placeholder="Rechercher globalement"
              className="search-input"
            />
          </div>
          <div className="topbar-right">
            <Bell className="topbar-icon" />
            <div className="topbar-avatar">{currentUser?.username?.charAt(0).toUpperCase() || 'HG'}</div>
            <ChevronDown className="topbar-dropdown" />
          </div>
        </div>

        
        <div className="content-area" ref={contentRef}>
          {!hasAccess ? (
            <AccessDenied
              role={currentUserRole}
              onGoHome={() => setCurrentPage(getDefaultPage(currentUserRole))}
            />
          ) : (
            <>
              {currentPage === 'dashboard' && <Dashboard role={currentUserRole} />}
              {currentPage === 'services' && <Services onViewService={handleViewService} />}
              {currentPage === 'patients' && <Patients />}
              {currentPage === 'calendar' && <Calendar />}
              {currentPage === 'users' && <Users />}
              {currentPage === 'service-detail' && renderServiceDetail()}
            </>
          )}
        </div>
      </div>

      
      <button className="help-button" aria-label="Aide">
        <HelpCircle />
      </button>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick, expanded }) => (
  <button
    onClick={onClick}
    className={`nav-item ${active ? 'active' : ''}`}
    aria-label={label}
  >
    {icon}
    {expanded && <span className="nav-item-label">{label}</span>}
  </button>
);

const AccessDenied = ({ role, onGoHome }) => (
  <div className="access-denied">
    <div className="access-denied-card">
      <div className="access-denied-title">Accès refusé</div>
      <div className="access-denied-text">
        Votre rôle ({role || 'Inconnu'}) n'a pas l'autorisation d'accéder à cette page.
      </div>
      <div className="access-denied-actions">
        <button className="access-denied-button" onClick={onGoHome}>
          Retour au tableau de bord
        </button>
      </div>
    </div>
  </div>
);

export default App;



