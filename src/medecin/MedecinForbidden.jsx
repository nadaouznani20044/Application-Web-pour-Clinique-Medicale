import React from 'react';
import { useNavigate } from 'react-router-dom';

const MedecinForbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">403</span>
          <h1 className="dashboard-title">Acces refuse</h1>
          <p className="dashboard-subtitle">
            Cette route est bloquee pour le role connecte.
          </p>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2 className="dashboard-panel-title">Zone protegee</h2>
            <p className="dashboard-panel-subtitle">
              Reviens vers les pages autorisees ou reconnecte-toi avec le bon compte.
            </p>
          </div>
        </div>

        <div className="dashboard-list">
          <div className="dashboard-list-item">
            <div className="dashboard-list-main">
              <div className="dashboard-list-title">Route interdite</div>
              <div className="dashboard-list-meta">
                Le controle d'acces bloque cette URL pour le role actuel.
              </div>
            </div>
            <span className="dashboard-chip dashboard-chip--neutral">403</span>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button type="button" className="dashboard-button dashboard-button--primary" onClick={() => navigate('/login')}>
            Retour a la connexion
          </button>
        </div>
      </section>
    </div>
  );
};

export default MedecinForbidden;
