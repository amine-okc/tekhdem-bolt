import React, { useState, useEffect } from 'react';
import { LockIcon, MailIcon } from 'lucide-react';
import axios from 'axios';
import { authSlice, setCredentials } from '../store/authSlice'; // Adjust the import path as necessary

// Imports for Redux
import { useDispatch, useSelector } from 'react-redux';

// Imports for React Router
import { BrowserRouter, useNavigate, Routes, Route, Link } from 'react-router-dom';

// Imports for Google Sign-In
// The '@react-oauth/google' package is essential for this functionality.
// If the preview environment cannot resolve this package (as indicated by compilation errors),
// Google Sign-In will not work in the preview. However, the code structure below
// demonstrates the correct usage for a project where this package is properly installed and configured.
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';






const LoginPageContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Using actual hooks
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
  const { token: authToken, user: authUser } = useSelector((state) => state.auth); 

  useEffect(() => {
    // Redirect if already logged in
    if (authToken && authUser) {
      navigate('/dashboard'); 
    }
  }, [authToken, authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Fallback for REACT_APP_BASE_URL if not set in environment
      const baseUrl = process.env.REACT_APP_BASE_URL || "https://api.example.com"; 
      const response = await axios.post(`${baseUrl}/user/login`, { 
        email,
        password
      });
      const { token, user } = response.data;

      // Dispatch action to set credentials in Redux store
      dispatch(setCredentials({ user, token })); 

    } catch (err) {
      console.error("Login error:", err);
      if (err.isAxiosError && !err.response) {
         setError('Impossible de joindre le serveur. Veuillez vérifier votre connexion.');
      } else {
         setError(err.response?.data?.error || 'Une erreur est survenue lors de la connexion.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In Logic
  let googleLoginFlow = () => { 
    console.error("useGoogleLogin hook is not available or not initialized. Google Sign-In cannot be initiated.");
    setError("Le module de connexion Google n'a pas pu être chargé ou initialisé.");
  };

  try {
    // This assignment will only work if useGoogleLogin was successfully imported.
    const actualUseGoogleLogin = useGoogleLogin; 
    if (typeof actualUseGoogleLogin === 'function') {
        googleLoginFlow = actualUseGoogleLogin({
            onSuccess: async (tokenResponse) => {
              setError('');
              setIsLoading(true);
              console.log("Google login success, tokenResponse:", tokenResponse);
              try {
                const baseUrl = process.env.REACT_APP_BASE_URL || "https://api.example.com"; 
                const backendResponse = await axios.post(`${baseUrl}/user/auth/google-signin`, { 
                  googleAccessToken: tokenResponse.access_token,
                });
                console.log("Backend response to Google Sign-In:", backendResponse.data);

                const { token, user } = backendResponse.data;
                
                dispatch(setCredentials({ user, token })); 
                console.log("Google login successful, attempting to navigate to /dashboard.");
                // Navigation will be handled by useEffect
              } catch (err) {
                console.error("Google Sign-In Backend Error:", err);
                if (err.isAxiosError && !err.response) {
                   setError('Impossible de joindre le serveur pour la connexion Google.');
                } else {
                   setError(err.response?.data?.error || 'Une erreur est survenue lors de la connexion avec Google.');
                }
              } finally {
                setIsLoading(false);
              }
            },
            onError: (errorResponse) => {
              console.error("Google login failed directly:", errorResponse);
              setError('Échec de la connexion avec Google. Veuillez réessayer.');
              setIsLoading(false); 
            },
          });
    }
  } catch (e) {
    console.error("Error initializing useGoogleLogin:", e);
  }


  const triggerGoogleLogin = () => {
    if (isLoading) return;
    console.log("Attempting to trigger Google Login");
    googleLoginFlow(); 
  };

  // If already authenticated, show a message or redirect (useEffect handles redirect)
  if (authToken && authUser) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 p-6 font-sans">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-2xl text-center max-w-md w-full">
                <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">Déjà connecté</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Vous êtes déjà connecté en tant que {authUser.email}. Redirection vers le tableau de bord...
                </p>
                <svg className="animate-spin h-8 w-8 text-primary-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row font-sans">
      {/* Image Section */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" 
           style={{
             backgroundImage: `url("https://placehold.co/800x1000/3b82f6/white?text=Bienvenue&font=inter")`, 
             backgroundPosition: 'center',
             backgroundSize: 'cover'
           }}
      >
        <div className="absolute inset-0 bg-black opacity-40 dark:opacity-60"></div>
        <div className="absolute bottom-10 left-10 text-white p-6 rounded-lg bg-black bg-opacity-40">
          <h2 className="text-3xl font-bold mb-4">Bienvenue</h2>
          <p className="text-xl max-w-md">
            Connectez-vous pour accéder à votre réseau professionnel et découvrir de nouvelles opportunités.
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Connexion
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Google Login Button */}
          <div>
            <button
              type="button"
              onClick={triggerGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg
                        text-gray-700 dark:text-white bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700
                        focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-colors duration-300
                        disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
              </svg>
              Se connecter avec Google
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 rounded-md">ou</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Erreur</p>
                <p>{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="email" id="email-input" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  type="password" id="password-input" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me" type="checkbox" disabled={isLoading}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-sm">
                <a href="#" onClick={(e) => {e.preventDefault(); console.log("Forgot password link clicked!");}} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                  Mot de passe oublié ?
                </a>
              </div>
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
                  Connexion en cours...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          <div className="text-center space-y-2">
             <p className="text-sm text-gray-600 dark:text-gray-400">
              Pas de compte ?{' '}
              <a href="#" onClick={(e) => {e.preventDefault(); navigate('/register')}} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Inscrivez-vous
              </a>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Vous êtes un recruteur ?{' '}
              <a href="#" onClick={(e) => {e.preventDefault(); console.log("Recruiter platform link clicked!");}} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                Accédez à la plateforme recruteur
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
};


export default LoginPage;


