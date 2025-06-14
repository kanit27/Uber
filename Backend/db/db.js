const mongoose = require('mongoose');
require('dotenv').config(); // Load .env file

const connectToDb = async () => {
  await mongoose.connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ Connected to MongoDB");
};

module.exports = connectToDb;