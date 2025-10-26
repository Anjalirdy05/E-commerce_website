import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster as SonnerToaster } from "sonner";

// ✅ Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";

// ✅ Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ChatBot from "./components/ChatBot";

// ✅ Styles
import "./App.css";

// ✅ Re-export the Sonner Toaster for use elsewhere if needed
export const Toaster = SonnerToaster;

// Frontend-only build: no backend URL or API constants needed

// ✅ Create a global context
export const AuthContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }
  }, [token]);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/auth" />;
  };

  const AdminRoute = ({ children }) => {
    return token && user?.is_admin ? children : <Navigate to="/" />;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="/auth" element={<Auth />} />
          </Routes>
          <Footer />
          {token && <ChatBot />}
          <Toaster position="top-center" />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
