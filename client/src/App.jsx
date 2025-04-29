import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage.jsx';
import ProductPage from './components/ProductPage/ProductPage.jsx';
import ProductInfoPage from './components/ProductInfoPage/ProductInfoPage.jsx';

function App() {
  const [userName, setUserName] = useState(null); 
  const [cart, setCart] = useState([]); 

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = Math.min(existing.quantity + quantity, 50);
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: Math.min(quantity, 50) }];
      }
    });
    // printCart won't print the last product added to the cart for some reason
    printCart();
  };
  
  const printCart = () => {
    console.log('Cart Contents:');
    if (cart.length === 0) {
      console.log('The cart is empty.');
      return;
    }
    cart.forEach(item => {
      console.log(`- ${item.title} (ID: ${item.id}): Quantity = ${item.quantity}, Price per item = $${item.price}`);
    });
  };

  const handleLogin = (username) => {
    console.log(`[App.jsx]: user ${userName} logging in`);
    setUserName(username);
  };

  const handleLogout = () => {
    setUserName(null);
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !userName ? (
            <AuthPage onLogin={handleLogin} />
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
      <Route
        path="/"
        element={
          userName ? (
            <ProductPage userName={userName} onLogout={handleLogout} cart={cart} addToCart={addToCart}/>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/product/:productId"
        element={
          userName ? (
            <ProductInfoPage userName={userName} onLogout={handleLogout} cart={cart} addToCart={addToCart}/>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to={userName ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;
