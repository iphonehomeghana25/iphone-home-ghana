import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext'; // <--- IMPORT CONTEXT
import '../App.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useShop(); // <--- Use context function

  if (!product) return null;

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0
  }).format(product.price);

  const isOutOfStock = product.stock_status === 'Out of Stock';

  const handleBuyNow = (e) => {
      e.stopPropagation(); // Prevents issues if card itself is clickable
      if (!isOutOfStock) {
          addToCart(product);
          // Optional: Navigate to cart after adding
          navigate('/cart');
      }
  };

  return (
    <div className="product-card" style={{ opacity: isOutOfStock ? 0.7 : 1 }}>
      
      {/* Condition Badge */}
      <span className={`condition-badge ${product.condition === 'New' ? 'new' : 'used'}`}>
        {product.condition === 'New' ? 'Brand New' : 'UK Used'}
      </span>

      {/* Out of Stock Overlay */}
      {isOutOfStock && (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(255,255,255,0.6)', zIndex: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <span style={{ background: 'black', color: 'white', padding: '5px 10px', fontWeight: 'bold', borderRadius: '4px' }}>SOLD OUT</span>
        </div>
      )}

      {/* Image */}
      <div className="image-wrapper">
        <img src={product.image_url} alt={product.name} />
      </div>

      {/* Info */}
      <div className="product-info">
        <p className="category">{product.category}</p>
        <h3>{product.name}</h3>
        
        {/* Specs Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#555' }}>
            {product.storage && <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{product.storage}</span>}
            {product.color && <span style={{ background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>{product.color}</span>}
            {product.battery_health && (
                <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 6px', borderRadius: '4px', fontWeight: '600' }}>
                    BH: {product.battery_health}
                </span>
            )}
        </div>

        <p className="price">{formattedPrice}</p>
        
        <button 
          className="add-btn"
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          style={{ 
              backgroundColor: isOutOfStock ? '#ccc' : 'var(--brand-yellow)',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer'
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
        </button>
      </div>
    </div>
  );
}