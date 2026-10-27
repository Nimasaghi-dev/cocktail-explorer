import React, { useEffect, useRef, useState } from 'react';
import './DrunkTitle.css';

// Stable pseudo-random 0–1 per letter, so each letter keeps its own wobble
const rand = (n: number) => {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

interface DrunkWordProps {
  text: string;
  className: string;
  seed: number;
}

const DrunkWord: React.FC<DrunkWordProps> = ({ text, className, seed }) => {
  const letters = Array.from(text).map((char, i) => {
    const a = rand(seed + i + 1);
    const b = rand(seed + i + 31);
    const c = rand(seed + i + 71);
    return {
      char: char === ' ' ? ' ' : char,
      style: {
        '--i': i,
        '--tilt': `${((2 + a * 4) * (i % 2 ? 1 : -1)).toFixed(2)}deg`,
        '--yaw': `${(8 + b * 10).toFixed(2)}deg`,
        '--pitch': `${((c - 0.5) * 24).toFixed(2)}deg`,
        '--bob': `${(0.03 + c * 0.06).toFixed(3)}em`,
        '--dur': `${(2.2 + b * 1.4).toFixed(2)}s`,
      } as React.CSSProperties,
    };
  });

  const renderLetters = () =>
    letters.map((l, i) => (
      <span key={i} className="drunk-letter" style={l.style}>
        <span className="drunk-letter__in">{l.char}</span>
      </span>
    ));

  return (
    <span
      className={`drunk-word ${className}`}
      style={{ '--word-delay': `${(-seed * 0.37).toFixed(2)}s` } as React.CSSProperties}
      aria-hidden="true"
    >
      <span className="drunk-word__ghost">{renderLetters()}</span>
      <span className="drunk-word__main">{renderLetters()}</span>
    </span>
  );
};

interface DrunkTitleProps {
  id: string;
  bold: string;
  thin: string;
}

/** The bold + thin double title, swaying, seeing double, stumbling in on scroll. */
const DrunkTitle: React.FC<DrunkTitleProps> = ({ id, bold, thin }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const [seen, setSeen] = useState(false);
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h2
      ref={ref}
      id={id}
      className={`double-title drunk-title${seen ? ' is-seen' : ''}${onScreen ? ' is-onscreen' : ''}`}
    >
      <span className="visually-hidden">{bold} {thin}</span>
      <DrunkWord text={bold} className="double-title__bold" seed={0} />
      <DrunkWord text={thin} className="double-title__thin" seed={11} />
    </h2>
  );
};

export default DrunkTitle;
