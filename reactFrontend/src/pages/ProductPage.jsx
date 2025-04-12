import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/product/${id}`);
        console.log('API Response:', response.data);
        if (response.data) {
          // Parse the image_urls string into an array
          const productData = {
            ...response.data,
            image_urls: JSON.parse(response.data.image_urls.replace(/'/g, '"'))
          };
          setProduct(productData);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to fetch product details');
        setTimeout(() => navigate('/'), 3000);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product._id,
        name: product.name,
        price: parseFloat(product.price),
        image: product.image_urls[0],
        quantity: 1
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="bg-red-50 p-4 rounded-md">
          <h2 className="text-xl text-red-700">{error || 'Product not found'}</h2>
        </div>
      </div>
    );
  }

  // Get the first image URL
  const imageUrl = product.image_urls?.[0];
  console.log('Using image URL:', imageUrl);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col gap-8">
            {/* Product Image */}
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm p-8 h-[600px] flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      console.error('Image failed to load:', e);
                      e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
                    }}
                  />
                ) : (
                  <div className="text-gray-500 text-center">
                    Image not available
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full">
              <div className="space-y-6">
                <h1 className="text-5xl font-medium text-gray-900">{product.name}</h1>
                <p className="text-4xl font-semibold text-gray-800">₹{product.price}</p>
                <p className="text-xl text-gray-600 leading-relaxed">{product.description}</p>
                
                <button
                  onClick={handleAddToCart}
                  className="mt-8 flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-4 px-8 rounded-md font-medium transition-colors duration-200 w-full"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;