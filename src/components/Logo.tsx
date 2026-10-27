import React, { useId } from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const gradientId = useId();

  return (
    <span className={`logo logo--${size}`}>
      <svg className="logo__mark" viewBox="0 0 32 40" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3dea0" />
            <stop offset="100%" stopColor="#c49a45" />
          </linearGradient>
        </defs>
        {/* Coupe glass with a cherry */}
        <path d="M3 9 H29 Q27.5 21 16 22 Q4.5 21 3 9 Z" fill={`url(#${gradientId})`} />
        <path d="M16 22 V35 M9.5 36 H22.5" stroke={`url(#${gradientId})`} strokeWidth="1.6" strokeLinecap="round" fill="none" />
        <path d="M22 9 Q23 5 26 3" stroke={`url(#${gradientId})`} strokeWidth="1.1" fill="none" />
        <circle cx="21.5" cy="9.5" r="2.4" fill={`url(#${gradientId})`} />
      </svg>
      <span className="logo__text">
        <span className="logo__name">
          Sip<span className="logo__amp">&amp;</span>Sin
        </span>
        <span className="logo__sub">Cocktail recipes</span>
      </span>
    </span>
  );
};

export default Logo;
