import React from 'react';
import { getUser } from '../utils/auth';

const Dashboard = () => {
    const user = getUser();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Bienvenue, {user?.first_name} {user?.last_name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Gérez votre profil et consultez vos statistiques
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Candidatures</h3>
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</div>
                    <p className="text-gray-600 dark:text-gray-400">Candidatures en cours</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Entretiens</h3>
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</div>
                    <p className="text-gray-600 dark:text-gray-400">Entretiens programmés</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Offres sauvegardées</h3>
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">0</div>
                    <p className="text-gray-600 dark:text-gray-400">Offres en favoris</p>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Activité récente</h3>
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">Aucune activité récente</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommandations</h3>
                    <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">Aucune recommandation pour le moment</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;