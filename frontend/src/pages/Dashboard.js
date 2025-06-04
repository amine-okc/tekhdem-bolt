import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { verifyAuth } from '../store/authSlice';
import { CheckCircle, Circle } from 'lucide-react';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const interval = setInterval(() => {
            dispatch(verifyAuth());
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [dispatch]);

    const steps = [
        { id: 'personal_info', title: 'Informations personnelles' },
        { id: 'experiences', title: 'Expériences professionnelles' },
        { id: 'education', title: 'Formation' },
        { id: 'languages', title: 'Langues' },
        { id: 'skills', title: 'Compétences' },
        { id: 'cv_upload', title: 'CV' }
    ];

    if (!user?.is_profile_complete) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Complétez votre profil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-8">
                        Pour profiter pleinement de nos services, veuillez compléter les étapes suivantes
                    </p>

                    <div className="space-y-4">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className="flex items-center w-full">
                                    {user?.steps?.[step.id] ? (
                                        <CheckCircle className="h-8 w-8 text-green-500" />
                                    ) : (
                                        <Circle className="h-8 w-8 text-gray-400" />
                                    )}
                                    <div className="ml-4 flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {step.title}
                                        </h3>
                                    </div>
                                    {!user?.steps?.[step.id] && (
                                        <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                                            Compléter
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

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
        </div>
    );
};

export default Dashboard;