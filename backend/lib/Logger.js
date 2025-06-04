// logger.js
const winston = require('winston');


const tableFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
  });
// Create a logger instance
const logger = winston.createLogger({
  level: 'info', // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Include timestamp
    winston.format.json() // Log in JSON format
  ),
  transports: [
    // Write logs to a file
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Error logs
    new winston.transports.File({ filename: 'logs/info.log', level: 'info'}),
    new winston.transports.File({ filename: 'logs/combined.log' }), // All logs
    // Optionally, log to the console
  
    new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(), // Add color to the output
          tableFormat // Use the custom format for console output
)}),
  ],
});

// Export the logger
module.exports = logger;
