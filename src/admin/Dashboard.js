import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import RecentOrders from './RecentOrders'; 
import LowStockAlert from './LowStockAlert'; 

export default function Dashboard() {
  const [stats, setStats] = useState({ 
      products: 0, 
      orders: 0, 
      bnpl: 0,
      revenue: 0,        // Total Cash Collected (Delivered)
      pendingRevenue: 0, // Cash in Pipeline (Processing/Shipped)
      monthlySales: 0    // Sales this month
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      // 1. Get Counts
      const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
      const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
      const { count: bnplCount } = await supabase.from('bnpl_records').select('*', { count: 'exact', head: true });

      // 2. Get Financial Data (Fetch order amounts and dates)
      const { data: orderData } = await supabase
        .from('orders')
        .select('total_amount, status, created_at');

      // 3. Calculate Financials
      let totalRev = 0;
      let pendingRev = 0;
      let monthRev = 0;
      
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      if (orderData) {
          orderData.forEach(order => {
              const amount = parseFloat(order.total_amount) || 0;
              const orderDate = new Date(order.created_at);

              // Calculate Total Revenue (Only Delivered orders count as "money in bank")
              // Note: You can change this logic if client counts 'Shipped' as revenue too.
              if (order.status === 'Delivered') {
                  totalRev += amount;

                  // Calculate Monthly Revenue
                  if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                      monthRev += amount;
                  }
              }

              // Calculate Pending Revenue (Potential money)
              if (order.status === 'Processing' || order.status === 'Shipped') {
                  pendingRev += amount;
              }
          });
      }

      setStats({
        products: productCount || 0,
        orders: orderCount || 0,
        bnpl: bnplCount || 0,
        revenue: totalRev,
        pendingRevenue: pendingRev,
        monthlySales: monthRev
      });

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {/* --- SALES TRACKER ROW (NEW) --- */}
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#667085' }}>Financial Overview</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {/* Total Revenue Card */}
          <StatCard 
            title="Total Revenue (Delivered)" 
            value={`GH₵${stats.revenue.toLocaleString()}`} 
            icon="💰" 
            color="#ecfdf5" 
            textColor="#065f46" 
          />
          
          {/* Pending Revenue Card */}
          <StatCard 
            title="Pending Sales (Active)" 
            value={`GH₵${stats.pendingRevenue.toLocaleString()}`} 
            icon="⏳" 
            color="#fffbeb" 
            textColor="#b45309" 
          />

          {/* Monthly Sales Card */}
          <StatCard 
            title="Sales This Month" 
            value={`GH₵${stats.monthlySales.toLocaleString()}`} 
            icon="📅" 
            color="#eff6ff" 
            textColor="#1e40af" 
          />
      </div>

      {/* --- OPERATIONAL STATS ROW --- */}
      <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#667085' }}>Store Operations</h3>
      
      {loading ? (
        <p>Loading stats...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <StatCard title="Total Products" value={stats.products} icon="📱" color="#f9fafb" textColor="#101828" />
          <StatCard title="Total Orders" value={stats.orders} icon="📦" color="#f9fafb" textColor="#101828" />
          <StatCard title="Active Debtors" value={stats.bnpl} icon="📒" color="#fef2f2" textColor="#b91c1c" />
        </div>
      )}

      {/* Alerts & Recent Activity */}
      <LowStockAlert />
      <RecentOrders />

    </div>
  );
}

function StatCard({ title, value, icon, color, textColor }) {
  return (
    <div style={{ 
      backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0', 
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '1.5rem'
    }}>
      <div style={{ 
          width: '60px', height: '60px', borderRadius: '50%', backgroundColor: color, 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem' 
      }}>
          {icon}
      </div>
      <div>
        <p style={{ color: '#667085', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0, letterSpacing: '0.5px' }}>{title}</p>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: textColor, margin: '0.25rem 0 0 0' }}>{value}</h2>
      </div>
    </div>
  );
}