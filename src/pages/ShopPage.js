import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard'; // Ensure this path is correct

export default function ShopPage() {
  const { addToCart } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      // Fetch all products
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false }); // Newest first

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching shop products:', error);
    } finally {
      setLoading(false);
    }
  }
  
  // These must match EXACTLY what you select in ManageProducts.js
  const categories = ['All', 'Brand New', 'UK Used', 'Accessories'];

  const filteredProducts = products.filter(product => {
    // 1. Check Category
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
    
    // 2. Check Search (Name or Description)
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchLower) || 
                          (product.description && product.description.toLowerCase().includes(searchLower));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container py-section">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="section-title">Shop All Devices</h1>
        <p className="section-subtitle">Brand new sealed and neat UK used iPhones and accessories.</p>
        
        {/* Search Bar */}
        <input 
            type="text" 
            placeholder="Search iPhone model or accessory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
                padding: '0.8rem', 
                borderRadius: '8px', 
                border: '1px solid #d0d5dd', 
                width: '100%', 
                maxWidth: '500px',
                marginTop: '1rem',
                textAlign: 'center',
                fontSize: '1rem'
            }}
        />
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3rem' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '100px',
              fontSize: '0.9rem',
              background: categoryFilter === cat ? 'black' : '#f3f4f6', // Active: Black, Inactive: Light Gray
              color: categoryFilter === cat ? 'white' : 'black',
              border: '1px solid transparent',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</p>
      ) : filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: '#f9fafb', borderRadius: '12px' }}>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter.</p>
            <button onClick={() => {setCategoryFilter('All'); setSearchTerm('');}} style={{marginTop: '1rem'}}>Clear Filters</button>
        </div>
      ) : (
        <div className="product-grid-layout">
          {filteredProducts.map((product) => (
            // ProductCard handles the 'Add to Cart' click internally via Context
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}