import React from 'react';
const NotFound = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <h1 style={{ fontSize: '72px', margin: '0', color: '#2d3748' }}>404</h1>
      <p style={{ fontSize: '24px', color: '#718096', marginBottom: '20px' }}>Page non trouvée</p>
      <a href="/dashboard" style={{
        padding: '12px 24px',
        background: '#667eea',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: '600'
      }}>
        Retour au Dashboard
      </a>
    </div>
  );
};