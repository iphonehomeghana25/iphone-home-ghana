import React, { createContext, useState, useContext } from 'react';
import { supabase } from '../lib/supabaseClient';

// 1. Create the Context
const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

// 2. Create the Provider (The wrapper for the whole app)
export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // --- Cart Management Functions ---

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // Increase quantity if item already exists
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Add new item to cart
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, amount) => {
    setCart(prevCart => {
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            // Remove item if quantity drops to 0
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null; 
          }
          return item;
        })
        .filter(Boolean); // Removes null items (quantity 0)
    });
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // --- Checkout and Order Placement ---

  const placeOrder = async (customerDetails, resetCart) => {
    if (cart.length === 0) return { error: 'Cart is empty.' };

    const newOrderId = `IHG-${Math.floor(Math.random() * 90000) + 10000}`; // Generate ID like IHG-12345
    
    const newOrder = {
      id: newOrderId,
      customer_name: customerDetails.fullName,
      customer_phone: customerDetails.phone,
      customer_email: customerDetails.email, // Required for future email receipt
      customer_address: customerDetails.address,
      payment_method: customerDetails.paymentMethod,
      items: cart, // The cart contents (saved as JSONB in Supabase)
      total_amount: cartTotal,
      status: 'Processing',
      created_at: new Date().toISOString()
    };

    try {
      // 1. Save order to Supabase
      const { error } = await supabase
        .from('orders')
        .insert([newOrder]);

      if (error) throw error;
      
      // 2. Clear the local cart
      resetCart(); 

      // NOTE: Email sending logic will go here later
      
      return { success: true, order: newOrder };

    } catch (error) {
      console.error('Order Placement Error:', error);
      return { error: error.message };
    }
  };

  const value = {
    cart,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    placeOrder,
    cartCount: cart.reduce((count, item) => count + item.quantity, 0),
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};