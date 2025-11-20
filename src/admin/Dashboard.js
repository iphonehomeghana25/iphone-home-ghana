import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, bnpl: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: bnplCount } = await supabase.from('bnpl_records').select('*', { count: 'exact', head: true });

      setStats({
        products: productCount || 0,
        orders: orderCount || 0,
        bnpl: bnplCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Dashboard Overview</h1>
      
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
          <StatCard title="Total Products" value={stats.products} icon="📱" color="#eff6ff" textColor="#1d4ed8" />
          <StatCard title="Total Orders" value={stats.orders} icon="📦" color="#f0fdf4" textColor="#15803d" />
          <StatCard title="Active Debtors" value={stats.bnpl} icon="📒" color="#fef2f2" textColor="#b91c1c" />
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, textColor }) {
  return (
    <div style={{ 
      backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem'
    }}>
      <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' }}>{icon}</div>
      <div>
        <p style={{ color: '#667085', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' }}>{title}</p>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', color: textColor, margin: 0 }}>{value}</h2>
      </div>
    </div>
  );
}