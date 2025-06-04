import React, { useState, useEffect } from 'react';
import { LockIcon, MailIcon } from 'lucide-react';
import axios from 'axios';

// Imports for Google Sign-In
// The '@react-oauth/google' package is essential for this functionality.
// If the preview environment cannot resolve this package (as indicated by compilation errors),
// Google Sign-In will not work in the preview. However, the code structure below
// demonstrates the correct usage for a project where this package is properly installed and configured.
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

// --- Mocks for functionalities not available in this single-file preview ---
const useNavigate = () => {
  return (path) => console.log(`Mock navigate to: ${path}`);
};

const useDispatch = () => {
  return (action) => console.log('Mock dispatch:', action);
};

const useSelector = (selector) => {
  // Mock a basic auth state, assuming no token initially.
  return selector({ auth: { token: null, user: null } }); 
};

const setCredentials = (credentials) => {
  return { type: 'MOCK_SET_CREDENTIALS', payload: credentials };
};
// --- End Mocks ---

const LoginPageContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); 
  const dispatch = useDispatch(); 
  const { token: authToken } = useSelector((state) => state.auth); 

  useEffect(() => {
    // This effect attempts to redirect if a token is found (e.g., after login).
    // In the mocked environment, `authToken` won't update post-dispatch,
    // so this navigation won't trigger automatically from state change here.
    if (authToken) {
      console.log('Auth token found (mocked), would navigate to /dashboard in a real app.');
      navigate('/dashboard'); 
    }
  }, [authToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const baseUrl = process.env.REACT_APP_BASE_URL || "https://api.example.com"; 
      const response = await axios.post(`${baseUrl}/user/login`, { 
        email,
        password
      });
      console.log("Login response:", response.data);
      const { token, user } = response.data;

      dispatch(setCredentials({ user, token })); 
      console.log("Login successful, attempting to navigate to /dashboard.");
      navigate('/dashboard'); 

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
  // We attempt to use `useGoogleLogin` here. If '@react-oauth/google' could not be resolved
  // at compile time, this hook will not be available, and `triggerGoogleLogin` will likely fail.
  let googleLoginFlow = () => { // Default to a no-op if useGoogleLogin is not available
    console.error("useGoogleLogin hook is not available. Google Sign-In cannot be initiated.");
    setError("Le module de connexion Google n'a pas pu être chargé.");
  };

  try {
    // This assignment will only work if useGoogleLogin was successfully imported.
    // If the import failed, this line might not execute or `useGoogleLogin` would be undefined.
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
                navigate('/dashboard'); 

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
    // This catch block is for errors during the setup of useGoogleLogin itself,
    // which might occur if the library is partially loaded or fails in an unexpected way.
    console.error("Error initializing useGoogleLogin:", e);
    // The `googleLoginFlow` remains the no-op function.
  }


  const triggerGoogleLogin = () => {
    if (isLoading) return;
    console.log("Attempting to trigger Google Login");
    // `googleLoginFlow` will either be the actual Google login function or the no-op error handler.
    googleLoginFlow(); 
  };

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
              <a href="#" onClick={(e) => {e.preventDefault(); console.log("Register link clicked!");}} className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
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

// Main component that provides the GoogleOAuthProvider
const App = () => { 
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER"; 

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --color-primary-50: #eff6ff; --color-primary-100: #dbeafe; --color-primary-200: #bfdbfe;
        --color-primary-300: #93c5fd; --color-primary-400: #60a5fa; --color-primary-500: #3b82f6; /* Tailwind Blue 500 */
        --color-primary-600: #2563eb; --color-primary-700: #1d4ed8; --color-primary-800: #1e40af;
        --color-primary-900: #1e3a8a;
      }
      body { font-family: 'Inter', sans-serif; }
      .text-primary-600 { color: var(--color-primary-600) !important; }
      .hover\\:text-primary-500:hover { color: var(--color-primary-500) !important; }
      .dark .dark\\:text-primary-400 { color: var(--color-primary-400) !important; }
      .dark .dark\\:hover\\:text-primary-300:hover { color: var(--color-primary-300) !important; }
      .bg-primary-600 { background-color: var(--color-primary-600) !important; }
      .hover\\:bg-primary-700:hover { background-color: var(--color-primary-700) !important; }
      .focus\\:ring-primary-500:focus { --tw-ring-color: var(--color-primary-500) !important; box-shadow: 0 0 0 2px var(--tw-ring-color) !important; }
      .dark .dark\\:focus\\:ring-primary-400:focus { --tw-ring-color: var(--color-primary-400) !important; box-shadow: 0 0 0 2px var(--tw-ring-color) !important; }
    `;
    document.head.appendChild(style);

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    return () => {
      document.head.removeChild(style);
      if (fontLink) document.head.removeChild(fontLink);
    };
  }, []);

  const isGoogleClientConfigured = googleClientId && googleClientId !== "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER";

  // It's crucial that GoogleOAuthProvider is rendered if Google Sign-In is to be attempted.
  // If the client ID is missing/invalid, the provider itself might handle this or show an error.
  // If the @react-oauth/google package itself is not resolved, then GoogleOAuthProvider and useGoogleLogin will not be available.
  if (!isGoogleClientConfigured) {
    console.warn("REACT_APP_GOOGLE_CLIENT_ID is not defined or is a placeholder. Google Sign-In functionality will be impaired or non-functional.");
    // Render a clear message to the user about the configuration issue.
    // LoginPageContent is rendered below so the user can still see the email/password form.
    // The Google button will be visible but likely non-functional if the provider/hook isn't properly initialized.
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 font-sans">
            <div className="p-8 bg-white dark:bg-gray-800 shadow-2xl rounded-xl text-center max-w-lg">
                <MailIcon className="h-16 w-16 text-primary-500 mx-auto mb-6"/>
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Erreur de Configuration Google</h1>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                    L'identifiant client Google (<code>REACT_APP_GOOGLE_CLIENT_ID</code>) est manquant ou invalide.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    La connexion avec Google ne pourra pas être initialisée correctement. Veuillez vérifier la configuration.
                </p>
                 <div className="mt-8 border-t dark:border-gray-700 pt-8 opacity-80"> 
                    <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                      (Le formulaire de connexion est affiché ci-dessous. La fonctionnalité Google sera inactive si le module Google n'a pas pu être chargé ou configuré.)
                    </p>
                    <LoginPageContent /> 
                </div>
            </div>
        </div>
    );
  }
  
  // If Google Client ID is configured, wrap LoginPageContent with GoogleOAuthProvider.
  // This is necessary for `useGoogleLogin` within LoginPageContent to function.
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <LoginPageContent />
    </GoogleOAuthProvider>
  );
};

export default App;
