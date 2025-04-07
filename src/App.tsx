import React, { useState, useEffect } from 'react';
import { Cocktail } from './types';
import { fetchDrink, fetchRandomDrink } from './services/api';
import DrinkCard from './components/DrinkCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Cocktail[]>([]);
  const [randomDrinks, setRandomDrinks] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadRandomDrinks();
  }, []);

  const loadRandomDrinks = async () => {
    const drinks = await fetchRandomDrink();
    setRandomDrinks(drinks);
  };

  const handleSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setError('Please enter a drink name');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsSearching(true);
    
    try {
      const drinks = await fetchDrink(searchTerm);
      setSearchResults(drinks);
      if (drinks.length === 0) {
        setError('No drinks found');
      }
    } catch (err) {
      setError('Error searching for drinks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchResults([]);
    setIsSearching(false);
    setError(null);
  };

  return (
    <div className="app">
      <header>
        <h1>Cocktail Explorer</h1>
      </header>

      <main>
        <SearchBar onSearch={handleSearch} />
        
        {isLoading && <LoadingSpinner />}
        
        {error && <div className="error-message">{error}</div>}

        {isSearching ? (
          <section className="search-results">
            <div className="section-header">
              <h2>Search Results</h2>
              <button className="reset-button" onClick={handleReset}>
                Back to Home
              </button>
            </div>
            <div className="drinks-grid">
              {searchResults.map(drink => (
                <DrinkCard key={drink.idDrink} drink={drink} />
              ))}
            </div>
          </section>
        ) : (
          <section className="random-drinks">
            <h2>Random Drinks</h2>
            <div className="drinks-grid">
              {randomDrinks.map(drink => (
                <DrinkCard key={drink.idDrink} drink={drink} />
              ))}
            </div>
          </section>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default App; 