import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
      
      // Update Tab Title for SEO
      if (data) document.title = `${data.title} - iPhone Home Ghana`;

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="container py-section" style={{textAlign:'center'}}>Loading article...</div>;
  if (!post) return <div className="container py-section" style={{textAlign:'center'}}>Article not found.</div>;

  return (
    <div className="container py-section" style={{ maxWidth: '800px' }}>
      <Link to="/blog" style={{ display: 'inline-block', marginBottom: '2rem', color: '#666', textDecoration: 'none', fontWeight: '600' }}>
        &larr; Back to Blog
      </Link>
      
      <article>
        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <p style={{ color: '#d97706', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', fontSize: '0.9rem' }}>Blog</p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h1>
            <p style={{ color: '#667085' }}>Published on {new Date(post.created_at).toLocaleDateString()}</p>
        </header>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#1f2937', whiteSpace: 'pre-wrap' }}>
            {/* Simple text rendering. whiteSpace: pre-wrap preserves paragraphs. */}
            {post.content}
        </div>
      </article>

      <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #eaecf0', textAlign: 'center' }}>
        <h3>Ready to upgrade your phone?</h3>
        <Link to="/shop">
            <button style={{ marginTop: '1rem' }}>Shop Now</button>
        </Link>
      </div>
    </div>
  );
}