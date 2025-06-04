import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import {
    FaSun,
    FaMoon,
    FaBriefcase,
    FaUserTie,
    FaClipboardList,
    FaHome,
    FaBars,
    FaTimes,
    FaSignOutAlt,
    FaUser,
    FaCog,
    FaChevronDown,
} from 'react-icons/fa';

const NavBar = ({ onLogout }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    // Get authentication state from Redux store
    const { user, token, loading, error } = useSelector((state) => state.auth);
    const isAuthenticated = !!token && !!user; // Derive authentication status

    // Navigation items that change based on authentication status
    const getNavItems = () => {
        const publicItems = [
            {
                title: 'Accueil',
                path: '/',
                icon: <FaHome className="mr-3 text-lg" />,
                description: 'Page principale',
                public: true
            },
            {
                title: 'Offres',
                path: '/job-offers',
                icon: <FaBriefcase className="mr-3 text-lg" />,
                description: 'Découvrez nos offres d\'emploi',
                public: true
            },
            {
                title: 'Services',
                path: '/services',
                icon: <FaClipboardList className="mr-3 text-lg" />,
                description: 'Nos services professionnels',
                public: true
            }
        ];

        const authenticatedItems = [
            ...publicItems,
            {
                title: 'Recruteur',
                path: '/recruiter',
                icon: <FaUserTie className="mr-3 text-lg" />,
                description: 'Espace recruteur',
                public: false,
                requiresAuth: true
            }
        ];

        return isAuthenticated ? authenticatedItems : publicItems;
    };

    // User menu items for authenticated users
    const userMenuItems = [
        {
            title: 'Mon Profil',
            path: '/profile',
            icon: <FaUser className="mr-3 text-sm" />
        },
        {
            title: 'Paramètres',
            path: '/settings',
            icon: <FaCog className="mr-3 text-sm" />
        }
    ];

    useEffect(() => {
        // Theme management
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
        root.style.transition = 'background-color 0.3s ease, color 0.3s ease';

        // Close user menu when clicking outside
        const handleClickOutside = (event) => {
            if (isUserMenuOpen && !event.target.closest('.user-menu-container')) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [theme, isUserMenuOpen]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = async () => {
        try {
            // Close menus first
            setIsUserMenuOpen(false);
            setIsMenuOpen(false);
            
            // Call the logout function passed as prop
            if (onLogout) {
                await onLogout();
            } else {
                // Fallback: dispatch generic logout action
                dispatch({ type: 'auth/logout' });
            }
            
            // Redirect to home page
            navigate('/', { replace: true });
            
        } catch (error) {
            console.error('Logout error:', error);
            // Force reload as fallback
            window.location.href = '/';
        }
    };

    // Safe user display with fallback
    const getUserDisplayName = () => {
        if (!user) return '';
        return user.first_name || user.name || user.email?.split('@')[0] || 'Utilisateur';
    };

    const getUserAvatar = () => {
        if (!user) return '/default-avatar.png';
        return user.avatar || user.profile_picture || '/default-avatar.png';
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Desktop Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link
                            to="/"
                            className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                        >
                            <img 
                                src="/logo.png" 
                                alt="Logo" 
                                className="h-16 w-auto"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'block';
                                }}
                            />
                            <span className="hidden">JobSite</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex space-x-4">
                            {getNavItems().map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 px-3 py-2 rounded-lg transition-colors duration-300"
                                >
                                    {item.icon}
                                    {item.title}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                                aria-label={`Basculer vers le mode ${theme === 'dark' ? 'clair' : 'sombre'}`}
                            >
                                {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
                            </button>

                            <div className="flex space-x-3">
                                {isAuthenticated && user ? (
                                    <div className="relative user-menu-container">
                                        <button
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg transition-colors duration-300"
                                            aria-expanded={isUserMenuOpen}
                                            aria-haspopup="true"
                                        >
                                            <img
                                                src={getUserAvatar()}
                                                alt={`Avatar de ${getUserDisplayName()}`}
                                                className="h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                                onError={(e) => {
                                                    e.target.src = '/default-avatar.png';
                                                }}
                                            />
                                            <span className="text-sm font-medium hidden lg:block">
                                                {getUserDisplayName()}
                                            </span>
                                            <FaChevronDown 
                                                className={`text-xs transition-transform duration-200 ${
                                                    isUserMenuOpen ? 'rotate-180' : ''
                                                }`} 
                                            />
                                        </button>

                                        {/* User Dropdown Menu */}
                                        {isUserMenuOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                        {getUserDisplayName()}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                
                                                {userMenuItems.map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                                                    >
                                                        {item.icon}
                                                        {item.title}
                                                    </Link>
                                                ))}
                                                
                                                <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                                
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                >
                                                    <FaSignOutAlt className="mr-3 text-sm" />
                                                    Déconnexion
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex space-x-3">
                                        <Link
                                            to="/login"
                                            className="px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm transition-colors duration-300"
                                        >
                                            Connexion
                                        </Link>

                                        <Link
                                            to="/register"
                                            className="px-4 py-2 bg-primary-400 text-white hover:bg-primary-500 rounded-lg text-sm transition-colors duration-300 shadow-md hover:shadow-lg"
                                        >
                                            Inscription
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors duration-300"
                            aria-label="Ouvrir le menu"
                        >
                            <FaBars className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Mobile Drawer */}
                    <Dialog 
                        open={isMenuOpen} 
                        onClose={() => setIsMenuOpen(false)} 
                        className="relative z-50 md:hidden"
                    >
                        <DialogBackdrop 
                            transition
                            className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out data-closed:opacity-0"
                        />

                        <div className="fixed inset-0 overflow-hidden">
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
                                    <DialogPanel
                                        transition
                                        className="pointer-events-auto relative w-screen max-w-md transform transition duration-300 ease-in-out data-closed:translate-x-full"
                                    >
                                        <div className="flex h-full flex-col bg-white dark:bg-gray-800 shadow-xl">
                                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Menu</h2>
                                                <button
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                                                    aria-label="Fermer le menu"
                                                >
                                                    <FaTimes className="h-6 w-6" />
                                                </button>
                                            </div>

                                            {/* User Info in Mobile Menu */}
                                            {isAuthenticated && user && (
                                                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                                    <div className="flex items-center space-x-3">
                                                        <img
                                                            src={getUserAvatar()}
                                                            alt={`Avatar de ${getUserDisplayName()}`}
                                                            className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
                                                            onError={(e) => {
                                                                e.target.src = '/default-avatar.png';
                                                            }}
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                                {getUserDisplayName()}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {user.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                                                {getNavItems().map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center w-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors duration-300"
                                                    >
                                                        {item.icon}
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.title}</span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                {item.description}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}

                                                {/* User Menu Items in Mobile */}
                                                {isAuthenticated && userMenuItems.map((item) => (
                                                    <Link
                                                        key={item.path}
                                                        to={item.path}
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="flex items-center w-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors duration-300"
                                                    >
                                                        {item.icon}
                                                        <span className="font-medium">{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                                                <button
                                                    onClick={toggleTheme}
                                                    className="w-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors duration-300"
                                                >
                                                    {theme === 'dark' ? <FaSun className="mr-3 text-lg text-yellow-400" /> : <FaMoon className="mr-3 text-lg text-gray-800" />}
                                                    {theme === 'dark' ? 'Mode Clair' : 'Mode Sombre'}
                                                </button>

                                                <div className="space-y-2">
                                                    {isAuthenticated ? (
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-3 rounded-lg transition-colors duration-300"
                                                        >
                                                            Déconnexion
                                                        </button>
                                                    ) : (
                                                        <>
                                                            <Link
                                                                to="/login"
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className="block text-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-3 rounded-lg transition-colors duration-300"
                                                            >
                                                                Connexion
                                                            </Link>
                                                            <Link
                                                                to="/register"
                                                                onClick={() => setIsMenuOpen(false)}
                                                                className="block text-center bg-primary-400 text-white hover:bg-primary-500 px-4 py-3 rounded-lg transition-colors duration-300"
                                                            >
                                                                Inscription
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </DialogPanel>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;