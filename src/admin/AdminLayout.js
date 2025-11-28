import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  
  // --- IPAD FIX: Changed limit from 1024 to 768 ---
  // This allows iPads (which are usually 768px-1024px) to access the dashboard
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); 

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- FIXED: Moved checkUser inside useEffect to remove dependency warning ---
  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/staff-login');
        }
      } catch (error) {
        console.error("Auth check failed", error);
        navigate('/staff-login');
      } finally {
        setLoading(false);
      }
    }

    checkUser();
  }, [navigate]); // navigate is a stable dependency

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/staff-login');
  };

  // --- MOBILE BLOCKER (Only blocks actual phones now) ---
  if (isMobile) {
    return (
        <div style={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '2rem', 
            textAlign: 'center',
            backgroundColor: '#f9fafb'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📱</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Mobile Access Restricted</h2>
            <p style={{ color: '#666', maxWidth: '300px' }}>
                Please use a Tablet (iPad), Laptop, or Desktop to manage the store.
            </p>
            <Link to="/" style={{ marginTop: '2rem', textDecoration: 'underline', fontWeight: '600' }}>Back to Shop</Link>
        </div>
    );
  }

  let pageTitle = 'Dashboard';
  if (location.pathname.includes('products')) pageTitle = 'Product Management';
  if (location.pathname.includes('orders')) pageTitle = 'Order Management';
  if (location.pathname.includes('bnpl')) pageTitle = 'BNPL Debtors';
  if (location.pathname.includes('sales')) pageTitle = 'Sales Analytics';
  if (location.pathname.includes('blog')) pageTitle = 'Blog Management';
  if (location.pathname.includes('reviews')) pageTitle = 'Customer Reviews'; // <--- NEW TITLE

  if (loading) return <div style={{ padding: '2rem' }}>Checking access...</div>;

  const sidebarWidth = collapsed ? '80px' : '260px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <aside style={{ 
          width: sidebarWidth, backgroundColor: 'white', borderRight: '1px solid #eaecf0', 
          padding: '1.5rem', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
          transition: 'width 0.3s ease', overflowX: 'hidden', display: 'flex', flexDirection: 'column', boxSizing: 'border-box'
      }}>
        <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', height: '40px' }}>
             {!collapsed && (
                 <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Admin Panel
                 </span>
             )}
             <button 
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085', minWidth: 'auto'
                }}
                title={collapsed ? "Expand" : "Collapse"}
             >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
             </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <AdminLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'} label="Overview" icon="📊" collapsed={collapsed} />
            <AdminLink to="/admin/products" active={location.pathname === '/admin/products'} label="Products" icon="📱" collapsed={collapsed} />
            <AdminLink to="/admin/orders" active={location.pathname === '/admin/orders'} label="Orders" icon="📦" collapsed={collapsed} />
            <AdminLink to="/admin/sales" active={location.pathname === '/admin/sales'} label="Sales" icon="📈" collapsed={collapsed} />
            <AdminLink to="/admin/blog" active={location.pathname === '/admin/blog'} label="Blog" icon="📝" collapsed={collapsed} />
            <AdminLink to="/admin/reviews" active={location.pathname === '/admin/reviews'} label="Reviews" icon="⭐" collapsed={collapsed} /> {/* <--- NEW LINK */}
            <AdminLink to="/admin/bnpl" active={location.pathname === '/admin/bnpl'} label="BNPL Debtors" icon="📒" collapsed={collapsed} />
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #eaecf0' }}>
            <button 
                onClick={handleLogout} 
                style={{ 
                    width: '100%', backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fee2e2',
                    padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'center', gap: '0.5rem', fontWeight: '600', minWidth: 'auto'
                }}
            >
                <span>🚪</span>
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
      </aside>

      <main style={{ 
          flexGrow: 1, marginLeft: sidebarWidth, transition: 'margin-left 0.3s ease', 
          width: `calc(100% - ${sidebarWidth})`, boxSizing: 'border-box'
      }}>
        <AdminHeader title={pageTitle} />
        <div style={{ padding: '2.5rem' }}>
            <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminLink({ to, label, icon, active, collapsed }) {
    return (
        <Link to={to} style={{
            display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '8px', textDecoration: 'none',
            color: active ? 'black' : '#667085', backgroundColor: active ? 'var(--brand-yellow)' : 'transparent',
            fontWeight: active ? '700' : '500', transition: 'all 0.2s', whiteSpace: 'nowrap', overflow: 'hidden'
        }} title={label}>
            <span style={{ fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}>{icon}</span>
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}

const ChevronLeft = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRight = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);