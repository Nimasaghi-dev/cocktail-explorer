import React from 'react';

export type GarnishKind = 'lemon' | 'mint' | 'cherry' | 'ice' | 'anise';

// Eight-point star anise, built once
const anisePoints = Array.from({ length: 16 }, (_, i) => {
  const angle = (Math.PI / 8) * i - Math.PI / 2;
  const r = i % 2 === 0 ? 27 : 8;
  return `${(32 + r * Math.cos(angle)).toFixed(2)},${(32 + r * Math.sin(angle)).toFixed(2)}`;
}).join(' ');

const aniseSeeds = Array.from({ length: 8 }, (_, i) => {
  const angle = (Math.PI / 4) * i - Math.PI / 2;
  return { cx: 32 + 16 * Math.cos(angle), cy: 32 + 16 * Math.sin(angle) };
});

const SHAPES: Record<GarnishKind, React.ReactNode> = {
  lemon: (
    <>
      <circle className="g-fill" cx="32" cy="32" r="28" />
      <circle className="g-line" cx="32" cy="32" r="23.5" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (Math.PI / 4) * i;
        return (
          <line
            key={i}
            className="g-line"
            x1={32 + 4 * Math.cos(angle)}
            y1={32 + 4 * Math.sin(angle)}
            x2={32 + 22 * Math.cos(angle)}
            y2={32 + 22 * Math.sin(angle)}
          />
        );
      })}
    </>
  ),
  mint: (
    <>
      <path className="g-fill" d="M32 5 C51 17 53 42 32 59 C11 42 13 17 32 5 Z" />
      <path className="g-line" d="M32 10 V56 M32 22 L42 15 M32 22 L22 15 M32 34 L44 27 M32 34 L20 27 M32 46 L40 40 M32 46 L24 40" />
    </>
  ),
  cherry: (
    <>
      <path className="g-line" d="M24 33 Q28 17 40 8 M42 36 Q41 21 40 8" />
      <path className="g-fill" d="M40 8 Q50 3 55 11 Q46 15 40 8 Z" />
      <circle className="g-fill" cx="24" cy="44" r="11" />
      <circle className="g-fill" cx="42" cy="46" r="10" />
      <path className="g-line" d="M18 40 Q19 37 22 36" />
    </>
  ),
  ice: (
    <>
      <path className="g-fill" d="M32 8 L54 20 L54 44 L32 56 L10 44 L10 20 Z" />
      <path className="g-line" d="M10 20 L32 32 L54 20 M32 32 V56 M16 26 L25 31" />
    </>
  ),
  anise: (
    <>
      <polygon className="g-fill" points={anisePoints} />
      {aniseSeeds.map((s, i) => (
        <circle key={i} className="g-line" cx={s.cx} cy={s.cy} r="2.4" />
      ))}
      <circle className="g-line" cx="32" cy="32" r="3" />
    </>
  ),
};

interface GarnishProps {
  kind: GarnishKind;
}

const Garnish: React.FC<GarnishProps> = ({ kind }) => (
  <svg className="garnish__art" viewBox="0 0 64 64" aria-hidden="true">
    {SHAPES[kind]}
  </svg>
);

export default Garnish;
