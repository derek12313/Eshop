import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage/AuthPage.jsx';
import ProductPage from './components/ProductPage/ProductPage.jsx';

function App() {
  const [userName, setUserName] = useState(null); 

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
            <ProductPage userName={userName} onLogout={handleLogout} />
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
