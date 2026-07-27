import React from 'react';
import { Link } from 'react-router-dom';

export default function BNPLPage() {
  return (
    <div className="container py-16">
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Buy Now, Pay Later</h1>
          <p className="section-subtitle" style={{ fontSize: '1.2rem' }}>
            Get your dream iPhone today and pay in flexible weekly or monthly installments.
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
        <div className="features-grid" style={{ marginBottom: '5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="feature-card" style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <div className="icon-box" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📝</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>1. Apply</h3>
            <p style={{ color: '#6b7280' }}>Visit our office with your Ghana Card for a quick assessment.</p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <div className="icon-box" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💰</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>2. Deposit</h3>
            <p style={{ color: '#6b7280' }}>Pay the initial 40% - 60% deposit based on your chosen device.</p>
          </div>
          <div className="feature-card" style={{ textAlign: 'center', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '12px' }}>
            <div className="icon-box" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📱</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>3. Pick Up</h3>
            <p style={{ color: '#6b7280' }}>Walk away with your phone and pay the rest in weekly or monthly installments.</p>
          </div>
        </div>

        {/* Pricing Table */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '2rem', fontWeight: '800' }}>New Price List & Installments Update 2026</h2>
          <p style={{ textAlign: 'center', color: '#667085', marginBottom: '2rem' }}>
            Payment duration: <strong>12 Weeks</strong> or <strong>3 Months</strong>. Missed payments may result in device locking.
          </p>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #eaecf0' }}>
                  <th style={thStyle}>Device Model</th>
                  <th style={thStyle}>Full Price</th>
                  <th style={thStyle}>Initial Deposit</th>
                  <th style={thStyle}>Weekly Pay</th>
                  <th style={thStyle}>Monthly Pay</th>
                </tr>
              </thead>
              <tbody>
                
                {/* Brand New Devices */}
                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>Brand New - iPhone 17 Series</td></tr>
                <PriceRow model="iPhone 17 Pro Max 1TB (Sim)" price="24,900" deposit="9,960 (40%)" weekly="1,867.50" monthly="7,470" />
                <PriceRow model="iPhone 17 Pro Max 2TB (eSIM Unlock)" price="23,500" deposit="13,800 (40%)" weekly="1,115" monthly="4,600" />
                <PriceRow model="iPhone 17 Pro Max 1TB (eSIM Unlock)" price="20,000" deposit="12,000 (40%)" weekly="1,000" monthly="4,000" />
                <PriceRow model="iPhone 17 Pro Max 512GB (Sim)" price="21,000" deposit="8,400 (40%)" weekly="1,575" monthly="6,300" />
                <PriceRow model="iPhone 17 Pro Max 512GB (eSIM Unlock)" price="17,500" deposit="7,000 (40%)" weekly="1,312.50" monthly="5,250" />
                <PriceRow model="iPhone 17 Pro Max 256GB (Sim)" price="17,500" deposit="7,000 (40%)" weekly="1,312" monthly="5,250" />
                <PriceRow model="iPhone 17 Pro Max 256GB (eSIM)" price="15,900" deposit="9,540 (40%)" weekly="795" monthly="3,180" />
                
                <PriceRow model="iPhone 17 Pro 1TB (Sim)" price="18,500" deposit="7,400 (40%)" weekly="1,387.50" monthly="5,550" />
                <PriceRow model="iPhone 17 Pro 1TB (eSIM Unlock)" price="16,800" deposit="10,080 (40%)" weekly="840" monthly="3,360" />
                <PriceRow model="iPhone 17 Pro 512GB (Sim)" price="17,500" deposit="7,000 (40%)" weekly="1,312.50" monthly="5,250" />
                <PriceRow model="iPhone 17 Pro 512GB (eSIM Unlock)" price="15,300" deposit="9,180 (40%)" weekly="765" monthly="3,060" />
                <PriceRow model="iPhone 17 Pro 256GB (Sim)" price="16,000" deposit="6,400 (40%)" weekly="1,200" monthly="4,800" />
                <PriceRow model="iPhone 17 Pro 256GB (eSIM Unlock)" price="14,300" deposit="8,580 (40%)" weekly="715" monthly="2,860" />
                
                <PriceRow model="iPhone 17 Air 1TB" price="15,800" deposit="6,320 (40%)" weekly="1,185" monthly="4,740" />
                <PriceRow model="iPhone 17 Air 512GB" price="13,500" deposit="8,100 (60%)" weekly="675" monthly="2,700" />
                <PriceRow model="iPhone 17 Air 256GB" price="11,900" deposit="7,140 (60%)" weekly="595" monthly="2,380" />
                <PriceRow model="iPhone 17 256GB" price="10,900" deposit="4,360 (40%)" weekly="817.50" monthly="3,270" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>Brand New - iPhone 16 Series</td></tr>
                <PriceRow model="iPhone 16 Pro Max 256GB" price="14,800" deposit="5,920 (40%)" weekly="1,110" monthly="4,440" />
                <PriceRow model="iPhone 16 Pro Max (eSIM Unlock)" price="13,100" deposit="5,240 (40%)" weekly="982.50" monthly="3,930" />
                <PriceRow model="iPhone 16 Pro 256GB" price="14,900" deposit="5,960 (40%)" weekly="1,117.50" monthly="4,470" />
                <PriceRow model="iPhone 16e 128GB (Sim)" price="6,800" deposit="2,720 (40%)" weekly="510" monthly="2,040" />
                <PriceRow model="iPhone 16 Plus 256GB" price="10,900" deposit="4,360 (40%)" weekly="817.50" monthly="3,270" />
                <PriceRow model="iPhone 16 Plus 128GB" price="9,900" deposit="3,960 (40%)" weekly="742.50" monthly="2,970" />
                <PriceRow model="iPhone 16 256GB" price="9,800" deposit="3,920 (40%)" weekly="735" monthly="2,940" />
                <PriceRow model="iPhone 16 128GB" price="9,500" deposit="3,800 (40%)" weekly="712.50" monthly="2,850" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>Brand New - iPhone 15 Series</td></tr>
                <PriceRow model="iPhone 15 256GB" price="9,390" deposit="3,756 (40%)" weekly="704.25" monthly="2,817" />

                {/* UK Used Section Header */}
                <tr style={{ borderBottom: '2px solid #eaecf0' }}>
                  <td colSpan="5" style={{ padding: '1.5rem 1rem', fontWeight: '900', backgroundColor: '#1f2937', color: '#FFD700', textAlign: 'center', fontSize: '1.2rem' }}>
                    UK Used Phones Collection
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 16 Series</td></tr>
                <PriceRow model="iPhone 16 Pro Max 1TB" price="13,500" deposit="5,400 (40%)" weekly="1,012.50" monthly="4,050" />
                <PriceRow model="iPhone 16 Pro Max 512GB" price="12,900" deposit="5,160 (40%)" weekly="967.50" monthly="3,870" />
                <PriceRow model="iPhone 16 Pro Max 256GB" price="11,900" deposit="4,760 (40%)" weekly="892.50" monthly="3,570" />
                <PriceRow model="iPhone 16 Pro 256GB" price="10,500" deposit="4,200 (40%)" weekly="787.50" monthly="3,150" />
                <PriceRow model="iPhone 16 Plus 256GB" price="8,900" deposit="3,360 (40%)" weekly="356" monthly="1,424" />
                <PriceRow model="iPhone 16 Plus 128GB" price="8,400" deposit="3,360 (40%)" weekly="630" monthly="1,680" />
                <PriceRow model="iPhone 16 256GB" price="8,600" deposit="3,440 (40%)" weekly="645" monthly="2,520" />
                <PriceRow model="iPhone 16 128GB" price="8,050" deposit="3,220 (40%)" weekly="603.75" monthly="2,415" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 15 Series</td></tr>
                <PriceRow model="iPhone 15 Pro Max 256GB (Sim)" price="8,900" deposit="3,560 (40%)" weekly="667.50" monthly="2,670" />
                <PriceRow model="iPhone 15 Pro Max 256GB (eSIM)" price="8,000" deposit="3,200 (40%)" weekly="600" monthly="2,400" />
                <PriceRow model="iPhone 15 Pro 256GB (Sim)" price="8,000" deposit="3,200 (40%)" weekly="600" monthly="2,400" />
                <PriceRow model="iPhone 15 Pro 128GB" price="7,500" deposit="3,080 (40%)" weekly="562.50" monthly="2,250" />
                <PriceRow model="iPhone 15 Plus 256GB" price="6,900" deposit="2,760 (40%)" weekly="517.50" monthly="2,070" />
                <PriceRow model="iPhone 15 Plus 128GB" price="6,450" deposit="2,580 (40%)" weekly="483.75" monthly="1,935" />
                <PriceRow model="iPhone 15 256GB" price="6,050" deposit="2,420 (40%)" weekly="453.75" monthly="1,815" />
                <PriceRow model="iPhone 15 128GB" price="5,650" deposit="2,260 (40%)" weekly="423.75" monthly="1,695" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 14 Series</td></tr>
                <PriceRow model="iPhone 14 Pro Max 256GB" price="7,600" deposit="3,040 (40%)" weekly="570" monthly="2,280" />
                <PriceRow model="iPhone 14 Pro Max 128GB" price="7,000" deposit="2,800 (40%)" weekly="525" monthly="2,100" />
                <PriceRow model="iPhone 14 Pro 256GB" price="6,450" deposit="2,580 (40%)" weekly="483.75" monthly="1,935" />
                <PriceRow model="iPhone 14 Pro 128GB" price="6,050" deposit="2,420 (40%)" weekly="453.75" monthly="1,815" />
                <PriceRow model="iPhone 14 Plus 256GB" price="6,700" deposit="2,680 (40%)" weekly="502.50" monthly="2,010" />
                <PriceRow model="iPhone 14 Plus 128GB" price="5,900" deposit="2,360 (40%)" weekly="442" monthly="1,770" />
                <PriceRow model="iPhone 14 256GB" price="5,000" deposit="2,000 (40%)" weekly="375" monthly="1,500" />
                <PriceRow model="iPhone 14 128GB" price="4,450" deposit="1,780 (40%)" weekly="337.75" monthly="1,335" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 13 Series</td></tr>
                <PriceRow model="iPhone 13 Pro Max 256GB" price="5,850" deposit="2,340 (40%)" weekly="438.75" monthly="1,755" />
                <PriceRow model="iPhone 13 Pro Max 128GB" price="5,350" deposit="2,140 (40%)" weekly="401.25" monthly="1,605" />
                <PriceRow model="iPhone 13 Pro 256GB" price="5,050" deposit="2,020 (40%)" weekly="378.75" monthly="1,515" />
                <PriceRow model="iPhone 13 Pro 128GB" price="4,650" deposit="1,860 (40%)" weekly="348.75" monthly="1,395" />
                <PriceRow model="iPhone 13 256GB" price="4,000" deposit="1,600 (40%)" weekly="300" monthly="1,200" />
                <PriceRow model="iPhone 13 128GB" price="3,650" deposit="1,460 (40%)" weekly="273.75" monthly="1,095" />
                <PriceRow model="iPhone 13 Mini 128GB" price="3,200" deposit="1,280 (40%)" weekly="240" monthly="960" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 12 Series</td></tr>
                <PriceRow model="iPhone 12 Pro Max 256GB" price="4,600" deposit="1,840 (40%)" weekly="345" monthly="1,380" />
                <PriceRow model="iPhone 12 Pro Max 128GB" price="4,050" deposit="1,620 (40%)" weekly="303.75" monthly="1,215" />
                <PriceRow model="iPhone 12 Pro 256GB" price="3,850" deposit="1,540 (40%)" weekly="288.75" monthly="1,155" />
                <PriceRow model="iPhone 12 Pro 128GB" price="3,400" deposit="1,360 (40%)" weekly="255" monthly="1,020" />
                <PriceRow model="iPhone 12 256GB" price="3,650" deposit="1,460 (40%)" weekly="273.75" monthly="1,095" />
                <PriceRow model="iPhone 12 128GB" price="2,950" deposit="1,180 (40%)" weekly="221.25" monthly="885" />
                <PriceRow model="iPhone 12 Mini 128GB" price="2,500" deposit="1,000" weekly="187.50" monthly="750" />
                <PriceRow model="iPhone 12 64GB" price="2,550" deposit="1,020 (40%)" weekly="191.25" monthly="765" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 11 & XR Series</td></tr>
                <PriceRow model="iPhone 11 Pro Max 256GB" price="3,350" deposit="1,340 (40%)" weekly="251.25" monthly="1,005" />
                <PriceRow model="iPhone 11 Pro Max 64GB" price="3,000" deposit="1,200 (40%)" weekly="225" monthly="900" />
                <PriceRow model="iPhone 11 Pro 256GB" price="3,000" deposit="1,200 (40%)" weekly="225" monthly="900" />
                <PriceRow model="iPhone 11 Pro 64GB" price="2,500" deposit="1,000 (40%)" weekly="194.25" monthly="777" />
                <PriceRow model="iPhone 11 128GB" price="2,500" deposit="1,500 (60%)" weekly="125" monthly="490" />
                <PriceRow model="iPhone 11 64GB" price="2,250" deposit="1,350 (60%)" weekly="112.50" monthly="450" />
                <PriceRow model="iPhone XR 128GB (Straight Buy Only)" price="2,000" deposit="N/A" weekly="N/A" monthly="N/A" />

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
                    <p style={{ fontWeight: 'bold', color: '#FFD700' }}>Kwashieman Branch</p>
                    <p>024 317 9760</p>
                </div>
                <div>
                    <p style={{ fontWeight: 'bold', color: '#FFD700' }}>Circle Branch</p>
                    <p>053 585 5514</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// Helper Component for Table Rows
function PriceRow({ model, price, deposit, weekly, monthly }) {
    return (
        <tr style={{ borderBottom: '1px solid #eaecf0', transition: 'background-color 0.2s', ':hover': {backgroundColor: '#f9fafb'} }}>
            <td style={tdStyle}><strong>{model}</strong></td>
            <td style={tdStyle}>GH₵{price}</td>
            <td style={tdStyle}>{deposit !== "N/A" ? `GH₵${deposit}` : deposit}</td>
            <td style={tdStyle}>{weekly !== "N/A" ? `GH₵${weekly}` : weekly}</td>
            <td style={tdStyle}>{monthly !== "N/A" ? `GH₵${monthly}` : monthly}</td>
        </tr>
    )
}

const thStyle = { textAlign: 'left', padding: '1rem', fontSize: '0.9rem', color: '#667085', fontWeight: '700' };
const tdStyle = { padding: '1rem', fontSize: '0.95rem' };
