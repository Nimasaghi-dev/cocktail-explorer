import React, { useState } from 'react';
import { Cocktail } from '../types';
import './DrinkCard.css';

interface DrinkCardProps {
  drink: Cocktail;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  const getIngredients = (): string[] => {
    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure ? measure : ''} ${ingredient}`);
      }
    }
    return ingredients;
  };

  return (
    <div className="drink-card">
      <img src={drink.strDrinkThumb} alt={drink.strDrink} />
      <h2>{drink.strDrink}</h2>
      <p className="glass-type">{drink.strGlass}</p>
      
      <div className="ingredients">
        <h3>Ingredients:</h3>
        <ul>
          {getIngredients().map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>

      <button 
        className="show-more"
        onClick={() => setShowInstructions(!showInstructions)}
      >
        {showInstructions ? 'Show Less' : 'Show More'}
      </button>

      {showInstructions && (
        <div className="instructions">
          <h3>Instructions:</h3>
          <pre>{drink.strInstructions}</pre>
        </div>
      )}
    </div>
  );
};

export default DrinkCard; 