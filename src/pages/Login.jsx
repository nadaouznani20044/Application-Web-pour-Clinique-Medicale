import React, { useState } from 'react';
import { Eye, EyeOff, Bell, Save, ChevronDown, HelpCircle, Shield, Activity } from 'lucide-react';
import '../styles/login.css';

const MedGestLogin = ({ onLogin }) => {
  const [userRole, setUserRole] = useState('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

 

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Identifiant requis';
    if (!password.trim()) newErrors.password = 'Mot de passe requis';

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin?.({ username, role: userRole, timestamp: new Date() });
        setIsLoading(false);
      }, 800);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="login-root">
      <div className="login-bg-image" />
      <div className="login-bg-overlay" />

      <div className="app-window">
        <main className="login-main">

         
          
          <div className="content-area">

            {/* Floating action buttons */}
            <button className="help-btn">
              <HelpCircle size={14} /> Help
            </button>
            <div className="lang-btn">
              Langue: Français (FR) <ChevronDown size={13} />
            </div>

            {/* Modal Card */}
            <div className="login-modal">

             

              {/* Header */}
              <div className="modal-header">
                <span className="modal-title">Connexion</span>
              </div>

             

              {/* Form */}
              <form className="login-form" onSubmit={handleSubmit}>

                {/* Username */}
                <div className="form-group">
                  <label className="form-label">Nom d'utilisateur / ID</label>
                  <input
                    type="text"
                    className={`form-input${errors.username ? ' error' : ''}`}
                    value={username}
                    autoComplete="username"
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setErrors({ ...errors, username: '' });
                    }}
                    disabled={isLoading}
                  />
                  {errors.username && <span className="error-msg">{errors.username}</span>}
                </div>

                {/* Password */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label className="form-label">Mot de Passe</label>
                    <a href="#forgot" className="forgot-link">Mot de Passe Oublié ?</a>
                  </div>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className={`form-input${errors.password ? ' error' : ''}`}
                      value={password}
                      autoComplete="current-password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: '' });
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
                  {isLoading ? 'Connexion en cours...' : 'Se Connecter'}
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