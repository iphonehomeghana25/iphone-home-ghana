import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ManageBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (post) => {
    setEditingId(post.id);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', excerpt: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create a simple slug (e.g., "iPhone 13 Price" -> "iphone-13-price")
    const slug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
      .replace(/(^-|-$)+/g, '');   // Remove leading/trailing hyphens

    const postData = { ...formData, slug };

    try {
      if (editingId) {
        const { error } = await supabase.from('blog_posts').update(postData).eq('id', editingId);
        if (error) throw error;
        alert('Post updated!');
      } else {
        const { error } = await supabase.from('blog_posts').insert([postData]);
        if (error) throw error;
        alert('Post published!');
      }
      handleCancel();
      fetchPosts();
    } catch (error) {
      alert('Error saving post: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this post?')) {
      const { error } = await supabase.from('blog_posts').delete().eq('id', id);
      if (!error) fetchPosts();
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '2rem' }}>Blog Management</h1>

      {/* Write Area */}
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #eaecf0', marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
             <h3 style={{ fontWeight: '700', margin: 0 }}>{editingId ? 'Edit Post' : 'Write New Post'}</h3>
             {editingId && <button onClick={handleCancel} style={{ padding: '0.5rem', fontSize: '0.8rem', backgroundColor: '#f3f4f6', color: 'black' }}>Cancel</button>}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
            <div>
                <label style={labelStyle}>Title</label>
                <input name="title" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. 5 Reasons to buy an iPhone 14" required />
            </div>
            <div>
                <label style={labelStyle}>Short Summary (Excerpt)</label>
                <input name="excerpt" value={formData.excerpt} onChange={handleChange} style={inputStyle} placeholder="A short preview text..." required />
            </div>
            <div>
                <label style={labelStyle}>Content</label>
                <textarea 
                    name="content" 
                    value={formData.content} 
                    onChange={handleChange} 
                    style={{ ...inputStyle, height: '300px', fontFamily: 'inherit', lineHeight: '1.6' }} 
                    placeholder="Write your article here..." 
                    required 
                />
            </div>
            <button type="submit" style={{ backgroundColor: editingId ? '#d97706' : 'black', color: 'white', padding: '1rem', width: '100%' }}>
                {editingId ? 'Update Post' : 'Publish Post'}
            </button>
        </form>
      </div>

      {/* Post List */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #eaecf0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #eaecf0' }}>
                <tr>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Title</th>
                    <th style={thStyle}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {posts.map(post => (
                    <tr key={post.id} style={{ borderBottom: '1px solid #eaecf0' }}>
                        <td style={tdStyle}>{new Date(post.created_at).toLocaleDateString()}</td>
                        <td style={tdStyle}>
                            <div style={{ fontWeight: '600' }}>{post.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#666' }}>/{post.slug}</div>
                        </td>
                        <td style={tdStyle}>
                            <button onClick={() => handleEdit(post)} style={{ marginRight: '10px', padding: '0.4rem 0.8rem', backgroundColor: '#f3f4f6', color: 'black', border: '1px solid #ccc', borderRadius: '4px' }}>Edit</button>
                            <button onClick={() => handleDelete(post.id)} style={{ padding: '0.4rem 0.8rem', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px' }}>Delete</button>
                        </td>
                    </tr>
                ))}
                {posts.length === 0 && <tr><td colSpan="3" style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>No blog posts yet.</td></tr>}
            </tbody>
        </table>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #d0d5dd', outline: 'none', boxSizing: 'border-box' };
const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };