import React from 'react';

export default function AdminHeader({ title }) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        
        {/* Notification Bell */}
        <button style={{ 
            background: '#f9fafb', border: '1px solid #eaecf0', borderRadius: '50%', 
            width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', padding: 0
        }}>
           <span style={{ fontSize: '1.2rem' }}>🔔</span>
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