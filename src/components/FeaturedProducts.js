import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';
import { Link, useNavigate } from 'react-router-dom';

export default function FeaturedProducts({ 
    title = "Just Arrived", 
    subtitle = "Fresh stock from the UK and Brand New boxes.",
    filterMode = "phones", // 'phones' or 'accessories'
    bgColor = "white"
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, [filterMode]); // Re-fetch if the mode changes

  async function fetchProducts() {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .limit(4) // Show top 4
        .order('created_at', { ascending: false });

      // --- FILTER LOGIC ---
      if (filterMode === 'accessories') {
          // Only show items where category IS 'Accessories'
          query = query.eq('category', 'Accessories');
      } else {
          // 'phones' mode: Show everything EXCEPT Accessories
          query = query.neq('category', 'Accessories');
      }

      const { data, error } = await query;

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Handle "View All" Click - Navigate to shop with simple filter intention
  // (Note: To make this filter automatically on the shop page would require updates to ShopPage, 
  // but for now it just links to the shop which is standard behavior)
  const handleViewAll = () => {
      navigate('/shop');
  };

  // Hide section if no products found (don't show empty "Accessories" section)
  if (!loading && products.length === 0) return null;

  return (
    <section className="container" style={{ paddingBottom: '5rem', paddingTop: '5rem', backgroundColor: bgColor }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="section-title">{title}</h2>
        <p className="section-subtitle">{subtitle}</p>
      </div>

      {/* Error Message */}
      {errorMsg && <div style={{color: 'red', textAlign:'center'}}>{errorMsg}</div>}

      {/* Product Grid */}
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading...</p>
      ) : (
        <div className="product-grid-layout">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* View All Link */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <button 
            onClick={handleViewAll}
            style={{ 
                backgroundColor: 'transparent',
                color: 'black',
                border: '1px solid black',
                fontWeight: '700',
                padding: '0.8rem 2rem'
            }}
        >
          View All {filterMode === 'accessories' ? 'Accessories' : 'Stock'} &rarr;
        </button>
      </div>
    </section>
  );
}