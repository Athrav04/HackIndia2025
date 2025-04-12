import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SearchResults from "./pages/SearchResults";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import Cart from "./components/Cart";
import Search from "./components/Search";
import Toast from "./components/Toast";
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <CartProvider>
      <SearchProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Cart />
        <Search />
        <Toast />
      </SearchProvider>
    </CartProvider>
  );
}

export default App;
