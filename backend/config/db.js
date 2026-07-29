const mongoose = require('mongoose');
const News = require('../models/News');
const seedDatabase = require('../utils/seeder');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Check if the News collection is empty
    const count = await News.countDocuments();
    if (count === 0) {
      console.log('Database is empty. Importing default news...');
      try {
        const processed = await seedDatabase();
        console.log('Default news imported successfully.');
      } catch (seedError) {
        console.error(`❌ Failed to auto-seed database: ${seedError.message}`);
      }
    }
  } catch (error) {
    console.error(` MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
