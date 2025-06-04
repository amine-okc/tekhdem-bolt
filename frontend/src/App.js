// App.js - Adapted to your existing structure
import React, { useEffect } from "react";
import "@fontsource/ubuntu";
import "./App.css";
import NavBar from "./components/guest/NavBar";
import Footer from "./components/guest/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/index";
import { useDispatch, useSelector } from 'react-redux';
import { logout, initializeSocket, verifyAuth } from './store/authSlice';
import { setupTokenValidation } from './utils/axiosInterceptor';
import axios from 'axios';
import { SocketProvider } from "./context/SocketContext";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, error, user } = useSelector(state => state.auth);
  
  // Initialize enhanced auth system
  useEffect(() => {
    let cleanup;
    let tokenVerificationInterval;

    // Setup axios interceptors
    cleanup = setupTokenValidation();
    
    // If user is authenticated, initialize real-time features
    if (isAuthenticated && token) {
      // Initialize WebSocket connection
      dispatch(initializeSocket());
      
      // Start periodic token verification (every 5 minutes)
      tokenVerificationInterval = setInterval(() => {
        dispatch(verifyAuth());
      }, 5 * 60 * 1000);
      
      // Verify token immediately
      dispatch(verifyAuth());
    }

    return () => {
      if (cleanup) cleanup();
      if (tokenVerificationInterval) {
        clearInterval(tokenVerificationInterval);
      }
    };
  }, [isAuthenticated, token, dispatch]);

  // Enhanced logout handler
  const handleLogout = async () => {
    try {
      // Notify backend about logout if token exists
      if (token) {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Clear localStorage first
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      
      // Dispatch Redux action (this will also disconnect WebSocket)
      dispatch(logout());
    }
  };

  // Show auth error overlay if there's an authentication error
  const AuthErrorOverlay = () => {
    if (!error) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            Authentication Error
          </h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  };

  return (
    <SocketProvider>
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar 
          className="shrink-0" 
          onLogout={handleLogout}
          user={user}
          isAuthenticated={isAuthenticated}
        />
        <main className="flex-1 pt-16">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
        <Footer className="shrink-0" />
        <AuthErrorOverlay />
      </div>
    </Router>
    </SocketProvider>
  );
}

export default App;