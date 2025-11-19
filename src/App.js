import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import ShopHero from './components/ShopHero';
import FeaturedProducts from './components/FeaturedProducts';
import Footer from './components/Footer';
import { 
  FeaturesSection, 
  HowItWorksSection, 
  TestimonialsSection, 
  TrackOrderInput, 
  ShopAllCTA,
  BNPLBanner // <--- Imported the new Banner
} from './components/HomeSections';

// Pages
import StaffLogin from './pages/StaffLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';
import BNPLPage from './pages/BNPLPage'; // <--- Imported the new Page

function App() {
  return (
    <div className="app-wrapper">
      {/* SEO */}
      <title>iPhone Home Ghana | Buy Brand New & UK Used iPhones in Accra</title>
      <meta name="description" content="Trusted iPhone dealer in Accra. Locations: Haatso & Circle. Buy authentic Apple products with warranty." />

      {/* 2. The Header (Stays at the top on every page) */}
      <Header />

      {/* 3. The Main Content (Changes based on the link you click) */}
      <Routes>
        
        {/* --- HOME PAGE --- */}
        <Route path="/" element={
          <main>
            {/* Hero Grid (Haatso & Circle Shops) */}
            <ShopHero />
            
            {/* Features (Authentic, Fast, Support) */}
            <FeaturesSection />

            {/* Featured Products (Just Arrived) */}
            <FeaturedProducts />
            
            {/* How It Works (1, 2, 3 Steps) */}
            <HowItWorksSection />

            {/* Testimonials (Customer Reviews) */}
            <TestimonialsSection />

            {/* Track Order Input (Search Bar) */}
            <TrackOrderInput />

            {/* NEW: Buy Now Pay Later Banner (The Marketing Hook) */}
            <BNPLBanner />

            {/* Final Call to Action Button */}
            <ShopAllCTA />
          </main>
        } />

        {/* --- PUBLIC PAGES --- */}
        <Route path="/shop" element={<div className="container py-16" style={{textAlign:'center'}}><h1>Shop Page Coming Soon</h1><p>We are stocking up the shelves...</p></div>} />
        
        <Route path="/cart" element={<div className="container py-16" style={{textAlign:'center'}}><h1>Your Cart</h1><p>Cart functionality coming shortly.</p></div>} />
        
        <Route path="/track" element={<div className="container py-16" style={{textAlign:'center'}}><h1>Track Order</h1><p>Order tracking system is being set up.</p></div>} />
        
        {/* Buy Now Pay Later Page (Connected!) */}
        <Route path="/bnpl" element={<BNPLPage />} />
        
        {/* Login Page */}
        <Route path="/staff-login" element={<StaffLogin />} />

        {/* --- ADMIN ROUTES (Protected, No Header/Footer) --- */}
        <Route path="/admin" element={<AdminLayout />}>
            {/* CONNECT THE REAL PAGES HERE */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<h1>Manage Orders Coming Soon</h1>} />
            <Route path="bnpl" element={<h1>Manage Debtors Coming Soon</h1>} />
        </Route>

      </Routes>

      {/* 4. The Footer (Stays at the bottom of every page) */}
      <Footer />
      
    </div>
  );
}

// Small helper to clean up App.js structure not strictly needed but good for readability if used
function PublicHome() {
    return (
        <main>
            <ShopHero />
            <FeaturesSection />
            <FeaturedProducts />
            <HowItWorksSection />
            <TestimonialsSection />
            <TrackOrderInput />
            <BNPLBanner />
            <ShopAllCTA />
        </main>
    );
}

export default App;