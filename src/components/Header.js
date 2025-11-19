import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css'; 

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Cart count placeholder (we will connect to real logic later)
  const cartCount = 0; 

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            {/* Simple SVG Logo Icon */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--brand-yellow)', fill: 'black' }}>
                <path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><path d="M12 16V9"/><path d="M12 9c-3.33 0-5.45-1.54-6-4h12c-.55 2.46-2.67 4-6 4z"/>
            </svg>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'black' }}>iPhone Home Ghana</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/bnpl" className="nav-link" style={{ color: '#d97706', fontWeight: 'bold' }}>Pay Later</Link>
          <Link to="/track" className="nav-link">Track Order</Link>
        </nav>

        {/* Icons (Cart & Menu) */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          
          {/* Cart Icon */}
          <div onClick={() => navigate('/cart')} style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && (
                <span style={{ 
                    position: 'absolute', top: '-8px', right: '-8px', 
                    backgroundColor: 'var(--brand-yellow)', color: 'black', 
                    fontSize: '0.75rem', fontWeight: 'bold', 
                    borderRadius: '50%', width: '20px', height: '20px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                    {cartCount}
                </span>
            )}
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <button className="mobile-only" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ background: 'none', border: 'none', padding: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{ position: 'absolute', top: '80px', left: 0, width: '100%', backgroundColor: 'white', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', zIndex: 40 }}>
            <Link to="/" onClick={closeMenu} className="mobile-menu-link">Home</Link>
            <Link to="/shop" onClick={closeMenu} className="mobile-menu-link">Shop iPhones</Link>
            <Link to="/bnpl" onClick={closeMenu} className="mobile-menu-link" style={{ color: '#d97706' }}>Buy Now Pay Later</Link>
            <Link to="/track" onClick={closeMenu} className="mobile-menu-link">Track Order</Link>
            <Link to="/staff-login" onClick={closeMenu} className="mobile-menu-link">Staff Login</Link>
        </div>
      )}
    </header>
  );
}
