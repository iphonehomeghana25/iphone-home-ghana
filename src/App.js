import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

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
import BlogPage from './pages/BlogPage';         // <--- NEW: Blog List Page
import BlogPostPage from './pages/BlogPostPage'; // <--- NEW: Single Blog Post Page

// Admin Components
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ManageProducts from './admin/ManageProducts';
import ManageOrders from './admin/ManageOrders';
import ManageBNPL from './admin/ManageBNPL';
import ManageSales from './admin/ManageSales';
import ManageBlog from './admin/ManageBlog';     // <--- NEW: Admin Blog Manager
import ManageReviews from './admin/ManageReviews'; // <--- NEW: Admin Reviews Manager

// --- WhatsApp Floating Button Component ---
const WhatsAppButton = () => (
  <a 
    href="https://wa.me/233243179760" 
    target="_blank" 
    rel="noopener noreferrer"
    style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#25D366',
      color: 'white',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
      zIndex: 1000,
      transition: 'transform 0.3s ease'
    }}
    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
    title="Chat on WhatsApp"
  >
    <svg width="35" height="35" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  </a>
);

const PublicLayout = () => (
  <>
    <ScrollToTop />
    <Header />
    <Outlet />
    <Footer />
    {/* Floating WhatsApp Button shows on ALL public pages */}
    <WhatsAppButton />
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
                
                {/* 1. PHONES SECTION */}
                <FeaturedProducts 
                    title="Just Arrived" 
                    subtitle="Fresh stock from the UK and Brand New boxes."
                    filterMode="phones"
                />

                <HowItWorksSection />
                
                {/* 2. ACCESSORIES SECTION */}
                <FeaturedProducts 
                    title="Essential Accessories" 
                    subtitle="Chargers, Cases, and Screen Protectors."
                    filterMode="accessories"
                    bgColor="#f9fafb"
                />

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
            
            <Route path="/blog" element={<BlogPage />} /> {/* <--- NEW ROUTE */}
            <Route path="/blog/:slug" element={<BlogPostPage />} /> {/* <--- NEW ROUTE */}

            <Route path="/track" element={<TrackOrderPage />} />
            <Route path="/bnpl" element={<BNPLPage />} />
            <Route path="/staff-login" element={<StaffLogin />} />
        </Route>

        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="products" element={<ManageProducts />} />
            <Route path="orders" element={<ManageOrders />} />
            <Route path="sales" element={<ManageSales />} />
            <Route path="blog" element={<ManageBlog />} /> {/* <--- NEW ROUTE */}
            <Route path="reviews" element={<ManageReviews />} /> {/* <--- NEW ROUTE ADDED HERE */}
            <Route path="bnpl" element={<ManageBNPL />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;