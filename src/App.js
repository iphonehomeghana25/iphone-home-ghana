import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
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
  BNPLBanner 
} from './components/HomeSections';

// Pages
import StaffLogin from './pages/StaffLogin';
import BNPLPage from './pages/BNPLPage';
import TrackOrderPage from './pages/TrackOrderPage';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import ManageBNPL from './admin/ManageBNPL'; // <--- Ensure this import is here

// --- PUBLIC LAYOUT WRAPPER ---
const PublicLayout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <div className="app-wrapper">
      <title>iPhone Home Ghana | Buy Brand New & UK Used iPhones in Accra</title>
      <meta name="description" content="Trusted iPhone dealer in Accra. Locations: Haatso & Circle. Buy authentic Apple products with warranty." />

      <Routes>
        
        {/* --- PUBLIC ROUTES --- */}
        <Route element={<PublicLayout />}>
            <Route path="/" element={
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
            } />
            
            <Route path="/shop" element={<div className="container py-16" style={{textAlign:'center'}}><h1>Shop Page Coming Soon</h1></div>} />
            <Route path="/cart" element={<div className="container py-16" style={{textAlign:'center'}}><h1>Your Cart</h1></div>} />
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/bnpl" element={<BNPLPage />} />
            <Route path="/staff-login" element={<StaffLogin />} />
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="bnpl" element={<ManageBNPL />} /> {/* <--- CONNECTED HERE */}
        </Route>

      </Routes>
      
    </div>
  );
}

export default App;