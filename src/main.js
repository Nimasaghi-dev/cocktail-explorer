
import { showRandomDrinks } from './api.js';
import { setupEventListeners } from './events.js';

document.addEventListener("DOMContentLoaded", async () => {
    await showRandomDrinks(3); 
    setupEventListeners();
});


