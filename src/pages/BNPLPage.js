import React from 'react';
import { Link } from 'react-router-dom';

export default function BNPLPage() {
  return (
    <div className="container py-16">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Buy Now, Pay Later</h1>
          <p className="section-subtitle" style={{ fontSize: '1.2rem' }}>
            Get your dream iPhone today and pay in flexible weekly installments.
          </p>
          <div style={{ 
            backgroundColor: '#FFFBEB', 
            border: '1px solid #FEF3C7', 
            color: '#B45309', 
            padding: '1rem', 
            borderRadius: '8px',
            display: 'inline-block',
            marginTop: '1rem'
          }}>
            <strong>Note:</strong> Valid Ghana Card required. Visit our Haatso or Circle branch to apply.
          </div>
        </div>

        {/* How It Works Grid */}
        <div className="features-grid" style={{ marginBottom: '5rem' }}>
          <div className="feature-card">
            <div className="icon-box">📝</div>
            <h3>1. Apply</h3>
            <p>Visit our office with your Ghana Card for a quick assessment.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">💰</div>
            <h3>2. Deposit</h3>
            <p>Pay the initial 40% - 60% deposit based on your chosen device.</p>
          </div>
          <div className="feature-card">
            <div className="icon-box">📱</div>
            <h3>3. Pick Up</h3>
            <p>Walk away with your phone and pay the rest in weekly installments.</p>
          </div>
        </div>

        {/* Pricing Table */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontWeight: '800' }}>Price List & Installments</h2>
          <p style={{ textAlign: 'center', color: '#667085', marginBottom: '2rem' }}>
            Payment duration: <strong>12 Weeks</strong>. Missed payments may result in device locking.
          </p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #eaecf0' }}>
                  <th style={thStyle}>Device Model</th>
                  <th style={thStyle}>Full Price</th>
                  <th style={thStyle}>Initial Deposit</th>
                  <th style={thStyle}>Weekly Pay</th>
                </tr>
              </thead>
              <tbody>
                <PriceRow model="iPhone 17 Pro Max 1TB" price="28,000" deposit="11,200 (40%)" weekly="2,100" />
                <PriceRow model="iPhone 17 Pro Max 1TB (Esim)" price="25,900" deposit="10,360 (40%)" weekly="1,943" />
                <PriceRow model="iPhone 17 Pro Max 512GB" price="23,400" deposit="9,360 (40%)" weekly="1,755" />
                <PriceRow model="iPhone 17 Pro Max 256GB" price="20,800" deposit="8,320 (40%)" weekly="1,560" />
                <PriceRow model="iPhone 17 Pro Max 256GB (Esim)" price="19,400" deposit="7,760 (40%)" weekly="1,455" />
                <PriceRow model="iPhone 17 Pro 512GB" price="21,000" deposit="8,400 (40%)" weekly="1,575" />
                <PriceRow model="iPhone 17 Pro 256GB" price="18,300" deposit="7,320 (40%)" weekly="1,373" />
                <PriceRow model="iPhone 17 Pro 256GB (Esim)" price="16,800" deposit="6,720 (40%)" weekly="1,260" />
                <PriceRow model="iPhone 17 Air 256GB" price="13,500" deposit="5,400 (40%)" weekly="1,013" />
                <PriceRow model="iPhone 17 256GB" price="13,400" deposit="5,360 (40%)" weekly="1,005" />
                
                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="4" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>iPhone 16 Series</td></tr>
                <PriceRow model="iPhone 16 Pro Max 256GB (Sim)" price="17,000" deposit="6,800 (40%)" weekly="1,275" />
                <PriceRow model="iPhone 16 Pro Max (Sim Locked)" price="14,000" deposit="5,600 (40%)" weekly="1,050" />
                <PriceRow model="iPhone 16 Pro Max 512GB" price="15,500" deposit="6,200 (40%)" weekly="1,163" />
                <PriceRow model="iPhone 16 Pro Max 256GB" price="14,200" deposit="5,680 (40%)" weekly="1,065" />
                <PriceRow model="iPhone 16 Plus 256GB" price="12,000" deposit="4,500 (40%)" weekly="900" />
                <PriceRow model="iPhone 16 Plus 128GB" price="10,500" deposit="4,200 (40%)" weekly="788" />
                <PriceRow model="iPhone 16 256GB" price="10,800" deposit="4,320 (40%)" weekly="810" />
                <PriceRow model="iPhone 16 128GB" price="9,500" deposit="3,800 (40%)" weekly="713" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="4" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>iPhone 15 Series</td></tr>
                <PriceRow model="iPhone 15 Pro Max 256GB" price="11,500" deposit="4,600 (40%)" weekly="863" />
                <PriceRow model="iPhone 15 Pro 256GB" price="10,000" deposit="4,000 (40%)" weekly="750" />
                <PriceRow model="iPhone 15 Pro 128GB" price="9,500" deposit="3,800 (40%)" weekly="713" />
                <PriceRow model="iPhone 15 Plus 256GB" price="8,800" deposit="3,520 (40%)" weekly="660" />
                <PriceRow model="iPhone 15 Plus 128GB" price="8,500" deposit="3,400 (40%)" weekly="638" />
                <PriceRow model="iPhone 15 256GB" price="8,000" deposit="3,200 (40%)" weekly="600" />
                <PriceRow model="iPhone 15 128GB" price="7,500" deposit="3,000 (40%)" weekly="563" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="4" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>iPhone 14 Series</td></tr>
                <PriceRow model="iPhone 14 Pro Max 256GB" price="9,300" deposit="3,720 (40%)" weekly="698" />
                <PriceRow model="iPhone 14 Pro Max 128GB" price="9,000" deposit="3,600 (40%)" weekly="675" />
                <PriceRow model="iPhone 14 Pro 256GB" price="7,900" deposit="3,160 (40%)" weekly="593" />
                <PriceRow model="iPhone 14 Pro 128GB" price="7,500" deposit="3,000 (40%)" weekly="563" />
                <PriceRow model="iPhone 14 Plus 256GB" price="6,600" deposit="2,640 (40%)" weekly="495" />
                <PriceRow model="iPhone 14 Plus 128GB" price="6,000" deposit="2,400 (40%)" weekly="450" />
                <PriceRow model="iPhone 14 256GB" price="5,800" deposit="2,320 (40%)" weekly="435" />
                <PriceRow model="iPhone 14 128GB" price="5,600" deposit="2,240 (40%)" weekly="420" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="4" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>iPhone 13 Series</td></tr>
                <PriceRow model="iPhone 13 Pro Max 256GB" price="7,000" deposit="2,800 (40%)" weekly="525" />
                <PriceRow model="iPhone 13 Pro Max 128GB" price="6,600" deposit="2,640 (40%)" weekly="495" />
                <PriceRow model="iPhone 13 Pro 256GB" price="6,000" deposit="2,400 (40%)" weekly="450" />
                <PriceRow model="iPhone 13 Pro 128GB" price="5,550" deposit="2,220 (40%)" weekly="416" />
                <PriceRow model="iPhone 13 256GB" price="4,800" deposit="1,920 (40%)" weekly="360" />
                <PriceRow model="iPhone 13 128GB" price="4,300" deposit="1,720 (40%)" weekly="323" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="4" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>iPhone 12 Series</td></tr>
                <PriceRow model="iPhone 12 Pro Max 256GB" price="5,500" deposit="2,200 (40%)" weekly="413" />
                <PriceRow model="iPhone 12 Pro Max 128GB" price="5,200" deposit="2,080 (40%)" weekly="390" />
                <PriceRow model="iPhone 12 Pro 256GB" price="4,400" deposit="1,760 (40%)" weekly="330" />
                <PriceRow model="iPhone 12 Pro 128GB" price="4,100" deposit="1,640 (40%)" weekly="308" />
                <PriceRow model="iPhone 12 128GB" price="3,850" deposit="1,540 (40%)" weekly="288" />
                <PriceRow model="iPhone 12 64GB" price="3,350" deposit="1,340 (40%)" weekly="251" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="4" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>iPhone 11 & XR Series</td></tr>
                <PriceRow model="iPhone 11 Pro Max 256GB" price="4,000" deposit="1,600 (40%)" weekly="300" />
                <PriceRow model="iPhone 11 Pro Max 64GB" price="3,850" deposit="1,540 (40%)" weekly="289" />
                <PriceRow model="iPhone 11 Pro 256GB" price="3,600" deposit="1,440 (40%)" weekly="270" />
                <PriceRow model="iPhone 11 Pro 64GB" price="3,450" deposit="1,380 (40%)" weekly="259" />
                <PriceRow model="iPhone 11 128GB" price="2,900" deposit="1,740 (60%)" weekly="145" />
                <PriceRow model="iPhone 11 64GB" price="2,600" deposit="1,560 (60%)" weekly="130" />
                <PriceRow model="iPhone XR 128GB" price="2,450" deposit="1,470 (60%)" weekly="122.50" />
                <PriceRow model="iPhone XR 64GB" price="2,100" deposit="1,260 (60%)" weekly="105" />

              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Section */}
        <div style={{ textAlign: 'center', backgroundColor: '#1f2937', color: 'white', padding: '3rem', borderRadius: '16px' }}>
            <h2 style={{ color: '#FFD700', fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>Ready to Start?</h2>
            <p style={{ marginBottom: '2rem', color: '#d1d5db', fontSize: '1.1rem' }}>
                Visit us today with your Ghana Card to pick up your phone.
            </p>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <div>
                    <p style={{ fontWeight: 'bold', color: '#FFD700' }}>Haatso Branch</p>
                    <p>024 317 9760</p>
                </div>
                <div>
                    <p style={{ fontWeight: 'bold', color: '#FFD700' }}>Circle Branch</p>
                    <p>054 123 4567</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Table Rows
function PriceRow({ model, price, deposit, weekly }) {
    return (
        <tr style={{ borderBottom: '1px solid #eaecf0' }}>
            <td style={tdStyle}><strong>{model}</strong></td>
            <td style={tdStyle}>GH₵{price}</td>
            <td style={tdStyle}>GH₵{deposit}</td>
            <td style={tdStyle}>GH₵{weekly}</td>
        </tr>
    )
}

const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085', fontWeight: '700' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };