import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import products from "../data";

// Create Context
const SearchContext = createContext();

// Create Provider Component
export const SearchProvider = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchInputRef = useRef(null);
  const navigate = useNavigate();

  // Toggle search modal
  const toggleSearch = () => {
    const newState = !isSearchOpen;
    setIsSearchOpen(newState);

    if (newState) {
      // Focus input when opening search
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      // Clear search when closing
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      // Perform search if query is at least 2 characters
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  };

  // Perform search
  const performSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();

    const results = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.features.some((feature) =>
          feature.toLowerCase().includes(lowercaseQuery)
        )
      );
    });

    setSearchResults(results);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();

    if (searchQuery.length >= 2) {
      // Close search modal
      setIsSearchOpen(false);

      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // Click outside to close
  const searchModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Context value
  const value = {
    isSearchOpen,
    searchQuery,
    searchResults,
    searchInputRef,
    searchModalRef,
    toggleSearch,
    handleSearchChange,
    handleSearchSubmit,
    performSearch,
  };

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);

  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }

  return context;
};
