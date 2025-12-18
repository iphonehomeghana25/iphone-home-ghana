import React from 'react';
import RaffleWheel from '../components/RaffleWheel';

export default function RafflePage({ location }) {
  return (
    <div style={{ 
        height: '100vh', 
        width: '100vw',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        // Luxury Dark Background
        backgroundColor: '#0a0a0a',
        backgroundImage: `
            radial-gradient(circle at 50% 50%, #1a1a1a 0%, #000000 100%)
        `,
        color: 'white',
        overflow: 'hidden' // Prevent scrolling
    }}>
        
        {/* Header - Compact to save space */}
        <div style={{ textAlign: 'center', marginBottom: '1vh', marginTop: '2vh' }}>
            <h1 style={{ margin: 0, fontSize: '0.8rem', color: '#666', textTransform: 'uppercase', letterSpacing: '4px' }}>
                iPhone Home Ghana
            </h1>
            <h2 style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '900', color: '#FFD700' }}>
                🎄 {location} RAFFLE 🎄
            </h2>
        </div>

        <RaffleWheel branch={location} />
        
    </div>
  );
}
