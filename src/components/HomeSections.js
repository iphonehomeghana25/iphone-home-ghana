import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- 1. Features Section ---
export function FeaturesSection() {
  return (
    <section className="py-16 container">
      <div className="features-grid">
        <div className="feature-card">
          <div className="icon-box">🛡️</div>
          <h3>Authentic Products</h3>
          <p>All devices are 100% genuine with warranty.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Quick delivery across Accra & Ghana.</p>
        </div>
        <div className="feature-card">
          <div className="icon-box">🎧</div>
          <h3>24/7 Support</h3>
          <p>Always here to help you via WhatsApp/Call.</p>
        </div>
      </div>
    </section>
  );
}

// --- 2. How It Works ---
export function HowItWorksSection() {
  return (
    <section className="py-16" style={{ backgroundColor: '#f9fafb' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="section-title">Shopping Made Simple</h2>
        <p className="section-subtitle">Get your perfect phone in three easy steps.</p>
        
        <div className="features-grid mt-4">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Place Your Order</h3>
            <p>Browse our collection and add your favorite phones to the cart.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Choose Payment</h3>
            <p>Select Pay on Delivery or secure Mobile Money at checkout.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Track & Receive</h3>
            <p>Use your Order ID to track your delivery right to your doorstep.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// --- 3. Testimonials ---
export function TestimonialsSection() {
  return (
    <section className="py-16 container">
      <h2 className="section-title" style={{ textAlign: 'center' }}>What Our Customers Say</h2>
      <div className="features-grid mt-4">
        <div className="review-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p>"Best prices in Accra, period. Got a clean UK used 13 Pro and it works like new. Delivery was same-day!"</p>
          <h4>- Daniel A.</h4>
        </div>
        <div className="review-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p>"iPhone Home Ghana is my go-to. Trustworthy and very professional service. Highly recommended."</p>
          <h4>- Grace O.</h4>
        </div>
        <div className="review-card">
          <div className="stars">⭐⭐⭐⭐⭐</div>
          <p>"Legit dealer. Bought a brand new 15 Pro and it was sealed perfect. The rider was very polite."</p>
          <h4>- Sammy T.</h4>
        </div>
      </div>
    </section>
  );
}

// --- 4. Track Order Input (Updated) ---
export function TrackOrderInput() {
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    navigate('/track'); 
  };

  return (
    <section className="py-16" style={{ backgroundColor: '#f9fafb', textAlign: 'center' }}>
      <div className="container">
        <h2 className="section-title">Track Your Delivery</h2>
        <p className="section-subtitle">Already placed an order? Enter your Order ID below.</p>
        
        <form onSubmit={handleTrack} style={{ marginTop: '2rem' }}>
            {/* New Class for the Pill Shape */}
            <div className="track-input-container">
                <input 
                    type="text" 
                    placeholder="e.g. IHG-88123" 
                    required
                />
                <button type="submit">Track Order</button>
            </div>
        </form>
      </div>
    </section>
  );
}

// --- 5. Shop All CTA (Ensure this is exported!) ---
export function ShopAllCTA() {
    const navigate = useNavigate();
    return (
        <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
            <button 
                onClick={() => navigate('/shop')} 
                style={{ 
                    fontSize: '1.2rem', 
                    padding: '1rem 3rem', 
                    backgroundColor: 'black', 
                    color: 'white' 
                }}
            >
                Shop All Products
            </button>
        </div>
    );
}
