import React, { useId } from 'react';
import './Logo.css';

interface LogoProps {
  size?: 'md' | 'lg';
}

// Polished gold: bright crown, dark horizon band, bronze base
const GOLD_STOPS = [
  ['0%', '#fff3c8'],
  ['30%', '#e8c676'],
  ['48%', '#9a6c24'],
  ['58%', '#d9b25c'],
  ['78%', '#f2d68c'],
  ['100%', '#a97a2c'],
];

const BOWL = 'M3 9 H29 Q27.5 21 16 22 Q4.5 21 3 9 Z';

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const gradientId = useId();
  const glintId = useId();

  return (
    <span className={`logo logo--${size}`}>
      <svg className="logo__mark" viewBox="0 0 32 40" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            {GOLD_STOPS.map(([offset, color]) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
          {/* Glint that sweeps across the bowl just before it crosses the name */}
          <linearGradient id={glintId} gradientUnits="userSpaceOnUse" x1="-14" y1="0" x2="0" y2="6">
            <stop offset="0%" stopColor="#fffbeb" stopOpacity="0" />
            <stop offset="50%" stopColor="#fffbeb" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fffbeb" stopOpacity="0" />
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="0 0; 48 0; 48 0"
              keyTimes="0; 0.12; 1"
              dur="8s"
              begin="0.9s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
        {/* Coupe glass with a cherry */}
        <path d={BOWL} fill={`url(#${gradientId})`} />
        <path className="logo__glint" d={BOWL} fill={`url(#${glintId})`} />
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
