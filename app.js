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
