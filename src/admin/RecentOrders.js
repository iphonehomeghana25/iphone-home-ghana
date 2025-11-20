import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOrders();
  }, []);

  async function fetchRecentOrders() {
    try {
      // Fetch only the latest 5 orders
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ padding: '1rem', color: '#667085' }}>Loading recent activity...</div>;

  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '12px', 
      border: '1px solid #eaecf0',
      marginTop: '2rem',
      overflow: 'hidden'
    }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid #eaecf0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>Recent Orders</h3>
        <Link to="/admin/orders" style={{ fontSize: '0.9rem', color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
          View All
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
          <tr>
            <th style={thStyle}>Order ID</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
             <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#667085' }}>No orders yet.</td></tr>
          ) : (
            orders.map(order => (
              <tr key={order.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                <td style={tdStyle}><span style={{ fontFamily: 'monospace' }}>{order.id}</span></td>
                <td style={tdStyle}>{order.customer_name}</td>
                <td style={tdStyle}>
                  <span style={{ 
                      padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700',
                      backgroundColor: getStatusColor(order.status).bg,
                      color: getStatusColor(order.status).text
                  }}>
                      {order.status}
                  </span>
                </td>
                <td style={tdStyle}>GH₵{order.total_amount}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Styling Helpers
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#667085', fontWeight: '600', textTransform: 'uppercase' };
const tdStyle = { padding: '1rem', fontSize: '0.9rem', color: '#101828' };

function getStatusColor(status) {
    switch(status) {
        case 'Delivered': return { bg: '#ecfdf5', text: '#027a48' };
        case 'Shipped': return { bg: '#eff6ff', text: '#175cd3' };
        case 'Cancelled': return { bg: '#fef2f2', text: '#b42318' };
        default: return { bg: '#fffbeb', text: '#b54708' }; // Processing
    }
}