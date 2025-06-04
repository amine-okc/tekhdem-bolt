import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, CheckCircle, X } from 'lucide-react';
import { getWilayas } from '../apis/location';

export default function Home() {
    const [searchTerm, setSearchTerm] = useState('');
    const [wilayas, setWilayas] = useState([]);
    const [location, setLocation] = useState('');

    const fetchWilayas = async (keyword) => {
        setLocation(keyword);
        if (keyword.length > 1) {
            const res = await getWilayas(keyword);
            setWilayas(res);
        } else {
            setWilayas([]);
        }
    };

    const selectWilaya = (wilayaName) => {
        setLocation(wilayaName);
        setWilayas([]);
    };

    const clearWilaya = () => {
        setLocation('');
        setWilayas([]);
    };

    const jobCategories = [
        'Informatique',
        'Marketing',
        'Finance',
        'Vente',
        'Ingénierie',
        'Ressources Humaines',
        'Commercial',
        'Design'
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
            <main className="container mx-auto px-4 sm:px-6 py-16">
                <div className="text-center mb-16 animate-fade-in-down">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-500 dark:text-primary-400 mb-6">
                        Trouvez Votre Emploi Idéal en Algérie
                    </h2>
                    <p className="text-base sm:text-xl text-secondary-600 dark:text-secondary-300 mb-10">
                        Plus de 10,000 opportunités professionnelles vous attendent
                    </p>

                    {/* Advanced Search - Improved Mobile Responsiveness */}
                    <div className="max-w-4xl mx-auto relative">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                {/* Keyword Search */}
                                <div className="flex-grow flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 sm:border-r dark:border-gray-600">
                                    <Search className="text-gray-500 dark:text-gray-300 mr-2" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Mot-clé, poste, entreprise"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-white text-sm sm:text-base"
                                    />
                                </div>

                                {/* Location Search */}
                                <div className="flex-grow flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3 relative">
                                    <MapPin className="text-gray-500 dark:text-gray-300 mr-2" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Wilaya"
                                        value={location}
                                        onChange={(e) => fetchWilayas(e.target.value)}
                                        className="w-full bg-transparent focus:outline-none text-gray-800 dark:text-white text-sm sm:text-base"
                                    />
                                    {location && (
                                        <button
                                            onClick={clearWilaya}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>

                                {/* Search Button */}
                                <button className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg transition duration-300 flex items-center justify-center">
                                    <Search className="mr-2" size={20} />
                                    Rechercher
                                </button>
                            </div>
                        </div>

                        {/* Wilayas Dropdown */}
                        {wilayas.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
                                {wilayas.map((wilaya) => (
                                    <div
                                        key={wilaya.code}
                                        onClick={() => selectWilaya(wilaya.name)}
                                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-300 transition-colors duration-200 cursor-pointer"
                                    >
                                        {wilaya.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section - Adjusted for mobile */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-16">
                    {[
                        {
                            icon: Briefcase,
                            title: "Offres Personnalisées",
                            description: "Des recommandations d'emploi basées sur votre profil et vos compétences"
                        },
                        {
                            icon: Filter,
                            title: "Filtres Avancés",
                            description: "Affinez votre recherche par secteur, salaire, type de contrat"
                        },
                        {
                            icon: CheckCircle,
                            title: "Candidatures Simplifiées",
                            description: "Postulez rapidement avec votre profil unique et sauvegardé"
                        }
                    ].map(({ icon: Icon, title, description }) => (
                        <div key={title} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform transition hover:scale-105 hover:shadow-xl">
                            <div className="flex items-center mb-4">
                                <Icon className="text-primary-500 dark:text-primary-300 mr-4" size={36} />
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    {title}
                                </h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Popular Job Categories - Adjusted for mobile */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
                        Catégories d'Emplois Populaires
                    </h2>
                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {jobCategories.map((category) => (
                            <div
                                key={category}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
                            >
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">{category}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
