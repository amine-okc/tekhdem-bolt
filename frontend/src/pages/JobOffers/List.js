import React, { useState } from 'react';
import { 
  Search as SearchIcon, 
  MapPin as LocationOnIcon, 
  Briefcase as WorkOutlineIcon, 
  Filter as FilterIcon, 
  DollarSign as SalaryIcon,
  User as ExperienceIcon,
  BookOpen as SkillIcon
} from 'lucide-react';

const JobOffersList = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    contractType: 'all',
    experience: 'all',
    salaryMin: '',
    salaryMax: '',
    skills: [],
    industries: []
  });
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Liste prédéfinie de compétences et industries
  const skillsList = [
    'JavaScript', 'React', 'Node.js', 'Python', 
    'Java', 'SQL', 'Cloud', 'Machine Learning', 
    'Figma', 'UI/UX', 'DevOps', 'Cybersécurité'
  ];

  const industriesList = [
    'Tech', 'Finance', 'Santé', 'E-commerce', 
    'Marketing Digital', 'Éducation', 'Média', 
    'Automobile', 'Énergie', 'Télécommunications'
  ];

  // Exemple de données (à remplacer par vos données réelles)
  const jobOffers = [
    {
      id: 1,
      title: 'Développeur Full Stack',
      description: 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe.',
      skills: ['JavaScript', 'React', 'Node.js'],
      location: {
        line1: '123 Rue de la Tech',
        line2: '',
        zipCode: '75001',
        city: 'Paris',
        country: 'France',
        coordinates: [48.8566, 2.3522]
      },
      contractType: 'cdi',
      experienceLevel: 2,
      salaryRange: [45000, 55000],
      startAt: '2024-02-01',
      companyId: 'company123',
      industry: 'Tech',
      viewsCount: 150,
      isFeatured: true,
      tags: ['Tech', 'Full Stack'],
      trendingScore: 85,
      socialShares: { facebook: 30, twitter: 20 }
    },
    {
      id: 2,
      title: 'Designer UI/UX',
      description: 'Recherche un designer UI/UX passionné pour créer des interfaces utilisateur intuitives.',
      skills: ['Figma', 'Adobe XD', 'User Research'],
      location: {
        line1: '456 Avenue du Design',
        line2: '',
        zipCode: '13001',
        city: 'Marseille',
        country: 'France',
        coordinates: [43.2965, 5.3698]
      },
      contractType: 'cdd',
      experienceLevel: 1,
      salaryRange: [35000, 45000],
      startAt: '2024-03-15',
      companyId: 'company456',
      industry: 'Design',
      viewsCount: 120,
      isFeatured: false,
      tags: ['Design', 'UI/UX'],
      trendingScore: 70,
      socialShares: { linkedin: 15, behance: 10 }
    },
  ];

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleSkillToggle = (skill) => {
    setFilters(prevFilters => {
      const currentSkills = prevFilters.skills;
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter(s => s !== skill)
        : [...currentSkills, skill];
      
      return {
        ...prevFilters,
        skills: newSkills
      };
    });
  };

  const handleIndustryToggle = (industry) => {
    setFilters(prevFilters => {
      const currentIndustries = prevFilters.industries;
      const newIndustries = currentIndustries.includes(industry)
        ? currentIndustries.filter(i => i !== industry)
        : [...currentIndustries, industry];
      
      return {
        ...prevFilters,
        industries: newIndustries
      };
    });
  };

  // Composant de filtres réutilisable pour desktop et mobile
  const FilterPanel = () => (
    <div className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
          <ExperienceIcon className="inline-block mr-2" /> Expérience
        </h2>
        <select
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
          className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">Toute expérience</option>
          <option value="1">Débutant</option>
          <option value="2">2-5 ans</option>
          <option value="3">5+ ans</option>
        </select>
      </div>

      {/* <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
          <SalaryIcon className="inline-block mr-2" /> Fourchette Salariale
        </h2>
        <div className="flex space-x-2">
          <input
            type="number"
            name="salaryMin"
            placeholder="Min (k€)"
            value={filters.salaryMin}
            onChange={handleFilterChange}
            className="w-1/2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
          />
          <input
            type="number"
            name="salaryMax"
            placeholder="Max (k€)"
            value={filters.salaryMax}
            onChange={handleFilterChange}
            className="w-1/2 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
      </div> */}

      <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
          <SkillIcon className="inline-block mr-2" /> Compétences
        </h2>
        <div className="flex flex-wrap gap-2">
          {skillsList.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              className={`px-2 py-1 rounded-lg text-sm transition ${
                filters.skills.includes(skill)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 dark:text-gray-200">
          Industries
        </h2>
        <div className="flex flex-wrap gap-2">
          {industriesList.map((industry) => (
            <button
              key={industry}
              onClick={() => handleIndustryToggle(industry)}
              className={`px-2 py-1 rounded-lg text-sm transition ${
                filters.industries.includes(industry)
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="px-4 py-6 dark:bg-gray-900 dark:text-gray-100 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 py-16">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
          >
            <FilterIcon />
            {isMobileFilterOpen ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>
        </div>

        {/* Filtres mobiles - affichés uniquement lorsque isMobileFilterOpen est true */}
        {isMobileFilterOpen && (
          <div className="md:hidden mb-6">
            <FilterPanel />
          </div>
        )}

        {/* Barre de recherche principale */}
        <div className="mb-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="col-span-1 md:col-span-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="keyword"
                  placeholder="Métier, mots-clés..."
                  value={filters.keyword}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="col-span-1 md:col-span-1">
              <div className="relative">
                <LocationOnIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  name="location"
                  placeholder="Ville, département..."
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="col-span-1 md:col-span-1">
              <select
                name="contractType"
                value={filters.contractType}
                onChange={handleFilterChange}
                className="w-full py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous les contrats</option>
                <option value="cdi">CDI</option>
                <option value="cdd">CDD</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Stage</option>
              </select>
            </div>
            <div className="col-span-1 md:col-span-1">
              <button
                className="w-full py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition"
              >
                Rechercher
              </button>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filtres additionnels - Desktop */}
          <div className="hidden md:block col-span-1">
            <FilterPanel />
          </div>

          {/* Résultats */}
          <div className="col-span-1 md:col-span-3 space-y-4">
            {jobOffers.map((job) => (
              <div 
                key={job.id} 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="mb-3">
                  <h3 className="text-xl font-bold text-primary-600 dark:text-primary-400 mb-1">{job.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{job.companyId}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-3 text-sm">
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                    <LocationOnIcon className="mr-1" size={16} />

                    {job.location.city}, {job.location.country}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                    <WorkOutlineIcon className="mr-1" size={16} />
                    {job.contractType.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-yellow-600/20 ring-inset">
                    {job.salaryRange[0]}k€ - {job.salaryRange[1]}k€
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{job.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Publié le {new Date(job.startAt).toLocaleDateString()}
                  </p>
                  <button className="px-4 py-2 border border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 rounded-lg hover:bg-primary-600 dark:hover:bg-primary-400 hover:text-white dark:hover:text-gray-800 transition">
                    Voir l'offre
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobOffersList;