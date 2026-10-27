import React, { useState, useEffect, useRef } from 'react';
import { Cocktail } from './types';
import { fetchMultipleRandomDrinks, searchDrinks } from './services/api';
import DrinkCard from './components/DrinkCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import InfiniteScroll from './components/InfiniteScroll';
import Logo from './components/Logo';
import Hero from './components/Hero';
import ClassicsMarquee from './components/ClassicsMarquee';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  const [searchResults, setSearchResults] = useState<Cocktail[]>([]);
  const [randomDrinks, setRandomDrinks] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState('');
  const drinksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadInitialRandomDrinks();
  }, []);

  const loadInitialRandomDrinks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const drinks = await fetchMultipleRandomDrinks(10);
      setRandomDrinks(drinks.filter((d, i) => drinks.findIndex(x => x.idDrink === d.idDrink) === i));
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
      // The random endpoint can return a drink we already show
      setRandomDrinks(prev => [
        ...prev,
        ...newDrinks.filter(d => !prev.some(p => p.idDrink === d.idDrink)),
      ]);
    } catch (err) {
      setError('Failed to load more drinks. Please try again later.');
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsSearching(true);
      setLastQuery(trimmed);
      const results = await searchDrinks(trimmed);
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
    setQuery('');
    loadInitialRandomDrinks();
  };

  const scrollToDrinks = () => {
    drinksRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (searchTerm: string) => {
    handleSearch(searchTerm);
    scrollToDrinks();
  };

  const handlePickClassic = (name: string) => {
    setQuery(name);
    handleSearchSubmit(name);
  };

  const handleLogoClick = () => {
    if (isSearching) handleReset();
    scrollToTop();
  };

  const featured = randomDrinks[0];

  const showFeaturedRecipe = () => {
    if (!featured) return;
    document
      .getElementById(`drink-${featured.idDrink}`)
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      <header className="site-header">
        <div className="site-header__inner">
          <button
            type="button"
            className="logo-link"
            onClick={handleLogoClick}
            aria-label="Cocktail Explorer, back to start"
          >
            <Logo />
          </button>
          <SearchBar value={query} onChange={setQuery} onSearch={handleSearchSubmit} />
        </div>
      </header>

      <Hero
        drink={isSearching ? undefined : featured}
        onSeeRecipe={showFeaturedRecipe}
        onScrollDown={scrollToDrinks}
      />

      <main className="content">
        {error && <div className="error-message" role="alert">{error}</div>}

        {isSearching ? (
          <section className="drinks-section" ref={drinksRef} aria-labelledby="results-title">
            <h2 className="double-title" id="results-title">
              <span className="double-title__bold">Results</span>
              <span className="double-title__thin">for “{lastQuery}”</span>
            </h2>
            <div className="section-actions">
              <button type="button" className="btn-outline" onClick={handleReset}>
                Back to random cocktails
              </button>
            </div>

            {isLoading && <LoadingSpinner />}

            {!isLoading && searchResults.length === 0 && (
              <div className="empty-state">
                <p className="empty-state__title">No cocktails named “{lastQuery}”.</p>
                <p>Search matches drink names. Try a shorter word, like “sour” or “gin”.</p>
              </div>
            )}

            <div className="drinks-grid">
              {searchResults.map(drink => (
                <DrinkCard key={drink.idDrink} drink={drink} />
              ))}
            </div>
          </section>
        ) : (
          <section className="drinks-section" ref={drinksRef} aria-labelledby="random-title">
            <h2 className="double-title" id="random-title">
              <span className="double-title__bold">Random</span>
              <span className="double-title__thin">cocktails</span>
            </h2>

            {isLoading && !randomDrinks.length && <LoadingSpinner />}

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

      <ClassicsMarquee onPick={handlePickClassic} />

      <Footer onBackToTop={scrollToTop} />

      <ScrollToTop />
    </div>
  );
};

export default App;
