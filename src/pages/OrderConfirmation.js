import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {}; 

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    if (!order) {
        navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    alert('Order ID copied to clipboard!');
  };

  const handleReviewSubmit = async (e) => {
      e.preventDefault();
      try {
          const { error } = await supabase.from('reviews').insert([{
              customer_name: order.customer_name,
              rating: rating,
              comment: comment,
              is_published: false // Hidden until approved
          }]);

          if (error) throw error;
          setReviewSubmitted(true);
      } catch (err) {
          alert('Error submitting review: ' + err.message);
      }
  };

  return (
    <div className="container py-section" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Existing Order Confirmation Block */}
      <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #eaecf0', maxWidth: '600px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '3rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Order Confirmed!</h1>
        <p style={{ color: '#667085', fontSize: '1.1rem', marginBottom: '2rem' }}>
            Thank you, <strong>{order.customer_name.split(' ')[0]}</strong>! We have received your order.
        </p>

        <div style={{ backgroundColor: '#f9fafb', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #eaecf0' }}>
            <p style={{ fontSize: '0.9rem', color: '#667085', marginBottom: '0.5rem' }}>Your Order ID</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '2px' }}>
                    {order.id}
                </span>
                <button onClick={copyOrderId} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: 'white', border: '1px solid #ccc', color: 'black', cursor: 'pointer' }}>
                    Copy
                </button>
            </div>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>What happens next?</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.6' }}>
                <li style={{ marginBottom: '0.5rem' }}>✅ Check your email for the receipt.</li>
                <li style={{ marginBottom: '0.5rem' }}>📞 Our team will call you shortly to confirm.</li>
                <li>🚚 You can track your delivery using the Order ID.</li>
            </ul>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/track"><button style={{ backgroundColor: 'white', color: 'black', border: '1px solid black' }}>Track Order</button></Link>
            <Link to="/"><button>Continue Shopping</button></Link>
        </div>
      </div>

      {/* --- NEW REVIEW SECTION --- */}
      {!reviewSubmitted ? (
          <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
              <h3 style={{ marginBottom: '1rem' }}>How was your experience?</h3>
              <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star} 
                            onClick={() => setRating(star)} 
                            style={{ cursor: 'pointer', color: star <= rating ? '#FFD700' : '#ddd' }}
                          >★</span>
                      ))}
                  </div>
                  <textarea 
                    placeholder="Write a quick review..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                    required
                    style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
                  />
                  <button type="submit" style={{ alignSelf: 'center', width: '200px' }}>Submit Review</button>
              </form>
          </div>
      ) : (
          <div style={{ padding: '2rem', backgroundColor: '#ecfdf5', color: '#065f46', borderRadius: '12px', fontWeight: '600' }}>
              Thank you! Your review has been submitted.
          </div>
      )}

    </div>
  );
}