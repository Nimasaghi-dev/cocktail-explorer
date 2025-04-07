import { Cocktail, CocktailResponse } from '../types';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';
const SEARCH_URL = `${BASE_URL}/search.php?s=`;
const RANDOM_URL = `${BASE_URL}/random.php`;

export const fetchDrink = async (searchTerm: string): Promise<Cocktail[]> => {
  try {
    const response = await fetch(SEARCH_URL + searchTerm);
    const data: CocktailResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error fetching drink:', error);
    return [];
  }
};

export const fetchRandomDrink = async (): Promise<Cocktail[]> => {
  try {
    const response = await fetch(RANDOM_URL);
    const data: CocktailResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error('Error fetching random drink:', error);
    return [];
  }
}; 