import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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
      
      // Update local state immediately
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
      alert(`Order #${id} updated to ${newStatus}`);
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  // --- NEW: DELETE FUNCTION ---
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Remove from UI
            setOrders(orders.filter(o => o.id !== id));
        } catch (error) {
            alert('Error deleting order: ' + error.message);
        }
    }
  };

  // Search Filter
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer_phone.includes(searchTerm)
  );

  return (
    <div>
      {/* Header & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Manage Orders</h1>
        <input 
            type="text" 
            placeholder="Search Order ID or Name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #d0d5dd', width: '300px' }}
        />
      </div>
      
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        {loading ? (
          <p style={{ padding: '2rem' }}>Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
           <p style={{ padding: '2rem', color: '#667085' }}>No orders found matching your search.</p> 
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Customer Info</th>
                <th style={thStyle}>Items</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Update</th>
                <th style={thStyle}>Actions</th> {/* New Header */}
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                  <td style={tdStyle}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#101828' }}>#{order.id}</span>
                    <div style={{ fontSize: '0.75rem', color: '#667085' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.75rem', color: '#101828', fontWeight: '600', marginTop: '4px' }}>{order.delivery_method || 'Delivery'}</div>
                  </td>
                  
                  <td style={tdStyle}>
                      <div style={{fontWeight:'600', color: '#101828'}}>{order.customer_name}</div>
                      <div style={{fontSize:'0.85rem', color:'#667085'}}>{order.customer_phone}</div>
                      <div style={{fontSize:'0.8rem', color:'#667085'}}>{order.customer_address}</div>
                  </td>

                  <td style={tdStyle}>
                      <div style={{ fontSize: '0.85rem', color: '#344054' }}>
                        {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                            <div key={idx}>• {item.name} (x{item.quantity})</div>
                        ))}
                      </div>
                  </td>

                  <td style={tdStyle}><strong style={{ color: '#101828' }}>GH₵{order.total_amount}</strong></td>
                  
                  <td style={tdStyle}>
                    <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: '100px', 
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: getStatusColor(order.status).bg,
                        color: getStatusColor(order.status).text
                    }}>
                        {order.status}
                    </span>
                  </td>

                  <td style={tdStyle}>
                    <select 
                        value={order.status} 
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #d0d5dd', fontSize: '0.9rem', cursor: 'pointer' }}
                    >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  
                  {/* NEW: Delete Button */}
                  <td style={tdStyle}>
                    <button 
                        onClick={() => handleDelete(order.id)}
                        style={{ 
                            padding: '0.5rem', 
                            backgroundColor: '#fee2e2', 
                            color: '#dc2626', 
                            border: 'none', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.8rem'
                        }}
                    >
                        Delete
                    </button>
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

const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.85rem', color: '#667085', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem', verticalAlign: 'top' };

function getStatusColor(status) {
    switch(status) {
        case 'Delivered': return { bg: '#ecfdf5', text: '#027a48' };
        case 'Shipped': return { bg: '#eff6ff', text: '#175cd3' };
        case 'Cancelled': return { bg: '#fef2f2', text: '#b42318' };
        default: return { bg: '#fffbeb', text: '#b54708' };
    }
}