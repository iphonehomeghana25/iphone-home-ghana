import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext'; // <--- IMPORT CONTEXT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap the entire app in the ShopProvider */}
    <ShopProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ShopProvider>
  </React.StrictMode>
);