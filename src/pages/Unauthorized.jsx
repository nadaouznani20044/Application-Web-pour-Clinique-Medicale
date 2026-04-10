import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">Accès refusé</span>
          <h1 className="dashboard-title">Autorisation requise</h1>
          <p className="dashboard-subtitle">
            Cette zone est réservée au rôle médecin chef avec un service associé.
          </p>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2 className="dashboard-panel-title">Rôle non autorisé</h2>
            <p className="dashboard-panel-subtitle">
              Vérifie le compte connecté ou reconnecte-toi avec un rôle autorisé.
            </p>
          </div>
        </div>

        <div className="dashboard-list">
          <div className="dashboard-list-item">
            <div className="dashboard-list-main">
              <div className="dashboard-list-title">Chef de service uniquement</div>
              <div className="dashboard-list-meta">
                Les pages de planning, rendez-vous, patients et statistiques sont protégées.
              </div>
            </div>
            <span className="dashboard-chip dashboard-chip--neutral">403</span>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button type="button" className="dashboard-button dashboard-button--primary" onClick={() => navigate('/login')}>
            Retour à la connexion
          </button>
        </div>
      </section>
    </div>
  );
};

export default Unauthorized;
