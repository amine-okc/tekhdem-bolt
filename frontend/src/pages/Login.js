import React, { useState, useEffect } from 'react';
import { LockIcon, MailIcon } from 'lucide-react';
import googleOneTap from 'google-one-tap';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Initialize Google One Tap with the package
    const options = {
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID, // Replace with your actual client ID
      auto_select: true,
      cancel_on_tap_outside: false,
      context: 'signin',
      callback: handleGoogleOneTapResponse
    };

    // Start Google One Tap
    googleOneTap(options);

    // Clean up
    return () => {
      // The google-one-tap package doesn't provide a direct cleanup method,
      // but we can remove the Google One Tap container if present
      const googleOneTapContainer = document.getElementById('credential_picker_container');
      if (googleOneTapContainer) {
        googleOneTapContainer.remove();
      }
    };
  });

  const handleGoogleOneTapResponse = (response) => {
    // Handle the Google One Tap response
    console.log('Google One Tap response:', response);
    
    // You would typically send this credential to your backend
    // for verification and to complete the authentication process
    const credential = response.credential;
    
    // For demonstration purposes, we'll just log the user in
    // with some basic information from the JWT payload
    try {
      const decodedToken = JSON.parse(atob(credential.split('.')[1]));
      setUser({
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture
      });
      console.log(user);
    } catch (error) {
      console.error('Error decoding Google token:', error);
    }
  };

  const handleGoogleLogin = () => {
    // This function can be used to trigger Google One Tap manually if needed
    // The package will typically handle the display automatically based on the options
    console.log('Attempting to trigger Google login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log('Login attempt', { email, password });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Image Section - Hidden on smaller screens */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative" 
           style={{
             backgroundImage: `url("/api/placeholder/1600/900?text=Professional+Networking")`,
             backgroundPosition: 'center',
             backgroundSize: 'cover'
           }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute bottom-10 left-10 text-white p-6">
          <h2 className="text-3xl font-bold mb-4">Bienvenue</h2>
          <p className="text-xl max-w-md">
            Connectez-vous pour accéder à votre réseau professionnel et découvrir de nouvelles opportunités.
          </p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {user ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="h-16 w-16 rounded-full"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bienvenue, {user.name}!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Vous êtes connecté avec {user.email}
              </p>
              <button
                onClick={() => setUser(null)}
                className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm 
                           text-white bg-primary-400 hover:bg-primary-500 focus:outline-none 
                           focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                           transition-colors duration-300"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                  Connexion
                </h1>
                <p className="text-center text-gray-600 dark:text-gray-400">
                  Connectez-vous à votre compte
                </p>
              </div>

              {/* Google Sign In Button */}
              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-gray-300 
                           dark:border-gray-600 rounded-lg shadow-sm text-gray-700 dark:text-white 
                           bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                           focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                           transition-colors duration-300"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20">
                    <path d="M10 2C5.58 2 2 5.58 2 10C2 14.42 5.58 18 10 18C14.42 18 18 14.42 18 10C18 5.58 14.42 2 10 2ZM14.7 11H10V14.7H8V11H4.3V9H8V5.3H10V9H14.7V11Z" 
                          fill="#EA4335" />
                  </svg>
                  Se connecter avec Google
                </button>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    ou
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="votre@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Votre mot de passe"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 peer-checked:border-primary-600  border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="/forgot-password" className="font-medium text-primary-400 hover:text-primary-500 dark:text-primary-500">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm 
                             text-white bg-primary-400 hover:bg-primary-500 focus:outline-none 
                             focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                             transition-colors duration-300"
                >
                  Se connecter
                </button>
              </form>

              {/* Mobile Image for smaller screens */}
              <div className="lg:hidden text-center mt-6">
                <div 
                  className="h-48 w-full bg-cover bg-center rounded-lg mb-4"
                  style={{
                    backgroundImage: `url("/api/placeholder/800/400?text=Professional+Network")`,
                  }}
                />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Vous êtes un recruteur ?{' '}
                  <a 
                    href="/recruiter-platform" 
                    className="font-medium text-primary-400 hover:text-primary-500 dark:text-primary-500"
                  >
                    Accédez à la plateforme recruteur
                  </a>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pas de compte ?{' '}
                  <a 
                    href="/register" 
                    className="font-medium text-primary-400 hover:text-primary-500 dark:text-primary-500"
                  >
                    Inscrivez-vous
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;