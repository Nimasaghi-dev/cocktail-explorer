import React from 'react';
import Logo from './Logo';
import './Footer.css';

interface FooterProps {
  onBackToTop: () => void;
}

const Footer: React.FC<FooterProps> = ({ onBackToTop }) => {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <Logo size="lg" />

        <nav aria-label="Footer">
          <ul className="footer-links">
            <li>
              <button type="button" onClick={onBackToTop}>Back to top</button>
            </li>
            <li>
              <a href="https://www.thecocktaildb.com" target="_blank" rel="noreferrer">
                TheCocktailDB
              </a>
            </li>
          </ul>
        </nav>

        <p className="footer-attent">Please drink responsibly</p>

        <p className="footer-copy">Cocktail data and images from TheCocktailDB</p>
      </div>
    </footer>
  );
};

export default Footer;
