import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageRaffle() {
  const [wins, setWins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWins();
    
    // Optional: Real-time subscription could go here later
    const interval = setInterval(fetchWins, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  async function fetchWins() {
    try {
      const { data, error } = await supabase
        .from('raffle_wins')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setWins(data || []);
    } catch (error) {
      console.error('Error fetching raffle wins:', error);
    } finally {
      setLoading(false);
    }
  }

  // Simple stats calculation
  const totalSpins = wins.length;
  const actualWinners = wins.filter(w => !w.prize_name.includes("Thank You")).length;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>🏆 Raffle Winners Log</h1>
      
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
            <h3 style={{ margin: 0, color: '#667085', fontSize: '0.9rem' }}>Total Spins</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>{totalSpins}</p>
        </div>
        <div style={cardStyle}>
            <h3 style={{ margin: 0, color: '#667085', fontSize: '0.9rem' }}>Actual Winners</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#16a34a' }}>{actualWinners}</p>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading records...</div>
        ) : (
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                        <tr>
                            <th style={thStyle}>Time</th>
                            <th style={thStyle}>Branch</th>
                            <th style={thStyle}>Customer Tier</th>
                            <th style={thStyle}>Prize Won</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wins.map((win) => (
                            <tr key={win.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                                <td style={tdStyle}>
                                    {new Date(win.created_at).toLocaleString()}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ 
                                        padding: '4px 8px', 
                                        borderRadius: '4px', 
                                        fontWeight: 'bold',
                                        fontSize: '0.8rem',
                                        backgroundColor: win.branch === 'Circle' ? '#fefce8' : '#eff6ff',
                                        color: win.branch === 'Circle' ? '#ca8a04' : '#2563eb'
                                    }}>
                                        {win.branch}
                                    </span>
                                </td>
                                <td style={tdStyle}>{win.tier}</td>
                                <td style={tdStyle}>
                                    <span style={{ 
                                        fontWeight: 'bold', 
                                        color: getPrizeColor(win.prize_name) 
                                    }}>
                                        {win.prize_name}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {wins.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                    No spins recorded yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
}

// Helper to color-code prizes
function getPrizeColor(prizeName) {
    if (prizeName.includes("Thank You")) return '#ef4444'; // Red for loss
    if (prizeName.includes("CHICKEN") || prizeName.includes("RICE")) return '#d97706'; // Gold/Orange for Big Wins
    return '#16a34a'; // Green for normal wins
}

// Styles
const cardStyle = { backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eaecf0' };
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085', fontWeight: '700' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };
