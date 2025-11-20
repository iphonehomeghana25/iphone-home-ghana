import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function LowStockAlert() {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkStock();
  }, []);

  async function checkStock() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, stock_status')
        .eq('stock_status', 'Out of Stock');

      if (error) throw error;
      setLowStockItems(data || []);
    } catch (error) {
      console.error('Error checking stock:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return null; 
  if (lowStockItems.length === 0) return null; 

  return (
    <div style={{ 
      marginTop: '2rem', 
      padding: '1.5rem', 
      backgroundColor: '#fef2f2', 
      border: '1px solid #fee2e2', 
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>⚠️</span>
        <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#991b1b', margin: 0 }}>Restock Alert</h3>
            <p style={{ margin: 0, color: '#b91c1c', fontSize: '0.9rem' }}>
                The following items are marked as <strong>Out of Stock</strong>:
            </p>
        </div>
      </div>

      <ul style={{ paddingLeft: '2.5rem', margin: 0 }}>
        {lowStockItems.map(item => (
            <li key={item.id} style={{ color: '#b91c1c', marginBottom: '0.25rem' }}>
                {item.name}
                <Link to="/admin/products" style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#dc2626', textDecoration: 'underline' }}>
                    Manage
                </Link>
            </li>
        ))}
      </ul>
    </div>
  );
}