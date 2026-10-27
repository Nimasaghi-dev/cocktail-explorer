import React from 'react';
import { Cocktail } from '../types';
import './Hero.css';

interface HeroProps {
  drink?: Cocktail;
  onSeeRecipe: () => void;
  onScrollDown: () => void;
}

const Hero: React.FC<HeroProps> = ({ drink, onSeeRecipe, onScrollDown }) => {
  const meta = drink
    ? [drink.strCategory, drink.strGlass].filter(Boolean).join(' · ')
    : 'Recipes for every glass';

  return (
    <section className="hero" aria-label="Featured cocktail">
      <div className="hero__copy">
        <p className="eyebrow">{drink ? 'Tonight’s pour' : 'Cocktail Explorer'}</p>
        <h1 className="hero__title">{drink ? drink.strDrink : 'Find your next drink'}</h1>
        <p className="hero__meta">{meta}</p>
        <p className="hero__tagline">
          {drink
            ? 'Picked at random from the cocktail library.'
            : 'Search thousands of cocktails by name.'}
        </p>
        {drink && (
          <button type="button" className="btn-outline" onClick={onSeeRecipe}>
            See the recipe
          </button>
        )}
      </div>

      <div className="hero__media">
        {drink && (
          <img
            key={drink.idDrink}
            className="hero__image"
            src={drink.strDrinkThumb}
            alt=""
          />
        )}
        <svg className="hero__rule" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <line x1="34" y1="0" x2="12" y2="100" vectorEffect="non-scaling-stroke" />
        </svg>
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
