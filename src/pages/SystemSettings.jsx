import React, { useEffect, useMemo, useState } from 'react';
import { Calendar, Languages, ShieldCheck, Bell } from 'lucide-react';
import '../styles/Dashboard.css';

const LANGUAGE_OPTIONS = [
  {
    value: 'fr',
    label: 'Français',
    short: 'FR',
    description: 'Interface et formats locaux en français.',
  },
  {
    value: 'ar',
    label: 'العربية',
    short: 'AR',
    description: 'Interface et formats locaux en arabe.',
  },
];

const formatLocale = {
  fr: 'fr-FR',
  ar: 'ar',
};

const resolveLanguage = (value) => LANGUAGE_OPTIONS.find((option) => option.value === value) || LANGUAGE_OPTIONS[0];

const SystemSettings = ({ language: languageProp = 'fr', onLanguageChange }) => {
  const [language, setLanguage] = useState(languageProp);

  useEffect(() => {
    setLanguage(languageProp);
  }, [languageProp]);

  const activeLanguage = useMemo(() => resolveLanguage(language), [language]);

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);

    if (typeof onLanguageChange === 'function') {
      onLanguageChange(nextLanguage);
    }

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('medical-app-language', nextLanguage);
    }
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <span className="dashboard-badge">Administration</span>
          <h1 className="dashboard-title">Paramètres système</h1>
          <p className="dashboard-subtitle">
            Configuration de la langue, des formats régionaux et des préférences d'affichage.
          </p>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <MetricCard
          label="Langue active"
          value={activeLanguage.short}
          hint={activeLanguage.description}
          icon={Languages}
          tone="teal"
        />
        <MetricCard
          label="Format de date"
          value={formatLocale[language] || 'fr-FR'}
          hint="Horodatage et date dans l'interface"
          icon={Calendar}
          tone="teal"
        />
        <MetricCard
          label="Notifications"
          value="Actives"
          hint="Messages et alertes système"
          icon={Bell}
          tone="orange"
        />
      </section>

      <div className="dashboard-grid dashboard-grid--overview">
        <div className="dashboard-stack">
          <Panel title="Configuration de langue" subtitle="Sélectionnez la langue de l'interface.">
            <div className="settings-language-card">
              <div className="settings-language-summary">
                <div className="settings-language-badge">{activeLanguage.short}</div>
                <div>
                  <div className="dashboard-list-title">{activeLanguage.label}</div>
                  <div className="dashboard-list-meta">{activeLanguage.description}</div>
                </div>
              </div>

              <label className="settings-field">
                <span>Langue de l'interface</span>
                <select value={language} onChange={(event) => handleLanguageChange(event.target.value)}>
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="settings-language-grid">
                {LANGUAGE_OPTIONS.map((option) => {
                  const isActive = option.value === language;

                  return (
                    <article
                      key={option.value}
                      className={`settings-language-option ${isActive ? 'active' : ''}`}
                    >
                      <div className="settings-language-option-top">
                        <span className="settings-language-option-code">{option.short}</span>
                        {isActive && <span className="dashboard-chip dashboard-chip--success">Actif</span>}
                      </div>
                      <div className="dashboard-list-title">{option.label}</div>
                      <div className="dashboard-list-meta">{option.description}</div>
                    </article>
                  );
                })}
              </div>
            </div>
          </Panel>

          <Panel title="Aperçu régional" subtitle="Paramètres d'affichage appliqués aux écrans du système.">
            <div className="dashboard-list">
              <div className="dashboard-list-item">
                <div className="dashboard-list-main">
                  <div className="dashboard-list-icon dashboard-icon--teal">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="dashboard-list-title">Format de date</div>
                    <div className="dashboard-list-meta">Date courte et lisible sur tous les modules</div>
                  </div>
                </div>
                <span className="dashboard-chip dashboard-chip--neutral">{formatLocale[language]}</span>
              </div>

              <div className="dashboard-list-item">
                <div className="dashboard-list-main">
                  <div className="dashboard-list-icon dashboard-icon--violet">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="dashboard-list-title">Accès admin</div>
                    <div className="dashboard-list-meta">Les paramètres système restent réservés à l'administrateur</div>
                  </div>
                </div>
                <span className="dashboard-chip dashboard-chip--success">Protégé</span>
              </div>
            </div>
          </Panel>
        </div>

        <Panel title="Conseil de déploiement" subtitle="Ce réglage est mémorisé localement pour l'utilisateur courant.">
          <div className="dashboard-list">
            <div className="dashboard-list-item">
              <div className="dashboard-list-main">
                <div className="dashboard-list-icon dashboard-icon--orange">
                  <Bell size={18} />
                </div>
                <div>
                  <div className="dashboard-list-title">Langue synchronisée</div>
                  <div className="dashboard-list-meta">
                    La langue choisie est enregistrée dans le navigateur et réappliquée au rechargement.
                  </div>
                </div>
              </div>
              <span className="dashboard-chip dashboard-chip--info">Persisté</span>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

const Panel = ({ title, subtitle, children }) => (
  <section className="dashboard-panel">
    <div className="dashboard-panel-header">
      <div>
        <h2 className="dashboard-panel-title">{title}</h2>
        {subtitle && <p className="dashboard-panel-subtitle">{subtitle}</p>}
      </div>
    </div>
    {children}
  </section>
);

const MetricCard = ({ icon: Icon, label, value, hint, tone }) => (
  <article className="dashboard-stat-card">
    <div className="dashboard-stat-top">
      <div>
        <span className="dashboard-stat-label">{label}</span>
        <div className="dashboard-stat-value">{value}</div>
      </div>
      <div className={`dashboard-stat-icon dashboard-icon--${tone}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="dashboard-stat-hint">{hint}</p>
  </article>
);

export default SystemSettings;
