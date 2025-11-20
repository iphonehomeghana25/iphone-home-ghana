import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Optimistic update (update UI immediately)
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      alert(`Order #${id} updated to ${newStatus}`);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Manage Orders</h1>
      
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading orders...</p>
        ) : orders.length === 0 ? (
           <p style={{ padding: '2rem' }}>No orders found.</p> 
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                  <td style={tdStyle}><span style={{ fontFamily: 'monospace', fontWeight: '600' }}>{order.id}</span></td>
                  <td style={tdStyle}>
                      <div style={{fontWeight:'600'}}>{order.customer_name}</div>
                      <div style={{fontSize:'0.85rem', color:'#666'}}>{order.customer_phone}</div>
                  </td>
                  <td style={tdStyle}>GH₵{order.total_amount}</td>
                  <td style={tdStyle}>
                    <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        backgroundColor: order.status === 'Delivered' ? '#f0fdf4' : order.status === 'Shipped' ? '#eff6ff' : '#fffbeb',
                        color: order.status === 'Delivered' ? '#15803d' : order.status === 'Shipped' ? '#1d4ed8' : '#b45309'
                    }}>
                        {order.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d0d5dd' }}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };