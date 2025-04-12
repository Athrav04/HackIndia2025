import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/product/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!product) return <div className="not-found">Product not found</div>;

  // Parse the image URLs from the string
  const imageUrls = JSON.parse(product.image_urls.replace(/'/g, '"'));

  return (
    <div className="product-detail-container">
      <div className="product-detail">
        <div className="product-image-container">
          <img 
            src={imageUrls[0]} 
            alt={product.name} 
            className="product-image"
          />
        </div>
        <div className="product-info">
          <h1 className="product-name">{product.name}</h1>
          <div className="product-price">
            <span className="currency">{product.currency}</span>
            <span className="amount">{product.price}</span>
          </div>
          <div className="product-description">
            <h2>About this item</h2>
            <p>{product.description}</p>
          </div>
          <button className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 