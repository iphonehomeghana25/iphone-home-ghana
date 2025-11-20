import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  // 1. Initialize Cart from LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('iphone_home_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 2. Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('iphone_home_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Cart Logic ---
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(prevCart => {
      return prevCart.map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null; 
          }
          return item;
        }).filter(Boolean);
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('iphone_home_cart');
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // --- CHECKOUT & EMAIL LOGIC ---
  const placeOrder = async (customerDetails) => {
    if (cart.length === 0) return { error: 'Cart is empty.' };

    const newOrderId = `IHG-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const newOrder = {
      id: newOrderId,
      customer_name: customerDetails.fullName,
      customer_phone: customerDetails.phone,
      customer_email: customerDetails.email,
      customer_address: customerDetails.address,
      payment_method: customerDetails.paymentMethod,
      delivery_method: customerDetails.deliveryMethod,
      items: cart, 
      total_amount: cartTotal,
      status: 'Processing',
      created_at: new Date().toISOString()
    };

    try {
      // 1. Save to Supabase
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) throw error;
      
      // 2. TRIGGER EMAIL (Fire and forget - don't block the UI if this fails)
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            order: newOrder,
            customer_email: customerDetails.email 
        })
      }).catch(err => console.error("Email failed to send:", err));

      // 3. Success
      clearCart(); 
      return { success: true, order: newOrder };

    } catch (error) {
      console.error('Order Placement Error:', error);
      return { error: error.message };
    }
  };

  const value = {
    cart,
    cartTotal,
    cartCount, 
    addToCart,
    removeFromCart,
    updateQuantity,
    placeOrder,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};