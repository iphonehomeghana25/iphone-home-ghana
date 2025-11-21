import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminHeader({ title }) {
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Fetch "Processing" orders count on mount
  useEffect(() => {
    fetchNotifications();
    
    // Optional: Set up an interval to check every 60 seconds without refreshing
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    try {
      // Count orders that are still 'Processing' (New)
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Processing');

      if (error) throw error;
      setNotificationCount(count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.5rem 2.5rem', 
      backgroundColor: 'white', 
      borderBottom: '1px solid #eaecf0',
      marginBottom: '2rem'
    }}>
      
      {/* Left: Page Title */}
      <div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, color: '#101828' }}>
          {title}
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#667085', marginTop: '0.25rem' }}>
          {currentDate}
        </p>
      </div>

      {/* Right: Profile & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        
        {/* Notification Bell - Click to go to Orders */}
        <button 
            onClick={() => navigate('/admin/orders')}
            style={{ 
                background: '#f9fafb', border: '1px solid #eaecf0', borderRadius: '50%', 
                width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', padding: 0, position: 'relative'
            }}
            title="View New Orders"
        >
           <span style={{ fontSize: '1.3rem' }}>🔔</span>
           
           {/* Red Badge Counter */}
           {notificationCount > 0 && (
               <span style={{ 
                   position: 'absolute', 
                   top: '-5px', 
                   right: '-5px', 
                   backgroundColor: '#dc2626', 
                   color: 'white', 
                   fontSize: '0.75rem', 
                   fontWeight: 'bold', 
                   borderRadius: '50%', 
                   width: '22px', 
                   height: '22px', 
                   display: 'flex', 
                   alignItems: 'center', 
                   justifyContent: 'center',
                   border: '2px solid white'
               }}>
                   {notificationCount}
               </span>
           )}
        </button>

        {/* Admin Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                backgroundColor: 'var(--brand-yellow)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', color: 'black'
            }}>
                A
            </div>
            <div style={{ lineHeight: '1.2' }}>
                <span style={{ display: 'block', fontWeight: '600', fontSize: '0.9rem' }}>Admin User</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: '#667085' }}>Store Manager</span>
            </div>
        </div>

      </div>
    </header>
  );
}