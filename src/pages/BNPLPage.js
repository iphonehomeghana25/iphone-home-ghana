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
                <PriceRow model="iPhone 17 Pro Max 2TB eSIM Unlock (Fresh Inbox)" price="24,500" deposit="9,800 (40%)" weekly="1,837.50" monthly="7,350" />
                <PriceRow model="iPhone 17 Pro Max 2TB eSIM Unlock" price="22,000" deposit="13,200 (60%)" weekly="1,100" monthly="4,400" />
                <PriceRow model="iPhone 17 Pro Max 1TB Sim (Fresh Inbox)" price="22,800" deposit="9,120 (40%)" weekly="1,710" monthly="6,840" />
                <PriceRow model="iPhone 17 Pro Max 1TB eSIM Unlock" price="20,000" deposit="12,000 (60%)" weekly="1,000" monthly="4,000" />
                <PriceRow model="iPhone 17 Pro Max 512GB Sim" price="19,600" deposit="7,840 (40%)" weekly="1,470" monthly="5,880" />
                <PriceRow model="iPhone 17 Pro Max 512GB eSIM Unlock" price="17,300" deposit="10,038 (60%)" weekly="907.75" monthly="3,631" />
                <PriceRow model="iPhone 17 Pro Max 256GB Sim" price="17,300" deposit="6,920 (40%)" weekly="1,297.50" monthly="5,190" />
                <PriceRow model="iPhone 17 Pro Max 256GB eSIM" price="15,200" deposit="9,120 (60%)" weekly="760" monthly="3,040" />
                <PriceRow model="iPhone 17 Pro 1TB Sim" price="18,900" deposit="7,560 (40%)" weekly="1,417.50" monthly="5,670" />
                <PriceRow model="iPhone 17 Pro 1TB eSIM Unlock" price="16,800" deposit="10,080 (60%)" weekly="840" monthly="3,360" />
                <PriceRow model="iPhone 17 Pro 512GB Sim" price="17,750" deposit="7,100 (40%)" weekly="1,331" monthly="5,325" />
                <PriceRow model="iPhone 17 Pro 512GB eSIM Unlock" price="15,300" deposit="9,180 (60%)" weekly="765" monthly="3,060" />
                <PriceRow model="iPhone 17 Pro 256GB Sim" price="15,750" deposit="6,300 (40%)" weekly="1,181.75" monthly="4,725" />
                <PriceRow model="iPhone 17 Pro 256GB eSIM Unlock" price="14,100" deposit="8,460 (60%)" weekly="705" monthly="2,820" />
                <PriceRow model="iPhone 17 Air 1TB eSIM" price="14,800" deposit="8,880 (60%)" weekly="740" monthly="2,960" />
                <PriceRow model="iPhone 17 Air 512GB eSIM" price="13,500" deposit="8,100 (60%)" weekly="675" monthly="2,700" />
                <PriceRow model="iPhone 17 Air 256GB eSIM" price="11,600" deposit="6,960 (60%)" weekly="580" monthly="2,340" />
                <PriceRow model="iPhone 17 256GB" price="10,500" deposit="4,200 (40%)" weekly="787.50" monthly="3,150" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>Brand New - iPhone 16 Series</td></tr>
                <PriceRow model="iPhone 16 Pro Max 256GB" price="14,500" deposit="5,400 (40%)" weekly="1,012.50" monthly="4,050" />
                <PriceRow model="iPhone 16 Pro 256GB" price="13,000" deposit="5,200 (40%)" weekly="975" monthly="3,900" />
                <PriceRow model="iPhone 16e 128GB eSIM" price="5,200" deposit="3,120 (60%)" weekly="260" monthly="1,040" />
                <PriceRow model="iPhone 16 Plus 256GB" price="11,800" deposit="4,270 (40%)" weekly="941.25" monthly="3,765" />
                <PriceRow model="iPhone 16 Plus 128GB" price="10,500" deposit="4,200 (40%)" weekly="787.50" monthly="3,150" />
                <PriceRow model="iPhone 16 256GB" price="9,800" deposit="3,920 (40%)" weekly="735" monthly="2,940" />
                <PriceRow model="iPhone 16 128GB" price="9,000" deposit="3,600 (40%)" weekly="675" monthly="2,700" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>Brand New - iPhone 15 Series</td></tr>
                <PriceRow model="iPhone 15 256GB Sim" price="7,800" deposit="3,120 (40%)" weekly="585" monthly="2,340" />

                {/* UK Used Section Header */}
                <tr style={{ borderBottom: '2px solid #eaecf0' }}>
                  <td colSpan="5" style={{ padding: '1.5rem 1rem', fontWeight: '900', backgroundColor: '#1f2937', color: '#FFD700', textAlign: 'center', fontSize: '1.2rem' }}>
                    UK Used Phones Collection
                  </td>
                </tr>

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 16 Series</td></tr>
                <PriceRow model="iPhone 16 Pro Max 1TB" price="13,500" deposit="5,400 (40%)" weekly="1,012.50" monthly="4,050" />
                <PriceRow model="iPhone 16 Pro Max 512GB" price="12,500" deposit="5,000 (40%)" weekly="937.50" monthly="3,750" />
                <PriceRow model="iPhone 16 Pro Max 256GB" price="11,000" deposit="4,400 (40%)" weekly="825" monthly="3,300" />
                <PriceRow model="iPhone 16 Pro 256GB" price="9,000" deposit="3,600 (40%)" weekly="675" monthly="2,700" />
                <PriceRow model="iPhone 16 Pro 128GB Sim" price="8,000" deposit="3,200 (40%)" weekly="600" monthly="2,400" />
                <PriceRow model="iPhone 16 Plus 256GB" price="8,900" deposit="3,560 (40%)" weekly="667.50" monthly="2,670" />
                <PriceRow model="iPhone 16 Plus 128GB" price="8,400" deposit="3,360 (40%)" weekly="630" monthly="1,680" />
                <PriceRow model="iPhone 16 256GB" price="8,300" deposit="3,320 (40%)" weekly="622.50" monthly="2,490" />
                <PriceRow model="iPhone 16 128GB" price="7,500" deposit="3,080 (40%)" weekly="562.50" monthly="2,250" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 15 Series</td></tr>
                <PriceRow model="iPhone 15 Pro Max 256GB (Sim)" price="8,800" deposit="3,520 (40%)" weekly="660" monthly="2,640" />
                <PriceRow model="iPhone 15 Pro Max 256GB (eSIM)" price="8,000" deposit="3,200 (40%)" weekly="600" monthly="2,400" />
                <PriceRow model="iPhone 15 Pro 256GB" price="7,500" deposit="3,080 (40%)" weekly="562.50" monthly="2,250" />
                <PriceRow model="iPhone 15 Pro 128GB" price="7,150" deposit="2,860 (40%)" weekly="536.25" monthly="2,145" />
                <PriceRow model="iPhone 15 Plus 256GB" price="6,900" deposit="2,760 (40%)" weekly="517.50" monthly="2,070" />
                <PriceRow model="iPhone 15 Plus 128GB" price="6,450" deposit="2,580 (40%)" weekly="483.75" monthly="1,935" />
                <PriceRow model="iPhone 15 256GB" price="6,050" deposit="2,420 (40%)" weekly="453.75" monthly="1,815" />
                <PriceRow model="iPhone 15 128GB" price="5,750" deposit="2,300 (40%)" weekly="431.25" monthly="1,725" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 14 Series</td></tr>
                <PriceRow model="iPhone 14 Pro Max 256GB" price="7,400" deposit="2,960 (40%)" weekly="555" monthly="2,220" />
                <PriceRow model="iPhone 14 Pro Max 128GB" price="6,850" deposit="2,740 (40%)" weekly="513.75" monthly="2,055" />
                <PriceRow model="iPhone 14 Pro 256GB" price="6,300" deposit="2,520 (40%)" weekly="472.50" monthly="1,890" />
                <PriceRow model="iPhone 14 Pro 128GB" price="5,950" deposit="2,380 (40%)" weekly="446.25" monthly="1,785" />
                <PriceRow model="iPhone 14 Plus 256GB" price="5,700" deposit="2,280 (40%)" weekly="427.50" monthly="1,710" />
                <PriceRow model="iPhone 14 Plus 128GB" price="4,750" deposit="1,900 (40%)" weekly="356.25" monthly="1,425" />
                <PriceRow model="iPhone 14 256GB" price="4,600" deposit="1,840 (40%)" weekly="345" monthly="1,380" />
                <PriceRow model="iPhone 14 128GB" price="4,450" deposit="1,700 (40%)" weekly="318.75" monthly="1,275" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 13 Series</td></tr>
                <PriceRow model="iPhone 13 Pro Max 256GB" price="5,750" deposit="2,300 (40%)" weekly="431.25" monthly="1,725" />
                <PriceRow model="iPhone 13 Pro Max 128GB" price="5,350" deposit="2,140 (40%)" weekly="401.25" monthly="1,605" />
                <PriceRow model="iPhone 13 Pro 256GB" price="5,050" deposit="2,020 (40%)" weekly="378.75" monthly="1,515" />
                <PriceRow model="iPhone 13 Pro 128GB" price="4,650" deposit="1,860 (40%)" weekly="348.75" monthly="1,395" />
                <PriceRow model="iPhone 13 256GB" price="4,000" deposit="1,600 (40%)" weekly="300" monthly="1,200" />
                <PriceRow model="iPhone 13 128GB" price="3,600" deposit="1,440 (40%)" weekly="270" monthly="1,080" />
                <PriceRow model="iPhone 13 Mini 128GB" price="3,200" deposit="1,280 (40%)" weekly="240" monthly="960" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 12 Series</td></tr>
                <PriceRow model="iPhone 12 Pro Max 256GB" price="4,550" deposit="1,820 (40%)" weekly="341.25" monthly="1,365" />
                <PriceRow model="iPhone 12 Pro Max 128GB" price="3,900" deposit="1,560 (40%)" weekly="281.25" monthly="1,125" />
                <PriceRow model="iPhone 12 Pro 256GB" price="3,650" deposit="1,460 (40%)" weekly="273.75" monthly="1,095" />
                <PriceRow model="iPhone 12 Pro 128GB" price="3,350" deposit="1,340 (40%)" weekly="251.25" monthly="1,005" />
                <PriceRow model="iPhone 12 256GB" price="3,300" deposit="1,320 (40%)" weekly="247.50" monthly="990" />
                <PriceRow model="iPhone 12 128GB" price="2,850" deposit="1,140 (40%)" weekly="213.75" monthly="855" />
                <PriceRow model="iPhone 12 Mini 128GB" price="2,400" deposit="960 (40%)" weekly="180" monthly="720" />
                <PriceRow model="iPhone 12 64GB" price="2,400" deposit="960 (40%)" weekly="180" monthly="720" />

                <tr style={{ borderBottom: '1px solid #eaecf0' }}><td colSpan="5" style={{ padding: '1rem', fontWeight: 'bold', backgroundColor: '#f9fafb' }}>UK Used - iPhone 11 & XR Series</td></tr>
                <PriceRow model="iPhone 11 Pro Max 256GB" price="3,100" deposit="1,240 (40%)" weekly="232.50" monthly="930" />
                <PriceRow model="iPhone 11 Pro Max 64GB" price="2,750" deposit="1,100 (40%)" weekly="206.25" monthly="825" />
                <PriceRow model="iPhone 11 Pro 256GB" price="2,900" deposit="1,160 (40%)" weekly="217.50" monthly="870" />
                <PriceRow model="iPhone 11 Pro 64GB" price="2,600" deposit="1,040 (40%)" weekly="195" monthly="780" />
                <PriceRow model="iPhone 11 128GB (60% Down)" price="2,450" deposit="1,470 (60%)" weekly="122.50" monthly="490" />
                <PriceRow model="iPhone 11 128GB (40% Down)" price="2,450" deposit="980 (40%)" weekly="183.75" monthly="735" />
                <PriceRow model="iPhone 11 64GB (60% Down)" price="2,150" deposit="1,350 (60%)" weekly="112.50" monthly="450" />
                <PriceRow model="iPhone 11 64GB (40% Down)" price="2,150" deposit="860 (40%)" weekly="163.75" monthly="655" />
                <PriceRow model="iPhone XR 128GB (60% Down)" price="2,000" deposit="1,200 (60%)" weekly="100" monthly="400" />
                <PriceRow model="iPhone XR 128GB (40% Down)" price="2,000" deposit="800 (40%)" weekly="150" monthly="600" />
                <PriceRow model="iPhone XR 64GB (60% Down)" price="1,020" deposit="612 (60%)" weekly="85" monthly="340" />
                <PriceRow model="iPhone XR 64GB (40% Down)" price="1,700" deposit="680 (40%)" weekly="127.50" monthly="510" />

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
