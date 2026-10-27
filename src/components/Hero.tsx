import React, { useEffect, useRef, useState } from 'react';
import { Cocktail } from '../types';
import Garnish, { GarnishKind } from './Garnish';
import { createHeroMotion, HeroMotion } from './heroMotion';
import './Hero.css';

interface HeroProps {
  drinks: Cocktail[];
  onSeeRecipe: (drink: Cocktail) => void;
  onScrollDown: () => void;
}

interface GarnishSpec {
  kind: GarnishKind;
  x: number; // % of its layer
  y: number;
  size: number; // px at desktop scale
}

const POOL_SIZE = 4;

// Over the photo
const FRONT_GARNISHES: GarnishSpec[] = [
  { kind: 'lemon', x: 40, y: 8, size: 84 },
  { kind: 'ice', x: 88, y: 13, size: 56 },
  { kind: 'anise', x: 15, y: 50, size: 52 },
  { kind: 'mint', x: 85, y: 66, size: 100 },
  { kind: 'cherry', x: 34, y: 84, size: 68 },
];

// Faint, behind the copy column
const BACK_GARNISHES: GarnishSpec[] = [
  { kind: 'lemon', x: 3, y: 7, size: 34 },
  { kind: 'mint', x: 43, y: 12, size: 46 },
  { kind: 'ice', x: 45, y: 58, size: 38 },
  { kind: 'anise', x: 42, y: 90, size: 36 },
];

// Warm tones for the slab behind the photo, picked per drink
const SLAB_TINTS = ['#f6ecd2', '#f3e2c2', '#f1e7d4', '#f5e4cc', '#ece2c8'];

const tintFor = (id: string) => SLAB_TINTS[Number(id) % SLAB_TINTS.length] ?? SLAB_TINTS[0];

const renderGarnishes = (specs: GarnishSpec[]) =>
  specs.map((g, i) => (
    <span
      key={`${g.kind}-${i}`}
      className="garnish"
      style={{
        left: `${g.x}%`,
        top: `${g.y}%`,
        '--s': g.size,
        '--d': `${0.5 + i * 0.12}s`,
      } as React.CSSProperties}
    >
      <Garnish kind={g.kind} />
    </span>
  ));

const Hero: React.FC<HeroProps> = ({ drinks, onSeeRecipe, onScrollDown }) => {
  const pool = drinks.slice(0, POOL_SIZE);
  const poolKey = pool.map(d => d.idDrink).join(',');
  const [activeIndex, setActiveIndex] = useState(0);
  const drink = pool[activeIndex] ?? pool[0];

  const heroRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fizzRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const motionRef = useRef<HeroMotion | null>(null);

  useEffect(() => {
    const [hero, media, stage, fizz, front, back] = [
      heroRef.current, mediaRef.current, stageRef.current,
      fizzRef.current, frontRef.current, backRef.current,
    ];
    if (!hero || !media || !stage || !fizz || !front || !back) return;
    const motion = createHeroMotion({ hero, media, stage, fizz, front, back });
    motionRef.current = motion;
    return () => {
      motion.destroy();
      motionRef.current = null;
    };
  }, []);

  // New set of drinks: start from the first and warm the cache so swaps are instant
  useEffect(() => {
    setActiveIndex(0);
    pool.forEach(d => {
      const img = new Image();
      img.src = d.strDrinkThumb;
    });
  }, [poolKey]);

  const select = (index: number) => {
    if (pool.length < 2) return;
    const next = (index + pool.length) % pool.length;
    if (next === activeIndex) return;
    const motion = motionRef.current;
    if (motion) motion.switchDrink(() => setActiveIndex(next));
    else setActiveIndex(next);
  };

  const meta = drink
    ? [drink.strCategory, drink.strGlass].filter(Boolean).join(' · ')
    : 'Recipes for every glass';

  return (
    <section className="hero" ref={heroRef} aria-label="Featured cocktail">
      <div className="hero__garnishes hero__garnishes--back" ref={backRef} aria-hidden="true">
        {renderGarnishes(BACK_GARNISHES)}
      </div>

      <div className="hero__copy">
        <p className="eyebrow">{drink ? 'Tonight’s pour' : 'Sip&Sin'}</p>
        <div className="hero__swap" key={drink?.idDrink ?? 'intro'}>
          <h1 className="hero__title">{drink ? drink.strDrink : 'Find your next drink'}</h1>
          <p className="hero__meta">{meta}</p>
        </div>
        <p className="hero__tagline">
          {drink
            ? 'Picked at random from the cocktail library.'
            : 'Search thousands of cocktails by name.'}
        </p>
        {drink && (
          <button type="button" className="btn-outline" onClick={() => onSeeRecipe(drink)}>
            See the recipe
          </button>
        )}

        {pool.length > 1 && (
          <div className="hero__switcher">
            <div className="hero__switcher-head">
              <p className="hero__switcher-label" id="switcher-label">More pours</p>
              <div className="hero__arrows">
                <button
                  type="button"
                  className="hero__arrow"
                  onClick={() => select(activeIndex - 1)}
                  aria-label="Previous drink"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 L5 8 L10 13" /></svg>
                </button>
                <button
                  type="button"
                  className="hero__arrow"
                  onClick={() => select(activeIndex + 1)}
                  aria-label="Next drink"
                >
                  <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3 L11 8 L6 13" /></svg>
                </button>
              </div>
            </div>
            <ul className="hero__cards" aria-labelledby="switcher-label">
              {pool.map((d, i) => (
                <li key={d.idDrink}>
                  <button
                    type="button"
                    className={`pour-card${i === activeIndex ? ' is-active' : ''}`}
                    onClick={() => select(i)}
                    aria-pressed={i === activeIndex}
                  >
                    <img src={`${d.strDrinkThumb}/small`} alt="" />
                    <span className="pour-card__name">{d.strDrink}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="visually-hidden" aria-live="polite">
          {drink ? `Showing ${drink.strDrink}` : ''}
        </p>
      </div>

      <div
        className="hero__media"
        ref={mediaRef}
        style={{ '--slab': drink ? tintFor(drink.idDrink) : undefined } as React.CSSProperties}
      >
        <div className="hero__stage" ref={stageRef}>
          <div className="hero__slab" />
          {drink && <img className="hero__image" src={drink.strDrinkThumb} alt="" />}
          <div className="hero__fizz" ref={fizzRef} aria-hidden="true" />
          <div className="hero__glare" aria-hidden="true" />
          <svg className="hero__rule" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="34" y1="0" x2="12" y2="100" vectorEffect="non-scaling-stroke" />
          </svg>
        </div>
        <div className="hero__garnishes hero__garnishes--front" ref={frontRef} aria-hidden="true">
          {renderGarnishes(FRONT_GARNISHES)}
        </div>
      </div>

      <button type="button" className="hero__scroll" onClick={onScrollDown} aria-label="Scroll to cocktails">
        <svg viewBox="0 0 24 12" aria-hidden="true">
          <path d="M2 2 L12 10 L22 2" />
        </svg>
      </button>
    </section>
  );
};

export default Hero;
