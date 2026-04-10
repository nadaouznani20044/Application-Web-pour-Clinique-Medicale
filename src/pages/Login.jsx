import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, ChevronDown, HelpCircle } from 'lucide-react';
import { ROLE_OPTIONS } from '../auth/permissions';
import { getServiceCatalog, getServiceLabel } from '../chefMedecin/chefStore';
import '../styles/Login.css';

const MedGestLogin = ({ onLogin }) => {
  const [userRole, setUserRole] = useState(ROLE_OPTIONS[0]?.value || 'administrateur');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [nurseId, setNurseId] = useState('');
  const [serviceId, setServiceId] = useState(getServiceCatalog()[0]?.id || 'gynecologie');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const serviceOptions = useMemo(() => getServiceCatalog(), []);
  const selectedRole = ROLE_OPTIONS.find((option) => option.value === userRole) || ROLE_OPTIONS[0];
  const isServiceScopedRole = userRole === 'chef_medecin' || userRole === 'medecin' || userRole === 'infirmier';

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!username.trim()) nextErrors.username = 'Identifiant requis';
    if (!password.trim()) nextErrors.password = 'Mot de passe requis';
    if (isServiceScopedRole && !serviceId) nextErrors.serviceId = 'Selectionnez un service';
    if (userRole === 'medecin' && !doctorId.trim()) nextErrors.doctorId = 'Saisissez votre identifiant medecin';
    if (userRole === 'infirmier' && !nurseId.trim()) nextErrors.nurseId = "Saisissez votre identifiant d'infirmier";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      onLogin?.({
        username,
        role: userRole,
        roleLabel: selectedRole?.label || userRole,
        doctorId: userRole === 'medecin' ? doctorId.trim() : null,
        nurseId: userRole === 'infirmier' ? nurseId.trim() : null,
        serviceId: isServiceScopedRole ? serviceId : null,
        serviceLabel: isServiceScopedRole ? getServiceLabel(serviceId) : null,
        timestamp: new Date(),
      });
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="login-root">
      <div className="login-bg-image" />
      <div className="login-bg-overlay" />

      <div className="app-window">
        <main className="login-main">
          <div className="content-area">
            <button className="help-btn" type="button">
              <HelpCircle size={14} /> Aide
            </button>
            <div className="lang-btn">
              Langue: Francais (FR) <ChevronDown size={13} />
            </div>

            <div className="login-modal">
              <div className="modal-header">
                <span className="modal-title">Connexion</span>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Profil / Role</label>
                  <select
                    className="form-select"
                    value={userRole}
                    onChange={(event) => {
                      const nextRole = event.target.value;
                      setUserRole(nextRole);
                      setErrors((current) => ({
                        ...current,
                        serviceId: '',
                        doctorId: '',
                        nurseId: '',
                      }));
                    }}
                    disabled={isLoading}
                  >
                    {ROLE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {isServiceScopedRole && (
                  <div className="form-group">
                    <label className="form-label">Service rattache</label>
                    <select
                      className={`form-select${errors.serviceId ? ' error' : ''}`}
                      value={serviceId}
                      onChange={(event) => {
                        setServiceId(event.target.value);
                        setErrors((current) => ({ ...current, serviceId: '' }));
                      }}
                      disabled={isLoading}
                    >
                      {serviceOptions.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                    {errors.serviceId && <span className="error-msg">{errors.serviceId}</span>}
                  </div>
                )}

                {userRole === 'medecin' && (
                  <div className="form-group">
                    <label className="form-label">Identifiant medecin</label>
                    <input
                      type="text"
                      className={`form-input${errors.doctorId ? ' error' : ''}`}
                      value={doctorId}
                      autoComplete="off"
                      onChange={(event) => {
                        setDoctorId(event.target.value);
                        setErrors((current) => ({ ...current, doctorId: '' }));
                      }}
                      placeholder="UUID du medecin"
                      disabled={isLoading}
                    />
                    {errors.doctorId && <span className="error-msg">{errors.doctorId}</span>}
                  </div>
                )}

                {userRole === 'infirmier' && (
                  <div className="form-group">
                    <label className="form-label">Identifiant infirmier</label>
                    <input
                      type="text"
                      className={`form-input${errors.nurseId ? ' error' : ''}`}
                      value={nurseId}
                      autoComplete="off"
                      onChange={(event) => {
                        setNurseId(event.target.value);
                        setErrors((current) => ({ ...current, nurseId: '' }));
                      }}
                      placeholder="UUID de l'infirmier"
                      disabled={isLoading}
                    />
                    {errors.nurseId && <span className="error-msg">{errors.nurseId}</span>}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur / ID</label>
                  <input
                    type="text"
                    className={`form-input${errors.username ? ' error' : ''}`}
                    value={username}
                    autoComplete="username"
                    onChange={(event) => {
                      setUsername(event.target.value);
                      setErrors((current) => ({ ...current, username: '' }));
                    }}
                    disabled={isLoading}
                  />
                  {errors.username && <span className="error-msg">{errors.username}</span>}
                </div>

                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label">Mot de passe</label>
                    <a href="#forgot" className="forgot-link">
                      Mot de passe oublie ?
                    </a>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input${errors.password ? ' error' : ''}`}
                      value={password}
                      autoComplete="current-password"
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setErrors((current) => ({ ...current, password: '' }));
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      aria-label="Afficher/masquer le mot de passe"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <span className="error-msg">{errors.password}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MedGestLogin;
