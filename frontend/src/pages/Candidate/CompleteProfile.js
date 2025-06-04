import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle, Circle, ChevronRight, ChevronLeft, Plus, Trash2, Upload, User, Briefcase, GraduationCap, Languages, Star, FileText } from 'lucide-react';

const CompleteProfile = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        birth_date: '',
        phone_number: '',
        address: {
            line1: '',
            line2: '',
            zip_code: '',
            city: '',
            country: ''
        },
        experiences: [],
        education: [],
        languages: [],
        skills: [],
        cv_file: null
    });

    const steps = [
        { 
            id: 'personal_info', 
            title: 'Informations personnelles',
            icon: User,
            fields: ['birth_date', 'phone_number', 'address']
        },
        { 
            id: 'experiences', 
            title: 'Expériences professionnelles',
            icon: Briefcase,
            fields: ['experiences']
        },
        { 
            id: 'education', 
            title: 'Formation',
            icon: GraduationCap,
            fields: ['education']
        },
        { 
            id: 'languages', 
            title: 'Langues',
            icon: Languages,
            fields: ['languages']
        },
        { 
            id: 'skills', 
            title: 'Compétences',
            icon: Star,
            fields: ['skills']
        },
        { 
            id: 'cv_upload', 
            title: 'CV',
            icon: FileText,
            fields: ['cv_file']
        }
    ];

    const languageLevels = [
        'Débutant',
        'Intermédiaire',
        'Avancé',
        'Courant',
        'Natif'
    ];

    const handleInputChange = (field, value, index = null, subField = null) => {
        setFormData(prev => {
            const newData = { ...prev };
            
            if (index !== null) {
                if (!newData[field]) newData[field] = [];
                if (subField) {
                    if (!newData[field][index]) newData[field][index] = {};
                    newData[field][index][subField] = value;
                } else {
                    newData[field][index] = value;
                }
            } else if (subField) {
                if (!newData[field]) newData[field] = {};
                newData[field][subField] = value;
            } else {
                newData[field] = value;
            }
            
            return newData;
        });
    };

    const addItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] || []), field === 'skills' ? '' : {}]
        }));
    };

    const removeItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        // Here you would make API call to save the profile data
        console.log('Submitting profile data:', formData);
        // dispatch(updateProfile(formData));
    };

    const renderPersonalInfo = () => (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date de naissance
                </label>
                <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => handleInputChange('birth_date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Numéro de téléphone
                </label>
                <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => handleInputChange('phone_number', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="+33 6 12 34 56 78"
                />
            </div>

            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Adresse</h4>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ligne 1
                    </label>
                    <input
                        type="text"
                        value={formData.address.line1}
                        onChange={(e) => handleInputChange('address', e.target.value, null, 'line1')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="123 Rue de la Paix"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Ligne 2 (optionnel)
                    </label>
                    <input
                        type="text"
                        value={formData.address.line2}
                        onChange={(e) => handleInputChange('address', e.target.value, null, 'line2')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Appartement, étage, etc."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Code postal
                        </label>
                        <input
                            type="text"
                            value={formData.address.zip_code}
                            onChange={(e) => handleInputChange('address', e.target.value, null, 'zip_code')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="75001"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Ville
                        </label>
                        <input
                            type="text"
                            value={formData.address.city}
                            onChange={(e) => handleInputChange('address', e.target.value, null, 'city')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Paris"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pays
                    </label>
                    <input
                        type="text"
                        value={formData.address.country}
                        onChange={(e) => handleInputChange('address', e.target.value, null, 'country')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="France"
                    />
                </div>
            </div>
        </div>
    );

    const renderExperiences = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Expériences professionnelles</h4>
                <button
                    onClick={() => addItem('experiences')}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                </button>
            </div>

            {formData.experiences.map((exp, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <h5 className="text-md font-medium text-gray-900 dark:text-white">Expérience {index + 1}</h5>
                        <button
                            onClick={() => removeItem('experiences', index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Titre du poste
                            </label>
                            <input
                                type="text"
                                value={exp.title || ''}
                                onChange={(e) => handleInputChange('experiences', e.target.value, index, 'title')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Développeur Full Stack"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Entreprise
                            </label>
                            <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => handleInputChange('experiences', e.target.value, index, 'company')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Nom de l'entreprise"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={exp.start_date || ''}
                                onChange={(e) => handleInputChange('experiences', e.target.value, index, 'start_date')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={exp.end_date || ''}
                                onChange={(e) => handleInputChange('experiences', e.target.value, index, 'end_date')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={exp.is_current}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={`current-${index}`}
                            checked={exp.is_current || false}
                            onChange={(e) => handleInputChange('experiences', e.target.checked, index, 'is_current')}
                            className="mr-2"
                        />
                        <label htmlFor={`current-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
                            Poste actuel
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                        </label>
                        <textarea
                            value={exp.description || ''}
                            onChange={(e) => handleInputChange('experiences', e.target.value, index, 'description')}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Décrivez vos responsabilités et réalisations..."
                        />
                    </div>
                </div>
            ))}

            {formData.experiences.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucune expérience ajoutée. Cliquez sur "Ajouter" pour commencer.
                </div>
            )}
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Formation</h4>
                <button
                    onClick={() => addItem('education')}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                </button>
            </div>

            {formData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <h5 className="text-md font-medium text-gray-900 dark:text-white">Formation {index + 1}</h5>
                        <button
                            onClick={() => removeItem('education', index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Établissement
                            </label>
                            <input
                                type="text"
                                value={edu.institution || ''}
                                onChange={(e) => handleInputChange('education', e.target.value, index, 'institution')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Université, École..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Diplôme
                            </label>
                            <input
                                type="text"
                                value={edu.degree || ''}
                                onChange={(e) => handleInputChange('education', e.target.value, index, 'degree')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Master, Licence, BTS..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Domaine d'étude
                        </label>
                        <input
                            type="text"
                            value={edu.field || ''}
                            onChange={(e) => handleInputChange('education', e.target.value, index, 'field')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="Informatique, Marketing, Droit..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date de début
                            </label>
                            <input
                                type="date"
                                value={edu.start_date || ''}
                                onChange={(e) => handleInputChange('education', e.target.value, index, 'start_date')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Date de fin
                            </label>
                            <input
                                type="date"
                                value={edu.end_date || ''}
                                onChange={(e) => handleInputChange('education', e.target.value, index, 'end_date')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                disabled={edu.is_current}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id={`current-edu-${index}`}
                            checked={edu.is_current || false}
                            onChange={(e) => handleInputChange('education', e.target.checked, index, 'is_current')}
                            className="mr-2"
                        />
                        <label htmlFor={`current-edu-${index}`} className="text-sm text-gray-700 dark:text-gray-300">
                            Formation en cours
                        </label>
                    </div>
                </div>
            ))}

            {formData.education.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucune formation ajoutée. Cliquez sur "Ajouter" pour commencer.
                </div>
            )}
        </div>
    );

    const renderLanguages = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Langues</h4>
                <button
                    onClick={() => addItem('languages')}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                </button>
            </div>

            {formData.languages.map((lang, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <h5 className="text-md font-medium text-gray-900 dark:text-white">Langue {index + 1}</h5>
                        <button
                            onClick={() => removeItem('languages', index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Langue
                            </label>
                            <input
                                type="text"
                                value={lang.language || ''}
                                onChange={(e) => handleInputChange('languages', e.target.value, index, 'language')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Français, Anglais, Espagnol..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Niveau
                            </label>
                            <select
                                value={lang.level || ''}
                                onChange={(e) => handleInputChange('languages', e.target.value, index, 'level')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            >
                                <option value="">Sélectionner un niveau</option>
                                {languageLevels.map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            ))}

            {formData.languages.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucune langue ajoutée. Cliquez sur "Ajouter" pour commencer.
                </div>
            )}
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">Compétences</h4>
                <button
                    onClick={() => addItem('skills')}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={skill || ''}
                            onChange={(e) => handleInputChange('skills', e.target.value, index)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            placeholder="JavaScript, React, Node.js..."
                        />
                        <button
                            onClick={() => removeItem('skills', index)}
                            className="text-red-500 hover:text-red-700"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {formData.skills.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Aucune compétence ajoutée. Cliquez sur "Ajouter" pour commencer.
                </div>
            )}
        </div>
    );

    const renderCvUpload = () => (
        <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Télécharger votre CV</h4>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Glissez-déposez votre CV ici
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                    ou cliquez pour sélectionner un fichier
                </p>
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleInputChange('cv_file', e.target.files[0])}
                    className="hidden"
                    id="cv-upload"
                />
                <label
                    htmlFor="cv-upload"
                    className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer"
                >
                    Choisir un fichier
                </label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Formats acceptés: PDF, DOC, DOCX (max 5MB)
                </p>
                
                {formData.cv_file && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <p className="text-sm text-green-800 dark:text-green-200">
                            Fichier sélectionné: {formData.cv_file.name}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderPersonalInfo();
            case 1:
                return renderExperiences();
            case 2:
                return renderEducation();
            case 3:
                return renderLanguages();
            case 4:
                return renderSkills();
            case 5:
                return renderCvUpload();
            default:
                return null;
        }
    };

    const isStepCompleted = (stepIndex) => {
        const step = steps[stepIndex];
        return user?.steps?.[step.id] || false;
    };

    const canProceedToNext = () => {
        const currentStepData = steps[currentStep];
        
        switch (currentStepData.id) {
            case 'personal_info':
                return formData.birth_date && formData.phone_number && 
                       formData.address.line1 && formData.address.city && 
                       formData.address.zip_code && formData.address.country;
            case 'experiences':
                return formData.experiences.length > 0 && 
                       formData.experiences.every(exp => exp.title && exp.company);
            case 'education':
                return formData.education.length > 0 && 
                       formData.education.every(edu => edu.institution && edu.degree);
            case 'languages':
                return formData.languages.length > 0 && 
                       formData.languages.every(lang => lang.language && lang.level);
            case 'skills':
                return formData.skills.length > 0 && 
                       formData.skills.every(skill => typeof skill === 'string' && skill.trim());
            case 'cv_upload':
                return formData.cv_file !== null;
            default:
                return true;
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
            <div className="w-full max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Complétez votre profil
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">
                        Étape {currentStep + 1} sur {steps.length}: {steps[currentStep].title}
                    </p>
                </div>
    
                {/* Progress Stepper */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
                    <div className="flex items-center justify-between w-full">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === currentStep;
                            const isCompleted = isStepCompleted(index);
                            const isPast = index < currentStep;
                            
                            return (
                                <div key={step.id} className="flex items-center flex-1">
                                    <div 
                                        className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                                            isCompleted 
                                                ? 'bg-green-500 border-green-500 text-white shadow-lg' 
                                                : isActive 
                                                ? 'bg-primary-500 border-primary-500 text-white shadow-lg ring-4 ring-primary-100 dark:ring-primary-900' 
                                                : isPast 
                                                ? 'bg-gray-300 dark:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300' 
                                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                                        }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : (
                                            <Icon className="w-6 h-6" />
                                        )}
                                    </div>
                                    
                                    {index < steps.length - 1 && (
                                        <div 
                                            className={`flex-1 h-1 mx-4 rounded-full transition-all duration-300 ${
                                                isPast || isCompleted 
                                                    ? 'bg-green-500' 
                                                    : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                        {steps.map((step, index) => {
                            const isActive = index === currentStep;
                            const isCompleted = isStepCompleted(index);
                            
                            return (
                                <div 
                                    key={step.id} 
                                    className={`text-sm font-medium text-center transition-colors duration-200 ${
                                        isCompleted || isActive 
                                            ? 'text-gray-900 dark:text-white' 
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                    style={{ width: `${100 / steps.length}%` }}
                                >
                                    {step.title}
                                </div>
                            );
                        })}
                    </div>
                </div>
    
                {/* Step Content */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-6 min-h-[400px]">
                    <div className="w-full">
                        {renderStepContent()}
                    </div>
                </div>
    
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                            currentStep === 0
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-gray-500 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                        }`}
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Précédent
                    </button>
    
                    {currentStep === steps.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!canProceedToNext()}
                            className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                                canProceedToNext()
                                    ? 'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Terminer
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={!canProceedToNext()}
                            className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                                canProceedToNext()
                                    ? 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-600 dark:hover:bg-primary-500 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            Suivant
                            <ChevronRight className="w-5 h-5 ml-2" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
};

export default CompleteProfile;