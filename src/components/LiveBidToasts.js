import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LiveBidToasts() {
  const [latestToast, setLatestToast] = useState(null);

  useEffect(() => {
    // 1. Instantly fetch the most recent bid on page load
    fetchInitialLastBid();

    // 2. Listen for NEW bids and REPLACE the current toast
    const channel = supabase
      .channel('public:bid_entries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bid_entries' },
        (payload) => {
          const newBid = payload.new;
          formatAndSetToast(newBid);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchInitialLastBid = async () => {
    try {
      const { data, error } = await supabase
        .from('bid_entries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (data && !error) {
        formatAndSetToast(data);
      }
    } catch (err) {
      console.error("Error fetching initial toast", err);
    }
  };

  const formatAndSetToast = (bidData) => {
    // Privacy check: Format name to "Firstname L."
    const nameParts = bidData.customer_name.split(' ');
    const shortName = nameParts.length > 1 
      ? `${nameParts[0]} ${nameParts[1][0]}.` 
      : nameParts[0];

    // Using a timestamp ID ensures React re-animates it if a new bid comes in
    setLatestToast({
      id: new Date().getTime(), 
      message: `🎉 ${shortName} just secured ${bidData.quantity} ticket(s)!`
    });
  };

  // If there are zero bids in the database yet, show nothing
  if (!latestToast) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '120px', // Sits perfectly on the top right, below the header
      right: '20px',
      zIndex: 9999,
      pointerEvents: 'none', // Lets users click through it if they need to
      maxWidth: '300px'
    }}>
      {/* The key prop forces React to re-mount and "pop" the animation when a new bid replaces the old one */}
      <div key={latestToast.id} style={toastStyle}>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '800' }}>
          Latest Entry
        </div>
        <div>
          {latestToast.message}
        </div>
      </div>
    </div>
  );
}

const toastStyle = {
  background: '#ffffff',
  color: '#111827',
  padding: '16px 20px',
  borderRadius: '12px',
  fontWeight: '700',
  fontSize: '0.95rem',
  boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
  border: '1px solid #eaecf0',
  borderLeft: '4px solid #10b981', // iPhone Home Green Accent
  animation: 'slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
};

// Injecting the animation keyframes directly into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes slideIn {
    0% { transform: translateX(100%); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);
