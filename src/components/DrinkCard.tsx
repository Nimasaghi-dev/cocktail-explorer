import React, { useState } from 'react';
import { Cocktail } from '../types';
import './DrinkCard.css';

interface DrinkCardProps {
  drink: Cocktail;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const instructionsId = `instructions-${drink.idDrink}`;

  return (
    <article className="drink-card" id={`drink-${drink.idDrink}`}>
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
          type="button"
          className="btn-outline btn-outline--small"
          onClick={toggleInstructions}
          aria-expanded={showInstructions}
          aria-controls={instructionsId}
        >
          {showInstructions ? 'Hide instructions' : 'Show instructions'}
        </button>

        {showInstructions && (
          <div className="drink-card__instructions" id={instructionsId}>
            <h4>Instructions</h4>
            <p>{drink.strInstructions}</p>
          </div>
        )}
      </div>
    </article>
  );
};

export default DrinkCard;
