import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function LiveBidToasts() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // 1. Subscribe to the Supabase Realtime channel
    const channel = supabase
      .channel('public:bid_entries')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bid_entries' },
        (payload) => {
          const newBid = payload.new;
          
          // Privacy check: Format name to "Firstname L."
          const nameParts = newBid.customer_name.split(' ');
          const shortName = nameParts.length > 1 
            ? `${nameParts[0]} ${nameParts[1][0]}.` 
            : nameParts[0];

          // Create the toast object
          const newToast = {
            id: newBid.id,
            message: `🎉 ${shortName} just secured ${newBid.quantity} ticket(s)!`
          };

          // Add to state
          setToasts((currentToasts) => [...currentToasts, newToast]);

          // 2. Auto-delete the toast after 4 seconds
          setTimeout(() => {
            setToasts((currentToasts) => currentToasts.filter((t) => t.id !== newBid.id));
          }, 4000);
        }
      )
      .subscribe();

    // Cleanup subscription when leaving the page
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px', // Placed on the left so it doesn't overlap your WhatsApp button
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none' // Ensures users can still click things underneath it
    }}>
      {toasts.map((toast) => (
        <div key={toast.id} style={toastStyle}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

const toastStyle = {
  background: '#111',
  color: '#fff',
  padding: '12px 24px',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '0.95rem',
  boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
  animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
  borderLeft: '4px solid #10b981' // Green accent line
};
