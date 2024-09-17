const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const randomUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const result = document.getElementById("result");
const randomDrinksSection = document.getElementById("random-drinks");
const searchBtn = document.getElementById("search-btn");

let randomDrinksLoaded = false;

document.addEventListener("DOMContentLoaded", async () => {
  if (!randomDrinksLoaded) {
    await showRandomDrinks(3);
    randomDrinksLoaded = true;
  }
});

async function showRandomDrinks(count) {
  randomDrinksSection.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const drink = await fetchDrink(randomUrl);
    if (drink) {
        displayDrink(drink[0], randomDrinksSection);
    }
  }
}

searchBtn.addEventListener("click", async () => {
  const userInput = document.getElementById("search-input").Value.trim();

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
        searchResults.forEach((drink) => displayDrink(drink, result));
      }
    }, 2000);
  }
});

async function fetchDrink(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.error("Error fetching data: ", error);
    return [];
  }
}

function displayDrink(drink, container) {
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
    <p>${drink.strCategory}</p>
    <ul>${ingredients.map(ing => `<li>${ing}</li>`).join('')}</ul>
    <button class= "show-more">Show more</button>
    <div class= "instructions hidden"><pre>${drink.strInstructions}</pre></div>
    `;
    container.appendChild(drinkCard);
}