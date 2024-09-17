import { searchBtn, result, randomDrinksSection, scrollTopBtn, url } from "./constants.js";
import { fetchDrink } from "./api.js";
import { displayDrink, showLoadingSpinner } from "./ui.js";

export function setupEventListeners() {
    searchBtn.addEventListener("click", async () => {
        const userInput = document.getElementById("search-input").value.trim();
    
        if (userInput.length === 0) {
            result.innerHTML = "<h3>Please enter a drink name</h3>";
        } else {
            randomDrinksSection.innerHTML = "";
    
            result.innerHTML = "";
            showLoadingSpinner(true);
            setTimeout(async () => {
                const searchResults = await fetchDrink(url + userInput);
                showLoadingSpinner(false);
    
                if (!searchResults || searchResults.length === 0) {
                    result.innerHTML = "<h3>No drinks found</h3>";
                } else {
                    searchResults.forEach(drink => displayDrink(drink, result));
                }
            }, 2000);
        }
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ 
            top: 0, behavior: 'smooth' 
        });
    });
}
