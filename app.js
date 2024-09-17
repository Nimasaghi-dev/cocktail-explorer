const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";
const randomUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php";
const result = document.getElementById("result");
const searchBtn = document.getElementById("search-btn");
const randomDrinksSection = document.getElementById("random-drinks");
const scrollTopBtn = document.getElementById("scroll-top");
const loadingSpinner = document.getElementById("loading");

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
  

async function fetchDrink(apiUrl) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.drinks;
  } catch (error) {
    console.error("Error fetching drink: ", error);
    return [];
  }
}

function displayDrink(drink, container) {
    const drinkCard = document.createElement("div"); 
    drinkCard.className = "drink-card";

    let ingredients = [];
    for (let i = 1; i <= 15; i++){
        const ingredient = drink[`strIngredients${i}`];
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
    <button class= "show-more">Show More</button>
    <div class= "instructions hidden"><pre>${drink.strInstructions}</pre></div>
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

function showLoadingSpinner(show) {
    if (show) {
        loadingSpinner.classList.remove("hidden");
    } else {
        loadingSpinner.classList.add("hidden");
    }
}

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
