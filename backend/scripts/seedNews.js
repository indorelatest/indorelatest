require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const fs = require('fs');
const News = require('../models/News');

const seedNews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Read the static news.json from the frontend data folder
    const dataPath = path.join(__dirname, '../../src/data/news.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const newsArray = JSON.parse(rawData);

    // Upsert each article (update if exists, insert if not)
    let inserted = 0;
    let updated = 0;

    for (const article of newsArray) {
      const result = await News.findOneAndUpdate(
        { id: article.id },
        { ...article },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (result.createdAt && result.updatedAt &&
          result.createdAt.getTime() === result.updatedAt.getTime()) {
        inserted++;
      } else {
        updated++;
      }
    }

    console.log(`Seeding complete: ${newsArray.length} articles processed`);
    console.log(`   → Inserted/Upserted: ${newsArray.length}`);
    process.exit(0);
  } catch (error) {
    console.error(' Seed error:', error.message);
    process.exit(1);
  }
};

seedNews();
