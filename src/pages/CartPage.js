import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container py-section" style={{ textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="section-title">Your Cart is Empty</h1>
        <p className="section-subtitle">Looks like you haven't added any phones yet.</p>
        <button onClick={() => navigate('/shop')}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="container py-section">
      <h1 className="section-title" style={{ marginBottom: '2rem', textAlign: 'left' }}>Your Cart ({cart.length})</h1>
      
      <div className="cart-grid">
        
        {/* Left: Cart Items */}
        <div className="cart-items-list">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              {/* Image */}
              <div className="cart-item-image">
                <img src={item.image_url} alt={item.name} />
              </div>
              
              {/* Details */}
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p className="cart-specs">
                   {item.storage} • {item.condition === 'New' ? 'Brand New' : 'UK Used'}
                </p>
                <p className="cart-price">GH₵{item.price.toLocaleString()}</p>
              </div>

              {/* Controls */}
              <div className="cart-item-controls">
                <div className="quantity-selector">
                    <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
                <span>Subtotal:</span>
                <span style={{ fontWeight: '700' }}>GH₵{cartTotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
                <span>Delivery:</span>
                <span style={{ color: '#667085' }}>Calculated at Checkout</span>
            </div>
            <div className="divider"></div>
            <div className="summary-row total">
                <span>Total:</span>
                <span>GH₵{cartTotal.toLocaleString()}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
            </button>
        </div>

      </div>
    </div>
  );
}