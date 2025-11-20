import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      // Fetch order from Supabase based on ID
      // Note: ID is a string (e.g., "IHG-88123")
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      if (data) {
        setOrder(data);
      } else {
        setError('Order not found. Please check your Order ID.');
      }
    } catch (err) {
        // If no rows found, Supabase throws an error, so we catch it here
        if (err.code === 'PGRST116') {
             setError('Order ID not found. Please double-check.');
        } else {
             setError('Error fetching order. Please try again.');
             console.error(err);
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-16" style={{ minHeight: '60vh', maxWidth: '600px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: '800', textAlign: 'center', marginBottom: '1rem' }}>Track Your Order</h1>
      <p style={{ textAlign: 'center', color: '#667085', marginBottom: '3rem' }}>
        Enter the Order ID sent to your email or phone number.
      </p>

      <form onSubmit={handleTrack} style={{ marginBottom: '3rem' }}>
        <div className="track-input-container" style={{ maxWidth: '100%' }}>
          <input 
            type="text" 
            placeholder="Enter Order ID (e.g. IHG-12345)" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            required 
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Order'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: '8px', textAlign: 'center' }}>
            {error}
        </div>
      )}

      {order && (
        <div style={{ border: '1px solid #eaecf0', borderRadius: '16px', padding: '2rem', backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>Order #{order.id}</span>
                <StatusBadge status={order.status} />
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#667085' }}>Customer:</span>
                    <span style={{ fontWeight: '600' }}>{order.customer_name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#667085' }}>Date:</span>
                    <span style={{ fontWeight: '600' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#667085' }}>Total:</span>
                    <span style={{ fontWeight: '600' }}>GH₵{order.total_amount}</span>
                </div>
                 <div style={{ marginTop: '1rem' }}>
                    <span style={{ color: '#667085', display: 'block', marginBottom: '0.5rem' }}>Items:</span>
                    {order.items && order.items.map((item, index) => (
                        <div key={index} style={{ padding: '0.5rem', backgroundColor: '#f9fafb', borderRadius: '6px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                            {item.name} (x{item.quantity})
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
    let color = '#374151';
    let bg = '#f3f4f6';

    if (status === 'Processing') { color = '#b45309'; bg = '#fffbeb'; }
    if (status === 'Shipped') { color = '#1d4ed8'; bg = '#eff6ff'; }
    if (status === 'Delivered') { color = '#15803d'; bg = '#f0fdf4'; }
    if (status === 'Cancelled') { color = '#b91c1c'; bg = '#fef2f2'; }

    return (
        <span style={{ backgroundColor: bg, color: color, padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700' }}>
            {status}
        </span>
    );
}