import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import ScrollToTop from './components/ScrollToTop'; // <--- IMPORT THIS

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
import ShopPage from './pages/ShopPage';        
import CartPage from './pages/CartPage';        
import CheckoutPage from './pages/CheckoutPage'; 
import OrderConfirmation from './pages/OrderConfirmation';

// Admin Components
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import ManageBNPL from './admin/ManageBNPL';

const PublicLayout = () => (
  <>
    <ScrollToTop /> {/* <--- ACTIVATE SCROLL FIX HERE */}
    <Header />
    <Outlet />
    <Footer />
  </>
);

function App() {
  return (
    <div className="app-wrapper">
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
            
            <Route path="/shop" element={<ShopPage />} /> 
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            
            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/bnpl" element={<BNPLPage />} />
            <Route path="/staff-login" element={<StaffLogin />} />
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="bnpl" element={<ManageBNPL />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;