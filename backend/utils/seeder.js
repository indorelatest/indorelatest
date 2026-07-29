const path = require('path');
const fs = require('fs');
const News = require('../models/News');

/**
 * Reusable helper function to seed/upsert default news articles from the
 * static JSON data file into the MongoDB database.
 * 
 * @returns {Promise<number>} The number of articles processed.
 */
const seedDatabase = async () => {
  const dataPath = path.join(__dirname, '../../src/data/news.json');
  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const newsArray = JSON.parse(rawData);

  for (const article of newsArray) {
    await News.findOneAndUpdate(
      { id: article.id },
      { ...article },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  return newsArray.length;
};

module.exports = seedDatabase;
