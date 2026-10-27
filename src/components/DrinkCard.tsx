import React, { useEffect, useRef, useState } from 'react';
import { Cocktail } from '../types';
import { useCardTilt } from './useCardTilt';
import './DrinkCard.css';

interface DrinkCardProps {
  drink: Cocktail;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  // Half-turns so far. Always spinning forward makes flipping back finish the
  // rotation instead of rewinding it; odd = instructions side up.
  const [turns, setTurns] = useState(0);
  const showInstructions = turns % 2 === 1;
  const flip = () => setTurns(t => t + 1);
  const cardRef = useCardTilt<HTMLElement>();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const showButtonRef = useRef<HTMLButtonElement>(null);
  const hideButtonRef = useRef<HTMLButtonElement>(null);
  const isFirstRender = useRef(true);

  // Only the visible face can be focused or read; move focus with the flip
  useEffect(() => {
    frontRef.current?.toggleAttribute('inert', showInstructions);
    backRef.current?.toggleAttribute('inert', !showInstructions);
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    (showInstructions ? hideButtonRef : showButtonRef).current?.focus({ preventScroll: true });
  }, [showInstructions]);

  const instructionsId = `instructions-${drink.idDrink}`;

  return (
    <article
      ref={cardRef}
      className="drink-card"
      id={`drink-${drink.idDrink}`}
    >
      <div className="drink-card__tilt">
        <div className="drink-card__inner" style={{ transform: `rotateY(${turns * 180}deg)` }}>
          <div className="drink-card__face drink-card__front" ref={frontRef}>
            <div className="drink-card__media">
              <img
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                loading="lazy"
              />
            </div>
            <div className="drink-card__body">
              <p className="drink-card__glass">{drink.strGlass}</p>
              <h3 className="drink-card__title">{drink.strDrink}</h3>

              <ul className="drink-card__ingredients" aria-label="Ingredients">
                {Array.from({ length: 15 }, (_, i) => i + 1)
                  .map(num => {
                    const ingredient = drink[`strIngredient${num}` as keyof Cocktail];
                    const measure = drink[`strMeasure${num}` as keyof Cocktail];
                    return ingredient ? (
                      <li key={num}>
                        <span className="drink-card__ingredient">{ingredient}</span>
                        {measure && (
                          <>
                            <span className="drink-card__leader" aria-hidden="true" />
                            <span className="drink-card__measure">{measure.trim()}</span>
                          </>
                        )}
                      </li>
                    ) : null;
                  })}
              </ul>

              <button
                ref={showButtonRef}
                type="button"
                className="btn-outline btn-outline--small"
                onClick={flip}
                aria-expanded={showInstructions}
                aria-controls={instructionsId}
              >
                Show instructions
              </button>
            </div>
            <span className="drink-card__glare" aria-hidden="true" />
          </div>

          <div
            className="drink-card__face drink-card__back"
            ref={backRef}
            id={instructionsId}
            role="region"
            aria-label={`${drink.strDrink} instructions`}
          >
            <p className="drink-card__glass">{drink.strGlass}</p>
            <p className="drink-card__back-title">{drink.strDrink}</p>
            <h4 className="drink-card__method-label">Instructions</h4>
            <div className="drink-card__method">
              <p>{drink.strInstructions}</p>
            </div>
            <button
              ref={hideButtonRef}
              type="button"
              className="btn-outline btn-outline--small"
              onClick={flip}
            >
              Back to ingredients
            </button>
            <span className="drink-card__glare" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default DrinkCard;
