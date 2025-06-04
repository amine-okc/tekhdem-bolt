import React, { useState, useEffect } from 'react';
import { LockIcon, MailIcon, UserIcon } from 'lucide-react';
import axios from 'axios';
import { authSlice, setCredentials } from '../store/authSlice'; // Adjust the import path as needed
// Imports for Google Sign-In
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// Imports for React Router
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



// --- Minimal Redux Slice (authSlice.js content) ---
const initialAuthState = {
  user: null,
  token: null,
};





const RegisterPageContent = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Real useNavigate
  const dispatch = useDispatch(); // Real useDispatch

  // Example of how you might use useSelector if needed:
  // const { user: currentUser } = useSelector((state) => state.auth);
  // useEffect(() => {
  //   if (currentUser) {
  //     console.log("Current user from Redux store:", currentUser);
  //   }
  // }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      console.log("Attempting registration with formData:", formData);
      const registerResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/candidate/register`, formData);
      console.log("Registration response:", registerResponse);
      
      if (registerResponse.data.token && registerResponse.data.user) {
        const { token, user } = registerResponse.data;
        dispatch(setCredentials({ user, token }));
        navigate('/dashboard');
      } else {
        console.log("Registration didn't return token, attempting login fallback");
        const loginResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, {
          email: formData.email,
          password: formData.password
        });
        console.log("Login fallback response:", loginResponse);
        const { token, user } = loginResponse.data;
        dispatch(setCredentials({ user, token }));
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Registration/Login Error:", err);
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (tokenResponse) => {
    setError('');
    setIsLoading(true);
    console.log("Google login success, tokenResponse:", tokenResponse);
    try {
      const backendResponse = await axios.post(`${process.env.REACT_APP_BASE_URL}/candidate/auth/google-signup`, {
        googleAccessToken: tokenResponse.access_token,
      });
      console.log("Backend response to Google Sign-In:", backendResponse);

      const { token, user } = backendResponse.data;
      dispatch(setCredentials({ user, token }));
      navigate('/dashboard');

    } catch (err) {
      console.error("Google Sign-In Backend Error:", err);
      setError(err.response?.data?.error || 'Une erreur est survenue lors de l\'inscription avec Google.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = (errorResponse) => {
    console.error("Google login failed directly:", errorResponse);
    setError('Échec de la connexion avec Google. Veuillez réessayer.');
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
  });

  const triggerGoogleSignUp = () => {
    if (isLoading) return;
    console.log("Triggering Google Sign-Up");
    googleLogin();
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans"> {/* Added font-sans for Inter */}
      {/* Image Section */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative"
           style={{
             backgroundImage: `url("https://placehold.co/800x1000/6366f1/white?text=Join+Us&font=inter")`, // Placeholder image
             backgroundPosition: 'center',
             backgroundSize: 'cover'
           }}
      >
        <div className="absolute inset-0 bg-black opacity-30 dark:opacity-50"></div> {/* Adjusted opacity */}
        <div className="absolute bottom-10 left-10 text-white p-6 rounded-lg bg-black bg-opacity-40"> {/* Added subtle background to text */}
          <h2 className="text-3xl font-bold mb-4">Rejoignez-nous</h2>
          <p className="text-xl max-w-md">
            Créez votre profil et connectez-vous avec des professionnels du monde entier pour développer votre carrière.
          </p>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Inscription
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Créez votre compte en quelques étapes
            </p>
          </div>

          {/* Google Sign-up Button */}
          <div>
            <button
              type="button"
              onClick={triggerGoogleSignUp}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg
                        text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700
                        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md" // Added shadow
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
              </svg>
              S'inscrire avec Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-md">ou</span> {/* Rounded ou */}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert"> {/* Improved alert styling */}
                <p className="font-bold">Erreur</p>
                <p>{error}</p>
              </div>
            )}
             
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required disabled={isLoading}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    placeholder="Prénom"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required disabled={isLoading}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    placeholder="Nom"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password" id="password" name="password" value={formData.password} onChange={handleChange} required disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Minimum 8 caractères"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms" type="checkbox" required disabled={isLoading}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                J'accepte les{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Navigating to Terms & Conditions page (mock)");}} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  termes et conditions
                </a>
                {' '}et la{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Navigating to Privacy Policy page (mock)");}} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  politique de confidentialité
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {formData.email ? 'Inscription en cours...' : 'Connexion Google en cours...'}
                </>
              ) : (
                "S'inscrire"
              )}
            </button>
          </form>
           <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Déjà un compte?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); alert("Navigating to Login page (mock)"); navigate('/login'); }} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

const RegisterPage = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <RegisterPageContent />
    </GoogleOAuthProvider>
  );
};




// Main component that provides the GoogleOAuthProvider, Redux Provider, and Router

export default RegisterPage;

