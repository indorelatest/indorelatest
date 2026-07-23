const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title_hi: { type: String, required: true },
    title_en: { type: String, required: true },
    summary_hi: { type: String, required: true },
    summary_en: { type: String, required: true },
    content_hi: { type: String, required: true },
    content_en: { type: String, required: true },
    category_hi: { type: String, required: true },
    category_en: { type: String, required: true },
    image: { type: String, default: '' },
    author_hi: { type: String, default: 'डेस्क' },
    author_en: { type: String, default: 'Desk' },
    publishDate_hi: { type: String, default: '' },
    publishDate_en: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    breaking: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Text indexes for full-text search across both languages
newsSchema.index({
  title_hi: 'text',
  title_en: 'text',
  summary_hi: 'text',
  summary_en: 'text',
  content_hi: 'text',
  content_en: 'text',
});

module.exports = mongoose.model('News', newsSchema);
