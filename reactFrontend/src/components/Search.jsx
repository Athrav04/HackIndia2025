import React from "react";
import { Link } from "react-router-dom";
import { useSearch } from "../context/SearchContext";
import "./Search.css";

function Search() {
  const {
    isSearchOpen,
    searchQuery,
    searchResults,
    searchInputRef,
    searchModalRef,
    toggleSearch,
    handleSearchChange,
    handleSearchSubmit,
  } = useSearch();

  if (!isSearchOpen) return null;

  return (
    <div className={`search-overlay ${isSearchOpen ? "open" : ""}`}>
      <div className="search-modal" ref={searchModalRef}>
        <div className="search-header">
          <form onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                ref={searchInputRef}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => handleSearchChange({ target: { value: "" } })}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className="search-submit">
              Search
            </button>
          </form>
          <button className="close-search" onClick={toggleSearch}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="search-results">
          {searchQuery.length >= 2 && searchResults.length === 0 ? (
            <div className="no-results">
              No products found for "{searchQuery}"
            </div>
          ) : searchQuery.length >= 2 ? (
            <>
              <div className="results-count">
                Found {searchResults.length} results for "{searchQuery}"
              </div>
              <div className="results-list">
                {searchResults.map((product) => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="result-item"
                    onClick={toggleSearch}
                  >
                    <div className="result-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="result-content">
                      <h3>{product.name}</h3>
                      <div className="result-price">₹{product.price}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="search-prompt">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <p>Start typing to search for products</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
