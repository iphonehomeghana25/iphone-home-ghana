import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container py-section" style={{ textAlign: 'center', minHeight: '60vh' }}>
        <h1 className="section-title">Your Cart is Empty</h1>
        <p className="section-subtitle">Looks like you haven't added any phones yet.</p>
        <button onClick={() => navigate('/shop')}>Start Shopping</button>
      </div>
    );
  }

  return (
    <div className="container py-section">
      <h1 className="section-title" style={{ marginBottom: '2rem' }}>Your Cart ({cart.length})</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left: Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {cart.map((item) => (
            <div key={item.id} style={{ 
                display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid #eaecf0', 
                borderRadius: '12px', alignItems: 'center', background: 'white' 
            }}>
              {/* Image */}
              <img src={item.image_url} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
              
              {/* Details */}
              <div style={{ flexGrow: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '700' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#667085', fontSize: '0.9rem' }}>
                   {item.storage} • {item.condition === 'New' ? 'Brand New' : 'UK Used'}
                </p>
                <p style={{ marginTop: '0.5rem', fontWeight: '700' }}>GH₵{item.price.toLocaleString()}</p>
              </div>

              {/* Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '5px 10px', background: 'transparent', color: 'black' }}>-</button>
                    <span style={{ padding: '0 10px', fontWeight: '600' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '5px 10px', background: 'transparent', color: 'black' }}>+</button>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#fee2e2', color: '#b91c1c', padding: '8px', fontSize: '0.8rem' }}>
                    Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Summary */}
        <div style={{ padding: '2rem', border: '1px solid #eaecf0', borderRadius: '16px', backgroundColor: '#f9fafb', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: '700' }}>GH₵{cartTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <span>Delivery:</span>
                <span style={{ color: '#667085' }}>Calculated at Checkout</span>
            </div>
            <div style={{ borderTop: '1px solid #ddd', margin: '1rem 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '1.2rem' }}>
                <span style={{ fontWeight: '800' }}>Total:</span>
                <span style={{ fontWeight: '800', color: 'black' }}>GH₵{cartTotal.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')} style={{ width: '100%' }}>
                Proceed to Checkout
            </button>
        </div>

      </div>
    </div>
  );
}