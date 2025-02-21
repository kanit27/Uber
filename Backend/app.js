const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const connectToDb = require('./db/db.js');
connectToDb();

app.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = app;