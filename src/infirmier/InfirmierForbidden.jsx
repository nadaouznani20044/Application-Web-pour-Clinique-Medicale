import React from 'react';
import { useNavigate } from 'react-router-dom';

const InfirmierForbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero dashboard-hero--compact">
        <div>
          <span className="dashboard-badge">403</span>
          <h1 className="dashboard-title">Acces refuse</h1>
          <p className="dashboard-subtitle">
            Cette route n&apos;est pas autorisee pour le role infirmier.
          </p>
        </div>
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2 className="dashboard-panel-title">Zone protegee</h2>
            <p className="dashboard-panel-subtitle">
              Le role infirmier est limite au tableau de bord, aux patients et au calendrier.
            </p>
          </div>
        </div>

        <div className="dashboard-list">
          <div className="dashboard-list-item">
            <div className="dashboard-list-main">
              <div className="dashboard-list-title">Route interdite</div>
              <div className="dashboard-list-meta">
                Retourne vers les pages autorisees ou reconnecte-toi avec un autre compte.
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

export default InfirmierForbidden;
