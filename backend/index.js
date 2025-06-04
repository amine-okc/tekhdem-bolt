// Load environment variables based on the current environment
if (process.env.NODE_ENV === 'production') {
    require('dotenv').config({ path: '.env.production' });
} else {
    require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const axios = require('axios');
const cors = require('cors')
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const logger = require('./lib/Logger');
const { execArgv } = require('process');

// Initialiser Express
const app = express();

app.use(cors({
    origin: '*',
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




// Connexion à MongoDB en utilisant l'URL depuis le fichier .env
mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME})
    .then(() => logger.info('Connected to MongoDB'))
    .catch(err => logger.error('Could not connect to MongoDB:', err));




/* add routes */

// Path to the 'routes' folder
app.use(express.json())
const routesPath = path.join(__dirname, 'routes');

// Get all filenames in the 'routes' folder
fs.readdir(routesPath, (err, files) => {
    try{
    if (err) {
        logger.error('Error reading directory: ', err)
        return;
    }
    // Filter the files to get only the ones that end with 'Routes.js'
    files.filter(file => {
        const route = require(path.join(routesPath, file));
        // Use the route file with a dynamic URL prefix
        const routeName = file.replace('.js', '').toLowerCase();
        app.use(`/api/${routeName}`, route);
    });
    }catch(error){
        logger.error('Error occured when reading routes : ' + error)
    }
});





// Start the server
app.listen(4000, () => {
    logger.info('Server is running on port 4000');
});