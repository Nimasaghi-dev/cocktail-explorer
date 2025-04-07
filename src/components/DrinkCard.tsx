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

  return (
    <div className="drink-card">
      <div className="drink-image-container">
        <img 
          src={drink.strDrinkThumb} 
          alt={drink.strDrink} 
          className="drink-image"
        />
      </div>
      <div className="drink-content">
        <h2>{drink.strDrink}</h2>
        <p className="glass-type">Glass: {drink.strGlass}</p>
        
        <div className="ingredients">
          <h3>Ingredients:</h3>
          <ul>
            {Array.from({ length: 15 }, (_, i) => i + 1)
              .map(num => {
                const ingredient = drink[`strIngredient${num}` as keyof Cocktail];
                const measure = drink[`strMeasure${num}` as keyof Cocktail];
                return ingredient ? (
                  <li key={num}>
                    {measure ? `${measure} ` : ''}{ingredient}
                  </li>
                ) : null;
              })}
          </ul>
        </div>

        <button 
          className="show-more" 
          onClick={toggleInstructions}
          aria-expanded={showInstructions ? "true" : "false"}
        >
          {showInstructions ? 'Hide Instructions' : 'Show Instructions'}
        </button>

        {showInstructions && (
          <div className="instructions">
            <h3>Instructions:</h3>
            <p>{drink.strInstructions}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrinkCard; 