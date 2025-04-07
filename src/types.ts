export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strGlass: string;
  strInstructions: string;
  [key: string]: string | null; // For dynamic ingredient and measure properties
}

export interface CocktailResponse {
  drinks: Cocktail[] | null;
} 