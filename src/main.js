// import { randomDrinksSection } from './constants.js';
import { showRandomDrinks } from './api.js';
import { setupEventListeners } from './events.js';

document.addEventListener("DOMContentLoaded", async () => {
    await showRandomDrinks(3); // No need to pass `randomDrinksSection` here
    setupEventListeners();
});

