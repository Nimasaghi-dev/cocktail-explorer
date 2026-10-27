import React from 'react';
import Logo from './Logo';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Logo size="lg" />

        <p className="footer-attent">Please drink responsibly</p>

        <p className="footer-copy">Cocktail data and images from TheCocktailDB</p>
      </div>
    </footer>
  );
};

export default Footer;
