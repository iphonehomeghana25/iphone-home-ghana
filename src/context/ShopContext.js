import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

// 1. Create the Context
const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

// 2. Create the Provider
export const ShopProvider = ({ children }) => {
  // INITIALIZE CART from LocalStorage if available
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('iphone_home_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // SAVE TO LOCALSTORAGE whenever cart changes
  useEffect(() => {
    localStorage.setItem('iphone_home_cart', JSON.stringify(cart));
  }, [cart]);

  // --- Cart Management Functions ---

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
      return prevCart
        .map(item => {
          if (item.id === productId) {
            const newQuantity = item.quantity + amount;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null; 
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  // Clear cart (useful after order placement)
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('iphone_home_cart');
  };

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // --- Checkout Logic ---

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
      delivery_method: customerDetails.deliveryMethod, // Added this field
      items: cart, 
      total_amount: cartTotal,
      status: 'Processing',
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) throw error;
      
      clearCart(); // Clear cart on success
      return { success: true, order: newOrder };

    } catch (error) {
      console.error('Order Placement Error:', error);
      return { error: error.message };
    }
  };

  const value = {
    cart,
    cartTotal,
    cartCount, // This drives the badge
    addToCart,
    removeFromCart,
    updateQuantity,
    placeOrder,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};