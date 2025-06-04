// hooks/useAuth.js
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  initializeSocket, 
  verifyAuth, 
  startTokenVerification,
  logout 
} from '../store/authSlice';
import axios from 'axios';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  // Initialize authentication system
  useEffect(() => {
    let tokenVerificationInterval;

    if (auth.isAuthenticated && auth.token) {
      // Initialize WebSocket connection
      dispatch(initializeSocket());
      
      // Start token verification
      tokenVerificationInterval = dispatch(startTokenVerification());
    }

    return () => {
      if (tokenVerificationInterval) {
        clearInterval(tokenVerificationInterval);
      }
    };
  }, [auth.isAuthenticated, auth.token, dispatch]);

  // Handle authentication state changes
  useEffect(() => {
    if (!auth.isAuthenticated && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [auth.isAuthenticated, navigate]);

  // Manual logout function
  const handleLogout = useCallback(async () => {
    try {
      // Notify backend about logout
      if (auth.token) {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      dispatch(logout());
      navigate('/login');
    }
  }, [auth.token, dispatch, navigate]);

  // Check if user session is still valid
  const checkAuthStatus = useCallback(async () => {
    if (auth.token) {
      dispatch(verifyAuth());
    }
  }, [auth.token, dispatch]);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    isConnected: auth.isConnected,
    logout: handleLogout,
    checkAuthStatus
  };
};

// Higher-order component for protected routes
export const withAuth = (WrappedComponent) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null; // useAuth hook will handle redirect
    }

    return <WrappedComponent {...props} />;
  };
};