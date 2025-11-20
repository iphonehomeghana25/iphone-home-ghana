import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/staff-login');
  };

  if (loading) return <div style={{ padding: '2rem' }}>Checking access...</div>;

  // Define the width based on state
  const sidebarWidth = collapsed ? '80px' : '260px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      
      {/* --- SIDEBAR (Fixed Position) --- */}
      <aside style={{ 
          width: sidebarWidth, 
          backgroundColor: 'white', 
          borderRight: '1px solid #eaecf0', 
          padding: '1.5rem', 
          position: 'fixed', /* Sticks to the left */
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'width 0.3s ease', /* Smooth width change */
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
      }}>
        
        {/* Header & Toggle */}
        <div style={{ 
            marginBottom: '3rem', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'space-between',
            height: '40px'
        }}>
             {!collapsed && (
                 <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    Admin Panel
                 </span>
             )}
             
             <button 
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: '5px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#667085',
                    minWidth: 'auto'
                }}
                title={collapsed ? "Expand" : "Collapse"}
             >
                {collapsed ? <ChevronRight /> : <ChevronLeft />}
             </button>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
            <AdminLink to="/admin/dashboard" active={location.pathname === '/admin/dashboard'} label="Overview" icon="📊" collapsed={collapsed} />
            <AdminLink to="/admin/products" active={location.pathname === '/admin/products'} label="Products" icon="📱" collapsed={collapsed} />
            <AdminLink to="/admin/orders" active={location.pathname === '/admin/orders'} label="Orders" icon="📦" collapsed={collapsed} />
            <AdminLink to="/admin/bnpl" active={location.pathname === '/admin/bnpl'} label="BNPL Debtors" icon="📒" collapsed={collapsed} />
        </nav>

        {/* Logout Button */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #eaecf0' }}>
            <button 
                onClick={handleLogout} 
                style={{ 
                    width: '100%', 
                    backgroundColor: '#fef2f2', 
                    color: '#dc2626', 
                    border: '1px solid #fee2e2',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: collapsed ? 'center' : 'center',
                    gap: '0.5rem',
                    fontWeight: '600',
                    minWidth: 'auto'
                }}
            >
                <span>🚪</span>
                {!collapsed && <span>Logout</span>}
            </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA (Dynamic Margin) --- */}
      <main style={{ 
          flexGrow: 1, 
          marginLeft: sidebarWidth, /* This pushes content away from the sidebar */
          padding: '2.5rem', 
          transition: 'margin-left 0.3s ease', /* Smooths the push */
          width: `calc(100% - ${sidebarWidth})`, /* Ensures it fills remaining space */
          boxSizing: 'border-box'
      }}>
        <Outlet />
      </main>
    </div>
  );
}

// --- Helper Components ---

function AdminLink({ to, label, icon, active, collapsed }) {
    return (
        <Link to={to} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            textDecoration: 'none',
            color: active ? 'black' : '#667085',
            backgroundColor: active ? 'var(--brand-yellow)' : 'transparent',
            fontWeight: active ? '700' : '500',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        }} title={label}>
            <span style={{ fontSize: '1.2rem', minWidth: '24px', textAlign: 'center' }}>{icon}</span>
            {!collapsed && <span>{label}</span>}
        </Link>
    );
}

// Simple Icons
const ChevronLeft = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
);
const ChevronRight = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);