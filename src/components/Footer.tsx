import React from 'react';
import Logo from './Logo';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Logo size="lg" />

        <p className="footer-attent">Please drink responsibly</p>
      </div>
    </footer>
  );
};

export default Footer;
