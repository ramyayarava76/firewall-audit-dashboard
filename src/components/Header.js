import React from 'react';

function Header() {
  const username = process.env.REACT_APP_USERNAME || 'Administrator';
  const timestamp = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header>
      <div className="container flex flex-wrap gap-md">
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h2 style={{ margin: '0 0 0.25rem 0' }}>🔒 Firewall Audit Dashboard</h2>
          <p style={{ margin: 0 }}>Security Analysis & Compliance Reporting</p>
        </div>
        <div style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
          <p style={{ margin: '0 0 0.25rem 0', opacity: 0.9 }}>User: <strong>{username}</strong></p>
          <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.75 }}>{timestamp}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;
