import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blog - iPhone Home Ghana";
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container py-section">
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="section-title">Latest News & Tips</h1>
        <p className="section-subtitle">Stay updated on the latest Apple trends and prices in Ghana.</p>
      </div>

      {loading ? <p style={{ textAlign: 'center' }}>Loading posts...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {posts.map(post => (
            <div key={post.id} style={{ border: '1px solid #eaecf0', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.3s ease', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '2rem', flexGrow: 1 }}>
                    <p style={{ fontSize: '0.85rem', color: '#667085', marginBottom: '0.5rem' }}>
                        {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {post.title}
                    </h3>
                    <p style={{ color: '#475467', lineHeight: '1.6', fontSize: '0.95rem' }}>
                        {post.excerpt}
                    </p>
                </div>
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #eaecf0', backgroundColor: '#f9fafb' }}>
                    <Link to={`/blog/${post.slug}`} style={{ color: 'black', fontWeight: '700', textDecoration: 'none' }}>
                        Read Article &rarr;
                    </Link>
                </div>
            </div>
          ))}
        </div>
      )}
      
      {!loading && posts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666' }}>No articles published yet.</p>
      )}
    </div>
  );
}