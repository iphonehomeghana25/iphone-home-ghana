import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageBNPL() {
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State for New Debtor
  const [formData, setFormData] = useState({
    customer_name: '', phone_number: '', ghana_card_number: '', 
    item_taken: '', total_debt: '', amount_paid: '0', is_fully_paid: false
  });

  useEffect(() => {
    fetchDebtors();
  }, []);

  async function fetchDebtors() {
    try {
      // FIXED: Changed sorting to 'id' to ensure it always works
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const initialRemaining = parseFloat(formData.total_debt) - parseFloat(formData.amount_paid);
      
      const record = {
        ...formData,
        total_debt: parseFloat(formData.total_debt),
        amount_paid: parseFloat(formData.amount_paid),
        is_fully_paid: initialRemaining <= 0
      };

      const { error } = await supabase.from('bnpl_records').insert([record]);
      if (error) throw error;
      
      alert('BNPL Customer Registered!');
      setFormData({ customer_name: '', phone_number: '', ghana_card_number: '', item_taken: '', total_debt: '', amount_paid: '0', is_fully_paid: false });
      fetchDebtors();
    } catch (error) { alert(error.message); }
  };

  // Delete Function
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

  // Filter
  const filteredDebtors = debtors.filter(d => 
    d.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.phone_number.includes(searchTerm) ||
    d.ghana_card_number.includes(searchTerm)
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>BNPL Management</h1>

      {/* Add New Debtor Form */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Register New BNPL Customer</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
            <input required name="customer_name" placeholder="Customer Name" value={formData.customer_name} onChange={handleChange} style={inputStyle} />
            <input required name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} style={inputStyle} />
            <input required name="ghana_card_number" placeholder="Ghana Card ID" value={formData.ghana_card_number} onChange={handleChange} style={inputStyle} />
            
            <input required name="item_taken" placeholder="Item Taken (e.g. iPhone 14 Pro)" value={formData.item_taken} onChange={handleChange} style={inputStyle} />
            <input required type="number" name="total_debt" placeholder="Total Debt (GHS)" value={formData.total_debt} onChange={handleChange} style={inputStyle} />
            <input required type="number" name="amount_paid" placeholder="Initial Deposit (GHS)" value={formData.amount_paid} onChange={handleChange} style={inputStyle} />
            
            <button type="submit" style={{ gridColumn: 'span 3', backgroundColor: 'black', color: 'white', padding: '1rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', border: 'none' }}>Save New BNPL Record</button>
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
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                    <tr>
                        <th style={thStyle}>Customer (ID)</th>
                        <th style={thStyle}>Item Taken</th>
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
                                    <div style={{fontWeight: '600'}}>{d.customer_name}</div>
                                    <div style={{fontSize: '0.8rem', color: '#666'}}>{d.phone_number}</div>
                                    <div style={{fontSize: '0.7rem', color: '#999'}}>{d.ghana_card_number}</div>
                                </td>
                                <td style={tdStyle}>{d.item_taken}</td>
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
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '0.8rem', borderRadius: '8px', border: '1px solid #d0d5dd', outline: 'none', width: '100%', boxSizing: 'border-box' };
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.8rem', color: '#667085', fontWeight: '600', textTransform: 'uppercase' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };