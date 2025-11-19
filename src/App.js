import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import ShopHero from './components/ShopHero';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import { FeaturesSection, HowItWorksSection, TestimonialsSection, TrackOrderInput, ShopAllCTA } from './components/HomeSections';

// Pages
import StaffLogin from './pages/StaffLogin';
import AdminLayout from './admin/AdminLayout';
// IMPORT THE NEW ADMIN PAGES (We will create these in the next step)
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';

function App() {
  return (
    <div className="app-wrapper">
      {/* SEO */}
      <title>iPhone Home Ghana | Buy Brand New & UK Used iPhones in Accra</title>
      <meta name="description" content="Trusted iPhone dealer in Accra. Locations: Haatso & Circle." />

      <Routes>
        {/* --- PUBLIC ROUTES (Has Header & Footer) --- */}
        <Route path="/" element={<><Header /><PublicHome /><Footer /></>} />
        <Route path="/shop" element={<><Header /><div className="container py-16" style={{textAlign:'center'}}><h1>Shop Page Coming Soon</h1></div><Footer /></>} />
        <Route path="/cart" element={<><Header /><div className="container py-16" style={{textAlign:'center'}}><h1>Cart Page Coming Soon</h1></div><Footer /></>} />
        <Route path="/track" element={<><Header /><div className="container py-16" style={{textAlign:'center'}}><h1>Track Order</h1></div><Footer /></>} />
        <Route path="/bnpl" element={<><Header /><div className="container py-16" style={{textAlign:'center'}}><h1>Buy Now Pay Later</h1></div><Footer /></>} />
        
        {/* Login Page */}
        <Route path="/staff-login" element={<><Header /><StaffLogin /><Footer /></>} />

        {/* --- ADMIN ROUTES (Protected, No Header/Footer) --- */}
        <Route path="/admin" element={<AdminLayout />}>
            {/* CONNECT THE REAL PAGES HERE */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<h1>Manage Orders Coming Soon</h1>} />
            <Route path="bnpl" element={<h1>Manage Debtors Coming Soon</h1>} />
        </Route>

      </Routes>
    </div>
  );
}

// Small helper to clean up App.js structure
function PublicHome() {
    return (
        <main>
            <ShopHero />
            <FeaturesSection />
            <FeaturedProducts />
            <HowItWorksSection />
            <TestimonialsSection />
            <TrackOrderInput />
            <ShopAllCTA />
        </main>
    );
}

export default App;
