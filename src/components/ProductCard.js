import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Safety check: If product is missing (undefined), don't render anything
  if (!product) return null;

  // Format price to Ghana Cedis
  const formattedPrice = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0
  }).format(product.price);

  return (
    <div className="product-card">
      {/* Condition Badge */}
      <span className={`condition-badge ${product.condition === 'New' ? 'new' : 'used'}`}>
        {product.condition === 'New' ? 'Brand New' : 'UK Used'}
      </span>

      {/* Image */}
      <div className="image-wrapper">
        <img src={product.image_url} alt={product.name} />
      </div>

      {/* Info */}
      <div className="product-info">
        <p className="category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="price">{formattedPrice}</p>
        
        <button 
          className="add-btn"
          onClick={() => navigate('/cart')}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
