import React, { useRef, useEffect } from 'react';
import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, onSearch }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when the component mounts
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch(value);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search cocktails by name"
        className="search-input"
        aria-label="Search cocktails by name"
      />
      <button type="submit" className="search-button">
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6" />
          <path d="M13 13 L18 18" />
        </svg>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
