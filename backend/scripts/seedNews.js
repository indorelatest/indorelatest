require('dotenv').config();
const mongoose = require('mongoose');
const seedDatabase = require('../utils/seeder');

/**
 * Standalone seed execution script.
 */
const runSeed = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is missing.');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    console.log('Running seeder script...');
    const processed = await seedDatabase();
    console.log(`Seeding complete: ${processed} articles processed/upserted.`);
    process.exit(0);
  } catch (error) {
    console.error(' Seed error:', error.message);
    process.exit(1);
  }
};

runSeed();
