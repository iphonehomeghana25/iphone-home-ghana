import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageBNPL() {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // --- NEW: Editing State ---
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    customer_name: '', phone_number: '', ghana_card_number: '', 
    item_taken: '', total_debt: '', amount_paid: '0', is_fully_paid: false,
    start_date: '', end_date: '', customer_image_url: ''
  });

  useEffect(() => {
    fetchDebtors();
  }, []);

  async function fetchDebtors() {
    try {
      const { data, error } = await supabase
        .from('bnpl_records')
        .select('*')
        .order('id', { ascending: false }); 

      if (error) throw error;
      setDebtors(data || []);
    } catch (error) { 
        console.error('Error fetching debtors:', error.message); 
    } finally { 
        setLoading(false); 
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('customer-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage.from('customer-images').getPublicUrl(filePath);
      setFormData(prev => ({ ...prev, customer_image_url: data.publicUrl }));
      alert('Photo uploaded successfully!');
    } catch (error) { 
        alert('Error uploading photo: ' + error.message); 
    } finally { 
        setUploading(false); 
    }
  };

  // --- NEW: Edit Handler ---
  const handleEdit = (debtor) => {
      setEditingId(debtor.id);
      setFormData({
          customer_name: debtor.customer_name,
          phone_number: debtor.phone_number,
          ghana_card_number: debtor.ghana_card_number,
          item_taken: debtor.item_taken,
          total_debt: debtor.total_debt,
          amount_paid: debtor.amount_paid,
          is_fully_paid: debtor.is_fully_paid,
          start_date: debtor.start_date || '',
          end_date: debtor.end_date || '', // Handles null end dates
          customer_image_url: debtor.customer_image_url || ''
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
      setEditingId(null);
      setFormData({ 
          customer_name: '', phone_number: '', ghana_card_number: '', 
          item_taken: '', total_debt: '', amount_paid: '0', is_fully_paid: false,
          start_date: '', end_date: '', customer_image_url: ''
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const initialRemaining = parseFloat(formData.total_debt) - parseFloat(formData.amount_paid);
      
      // Clean up empty date strings to NULL so database doesn't complain
      const payload = {
        ...formData,
        total_debt: parseFloat(formData.total_debt),
        amount_paid: parseFloat(formData.amount_paid),
        is_fully_paid: initialRemaining <= 0,
        end_date: formData.end_date === '' ? null : formData.end_date 
      };

      if (editingId) {
          // UPDATE EXISTING
          const { error } = await supabase
            .from('bnpl_records')
            .update(payload)
            .eq('id', editingId);
          if (error) throw error;
          alert('Record Updated!');
      } else {
          // CREATE NEW
          const { error } = await supabase.from('bnpl_records').insert([payload]);
          if (error) throw error;
          alert('BNPL Customer Registered!');
      }
      
      handleCancelEdit(); // Reset form
      fetchDebtors();
    } catch (error) { alert(error.message); }
  };

  const handleDelete = async (id) => {
      if (window.confirm('Delete this debtor record? This action cannot be undone.')) {
          try {
              const { error } = await supabase.from('bnpl_records').delete().eq('id', id);
              if (error) throw error;
              setDebtors(debtors.filter(d => d.id !== id));
          } catch (error) {
              alert('Error deleting record: ' + error.message);
          }
      }
  };

  const addPayment = async (debtor) => {
    const newPayment = prompt(`Enter amount paid for ${debtor.item_taken}:`);
    if (newPayment && !isNaN(newPayment) && parseFloat(newPayment) > 0) {
        const paymentAmount = parseFloat(newPayment);
        const totalPaid = debtor.amount_paid + paymentAmount;
        const remaining = debtor.total_debt - totalPaid;
        const isPaidOff = remaining <= 0;

        try {
            const { error } = await supabase.from('bnpl_records')
                .update({ amount_paid: totalPaid, is_fully_paid: isPaidOff })
                .eq('id', debtor.id);
            
            if (error) throw error;
            alert(`Payment of GH₵${paymentAmount} recorded! Remaining: GH₵${Math.max(0, remaining).toFixed(2)}`);
            fetchDebtors();

        } catch (error) {
            alert('Error recording payment: ' + error.message);
        }
    }
  };

  const filteredDebtors = debtors.filter(d => 
    d.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.phone_number.includes(searchTerm) ||
    d.ghana_card_number.includes(searchTerm)
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>BNPL Management</h1>

      {/* Add / Edit Form */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h3 style={{ fontWeight: '700', margin: 0 }}>{editingId ? 'Edit Customer Details' : 'Register New BNPL Customer'}</h3>
             {editingId && <button onClick={handleCancelEdit} style={{ padding: '0.5rem', fontSize: '0.8rem', backgroundColor: '#f3f4f6', color: 'black', border:'none', borderRadius:'4px', cursor:'pointer' }}>Cancel Edit</button>}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <input required name="customer_name" placeholder="Customer Name" value={formData.customer_name} onChange={handleChange} style={inputStyle} />
            <input required name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} style={inputStyle} />
            <input required name="ghana_card_number" placeholder="Ghana Card ID" value={formData.ghana_card_number} onChange={handleChange} style={inputStyle} />
            
            <input required name="item_taken" placeholder="Item Taken (e.g. iPhone 14 Pro)" value={formData.item_taken} onChange={handleChange} style={inputStyle} />
            <input required type="number" name="total_debt" placeholder="Total Debt (GHS)" value={formData.total_debt} onChange={handleChange} style={inputStyle} />
            <input required type="number" name="amount_paid" placeholder="Initial Deposit (GHS)" value={formData.amount_paid} onChange={handleChange} style={inputStyle} />
            
            <div>
                <label style={labelStyle}>Start Date</label>
                <input required type="date" name="start_date" value={formData.start_date} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>End Date (Optional)</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
                <label style={labelStyle}>Customer Photo</label>
                <input type="file" accept="image/*" capture="user" onChange={handleImageUpload} style={inputStyle} />
                {uploading && <span style={{fontSize:'0.8rem', color:'blue'}}>Uploading...</span>}
                {formData.customer_image_url && <span style={{fontSize:'0.8rem', color:'green'}}>Photo Ready ✅</span>}
            </div>
            
            <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: editingId ? '#d97706' : 'black', color: 'white', padding: '1rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', border: 'none' }}>
                {editingId ? 'Update Record' : 'Save New BNPL Record'}
            </button>
        </form>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <input 
            type="text" placeholder="Search Name, Phone or Ghana Card ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #d0d5dd', width: '300px' }}
          />
      </div>

      {/* Debtors Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        {loading ? <p style={{padding: '2rem'}}>Loading debtors...</p> : (
            <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                    <tr>
                        <th style={thStyle}>Customer</th>
                        <th style={thStyle}>Item & Dates</th>
                        <th style={thStyle}>Total Debt</th>
                        <th style={thStyle}>Paid So Far</th>
                        <th style={thStyle}>Remaining</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDebtors.map(d => {
                        const remaining = d.total_debt - d.amount_paid;
                        const isPaidOff = remaining <= 0;
                        return (
                            <tr key={d.id} style={{ borderBottom: '1px solid #eaecf0', backgroundColor: isPaidOff ? '#f0fdf4' : 'white' }}>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {d.customer_image_url ? (
                                            <img src={d.customer_image_url} alt="Cust" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eee' }}></div>
                                        )}
                                        <div>
                                            <div style={{fontWeight: '600'}}>{d.customer_name}</div>
                                            <div style={{fontSize: '0.8rem', color: '#666'}}>{d.phone_number}</div>
                                            <div style={{fontSize: '0.7rem', color: '#999'}}>{d.ghana_card_number}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={tdStyle}>
                                    <div>{d.item_taken}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px' }}>
                                        {d.start_date ? new Date(d.start_date).toLocaleDateString() : 'No Start'} 
                                        {' → '} 
                                        {d.end_date ? new Date(d.end_date).toLocaleDateString() : 'Ongoing'}
                                    </div>
                                </td>
                                <td style={tdStyle}>GH₵{d.total_debt.toLocaleString()}</td>
                                <td style={{...tdStyle, color: '#15803d', fontWeight: '600'}}>GH₵{d.amount_paid.toLocaleString()}</td>
                                <td style={{...tdStyle, color: isPaidOff ? '#15803d' : '#b45309', fontWeight: '700'}}>
                                    {isPaidOff ? 'PAID OFF' : `GH₵${remaining.toLocaleString()}`}
                                </td>
                                <td style={tdStyle}>
                                    <span style={{ 
                                        padding: '4px 10px', 
                                        borderRadius: '100px', 
                                        fontSize: '0.75rem',
                                        fontWeight: '700',
                                        backgroundColor: isPaidOff ? '#dcfce7' : '#fffbeb',
                                        color: isPaidOff ? '#027a48' : '#b54708'
                                    }}>
                                        {isPaidOff ? 'Complete' : 'Active Debt'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {!isPaidOff && (
                                            <button 
                                                onClick={() => addPayment(d)}
                                                style={{ padding: '0.5rem 0.8rem', backgroundColor: 'var(--brand-yellow)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: 'black', fontWeight: '600', fontSize: '0.8rem' }}
                                            >
                                                Pay
                                            </button>
                                        )}
                                        {/* Edit Button */}
                                        <button 
                                            onClick={() => handleEdit(d)}
                                            style={{ padding: '0.5rem 0.8rem', backgroundColor: '#f3f4f6', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', color: 'black', fontWeight: '600', fontSize: '0.8rem' }}
                                        >
                                            Edit
                                        </button>
                                        {/* Delete Button */}
                                        <button 
                                            onClick={() => handleDelete(d.id)}
                                            style={{ padding: '0.5rem 0.8rem', backgroundColor: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', fontWeight: '600', fontSize: '0.8rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.8rem', color: '#666' };
const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid #d0d5dd', outline: 'none', width: '100%', boxSizing: 'border-box' };
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#667085', fontWeight: '600', textTransform: 'uppercase' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };