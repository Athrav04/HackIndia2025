import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const { id, name, price, rating, image } = product;
  const cardRef = useRef(null);

  useEffect(() => {
    if (cardRef.current) {
      // Add the animated class to make the product visible
      cardRef.current.classList.add("animated");
    }
  }, []);

  // Generate star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`star-${i}`} className="star full">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <span key="half-star" className="star half">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="none" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
              fill="url(#halfStarGradient)"
            />
          </svg>
        </span>
      );
    }

    // Add empty stars to make total of 5
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-star-${i}`} className="star empty">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </span>
      );
    }

    return stars;
  };

  return (
    <div className="product-card" ref={cardRef} data-scroll>
      <Link to={`/products/${id}`} className="product-link">
        <div className="product-image">
          <img src={image} alt={name} loading="lazy" />
          <div className="eco-badge">Eco-Friendly</div>
        </div>

        <div className="product-info">
          <h3 className="product-name">{name}</h3>
          <div className="product-rating">
            <div className="stars">{renderStars(rating)}</div>
            <span className="rating-value">{rating.toFixed(1)}</span>
          </div>
          <div className="product-price">₹{price}</div>
          <button className="view-product">View Details</button>
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
