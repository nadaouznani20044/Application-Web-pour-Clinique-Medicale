import React, { useState } from 'react';
import { Menu, Users, BarChart3, FileText, Hospital, Settings, LogOut, Bell, HelpCircle, ChevronDown, Activity, Calendar as CalendarIcon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Patients from './pages/Patients';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Pediatrie from './gereservices/Pediatrie';
import Gynecologie from './gereservices/Gynecologie';
import Ophtalmologie from './gereservices/Ophtalmologie';
import Radiologie from './gereservices/Radiologie';
import Laboratoire from './gereservices/Laboratoire';
import Chirurgie from './gereservices/Chirurgie';
import Urgence from './gereservices/Urgence';
import MedecineInterne from './gereservices/MedecineInterne';
import './styles/global.css';
import './styles/app.css';
import './styles/login.css';
import './styles/Calendar.css';
import './styles/Pediatrie.css';
import './styles/Gynecologie.css';
import './styles/Ophtalmologie.css';
import './styles/Radiologie.css';
import './styles/Laboratoire.css';
import './styles/Chirurgie.css';
import './styles/Urgence.css';
import './styles/MedecineInterne.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setCurrentUser(userData);
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

  // Fonction pour rendre le bon composant de service
  const renderServiceDetail = () => {
    switch(selectedService) {
      case 'Pédiatrie':
        return <Pediatrie serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Gynécologie':
        return <Gynecologie serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Ophtalmologie':
        return <Ophtalmologie serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Radiologie':
        return <Radiologie serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Laboratoire / Analyses':
        return <Laboratoire serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Chirurgie':
        return <Chirurgie serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Urgence':
        return <Urgence serviceName={selectedService} onBack={handleBackFromService} />;
      case 'Médecine Interne':
        return <MedecineInterne serviceName={selectedService} onBack={handleBackFromService} />;
      default:
        return <Pediatrie serviceName={selectedService} onBack={handleBackFromService} />;
    }
  };

  // Si pas authentifié, afficher la page de connexion
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-wrapper">
      {/* Sidebar */}
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
          <NavItem 
            icon={<BarChart3 />} 
            label="Dashboard" 
            active={currentPage === 'dashboard'}
            onClick={() => setCurrentPage('dashboard')}
            expanded={sidebarOpen}
          />
          <NavItem 
            icon={<Users />} 
            label="User Management" 
            active={currentPage === 'users'}
            onClick={() => setCurrentPage('users')}
            expanded={sidebarOpen}
          />
          <NavItem 
            icon={<Hospital />} 
            label="Manage Services" 
            active={currentPage === 'services'}
            onClick={() => setCurrentPage('services')}
            expanded={sidebarOpen}
          />
          <NavItem 
            icon={<FileText />} 
            label="Patient Records" 
            active={currentPage === 'patients'}
            onClick={() => setCurrentPage('patients')}
            expanded={sidebarOpen}
          />
          <NavItem 
            icon={<Activity />} 
            label="Hospitalization Management" 
            active={currentPage === 'hospitalization'}
            onClick={() => setCurrentPage('hospitalization')}
            expanded={sidebarOpen}
          />
          <NavItem 
            icon={<CalendarIcon />} 
            label="Calender" 
            active={currentPage === 'calendar'}
            onClick={() => setCurrentPage('calendar')}
            expanded={sidebarOpen}
          />
          <NavItem 
            icon={<Settings />} 
            label="System Settings" 
            active={currentPage === 'settings'}
            onClick={() => setCurrentPage('settings')}
            expanded={sidebarOpen}
          />
        </nav>

        <div className="sidebar-footer">
          <NavItem 
            icon={<LogOut />} 
            label="Logout" 
            active={false}
            onClick={handleLogout}
            expanded={sidebarOpen}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <div className="topbar-left">
            <input
              type="text"
              placeholder="Recherchers au globals"
              className="search-input"
            />
          </div>
          <div className="topbar-right">
            <Bell className="topbar-icon" />
            <div className="topbar-avatar">{currentUser?.username?.charAt(0).toUpperCase() || 'HG'}</div>
            <ChevronDown className="topbar-dropdown" />
          </div>
        </div>

        {/* Page Content */}
        <div className="content-area">
          {currentPage === 'dashboard' && <Dashboard />}
          {currentPage === 'services' && <Services onViewService={handleViewService} />}
          {currentPage === 'patients' && <Patients />}
          {currentPage === 'calendar' && <Calendar />}
          {currentPage === 'service-detail' && renderServiceDetail()}
        </div>
      </div>

      {/* Help Button */}
      <button className="help-button" aria-label="Help">
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

export default App;