// utils/axiosInterceptor.js
import axios from 'axios';
import { store } from '../store/index';
import { forceLogout, verifyAuth, setCredentials } from '../store/authSlice';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
          token: store.getState().auth.token
        });

        if (refreshResponse.data.token) {
          const newToken = refreshResponse.data.token;
          store.dispatch(setCredentials({
            user: refreshResponse.data.user || store.getState().auth.user,
            token: newToken
          }));
          
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Force logout if refresh fails
        store.dispatch(forceLogout({ 
          reason: 'Session expired. Please log in again.' 
        }));
        
        // Redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other auth-related errors
    if (error.response?.status === 403) {
      const errorMessage = error.response.data?.message || 'Access forbidden';
      
      if (errorMessage.includes('user not found') || errorMessage.includes('deleted')) {
        store.dispatch(forceLogout({ 
          reason: 'Account no longer exists' 
        }));
        window.location.href = '/login';
      } else if (errorMessage.includes('suspended') || errorMessage.includes('banned')) {
        store.dispatch(forceLogout({ 
          reason: 'Account has been suspended' 
        }));
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Setup periodic token validation
export const setupTokenValidation = () => {
  let validationInterval;
  
  const startValidation = () => {
    // Clear existing interval
    if (validationInterval) {
      clearInterval(validationInterval);
    }
    
    // Validate token every 10 minutes
    validationInterval = setInterval(() => {
      const state = store.getState();
      if (state.auth.isAuthenticated) {
        store.dispatch(verifyAuth());
      } else {
        clearInterval(validationInterval);
      }
    }, 10 * 60 * 1000);
  };

  // Start validation when user is authenticated
  const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    if (state.auth.isAuthenticated && !validationInterval) {
      startValidation();
    } else if (!state.auth.isAuthenticated && validationInterval) {
      clearInterval(validationInterval);
      validationInterval = null;
    }
  });

  return unsubscribe;
};

export default axios;