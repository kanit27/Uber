const mongoose = require('mongoose');
require('dotenv').config(); // Load .env file

function connectToDb() {
    
    mongoose.connect(process.env.DB_CONNECT)
    .then(() => {
        console.log('Connected to database');
    })
    .catch((error) => {
        console.error('Connection failed:', error.message);
    });
}

module.exports = connectToDb;