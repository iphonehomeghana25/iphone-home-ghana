import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageBids() {
  const [products, setProducts] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [entryMode, setEntryMode] = useState('inventory'); 
  const [selectedProduct, setSelectedProduct] = useState('');
  const [manualName, setManualName] = useState('');
  const [manualImage, setManualImage] = useState('');
  
  const [itemSpecs, setItemSpecs] = useState('');
  const [endTime, setEndTime] = useState('');
  const [targetRevenue, setTargetRevenue] = useState(1000); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [viewingBid, setViewingBid] = useState(null);
  const [entries, setEntries] = useState([]);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  const entriesPanelRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
      @keyframes spinAnimation {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(1080deg); }
      }
    `;
    document.head.appendChild(styleSheet);

    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      const { data: prodData } = await supabase.from('products').select('id, name, image_url').neq('category', 'Accessories'); 
      const { data: bidData } = await supabase.from('active_bids').select('*').order('created_at', { ascending: false });

      if (prodData) setProducts(prodData);
      if (bidData) setActiveBids(bidData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const openCloudinaryWidget = () => {
    if (!window.cloudinary) return alert('Cloudinary widget loading...');
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME, 
        uploadPreset: process.env.REACT_APP_CLOUDINARY_PRODUCT_PRESET, 
        multiple: false, clientAllowedFormats: ['image'], maxImageFileSize: 5000000, 
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setManualImage(result.info.secure_url); 
        }
      }
    );
    widget.open();
  };

  const handleCreateBid = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let finalName = ''; let finalImage = '';
    if (entryMode === 'inventory') {
      const product = products.find(p => String(p.id) === String(selectedProduct));
      if (!product) { alert('Error: Product not found.'); setIsSubmitting(false); return; }
      finalName = product.name; finalImage = product.image_url;
    } else {
      if (!manualName || !manualImage) { alert('Error: Provide name and image.'); setIsSubmitting(false); return; }
      finalName = manualName; finalImage = manualImage;
    }

    try {
      const calculatedTickets = Math.ceil(parseInt(targetRevenue) / 10);

      const { error } = await supabase
        .from('active_bids')
        .insert([{
          product_name: finalName,
          image_url: finalImage,
          item_specs: itemSpecs, 
          end_time: new Date(endTime).toISOString(),
          target_tickets: calculatedTickets,
          status: 'active'
        }]);

      if (error) throw error;
      
      alert('Bid Campaign Launched!');
      setSelectedProduct(''); setManualName(''); setManualImage(''); setItemSpecs(''); setEndTime(''); setTargetRevenue(1000);
      fetchInitialData(); 
    } catch (error) {
      alert('Error creating bid: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewEntries = async (bidId) => {
    setViewingBid(bidId);
    
    // Make sure we load any previously saved winner into state immediately
    const currentBidData = activeBids.find(b => b.id === bidId);
    setWinner(currentBidData?.winner_data || null);

    try {
      const { data } = await supabase.from('bid_entries').select('*').eq('active_bid_id', bidId);
      setEntries(data || []);

      setTimeout(() => {
        if (entriesPanelRef.current) entriesPanelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (error) {
      console.error('Error fetching entries:', error);
    }
  };

  // --- STRICT ERROR CHECKING ADDED HERE ---
  const pickWinner = async () => {
    if (entries.length === 0) return alert('No entries yet!');
    
    let pool = [];
    entries.forEach(entry => {
      for (let i = 0; i < entry.quantity; i++) pool.push(entry);
    });

    const randomIndex = Math.floor(Math.random() * pool.length);
    const selectedWinner = pool[randomIndex];
    
    // 1. Lock the UI into the spinning state
    setWinner(selectedWinner);
    setIsSpinning(true); 

    try {
      // 2. Alert the database (This triggers the public broadcast!)
      const { error: spinError } = await supabase
        .from('active_bids')
        .update({ winner_data: selectedWinner, status: 'spinning' })
        .eq('id', viewingBid);
      
      if (spinError) {
        alert("Supabase Update Error: " + spinError.message);
        setIsSpinning(false);
        return;
      }
      
      fetchInitialData(); 

      // 3. Wait 14 seconds for the public wheel to finish
      setTimeout(async () => {
        setIsSpinning(false); 

        // 4. Finalize the database to push it to the Wall of Fame
        const { error: completeError } = await supabase
          .from('active_bids')
          .update({ status: 'completed' })
          .eq('id', viewingBid);
          
        if (completeError) {
           alert("Supabase Complete Error: " + completeError.message);
        }
        
        fetchInitialData(); 
      }, 14000); 

    } catch (error) {
      alert("System Error: " + error.message);
      setIsSpinning(false);
    }
  };

  const updateBidStatus = async (bidId, newStatus) => {
    if (window.confirm("Manually end this bid?")) {
        try {
        await supabase.from('active_bids').update({ status: newStatus }).eq('id', bidId);
        fetchInitialData();
        } catch (error) { console.error('Error:', error); }
    }
  };

  const handleDeleteBid = async (bidId) => {
    if (window.confirm("Permanently delete this bid campaign?")) {
        try {
            await supabase.from('bid_entries').delete().eq('active_bid_id', bidId);
            const { error } = await supabase.from('active_bids').delete().eq('id', bidId);
            if (error) throw error;
            if (viewingBid === bidId) setViewingBid(null);
            fetchInitialData();
        } catch (error) { alert('Error: ' + error.message); }
    }
  };

  if (loading) return <div>Loading Bid Management...</div>;

  const totalTicketsSold = entries.reduce((sum, e) => sum + e.quantity, 0);
  const totalRevenueMade = totalTicketsSold * 10;
  const currentViewingBidData = activeBids.find(b => b.id === viewingBid);
  const campaignTargetRevenue = (currentViewingBidData?.target_tickets || 100) * 10;

  return (
    <div>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #eaecf0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0 }}>Create New Bid Campaign</h3>
          <div style={{ display: 'flex', gap: '0.5rem', background: '#f3f4f6', padding: '6px', borderRadius: '8px' }}>
            <button type="button" onClick={() => setEntryMode('inventory')} style={{ padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: entryMode === 'inventory' ? '#111' : 'transparent', color: entryMode === 'inventory' ? '#fff' : '#4b5563' }}>From Inventory</button>
            <button type="button" onClick={() => setEntryMode('manual')} style={{ padding: '0.6rem 1.2rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', background: entryMode === 'manual' ? '#111' : 'transparent', color: entryMode === 'manual' ? '#fff' : '#4b5563' }}>Custom Item</button>
          </div>
        </div>

        <form onSubmit={handleCreateBid} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {entryMode === 'inventory' ? (
            <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Select Phone</label>
              <select required value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="">-- Choose a Product --</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Custom Product Name</label>
                <input type="text" required placeholder="e.g. AirPods Pro" value={manualName} onChange={(e) => setManualName(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}/>
              </div>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Image</label>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <button type="button" onClick={openCloudinaryWidget} style={{ padding: '0.8rem', flex: 1, background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{manualImage ? 'Change Image' : '☁️ Upload'}</button>
                  {manualImage && <img src={manualImage} alt="Preview" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #eaecf0' }} />}
                </div>
              </div>
            </>
          )}

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Specs & Condition</label>
            <input 
              type="text" required placeholder="e.g. 128GB - UK Used" value={itemSpecs} onChange={(e) => setItemSpecs(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '150px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Target Revenue (GH₵)</label>
            <input 
              type="number" required min="10" step="10" value={targetRevenue} onChange={(e) => setTargetRevenue(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>
          
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>End Date & Time</label>
            <input type="datetime-local" required value={endTime} onChange={(e) => setEndTime(e.target.value)} style={{ width: '100%', padding: '0.8rem', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box' }}/>
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
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{bid.product_name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>{bid.item_specs || 'Standard Specs'}</div>
                    {bid.winner_data && <div style={{ fontSize: '0.75rem', color: '#059669', marginTop: '4px' }}>🏆 Winner Selected</div>}
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>{new Date(bid.end_time).toLocaleString()}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', background: bid.status === 'active' ? '#ecfdf5' : bid.status === 'spinning' ? '#eff6ff' : '#f3f4f6', color: bid.status === 'active' ? '#065f46' : bid.status === 'spinning' ? '#1d4ed8' : '#374151' }}>
                    {bid.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button onClick={() => handleViewEntries(bid.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer', background: '#f9fafb', color: '#111', border: '1px solid #d1d5db', borderRadius: '6px', fontWeight: 'bold' }}>View Entries</button>
                  {bid.status === 'active' && <button onClick={() => updateBidStatus(bid.id, 'completed')} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>End Now</button>}
                  <button onClick={() => handleDeleteBid(bid.id)} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', cursor: 'pointer', background: 'transparent', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '6px', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewingBid && (
        <div ref={entriesPanelRef} style={{ marginTop: '2rem', background: '#f9fafb', padding: '2rem', borderRadius: '12px', border: '1px solid #eaecf0', scrollMarginTop: '100px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h3>Campaign Analytics</h3>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Revenue Made</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#111' }}>GH₵{totalRevenueMade} <span style={{fontSize: '0.9rem', color: '#9ca3af', fontWeight: 'normal'}}>/ {campaignTargetRevenue}</span></div>
                </div>
                <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb', minWidth: '150px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 'bold' }}>Tickets Sold</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '900', color: '#d97706' }}>{totalTicketsSold} <span style={{fontSize: '0.9rem', color: '#9ca3af', fontWeight: 'normal'}}>/ {currentViewingBidData?.target_tickets || 100}</span></div>
                </div>
              </div>
            </div>
            <button onClick={() => setViewingBid(null)} style={{ background: 'transparent', color: 'black', border: '1px solid black', padding: '0.4rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Close Window</button>
          </div>

          {/* FIX: Simplified logic so the button NEVER comes back once a winner is picked */}
          {isSpinning ? (
             <div style={{ background: 'white', padding: '4rem 2rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #eaecf0', marginBottom: '2rem' }}>
                <div style={{ animation: 'spinAnimation 3s cubic-bezier(0.1, 0.7, 0.1, 1) infinite', width: '80px', height: '80px', border: '8px solid #f3f4f6', borderTop: '8px solid var(--brand-yellow)', borderRadius: '50%', margin: '0 auto' }}></div>
                <h2 style={{ marginTop: '2rem', color: '#111' }}>Spinning the Wheel...</h2>
                <p style={{ color: '#6b7280' }}>Broadcasting live to the public page right now!</p>
             </div>
          ) : winner ? (
            <div style={{ background: '#ecfdf5', padding: '2rem', borderRadius: '12px', textAlign: 'center', border: '2px solid #10b981', marginBottom: '2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
              <h2 style={{ color: '#065f46', margin: 0 }}>Winner Selected!</h2>
              <h1 style={{ fontSize: '2.5rem', margin: '1rem 0', color: '#064e3b' }}>{winner.customer_name}</h1>
              <p style={{ margin: '0.5rem 0' }}><strong>WhatsApp:</strong> {winner.customer_phone}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Email:</strong> {winner.customer_email}</p>
              <p style={{ margin: '0.5rem 0' }}><strong>Tickets Held:</strong> {winner.quantity}</p>
            </div>
          ) : (
            <button onClick={pickWinner} style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', marginBottom: '2rem', background: 'var(--brand-yellow)', color: 'black', fontWeight: '900', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              🎲 Pick Random Winner Now
            </button>
          )}
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {entries.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>No bids placed for this item yet.</p>
            ) : (
              entries.map(entry => (
                <div key={entry.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'white', marginBottom: '0.75rem', borderRadius: '8px', border: '1px solid #eaecf0' }}>
                  <div>
                    <strong style={{ fontSize: '1.1rem', color: '#111' }}>{entry.customer_name}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '0.4rem', display: 'flex', gap: '1rem' }}>
                      <span>📞 {entry.customer_phone}</span>
                      <span>✉️ {entry.customer_email}</span>
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
        </div>
      )}
    </div>
  );
}
