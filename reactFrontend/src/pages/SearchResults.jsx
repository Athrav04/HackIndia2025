import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import products from "../data";
import "./SearchResults.css";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top
    window.scrollTo(0, 0);

    setLoading(true);

    // Simulate loading delay
    const timer = setTimeout(() => {
      // Perform search
      const searchResults = products.filter((product) => {
        const lowercaseQuery = query.toLowerCase();
        return (
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.description.toLowerCase().includes(lowercaseQuery) ||
          product.features.some((feature) =>
            feature.toLowerCase().includes(lowercaseQuery)
          )
        );
      });

      setResults(searchResults);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-results-page">
      <Header />
      <main>
        <div className="container">
          <div className="search-results-header">
            <h1>Search Results</h1>
            <p>
              {loading
                ? "Searching..."
                : results.length === 0
                ? `No results found for "${query}"`
                : `Found ${results.length} results for "${query}"`}
            </p>
          </div>

          {loading ? (
            <div className="search-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="no-search-results">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
              <p>We couldn&apos;t find any products that match your search.</p>
              <div className="search-suggestions">
                <h3>Suggestions:</h3>
                <ul>
                  <li>Check the spelling of your search term.</li>
                  <li>Try using more general keywords.</li>
                  <li>Try searching for a related product.</li>
                </ul>
              </div>
              <Link to="/" className="back-home-btn">
                Back to Homepage
              </Link>
            </div>
          ) : (
            <div className="search-results-grid">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default SearchResults;
