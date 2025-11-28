import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const { cart, cartTotal, placeOrder } = useShop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', address: '', email: '',
    paymentMethod: 'Pay on Delivery', deliveryMethod: 'Delivery',
    orderNotes: '' // <--- New State for Notes
  });

  useEffect(() => {
    if (cart.length === 0 && !loading && !isSuccess) {
        navigate('/shop');
    }
  }, [cart, loading, isSuccess, navigate]);

  if (cart.length === 0 && !loading && !isSuccess) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await placeOrder(formData);

    if (response.success) {
        setIsSuccess(true);
        setLoading(false);
        navigate('/order-confirmation', { state: { order: response.order } });
    } else {
        setLoading(false);
        alert('Error placing order: ' + response.error);
    }
  };

  return (
    <div className="container py-section" style={{ maxWidth: '800px' }}>
      <h1 className="section-title">Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        
        {/* Order Preview */}
        <div style={{ background: '#f9fafb', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaecf0' }}>
            <h3 style={{ margin: 0 }}>Order Total: GH₵{cartTotal.toLocaleString()}</h3>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
                {cart.length} Items in cart
            </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input required name="fullName" placeholder="Full Name" onChange={handleChange} style={inputStyle} />
                <input required name="phone" placeholder="Phone Number" onChange={handleChange} style={inputStyle} />
            </div>
            
            <input required name="email" type="email" placeholder="Email Address (for receipt)" onChange={handleChange} style={inputStyle} />
            
            {/* Delivery Method */}
            <div style={{ border: '1px solid #d0d5dd', borderRadius: '8px', padding: '1rem' }}>
                <label style={{display:'block', marginBottom:'0.8rem', fontWeight:'700'}}>Delivery Method</label>
                <select name="deliveryMethod" onChange={handleChange} style={inputStyle}>
                    <option value="Delivery">🚚 Delivery to my Doorstep</option>
                    <option value="Pickup-Haatso">🏪 Pickup @ Haatso Branch</option>
                    <option value="Pickup-Circle">🏪 Pickup @ Circle Branch</option>
                </select>
            </div>

            {/* Address Field */}
            {formData.deliveryMethod === 'Delivery' && (
                <textarea required name="address" placeholder="Delivery Address / Ghana Post GPS / Landmark" onChange={handleChange} style={{ ...inputStyle, height: '80px' }} />
            )}

            {/* --- NEW: Order Notes / Color Request --- */}
            <div>
                <label style={{display:'block', marginBottom:'0.5rem', fontWeight:'600'}}>Order Notes (Optional)</label>
                <textarea 
                    name="orderNotes" 
                    placeholder="Type the color you want or any special instructions..." 
                    onChange={handleChange} 
                    style={{ ...inputStyle, height: '80px' }} 
                />
            </div>

            {/* Payment Method */}
            <div style={{ border: '1px solid #d0d5dd', borderRadius: '8px', padding: '1rem' }}>
                <label style={{display:'block', marginBottom:'0.8rem', fontWeight:'700'}}>Payment Method</label>
                <select name="paymentMethod" onChange={handleChange} style={inputStyle}>
                    <option value="Pay on Delivery">Pay on Delivery (Cash/Momo)</option>
                    <option value="Pay Online">Pay Now (Bank Transfer / Mobile Money)</option>
                </select>

                {formData.paymentMethod === 'Pay Online' && (
                    <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fcd34d', borderRadius: '8px' }}>
                        <p style={{ fontWeight: 'bold', color: '#92400e', marginBottom: '0.5rem' }}>Make payment to:</p>
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: '0.9rem', color: '#78350f' }}>
                            <li style={{ marginBottom: '0.5rem' }}>🏦 <strong>Bank:</strong> Cal Bank / Osu Branch - 1400004044152 (Success key Enterprise)</li>
                            <li>📱 <strong>MTN Momo:</strong> 053 883 9690 (iPhone Home Ghana)</li>
                        </ul>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.8rem', fontStyle: 'italic' }}>
                            *Please use your Name as Reference. We will confirm payment before delivery.*
                        </p>
                    </div>
                )}
            </div>

            <button type="submit" disabled={loading} style={{ marginTop: '1rem', width: '100%' }}>
                {loading ? 'Processing Order...' : `Confirm Order (GH₵${cartTotal.toLocaleString()})`}
            </button>

        </form>
      </div>
    </div>
  );
}

const inputStyle = { padding: '0.8rem', borderRadius: '6px', border: '1px solid #d0d5dd', width: '100%', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '1rem' };