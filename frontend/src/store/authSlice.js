// store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { io } from 'socket.io-client';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!(localStorage.getItem('token') && localStorage.getItem('user')),
  loading: false,
  error: null,
  socket: null,
  isConnected: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },
    logout: (state) => {
      // Disconnect socket before logout
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isConnected = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    forceLogout: (state, action) => {
      // Force logout with reason
      state.error = action.payload?.reason || 'Session expired';
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isConnected = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  setCredentials, 
  logout, 
  setSocket, 
  setConnectionStatus, 
  forceLogout, 
  setLoading, 
  setError, 
  clearError 
} = authSlice.actions;

// Initialize WebSocket connection
export const initializeSocket = () => (dispatch, getState) => {
  const { auth } = getState();
  
  if (!auth.token || auth.socket) return;

  const socket = io(process.env.REACT_APP_WEBSOCKET_URL || process.env.REACT_APP_BASE_URL, {
    auth: {
      token: auth.token
    },
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    dispatch(setConnectionStatus(true));
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    dispatch(setConnectionStatus(false));
  });

  // Listen for auth-related events
  socket.on('auth:logout', (data) => {
    console.log('Forced logout:', data.reason);
    dispatch(forceLogout({ reason: data.reason }));
    // Redirect to login
    window.location.href = '/login';
  });

  socket.on('auth:token-invalid', () => {
    console.log('Token invalidated');
    dispatch(forceLogout({ reason: 'Token expired or invalid' }));
    window.location.href = '/login';
  });

  socket.on('user:deleted', () => {
    console.log('User account deleted');
    dispatch(forceLogout({ reason: 'Account has been deleted' }));
    window.location.href = '/login';
  });

  socket.on('user:suspended', (data) => {
    console.log('User account suspended');
    dispatch(forceLogout({ reason: `Account suspended: ${data.reason}` }));
    window.location.href = '/login';
  });

  dispatch(setSocket(socket));
};

// Enhanced token verification with retry logic
export const verifyAuth = () => async (dispatch, getState) => {
  const { auth } = getState();
  
  if (!auth.token) {
    dispatch(logout());
    return;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/verify-token`, {
      timeout: 5000 // 5 second timeout
    });
    
    if (!response.data.valid) {
      dispatch(forceLogout({ reason: 'Token expired' }));
      window.location.href = '/login';
    } else {
      // Initialize socket if not already connected
      if (!auth.socket && auth.isAuthenticated) {
        dispatch(initializeSocket());
      }
    }
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error.response?.status === 401 || error.response?.status === 403) {
      dispatch(forceLogout({ reason: 'Authentication failed' }));
      window.location.href = '/login';
    }
  }
};

// Periodic token verification
export const startTokenVerification = () => (dispatch) => {
  // Verify immediately
  dispatch(verifyAuth());
  
  // Then verify every 5 minutes
  const interval = setInterval(() => {
    dispatch(verifyAuth());
  }, 5 * 60 * 1000);
  
  return interval;
};

export default authSlice.reducer;