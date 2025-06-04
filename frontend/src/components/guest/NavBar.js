import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from 'react-icons/fa';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    );

    const [user, setUser] = useState(null);

    const navItems = [
        {
            title: 'Accueil',
            path: '/',
            icon: <FaHome className="mr-3 text-lg" />,
            description: 'Page principale'
        },
        {
            title: 'Offres',
            path: '/job-offers',
            icon: <FaBriefcase className="mr-3 text-lg" />,
            description: 'Découvrez nos offres d\'emploi'
        },
        {
            title: 'Services',
            path: '/services',
            icon: <FaClipboardList className="mr-3 text-lg" />,
            description: 'Nos services professionnels'
        },
        {
            title: 'Recruteur',
            path: '/recruiter',
            icon: <FaUserTie className="mr-3 text-lg" />,
            description: 'Espace recruteur'
        }
    ];

    useEffect(() => {
        // Vérification du jeton et récupération des informations de l'utilisateur
        const token = localStorage.getItem('token');
        if (token) {
            // Si le jeton est trouvé, tu peux récupérer l'utilisateur à partir du jeton
        
            setUser(JSON.parse(localStorage.getItem('user')))
        }

        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);

        root.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    const handleLogout = () => {
        // Suppression du jeton et de l'utilisateur du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/'; // Redirige vers la page d'accueil après déconnexion
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
                            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6">
                        <div className="flex space-x-4">
                            {navItems.map((item) => (
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
                            >
                                {theme === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-800" />}
                            </button>

                            <div className="flex space-x-3">
                                {/* Si l'utilisateur est connecté, on affiche l'avatar et le nom */}
                                {user ? (
                                    
                                    <div className="flex items-center space-x-3">
                                        <p>{console.log(user)}</p>
                                        <img
                                            src={user.avatar || '/default-avatar.png'}
                                            alt={user.first_name}
                                            className="h-8 w-8 rounded-full"
                                        />
                                        <span className="text-sm text-gray-800 dark:text-gray-200">{user.name}</span>
                                        <button
                                            onClick={handleLogout}
                                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full"
                                        >
                                            <FaSignOutAlt />
                                        </button>
                                    </div>
                                ) : (
                                    // Si l'utilisateur n'est pas connecté, on affiche les boutons de connexion et inscription
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
                                                >
                                                    <FaTimes className="h-6 w-6" />
                                                </button>
                                            </div>

                                            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                                                {navItems.map((item) => (
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
