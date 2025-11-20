import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State - Includes NEW fields
  const [formData, setFormData] = useState({
    name: '', price: '', category: 'Brand New', condition: 'New', description: '', image_url: '',
    storage: '', color: '', battery_health: '', stock_status: 'In Stock'
  });

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleImageUpload = async (e) => {
    try {
      setUploading(true);
      const file = e.target.files[0];
      if (!file) return;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
      setFormData({ ...formData, image_url: data.publicUrl });
      alert('Image uploaded!');
    } catch (error) { alert('Error: ' + error.message); } finally { setUploading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) return alert('Please upload an image first!');
    try {
      const { error } = await supabase.from('products').insert([formData]);
      if (error) throw error;
      alert('Product Added!');
      // Reset Form
      setFormData({ 
        name: '', price: '', category: 'Brand New', condition: 'New', description: '', image_url: '',
        storage: '', color: '', battery_health: '', stock_status: 'In Stock'
      });
      fetchProducts();
    } catch (error) { alert(error.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Manage Products</h1>

      {/* --- ADD PRODUCT FORM --- */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0', marginBottom: '3rem' }}>
        <h3 style={{ marginBottom: '1.5rem', fontWeight: '700' }}>Add New Product</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Product Name</label>
                <input name="name" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g. iPhone 15 Pro Max" required />
            </div>

            <div>
                <label style={labelStyle}>Price (GHS)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} style={inputStyle} placeholder="16500" required />
            </div>

            <div>
                <label style={labelStyle}>Storage</label>
                <select name="storage" value={formData.storage} onChange={handleChange} style={inputStyle}>
                    <option value="">Select Storage</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                </select>
            </div>

            <div>
                <label style={labelStyle}>Color</label>
                <input name="color" value={formData.color} onChange={handleChange} style={inputStyle} placeholder="e.g. Natural Titanium" />
            </div>

            <div>
                <label style={labelStyle}>Battery Health</label>
                <input name="battery_health" value={formData.battery_health} onChange={handleChange} style={inputStyle} placeholder="e.g. 100% or 95%" />
            </div>

            <div>
                <label style={labelStyle}>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                    <option>Brand New</option><option>UK Used</option><option>Accessories</option>
                </select>
            </div>

            <div>
                <label style={labelStyle}>Stock Status</label>
                <select name="stock_status" value={formData.stock_status} onChange={handleChange} style={inputStyle}>
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                </select>
            </div>

            <div>
                <label style={labelStyle}>Product Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} style={inputStyle} />
                {uploading && <span style={{fontSize: '0.8rem', color: 'blue'}}>Uploading...</span>}
                {formData.image_url && <img src={formData.image_url} alt="Preview" style={{height: '50px', marginTop: '10px', borderRadius: '4px'}} />}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} style={{...inputStyle, height: '80px'}} placeholder="Additional details..." />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
                <button type="submit" style={{ width: '100%', backgroundColor: 'black', color: 'white', padding: '1rem' }}>
                    {uploading ? 'Wait...' : 'Add Product'}
                </button>
            </div>
        </form>
      </div>

      {/* --- PRODUCT LIST WITH SEARCH --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontWeight: '700', margin: 0 }}>Inventory ({products.length})</h3>
        <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #d0d5dd', width: '250px' }}
        />
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        {loading ? <p style={{padding: '2rem'}}>Loading...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                    <tr>
                        <th style={thStyle}>Image</th>
                        <th style={thStyle}>Name</th>
                        <th style={thStyle}>Details (Storage/Color/BH)</th>
                        <th style={thStyle}>Price</th>
                        <th style={thStyle}>Status</th>
                        <th style={thStyle}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map(p => (
                        <tr key={p.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                            <td style={tdStyle}><img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} /></td>
                            <td style={tdStyle}>
                                <div style={{fontWeight:'600'}}>{p.name}</div>
                                <div style={{fontSize:'0.8rem', color:'#666'}}>{p.category}</div>
                            </td>
                            <td style={tdStyle}>
                                <div style={{fontSize:'0.85rem', fontWeight: '500'}}>{p.storage} {p.color && `• ${p.color}`}</div>
                                {p.battery_health && <div style={{fontSize:'0.8rem', color:'#16a34a', fontWeight: 'bold'}}>BH: {p.battery_health}</div>}
                            </td>
                            <td style={tdStyle}>GH₵{p.price}</td>
                            <td style={tdStyle}>
                                <span style={{ 
                                    padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                    backgroundColor: p.stock_status === 'In Stock' ? '#dcfce7' : '#fee2e2',
                                    color: p.stock_status === 'In Stock' ? '#166534' : '#991b1b'
                                }}>
                                    {p.stock_status}
                                </span>
                            </td>
                            <td style={tdStyle}>
                                <button onClick={() => handleDelete(p.id)} style={{ padding: '0.5rem 1rem', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Delete</button>
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

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d0d5dd', outline: 'none', boxSizing: 'border-box' };
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };