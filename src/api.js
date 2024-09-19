import { randomUrl } from './constants.js';
import { displayDrink } from './ui.js';

export async function showRandomDrinks(count) {
    const randomDrinksSection = document.getElementById('random-drinks'); // Add this line
    randomDrinksSection.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const drink = await fetchDrink(randomUrl);
        if (drink) {
            displayDrink(drink[0], randomDrinksSection);
        }
    }
}


//! This block try/catch is used for error handling. It ensures that even if an error occurs during the API call or JSON parsing, the function doesn't crash.
export async function fetchDrink(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.drinks;
    } catch (error) {
        console.error("Error fetching drink: ", error);
        return [];
    }
}