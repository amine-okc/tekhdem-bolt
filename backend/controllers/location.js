const communes = require('../data/communes.json');
const wilayas = require('../data/wilayas.json');

// Search wilayas by keyword
const searchWilayas = (keyword) => {
    if (!keyword) return [];
    const normalizedKeyword = keyword.toLowerCase().trim();
    return wilayas
        .filter(wilaya => 
            wilaya.name.toLowerCase().includes(normalizedKeyword) ||
            wilaya.arName.includes(keyword) ||
            wilaya.code.toString().includes(normalizedKeyword)
        )
        .slice(0, 10); // Limit results to 10 items
};

// Search communes by keyword
const searchCommunes = (keyword) => {
    if (!keyword) return [];
    
    const normalizedKeyword = keyword.toLowerCase().trim();
    return communes
        .filter(commune => 
            commune.name.toLowerCase().includes(normalizedKeyword) ||
            commune.arName.includes(keyword) ||
            commune.postalCode.includes(keyword)
        )
        .slice(0, 10); // Limit results to 10 items
};

const searchCommunesOfWilaya = (wilayaCode) => {
    if (!wilayaCode) return []

    return communes.filter(commune => 
        commune.wilayaId === wilayaCode
    )
}

// Controller functions for API endpoints
module.exports = {
    autocompleteWilayas: (req, res) => {
        const { keyword } = req.query;
        const results = searchWilayas(keyword);
        res.json(results);
    },

    autocompleteCommunes: (req, res) => {
        const { keyword } = req.query;
        const results = searchCommunes(keyword);
        res.json(results);
    },

    getCommunesOfWilaya: (req, res) => {
        const {wilaya} = req.query;
        const results = searchCommunesOfWilaya(wilaya);
        res.json(results);
    }
    
};