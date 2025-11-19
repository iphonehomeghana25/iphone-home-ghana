import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: 'black', color: 'white', paddingTop: '5rem', paddingBottom: '2rem', borderTop: '1px solid #222' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem' }}>
          
          {/* Column 1: Brand & Socials */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                {/* Logo Icon */}
                <img src={`${process.env.PUBLIC_URL}/favicon.svg`} alt="Logo" style={{ width: '32px', height: '32px' }} />
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', letterSpacing: '-0.02em' }}>iPhone Home</span>
            </div>
            <p style={{ color: '#9ca3af', lineHeight: '1.6', marginBottom: '2rem', fontSize: '0.95rem' }}>
              Your verified source for Apple devices in Accra. Brand new and neat UK used phones delivered to your door.
            </p>
            
            {/* Social Media Icons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <SocialLink href="#" icon={<InstagramIcon />} />
              <SocialLink href="#" icon={<FacebookIcon />} />
              <SocialLink href="#" icon={<TikTokIcon />} />
            </div>
          </div>

          {/* Column 2: Shop & Admin */}
          <div>
            <h3 className="footer-heading">Shop</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#d1d5db' }}>
              <li><Link to="/shop" className="footer-link">All Products</Link></li>
              <li><Link to="/shop" className="footer-link">Brand New iPhones</Link></li>
              <li><Link to="/shop" className="footer-link">UK Used iPhones</Link></li>
              <li><Link to="/bnpl" className="footer-link">Buy Now Pay Later</Link></li>
            
              
              {/* Staff Portal Link (Subtle) */}
              <li style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #333' }}>
                <Link to="/staff-login" className="footer-link" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                  🔒 Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Location & Contacts */}
          <div>
            <h3 className="footer-heading">Visit Us</h3>
            
            <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'white', fontWeight: '700', marginBottom: '0.25rem' }}>Haatso Branch:</p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Near DH Electricals, Atomic Rd.</p>
                <p style={{ color: '#FFD700', fontSize: '0.9rem', marginTop: '0.25rem' }}>📞 024 317 9760</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: 'white', fontWeight: '700', marginBottom: '0.25rem' }}>Circle Branch:</p>
                <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Opposite Odor Rice.</p>
                <p style={{ color: '#FFD700', fontSize: '0.9rem', marginTop: '0.25rem' }}>📞 054 123 4567</p>
            </div>
            
            {/* Embedded Google Map */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #333', height: '140px' }}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.465863748724!2d-0.2078673!3d5.6577562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9c6754400001%3A0x123456789abcdef!2sHaatso%20Atomic%20Rd%2C%20Accra!5e0!3m2!1sen!2sgh!4v1699999999999!5m2!1sen!2sgh" 
                width="100%" 
                height="100%" 
                style={{ border: 0, display: 'block' }} 
                allowFullScreen="" 
                loading="lazy"
                title="Shop Location"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div style={{ borderTop: '1px solid #222', marginTop: '5rem', paddingTop: '2rem', textAlign: 'center', color: '#52525b', fontSize: '0.85rem' }}>
          <p>&copy; {new Date().getFullYear()} iPhone Home Ghana. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// --- Helper Component for Social Links ---
function SocialLink({ href, icon }) {
  return (
    <a href={href} className="social-icon-btn">
      {icon}
    </a>
  );
}

// --- Icons (SVGs) ---
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
);
