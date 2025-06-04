import React, { useState, useEffect } from 'react';
import { LockIcon, MailIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../store/authSlice';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      dispatch(setCredentials({ user, token }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    }
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
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
              Connexion
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Connectez-vous à votre compte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
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
        </div>
      </div>
    </div>
  );
};

export default LoginPage;