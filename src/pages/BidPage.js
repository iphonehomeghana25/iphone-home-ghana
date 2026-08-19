import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { usePaystackPayment } from 'react-paystack';

export default function BidPage() {
  const [activeBid, setActiveBid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);
  
  // --- NEW: Success State ---
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

  useEffect(() => {
    fetchActiveBid();
  }, []);

  async function fetchActiveBid() {
    try {
      const { data, error } = await supabase
        .from('active_bids')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) setActiveBid(data);
    } catch (error) {
      console.error('No active bids found or error:', error);
    } finally {
      setLoading(false);
    }
  }

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

  const config = {
    reference: (new Date()).getTime().toString(),
    email: formData.email || 'pending@customer.com', 
    amount: totalAmount * 100, 
    currency: 'GHS',
    publicKey: process.env.REACT_APP_PAYSTACK_PUBLIC_KEY || '', 
  };

  const initializePayment = usePaystackPayment(config);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 4. SECURE VERIFICATION (DEBUGGING MODE) ---
  const onSuccess = async (reference) => {
    console.log("1. PAYSTACK SUCCESS TRIGGERED! Reference:", reference);
    setIsVerifying(true);
    
    try {
      console.log("2. Sending data to Vercel Backend...");
      
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

      console.log("3. Vercel Response Status:", response.status);
      
      // We grab raw text first to prevent JSON crashes!
      const textResult = await response.text(); 
      console.log("4. Raw Vercel Response:", textResult);

      if (!response.ok) {
        alert(`Vercel Backend Failed (Status ${response.status}). Check console for details.`);
        return;
      }

      // Now we safely parse it
      const result = JSON.parse(textResult);

      if (result.success) {
        console.log("5. Database save successful! Showing UI.");
        setIsSuccess(true);
      } else {
        alert('Database Error: ' + result.error);
      }
    } catch (error) {
      console.error("FATAL TRY/CATCH ERROR:", error);
      alert(`Frontend Caught Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const onClose = () => {
    console.log('Payment window closed.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (timeLeft === null) return alert('This bid has ended!');
    if (!process.env.REACT_APP_PAYSTACK_PUBLIC_KEY) return alert('Paystack Public Key is missing!');
    if (!formData.email) return alert('Please enter a valid email address.');
    
    initializePayment(onSuccess, onClose);
  };

  if (loading) return <div className="container py-section" style={{ textAlign: 'center' }}>Loading live bids...</div>;

  if (!activeBid) {
    return (
      <div className="container py-section" style={{ textAlign: 'center' }}>
        <h2>No Active Bids Right Now</h2>
        <p>Check back later for your chance to win big!</p>
      </div>
    );
  }

  return (
    <div className="container py-section">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
        
        {/* Left Side: Product Details & Timer */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ background: '#ef4444', color: 'white', padding: '6px 16px', borderRadius: '100px', fontWeight: 'bold', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Live Auction
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '1.5rem 0 1rem 0' }}>
            Win an {activeBid.product_name}
          </h1>
          <img 
            src={activeBid.image_url} 
            alt={activeBid.product_name} 
            style={{ width: '100%', maxWidth: '350px', height: 'auto', objectFit: 'contain', margin: '0 auto' }} 
          />
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
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
        <div style={{ background: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #eaecf0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
          
          {isSuccess ? (
            // --- SUCCESS SCREEN UI ---
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h2 style={{ color: '#059669', fontWeight: '800', marginBottom: '1rem' }}>Payment Successful!</h2>
                <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Thank you, <strong>{formData.fullName}</strong>. You have officially secured <strong>{ticketCount}</strong> bid(s) for the {activeBid.product_name}.
                </p>
                <div style={{ background: '#f3f4f6', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>We have sent a digital receipt to:</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontWeight: 'bold', color: '#111' }}>{formData.email}</p>
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{ background: 'transparent', color: 'black', border: '1px solid black', padding: '0.8rem 2rem', borderRadius: '100px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Buy More Bids
                </button>
            </div>
          ) : (
            // --- ENTRY FORM UI ---
            <>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: '700' }}>Secure Your Entry</h3>
                <p style={{ color: '#667085', marginBottom: '2rem' }}>Only GH₵{pricePerTicket} per bid. The more bids you buy, the higher your chances of winning!</p>
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem' }}>How many bids?</label>
                    <div style={{ display: 'flex', alignItems: 'center', border: '2px solid #eaecf0', borderRadius: '8px', overflow: 'hidden' }}>
                      <button type="button" onClick={() => setTicketCount(Math.max(1, ticketCount - 1))} style={{ flex: 1, padding: '1rem', background: '#f9fafb', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>-</button>
                      <div style={{ flex: 2, textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>{ticketCount}</div>
                      <button type="button" onClick={() => setTicketCount(ticketCount + 1)} style={{ flex: 1, padding: '1rem', background: '#f9fafb', fontSize: '1.2rem', cursor: 'pointer', border: 'none' }}>+</button>
                    </div>
                  </div>

                  <input required type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} style={inputStyle} />
                  <input required type="tel" name="phone" placeholder="Phone Number (WhatsApp)" value={formData.phone} onChange={handleInputChange} style={inputStyle} />
                  <input required type="email" name="email" placeholder="Email Address (For receipt)" value={formData.email} onChange={handleInputChange} style={inputStyle} />
                  
                  <div style={{ borderTop: '1px solid #eaecf0', margin: '1rem 0' }}></div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.25rem', fontWeight: '800' }}>
                    <span>Total to Pay:</span>
                    <span>GH₵{totalAmount}</span>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!timeLeft || isVerifying}
                    style={{ 
                      width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 'bold', 
                      background: (!timeLeft || isVerifying) ? '#ccc' : 'black', 
                      color: 'white', borderRadius: '8px', marginTop: '1rem', border: 'none', cursor: (!timeLeft || isVerifying) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isVerifying ? 'Verifying Payment...' : `Pay GH₵${totalAmount} Now`}
                  </button>
                </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

function TimeBox({ value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9fafb', padding: '0.8rem 1.2rem', borderRadius: '8px', border: '1px solid #eaecf0', minWidth: '70px' }}>
      <span style={{ fontSize: '1.8rem', fontWeight: '800', lineHeight: '1' }}>{value}</span>
      <span style={{ fontSize: '0.75rem', color: '#667085', textTransform: 'uppercase', fontWeight: '600', marginTop: '0.25rem' }}>{label}</span>
    </div>
  );
}

const inputStyle = { padding: '1rem', borderRadius: '8px', border: '1px solid #eaecf0', width: '100%', boxSizing: 'border-box', fontSize: '1rem', fontFamily: 'inherit' };
