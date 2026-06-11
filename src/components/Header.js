import React from 'react';

function Header() {
  const username = process.env.REACT_APP_USERNAME || 'User';
  
  return (
    <header>
      <h2>Dashboard Header</h2>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>User: {username}</p>
    </header>
  );
}

export default Header;
