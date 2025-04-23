import React, { useState, useEffect } from 'react';
import { Cocktail } from './types';
import { fetchMultipleRandomDrinks, searchDrinks } from './services/api';
import DrinkCard from './components/DrinkCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import InfiniteScroll from './components/InfiniteScroll';
import './App.css';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Cocktail[]>([]);
  const [randomDrinks, setRandomDrinks] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadInitialRandomDrinks();
  }, []);

  const loadInitialRandomDrinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const drinks = await fetchMultipleRandomDrinks(10);
      setRandomDrinks(drinks);
      setHasMore(true);
    } catch (err) {
      setError('Failed to load random drinks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreRandomDrinks = async () => {
    if (!hasMore || isLoading) return;
    
    try {
      setIsLoading(true);
      const newDrinks = await fetchMultipleRandomDrinks(5);
      setRandomDrinks(prev => [...prev, ...newDrinks]);
    } catch (err) {
      setError('Failed to load more drinks. Please try again later.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsSearching(true);
      const results = await searchDrinks(query);
      setSearchResults(results);
      setHasMore(false);
    } catch (err) {
      setError('Failed to search drinks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSearching(false);
    setSearchResults([]);
    loadInitialRandomDrinks();
  };

  return (
    <div className="app">
      <header>
        <h1>Cocktail Explorer</h1>
        <SearchBar onSearch={handleSearch} />
      </header>

      <main>
        {error && <div className="error-message">{error}</div>}
        
        {isLoading && !randomDrinks.length && !searchResults.length && (
          <LoadingSpinner />
        )}

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
            <InfiniteScroll
              onLoadMore={loadMoreRandomDrinks}
              hasMore={hasMore}
              isLoading={isLoading}
            >
              <div className="drinks-grid">
                {randomDrinks.map(drink => (
                  <DrinkCard key={drink.idDrink} drink={drink} />
                ))}
              </div>
            </InfiniteScroll>
          </section>
        )}
      </main>

      <ScrollToTop />
    </div>
  );
};

export default App; 