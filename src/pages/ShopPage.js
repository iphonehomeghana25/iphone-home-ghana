import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard'; 

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
      // 1. Fetch all products (Newest First)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // --- CUSTOM SORTING LOGIC START ---
        
        // A. Separate Phones vs Accessories
        // We assume anything NOT 'Accessories' is a phone (Brand New / UK Used)
        const phones = data.filter(p => p.category !== 'Accessories');
        const accessories = data.filter(p => p.category === 'Accessories');

        // B. Create the "VIP Section" (Top 12 Phones = ~3 Rows)
        const topPhones = phones.slice(0, 12);
        const remainingPhones = phones.slice(12);

        // C. Create the "Mixed Section" (Rest of phones + All Accessories)
        // We combine them and re-sort by date so they interleave naturally
        const mixedBatch = [...remainingPhones, ...accessories].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
        );

        // D. Combine: VIP Phones on top, Mixed items below
        const finalSort = [...topPhones, ...mixedBatch];
        
        setProducts(finalSort);
        // --- CUSTOM SORTING LOGIC END ---
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching shop products:', error);
    } finally {
      setLoading(false);
    }
  }
  
  const categories = ['All', 'Brand New', 'UK Used', 'Accessories'];

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
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
              background: categoryFilter === cat ? 'black' : '#f3f4f6', 
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
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}