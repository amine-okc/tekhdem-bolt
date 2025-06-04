import Home from '../pages/Home';
import JobOffersList from '../pages/JobOffers/List';
import Login from '../pages/Login'
import Register from '../pages/Register';
import React from 'react'; // Ajoute ceci si ce n'est pas déjà importé

const routes = [
  { path: '/', element: <Home /> }, 
  { path: '/job-offers', element: <JobOffersList /> },
  {path : '/login', element: <Login />},
  {path : '/register', element: <Register />}
];

export default routes;