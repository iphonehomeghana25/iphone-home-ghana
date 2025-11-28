import React from 'react';
import { useNavigate } from 'react-router-dom';
import haatsoImg from '../assets/shop-haatso.png'; 
import circleImg from '../assets/shop-circle.png';

export default function ShopHero() {
  const navigate = useNavigate();

  return (
    <section className="hero-grid-section">
      <div className="shop-grid">
        
        {/* Left: Haatso Shop */}
        <div className="shop-card" style={{ backgroundImage: `url(${haatsoImg})` }}>
            <div className="overlay">
                <span className="badge">Haatso Branch</span>
                <h2>Haatso Showroom</h2>
                
                {/* NEW: Contact Info Block */}
                <div className="hero-contact-info">
                    <span>📍 Same building as Dosty Pharmacy, Atomic Road</span>
                    <span>📞 024 317 9760 / 053 585 5514</span>
                </div>

                <button onClick={() => navigate('/shop')}>Shop Haatso Stock</button>
            </div>
        </div>

        {/* Right: Circle Shop */}
        <div className="shop-card" style={{ backgroundImage: `url(${circleImg})` }}>
            <div className="overlay">
                <span className="badge">Circle Branch</span>
                <h2>Circle Store</h2>
                
                {/* NEW: Contact Info Block */}
                <div className="hero-contact-info">
                    <span>📍 Opposite Odor Rice, Circle Area</span>
                    <span>📞 053 585 5514 / 024 317 9760</span>
                </div>

                <button onClick={() => navigate('/shop')}>Shop Circle Stock</button>
            </div>
        </div>

      </div>
    </section>
  );
}
