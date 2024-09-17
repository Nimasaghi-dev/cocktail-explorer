const url = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="
const randomUrl = "https://www.thecocktaildb.com/api/json/v1/1/random.php"

async function fetchDrink(apiUrl) {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data.drinks;
}

async function showRandomDrinks(count) {
    for (let i = 0; i < count; i++) {
        const drink = await fetchDrink(randomUrl);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showRandomDrinks(3);
})