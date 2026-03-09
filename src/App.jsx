import React from "react";
import Login from "./login";
import "./App.css";

function App() {
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