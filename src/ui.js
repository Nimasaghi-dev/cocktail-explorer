import { loadingSpinner, scrollTopBtn } from "./constants.js";

export function displayDrink(drink, container) {
    const drinkCard = document.createElement("div");
    drinkCard.className = "drink-card";

    let ingredients = [];
    for (let i = 1; i <= 15; i++){
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
            ingredients.push(`${measure ? measure : ''} ${ingredient}`);
        }
    }

    drinkCard.innerHTML = `
    <img src="${drink.strDrinkThumb}" alt="${drink.strDrink}">
    <h2>${drink.strDrink}</h2>
    <p>${drink.strGlass}</p>
    <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
    <button class="show-more">Show More</button>
    <div class="instructions hidden"><pre>${drink.strInstructions}</pre></div>
    `;

    container.appendChild(drinkCard);

    const showMoreBtn = drinkCard.querySelector(".show-more");
    const instructionsDiv = drinkCard.querySelector(".instructions");

    showMoreBtn.addEventListener("click", () => {
        if (instructionsDiv.classList.contains("hidden")) {
            instructionsDiv.classList.remove("hidden");
            showMoreBtn.textContent = "Show less";
        } else {
            instructionsDiv.classList.add("hidden");
            showMoreBtn.textContent = "Show more";
        }
    });
}

export function showLoadingSpinner(show) {
    if (show) {
        loadingSpinner.classList.remove("hidden");
    } else {
        loadingSpinner.classList.add("hidden");
    }
}
