import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }

  const togglePublish = async (id, currentStatus) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ is_published: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      
      // Update UI immediately
      setReviews(reviews.map(r => r.id === id ? { ...r, is_published: !currentStatus } : r));
    } catch (error) {
      alert('Error updating review: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) setReviews(reviews.filter(r => r.id !== id));
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Customer Reviews</h1>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        {loading ? <p style={{padding:'2rem'}}>Loading reviews...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                    <tr>
                        <th style={thStyle}>Date</th>
                        <th style={thStyle}>Customer</th>
                        <th style={thStyle}>Rating</th>
                        <th style={thStyle}>Comment</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reviews.map(r => (
                        <tr key={r.id} style={{ borderBottom: '1px solid #eaecf0', backgroundColor: r.is_published ? 'white' : '#f9fafb' }}>
                            <td style={tdStyle}>{new Date(r.created_at).toLocaleDateString()}</td>
                            <td style={{...tdStyle, fontWeight: '600'}}>{r.customer_name}</td>
                            <td style={tdStyle}>{'⭐'.repeat(r.rating)}</td>
                            <td style={{...tdStyle, maxWidth: '300px'}}>{r.comment}</td>
                            <td style={tdStyle}>
                                <span style={{ 
                                    padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700',
                                    backgroundColor: r.is_published ? '#ecfdf5' : '#f3f4f6',
                                    color: r.is_published ? '#027a48' : '#666'
                                }}>
                                    {r.is_published ? 'Published' : 'Hidden'}
                                </span>
                            </td>
                            <td style={tdStyle}>
                                <button onClick={() => togglePublish(r.id, r.is_published)} style={{ marginRight: '10px', padding: '0.4rem 0.8rem', backgroundColor: r.is_published ? '#f3f4f6' : 'var(--brand-yellow)', color: 'black', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}>
                                    {r.is_published ? 'Unpublish' : 'Approve'}
                                </button>
                                <button onClick={() => handleDelete(r.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {reviews.length === 0 && <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No reviews yet.</td></tr>}
                </tbody>
            </table>
        )}
      </div>
    </div>
  );
}

const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem', verticalAlign: 'top' };