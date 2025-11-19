import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import ProductCard from './ProductCard';
import { Link } from 'react-router-dom';

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Fetch error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 container">
      {/* 1. Centered Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="section-title">Just Arrived</h2>
        <p className="section-subtitle">Fresh stock from the UK and Brand New boxes.</p>
      </div>

      {/* Error Message */}
      {errorMsg && <div style={{color: 'red', textAlign:'center'}}>{errorMsg}</div>}

      {/* Product Grid */}
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading stock...</p>
      ) : (
        <div className="product-grid-layout">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* 2. Centered 'View All' Link at Bottom */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link to="/shop" style={{ 
            fontWeight: '700', 
            color: 'black', 
            textDecoration: 'underline', 
            fontSize: '1.1rem' 
        }}>
          View All New Stock &rarr;
        </Link>
      </div>
    </section>
  );
}
