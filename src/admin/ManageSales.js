import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageSales() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('This Month'); // Default filter

  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingRevenue: 0,
    orderCount: 0
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilter(filter);
  }, [orders, filter]);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    } finally {
      setLoading(false);
    }
  }

  const applyFilter = (selectedFilter) => {
    const now = new Date();
    let filtered = [];

    if (selectedFilter === 'All Time') {
        filtered = orders;
    } else {
        filtered = orders.filter(order => {
            const orderDate = new Date(order.created_at);
            
            if (selectedFilter === 'Today') {
                return orderDate.toDateString() === now.toDateString();
            }
            if (selectedFilter === 'This Week') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                return orderDate >= oneWeekAgo;
            }
            if (selectedFilter === 'This Month') {
                return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            }
            if (selectedFilter === 'This Year') {
                return orderDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }

    setFilteredOrders(filtered);
    calculateStats(filtered);
  };

  const calculateStats = (data) => {
      let revenue = 0;
      let pending = 0;

      data.forEach(order => {
          const amount = parseFloat(order.total_amount) || 0;
          
          // "Delivered" = Cash in Hand
          if (order.status === 'Delivered') {
              revenue += amount;
          }
          // "Processing" or "Shipped" = Potential Cash
          if (order.status === 'Processing' || order.status === 'Shipped') {
              pending += amount;
          }
      });

      setStats({
          totalRevenue: revenue,
          pendingRevenue: pending,
          orderCount: data.length
      });
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Sales Analytics</h1>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {['Today', 'This Week', 'This Month', 'This Year', 'All Time'].map(f => (
            <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{ 
                    padding: '0.6rem 1.2rem', 
                    borderRadius: '100px',
                    border: filter === f ? '2px solid black' : '1px solid #ddd',
                    backgroundColor: filter === f ? 'black' : 'white',
                    color: filter === f ? 'white' : 'black',
                    fontWeight: '600',
                    cursor: 'pointer'
                }}
            >
                {f}
            </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <div style={cardStyle('#ecfdf5', '#065f46')}>
              <p style={cardLabelStyle}>Total Revenue (Delivered)</p>
              <h2 style={cardValueStyle}>GH₵{stats.totalRevenue.toLocaleString()}</h2>
          </div>
          <div style={cardStyle('#fffbeb', '#b45309')}>
              <p style={cardLabelStyle}>Pending (Processing/Shipped)</p>
              <h2 style={cardValueStyle}>GH₵{stats.pendingRevenue.toLocaleString()}</h2>
          </div>
          <div style={cardStyle('#eff6ff', '#1e40af')}>
              <p style={cardLabelStyle}>Total Orders</p>
              <h2 style={cardValueStyle}>{stats.orderCount}</h2>
          </div>
      </div>

      {/* Sales Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #eaecf0' }}>
            <h3 style={{ margin: 0 }}>Transaction History ({filter})</h3>
        </div>
        
        {loading ? <p style={{padding:'2rem'}}>Loading sales...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                    <tr>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Customer</th>
                        <th style={thStyle}>Amount</th>
                        <th style={thStyle}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                            <td style={tdStyle}>{new Date(order.created_at).toLocaleDateString()}</td>
                            <td style={tdStyle}>{order.customer_name}</td>
                            <td style={{...tdStyle, fontWeight: '700'}}>GH₵{parseFloat(order.total_amount).toLocaleString()}</td>
                            <td style={tdStyle}>
                                <span style={{ 
                                    padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700',
                                    backgroundColor: order.status === 'Delivered' ? '#ecfdf5' : (order.status === 'Cancelled' ? '#fef2f2' : '#fffbeb'),
                                    color: order.status === 'Delivered' ? '#027a48' : (order.status === 'Cancelled' ? '#b91c1c' : '#b45309')
                                }}>
                                    {order.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                        <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No sales found for this period.</td></tr>
                    )}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}

// Styles
const cardStyle = (bg, color) => ({
    backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: `6px solid ${bg}` // Accent border
});
const cardLabelStyle = { color: '#667085', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', margin: 0 };
const cardValueStyle = { fontSize: '2rem', fontWeight: '800', margin: '0.5rem 0 0 0', color: '#101828' };
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };