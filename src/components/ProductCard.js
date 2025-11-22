import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext'; 
import '../App.css';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useShop(); 

  if (!product) return null;

  const formattedPrice = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 0
  }).format(product.price);

  const isOutOfStock = product.stock_status === 'Out of Stock';

  // --- FIXED BADGE LOGIC ---
  // We now check the CATEGORY to determine the badge style and text
  const isBrandNew = product.category === 'Brand New';
  const badgeText = isBrandNew ? 'Brand New' : (product.category === 'Accessories' ? 'Accessory' : 'UK Used');
  const badgeClass = isBrandNew ? 'new' : 'used';

  const handleBuyNow = (e) => {
      e.stopPropagation(); 
      if (!isOutOfStock) {
          addToCart(product);
          navigate('/cart');
      }
  };

  return (
    <div className="product-card" style={{ opacity: isOutOfStock ? 0.7 : 1 }}>
      
      {/* Dynamic Badge based on Category */}
      <span className={`condition-badge ${badgeClass}`}>
        {badgeText}
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