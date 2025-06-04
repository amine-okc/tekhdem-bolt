


// routes/index.js - Example of how to integrate protected routes
import React from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Import your page components
import Home from '../pages/Home';
import JobOffersList from '../pages/JobOffers/List';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pages/Dashboard';

const routes = [
  // Public routes
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  
  // Protected routes - these require authentication
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },

  // {
  //   path: '/profile',
  //   element: (
  //     <ProtectedRoute>
  //       <Profile />
  //     </ProtectedRoute>
  //   )
  // },
  // {
  //   path: '/settings',
  //   element: (
  //     <ProtectedRoute>
  //       <Settings />
  //     </ProtectedRoute>
  //   )
  // },
  
  // You can also create admin-only routes
  // {
  //   path: '/admin',
  //   element: (
  //     <ProtectedRoute>
  //       <AdminDashboard />
  //     </ProtectedRoute>
  //   )
  // }
];

export default routes;