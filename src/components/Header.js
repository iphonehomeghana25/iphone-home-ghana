import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext'; 
import logo from '../assets/logo1.png'; // <--- IMPORTED LOGO HERE
import '../App.css'; 

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const { cartCount } = useShop(); 

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
      <div className="container" style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Logo */}
        <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            {/* Updated to use the imported logo variable */}
            <img src={logo} alt="iPhone Home Ghana Logo" style={{ height: '40px', width: 'auto' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'black' }}>iPhone Home Ghana</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/shop" className="nav-link">Shop</Link>
          <Link to="/bnpl" className="nav-link" style={{ color: '#d97706', fontWeight: 'bold' }}>Pay Later</Link>
          <Link to="/track" className="nav-link">Track Order</Link>
        </nav>

        {/* Icons */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <div onClick={() => navigate('/cart')} style={{ position: 'relative', cursor: 'pointer' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {/* Only show badge if count > 0 */}
            {cartCount > 0 && (
                <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--brand-yellow)', color: 'black', fontSize: '0.75rem', fontWeight: 'bold', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
            )}
          </div>

          {/* HAMBURGER BUTTON */}
          <button 
            id="mobile-menu-btn"
            className="mobile-only" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
               // Close Icon (X)
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
               // Menu Icon (Bars)
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <>
            {/* 1. The Backdrop */}
            <div className="mobile-menu-backdrop" onClick={closeMenu}></div>

            {/* 2. The Menu Itself */}
            <div className="mobile-menu-dropdown">
                <Link to="/" onClick={closeMenu} className="mobile-menu-link">Home</Link>
                <Link to="/shop" onClick={closeMenu} className="mobile-menu-link">Shop iPhones</Link>
                <Link to="/bnpl" onClick={closeMenu} className="mobile-menu-link" style={{ color: '#d97706' }}>Buy Now Pay Later</Link>
                <Link to="/track" onClick={closeMenu} className="mobile-menu-link">Track Order</Link>
                <div style={{ borderTop: '1px solid #eee', margin: '1rem 1rem 0 1rem' }}></div>
                <Link to="/staff-login" onClick={closeMenu} className="mobile-menu-link" style={{ fontSize: '0.9rem', color: '#999' }}>Staff Portal</Link>
            </div>
        </>
      )}
    </header>
  );
}