import Home from '../pages/Home';
import JobOffersList from '../pages/JobOffers/List';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../components/PrivateRoute';
import Dashboard from '../pages/Dashboard';

const routes = [
  { path: '/', element: <Home /> },
  { path: '/job-offers', element: <JobOffersList /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { 
    path: '/dashboard', 
    element: <PrivateRoute><Dashboard /></PrivateRoute>
  }
];

export default routes;