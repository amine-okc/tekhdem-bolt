import { FaFacebook, FaXTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-white/90 dark:bg-gray-900/90">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* À propos */}
                    <div>
                        <h3 className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">À propos</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Votre partenaire de confiance pour tous vos besoins professionnels.
                        </p>
                    </div>

                    {/* Liens utiles */}
                    <div>
                        <h3 className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">Liens utiles</h3>
                        <ul className="space-y-2">
                            <li><a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Accueil</a></li>
                            <li><a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Services</a></li>
                            <li><a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">À propos</a></li>
                            <li><a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">Blog</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">Contact</h3>
                        <ul className="space-y-2">
                            <li className="text-gray-600 dark:text-gray-300">Email: contact@tekhdem.dz</li>
                            <li className="text-gray-600 dark:text-gray-300">Tél: +213 1 23 45 67 89</li>
                            <li className="text-gray-600 dark:text-gray-300">Adresse: Alger, Algérie</li>
                        </ul>
                    </div>

                    {/* Réseaux sociaux */}
                    <div>
                        <h3 className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-4">Réseaux sociaux</h3>
                        <div className="flex space-x-4">
                            <a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                                <FaFacebook size={24} />
                            </a>
                            <a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                                <FaXTwitter size={24} />
                            </a>
                            <a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                                <FaInstagram size={24} />
                            </a>
                            <a href="&" className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400">
                                <FaLinkedin size={24} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-600 dark:text-gray-300">
                        © {new Date().getFullYear()} Votre Entreprise. Tous droits réservés.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;