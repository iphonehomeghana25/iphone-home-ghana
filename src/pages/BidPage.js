import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import LiveBidToasts from '../components/LiveBidToasts';

export default function BidPage() {
  const [activeBids, setActiveBids] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inject Paystack script securely on mount
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);

    fetchActiveBids();
  }, []);

  async function fetchActiveBids() {
    try {
      // FIX 1: Removed .limit(1).single() to fetch ALL active bids
      const { data, error } = await supabase
        .from('active_bids')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (data) setActiveBids(data);
    } catch (error) {
      console.error('Error fetching active bids:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-section" style={{ textAlign: 'center' }}>Loading live bids...</div>;

  if (activeBids.length === 0) {
    return (
      <div className="container py-section" style={{ textAlign: 'center' }}>
        <h2>No Active Bids Right Now</h2>
        <p>Check back later for your chance to win big!</p>
      </div>
    );
  }

  return (
    <div className="container py-section">
      
      {/* --- NEW LIVE NOTIFICATION LISTENER --- */}
      <LiveBidToasts />

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>Live Bidding Auctions 🔥</h1>
        <p style={{ color: '#667085', marginTop: '0.5rem' }}>Select an active campaign below, grab your tickets, and good luck!</p>
      </div>

      {/* Map through all active bids... */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {activeBids.map(bid => (
          <BidCard key={bid.id} activeBid={bid} />
        ))}
      </div>
    </div>
  );
}

// --- NEW BID CARD COMPONENT ---
// This handles the state, timer, and form for EACH individual bid independently
function BidCard({ activeBid }) {
  const [timeLeft, setTimeLeft] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [ticketCount, setTicketCount] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: ''
  });

  const pricePerTicket = 10; 
  const totalAmount = ticketCount * pricePerTicket;

  // Countdown Timer Logic
  useEffect(() => {
    if (!activeBid) return;

    const timer = setInterval(() => {
      const difference = +new Date(activeBid.end_time) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft(null); 
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBid]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSuccess = async (reference) => {
    setIsVerifying(true);
    
    try {
      const response = await fetch('/api/buy-bid', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reference: reference.reference,
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: formData.email,
          quantity: ticketCount,
          total_paid: totalAmount,
          active_bid_id: activeBid.id,
          product_name: activeBid.product_name
        })
      });

      const textResult = await response.text(); 
      if (!response.ok) {
        alert(`Verification Failed (Status ${response.status}).`);
        setIsVerifying(false);
        return;
      }

      const result = JSON.parse(textResult);

      if (result.success) {
        setIsSuccess(true);
      } else {
        alert('Database Error: ' + result.error);
      }
    } catch (error) {
      alert(`Frontend Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeLeft === null) return alert('This bid has ended!');
    if (!process.env.REACT_APP_PAYSTACK_PUBLIC_KEY) return alert('Paystack Public Key is missing!');
    if (!formData.email) return alert('Please enter a valid email address.');
    
    const handler = window.PaystackPop.setup({
      key: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: totalAmount * 100, 
      currency: 'GHS',
      reference: (new Date()).getTime().toString(),
      callback: function(response) {
        onSuccess(response);
      },
      onClose: function() {
        console.log('Payment window closed by user.');
      }
    });

    handler.openIframe();
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #eaecf0', padding: '2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
      {/* FIX 3: Changed grid to a responsive flex layout to prevent mobile cutoff */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'center' }}>
        
        {/* Left Side: Product Details & Timer */}
        <div style={{ flex: '1 1 280px', textAlign: 'center' }}>
          <span style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Live Auction
          </span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', margin: '1rem 0' }}>
            Win an {activeBid.product_name}
          </h2>
          <img 
            src={activeBid.image_url} 
            alt={activeBid.product_name} 
            style={{ width: '100%', maxWidth: '280px', height: 'auto', objectFit: 'contain', margin: '0 auto' }} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            {timeLeft ? (
              <>
                <TimeBox label="Days" value={timeLeft.days}/>
                <TimeBox label="Hours" value={timeLeft.hours}/>
                <TimeBox label="Mins" value={timeLeft.minutes}/>
                <TimeBox label="Secs" value={timeLeft.seconds}/>
              </>
            ) : (
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#dc2626' }}>BIDDING CLOSED</div>
            )}
          </div>
        </div>

        {/* Right Side: Entry Form or Success Screen */}
        <div style={{ flex: '1 1 300px' }}>
          {isSuccess ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: '#ecfdf5', borderRadius: '12px', border: '2px solid #10b981' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
                <h2 style={{ color: '#065f46', fontWeight: '800', marginBottom: '1rem', fontSize: '1.5rem' }}>Payment Successful!</h2>
                <p style={{ color: '#047857', fontSize: '1rem', marginBottom: '1.5rem' }}>
                    Thank you, <strong>{formData.fullName}</strong>. You secured <strong>{ticketCount}</strong> bid(s). Check your email for your digital receipt.
                </p>
                <button 
                  onClick={() => {
                    setIsSuccess(false);
                    setTicketCount(1);
                    setFormData({ fullName: '', phone: '', email: '' });
                  }} 
                  style={{ background: '#059669', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Buy More For This Item
                </button>
            </div>
          ) : (
            <div style={{ padding: '1rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Secure Your Entry</h3>
                <p style={{ color: '#667085', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Only GH₵{pricePerTicket} per bid. Buy more to increase your chances!</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>How many bids?</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #eaecf0', borderRadius: '8px', overflow: 'hidden' }}>
                      {/* FIX 2: Added visible background, border, and text color to +/- buttons */}
                      <button type="button" onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} style={{ flex: 1, padding: '1rem', background: '#e5e7eb', color: '#000', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer', borderRight: '1px solid #d1d5db', borderLeft: 'none', borderTop: 'none', borderBottom: 'none' }}>-</button>
                      <div style={{ flex: 2, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', background: '#fff' }}>{ticketCount}</div>
                      <button type="button" onClick={() => setTicketCount(ticketCount + 1)} style={{ flex: 1, padding: '1rem', background: '#e5e7eb', color: '#000', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer', borderLeft: '1px solid #d1d5db', borderRight: 'none', borderTop: 'none', borderBottom: 'none' }}>+</button>
                    </div>
                  </div>

                  <input required type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} style={inputStyle} />
                  <input required type="tel" name="phone" placeholder="Phone Number (WhatsApp)" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                  <input required type="email" name="email" placeholder="Email Address (For receipt)" value={formData.email} onChange={handleInputChange} style={inputStyle} />
                  
                  <div style={{ borderTop: '1px solid #eaecf0', margin: '0.5rem 0' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', fontWeight: '800' }}>
                    <span>Total to Pay:</span>
                    <span>GH₵{totalAmount}</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!timeLeft || isVerifying}
                    style={{ 
                      width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold', 
                      background: (!timeLeft || isVerifying) ? '#ccc' : 'black', 
                      color: 'white', borderRadius: '8px', marginTop: '0.5rem', border: 'none', cursor: (!timeLeft || isVerifying) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isVerifying ? 'Verifying...' : `Pay GH₵${totalAmount} Now`}
                  </button>
                </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Small helper component for the countdown squares
function TimeBox({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9fafb', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #eaecf0', minWidth: '60px' }}>
      <span style={{ fontSize: '1.5rem', fontWeight: '900', lineHeight: '1' }}>{value}</span>
      <span style={{ fontSize: '0.7rem', color: '#667085', textTransform: 'uppercase', fontWeight: '700', marginTop: '0.3rem' }}>{label}</span>
    </div>
  );
}

const inputStyle = { padding: '0.9rem', borderRadius: '8px', border: '1px solid #d1d5db', width: '100%', boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'inherit' };
