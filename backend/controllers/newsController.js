const News = require('../models/News');
const { deleteFromR2 } = require('../utils/r2Storage');

// ─── GET all news (with optional filters) ───────────────────────────────────
const getAllNews = async (req, res) => {
  try {
    const { category, limit, sort, lang } = req.query;
    const query = {};

    if (category) {
      query.$or = [
        { category_hi: { $regex: category, $options: 'i' } },
        { category_en: { $regex: category, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const limitNum = parseInt(limit) || 100;

    const news = await News.find(query).sort(sortOption).limit(limitNum);
    res.json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET featured news ───────────────────────────────────────────────────────
const getFeaturedNews = async (req, res) => {
  try {
    const news = await News.find({ featured: true }).sort({ createdAt: -1 });
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET trending news ───────────────────────────────────────────────────────
const getTrendingNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const news = await News.find({ trending: true }).sort({ views: -1 }).limit(limit);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET most read news ──────────────────────────────────────────────────────
const getMostReadNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const news = await News.find().sort({ views: -1 }).limit(limit);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET latest news ─────────────────────────────────────────────────────────
const getLatestNews = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    const news = await News.find().sort({ createdAt: -1 }).limit(limit);
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET breaking news ───────────────────────────────────────────────────────
const getBreakingNews = async (req, res) => {
  try {
    const news = await News.find({ breaking: true }).sort({ createdAt: -1 }).limit(10);
    // Fallback to latest if no breaking news is set
    if (news.length === 0) {
      const fallback = await News.find().sort({ createdAt: -1 }).limit(10);
      return res.json({ success: true, data: fallback });
    }
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET news by category ────────────────────────────────────────────────────
const getNewsByCategory = async (req, res) => {
  try {
    const { name } = req.params;
    const { sort } = req.query;

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { views: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    const news = await News.find({
      $or: [
        { category_hi: { $regex: name, $options: 'i' } },
        { category_en: { $regex: name, $options: 'i' } },
      ],
    }).sort(sortOption);

    res.json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── SEARCH news ─────────────────────────────────────────────────────────────
const searchNews = async (req, res) => {
  try {
    const { q, lang = 'hi' } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const regex = new RegExp(q, 'i');
    const news = await News.find({
      $or: [
        { [`title_${lang}`]: regex },
        { [`summary_${lang}`]: regex },
        { [`content_${lang}`]: regex },
        { title_hi: regex },
        { title_en: regex },
      ],
    }).limit(20);

    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET single news by slug id ──────────────────────────────────────────────
const getNewsById = async (req, res) => {
  try {
    const news = await News.findOne({ id: req.params.id });
    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST increment view count ───────────────────────────────────────────────
const incrementView = async (req, res) => {
  try {
    const news = await News.findOneAndUpdate(
      { id: req.params.id },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, views: news.views });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST create article (admin) ─────────────────────────────────────────────
const createNews = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.imageUrl && !body.image) {
      body.image = body.imageUrl;
    }
    const news = new News(body);
    const saved = await news.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── PUT update article (admin) ──────────────────────────────────────────────
const updateNews = async (req, res) => {
  try {
    const body = { ...req.body };
    if (body.imageUrl && !body.image) {
      body.image = body.imageUrl;
    }
    const news = await News.findOneAndUpdate(
      { id: req.params.id },
      body,
      { new: true, runValidators: true }
    );
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });
    res.json({ success: true, data: news });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── DELETE article (admin) ───────────────────────────────────────────────────
const deleteNews = async (req, res) => {
  try {
    const news = await News.findOneAndDelete({ id: req.params.id });
    if (!news) return res.status(404).json({ success: false, message: 'News not found' });

    // Clean up associated Cloudflare R2 image if imageKey exists
    if (news.imageKey) {
      try {
        await deleteFromR2(news.imageKey);
      } catch (err) {
        console.warn(`Failed to clean up R2 image ${news.imageKey}:`, err.message);
      }
    }

    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST verify passcode ───────────────────────────────────────────────────
const verifyPasscode = async (req, res) => {
  try {
    const { passcode } = req.body;
    const correctPasscode = process.env.ADMIN_PASSCODE || 'admin123';
    if (passcode === correctPasscode) {
      res.json({ success: true, message: 'Authenticated successfully' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid passcode' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET admin stats ─────────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const totalArticles = await News.countDocuments();
    const featuredCount = await News.countDocuments({ featured: true });
    const trendingCount = await News.countDocuments({ trending: true });
    const breakingCount = await News.countDocuments({ breaking: true });
    const totalViews = await News.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } },
    ]);

    const categoryStats = await News.aggregate([
      { $group: { _id: '$category_en', count: { $sum: 1 }, views: { $sum: '$views' } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      success: true,
      data: {
        totalArticles,
        featuredCount,
        trendingCount,
        breakingCount,
        totalViews: totalViews[0]?.total || 0,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllNews,
  getFeaturedNews,
  getTrendingNews,
  getMostReadNews,
  getLatestNews,
  getBreakingNews,
  getNewsByCategory,
  searchNews,
  getNewsById,
  incrementView,
  createNews,
  updateNews,
  deleteNews,
  getStats,
  verifyPasscode,
};
