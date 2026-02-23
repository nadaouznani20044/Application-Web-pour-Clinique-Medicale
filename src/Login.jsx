import { useState } from "react";
import "./Login.css";

const ECG_PATH = "M0,50 L60,50 L75,20 L90,80 L105,35 L120,65 L135,50 L300,50";

export default function MedicalLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="login-page">

      <div className="left-panel">
        <div className="left-circle" />
        <div className="deco-circle-lg" />
        <div className="deco-circle-sm" />

       
        <span className="float-icon float-icon--1">🩺</span>
        <span className="float-icon float-icon--2">➕</span>
        <span className="float-icon float-icon--3">💊</span>
        <span className="float-icon float-icon--4">🔬</span>

      
        <div className="left-content">
        
          <svg className="cross-svg" width="120" height="120" viewBox="0 0 120 120">
            <rect x="40" y="10" width="40" height="100" rx="10" fill="rgba(255,255,255,0.85)" />
            <rect x="10" y="40" width="100" height="40" rx="10" fill="rgba(255,255,255,0.85)" />
          </svg>

          
          <svg className="ecg-svg" width="260" height="60" viewBox="0 0 300 60">
            <path
              className="ecg-path"
              d={ECG_PATH}
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="400"
            />
          </svg>

          <p className="tagline">Medical</p>
        </div>
      </div>

    
      <div className="right-panel">
        <div className="form-card">
          <h1 className="form-title">WELCOME!</h1>

          <div className="form-group--1">
            <input
              className="form-input"
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group--2">
            <input
              className="form-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button className="login-btn" disabled={loading} onClick={handleLogin}>
              {loading ? <div className="btn-spinner" /> : "Login"}
            </button>

            <div className="form-footer">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember Me
              </label>
              <button className="forgot-link">Forgot your password?</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}