import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/product/${id}`);
        if (response.data) {
          setProduct(response.data);
        } else {
          setError('Product not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch product details');
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: parseFloat(product.price),
        image: JSON.parse(product.image_urls.replace(/'/g, '"'))[0],
        quantity: 1
      });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error || 'Product not found'}</p>
        <a href="/" className="back-btn">Return to Home</a>
      </div>
    );
  }

  const imageUrls = JSON.parse(product.image_urls.replace(/'/g, '"'));

  return (
    <div className="product-page">
      <div className="product-breadcrumbs">
        <a href="/">Home</a> / <span>{product.name}</span>
      </div>
      
      <div className="product-content">
        <div className="product-gallery">
          <div className="product-image-container">
            <img
              src={imageUrls[0]}
              alt={product.name}
              className="product-main-image"
            />
          </div>
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-price">
            <span className="currency">{product.currency}</span>
            <span className="amount">{product.price}</span>
          </div>

          <div className="product-availability in-stock">
            In Stock
          </div>

          <div className="product-description">
            <h2>About this item</h2>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <button 
              className="add-to-cart-button"
              onClick={handleAddToCart}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
              Add to Cart
            </button>
          </div>

          <div className="shipping-info">
            <p>Free delivery on orders over £20</p>
            <p>Delivery within 2-3 business days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;