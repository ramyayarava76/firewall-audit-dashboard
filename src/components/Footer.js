import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const buildVersion = process.env.REACT_APP_VERSION || '1.0.0';

  return (
    <footer>
      <div className="container flex flex-wrap gap-lg" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0 }}>
          &copy; {currentYear} Firewall Audit Dashboard. All rights reserved.
        </p>
        <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.8 }}>
          Version {buildVersion} • Built with React
        </p>
      </div>
    </footer>
  );
}

export default Footer;
