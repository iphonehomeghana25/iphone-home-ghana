import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageBids() {
  const [products, setProducts] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [entryMode, setEntryMode] = useState('inventory'); // 'inventory' or 'manual'
  const [selectedProduct, setSelectedProduct] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualImage, setManualImage] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Winner Selection State
  const [viewingBid, setViewingBid] = useState(null);
  const [entries, setEntries] = useState([]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // 1. Inject Cloudinary Upload Widget Script securely on mount
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      const { data: prodData } = await supabase
        .from('products')
        .select('id, name, image_url')
        .neq('category', 'Accessories'); 

      const { data: bidData } = await supabase
        .from('active_bids')
        .select('*')
        .order('created_at', { ascending: false });

      if (prodData) setProducts(prodData);
      if (bidData) setActiveBids(bidData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  // --- CLOUDINARY UPLOAD WIDGET ---
  const openCloudinaryWidget = () => {
    if (!window.cloudinary) {
      alert('Cloudinary widget is still loading. Please try again in a second.');
      return;
    }

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME, // Make sure this is in your .env.local
        uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET, // Make sure this is in your .env.local
        multiple: false,
        clientAllowedFormats: ['image'],
        maxImageFileSize: 5000000, // 5MB limit
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setManualImage(result.info.secure_url); // Save the uploaded URL to state
        }
      }
    );
    
    widget.open();
  };

  const handleCreateBid = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalName = '';
    let finalImage = '';

    if (entryMode === 'inventory') {
      const product = products.find(p => String(p.id) === String(selectedProduct));
      if (!product) {
        alert('Error: Could not find the selected product details.');
        setIsSubmitting(false);
        return;
      }
      finalName = product.name;
      finalImage = product.image_url;
    } else {
      if (!manualName || !manualImage) {
        alert('Error: Please provide a product name and upload an image.');
        setIsSubmitting(false);
        return;
      }
      finalName = manualName;
      finalImage = manualImage;
    }

    try {
      const { error } = await supabase
        .from('active_bids')
        .insert([{
          product_name: finalName,
          image_url: finalImage,
          end_time: new Date(endTime).toISOString(),
          status: 'active'
        }]);

      if (error) throw error;
      
      alert('Bid Campaign Created successfully!');
      setSelectedProduct('');
      setManualName('');
      setManualImage('');
      setEndTime('');
      fetchInitialData(); 
    } catch (error) {
      alert('Error creating bid: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewEntries = async (bidId) => {
    setViewingBid(bidId);
    setWinner(null);
    try {
      const { data } = await supabase
        .from('bid_entries')
        .select('*')
        .eq('active_bid_id', bidId);
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  const pickWinner = () => {
    if (entries.length === 0) return alert('No entries yet!');

    let pool = [];
    entries.forEach(entry => {
      for (let i = 0; i < entry.quantity; i++) {
        pool.push(entry);
      }
    });

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedWinner = pool[randomIndex];
    setWinner(selectedWinner);
  };

  const updateBidStatus = async (bidId, newStatus) => {
    try {
      await supabase.from('active_bids').update({ status: newStatus }).eq('id', bidId);
      fetchInitialData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div>Loading Bid Management...</div>;

  return (
    <div>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaecf0', marginBottom: '2rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Create New Bid Campaign</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
            <button 
              type="button"
              onClick={() => setEntryMode('inventory')}
              style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', background: entryMode === 'inventory' ? 'white' : 'transparent', boxShadow: entryMode === 'inventory' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              From Inventory
            </button>
            <button 
              type="button"
              onClick={() => setEntryMode('manual')}
              style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', background: entryMode === 'manual' ? 'white' : 'transparent', boxShadow: entryMode === 'manual' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}
            >
              Custom Item
            </button>
          </div>
        </div>

        <form onSubmit={handleCreateBid} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          
          {entryMode === 'inventory' ? (
            <div style={{ flex: '1', minWidth: '250px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Phone</label>
              <select 
                required 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}
              >
                <option value="">-- Choose a Product --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Custom Product Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. AirPods Pro Gen 2"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Image</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button 
                    type="button" 
                    onClick={openCloudinaryWidget}
                    style={{ padding: '0.8rem', flex: 1, background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    {manualImage ? 'Upload Different Image' : '☁️ Upload to Cloudinary'}
                  </button>
                  {manualImage && (
                    <img src={manualImage} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eaecf0' }} />
                  )}
                </div>
              </div>
            </>
          )}
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>End Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={isSubmitting} style={{ padding: '0.8rem 2rem', height: '47px', background: 'var(--brand-yellow)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            {isSubmitting ? 'Creating...' : 'Launch Bid'}
          </button>
        </form>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaecf0' }}>
        <h3>Active & Past Bids</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '1rem' }}>Product</th>
              <th style={{ padding: '1rem' }}>End Time</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeBids.map(bid => (
              <tr key={bid.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={bid.image_url} alt={bid.product_name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                  {bid.product_name}
                </td>
                <td style={{ padding: '1rem' }}>{new Date(bid.end_time).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold',
                    background: bid.status === 'active' ? '#ecfdf5' : '#f3f4f6',
                    color: bid.status === 'active' ? '#065f46' : '#374151'
                  }}>
                    {bid.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleViewEntries(bid.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', cursor: 'pointer' }}>View Entries</button>
                  {bid.status === 'active' && (
                    <button onClick={() => updateBidStatus(bid.id, 'completed')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>End Now</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingBid && (
        <div style={{ marginTop: '2rem', background: '#f9fafb', padding: '2rem', borderRadius: '12px', border: '1px solid #eaecf0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Bid Entries ({entries.reduce((sum, e) => sum + e.quantity, 0)} Total Tickets)</h3>
            <button onClick={() => setViewingBid(null)} style={{ background: 'transparent', color: 'black', border: '1px solid black', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Close Window</button>
          </div>

          {winner ? (
            <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '2px solid #10b981' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h2 style={{ color: '#065f46', margin: 0 }}>Winner Selected!</h2>
              <h1 style={{ fontSize: '2.5rem', margin: '1rem 0' }}>{winner.customer_name}</h1>
              <p style={{ margin: '0.5rem 0' }}><strong>Phone:</strong> {winner.customer_phone}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Email:</strong> {winner.customer_email}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Tickets Held:</strong> {winner.quantity}</p>
            </div>
          ) : (
            <>
              <button onClick={pickWinner} style={{ width: '100%', padding: '1rem', fontSize: '1.2rem', marginBottom: '1.5rem', background: 'var(--brand-yellow)', color: 'black', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                🎲 Pick Random Winner
              </button>
              
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                {entries.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666' }}>No bids placed for this item yet.</p>
                ) : (
                  entries.map(entry => (
                    <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', marginBottom: '0.75rem', borderRadius: '8px', border: '1px solid #eaecf0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                      <div>
                        <strong style={{ fontSize: '1.1rem', color: '#111' }}>{entry.customer_name}</strong>
                        <div style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '0.4rem', display: 'flex', gap: '1rem' }}>
                          <span>📞 {entry.customer_phone}</span>
                          <span>✉️ {entry.customer_email}</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.4rem' }}>
                          Ref: {entry.paystack_reference} | Paid: GH₵{entry.total_paid}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '900', color: '#d97706', fontSize: '1.2rem', background: '#fef3c7', padding: '0.4rem 0.8rem', borderRadius: '6px' }}>
                          {entry.quantity} Ticket(s)
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
