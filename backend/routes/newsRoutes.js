const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/newsController");

// Admin stats
router.get("/stats", getStats);

// Verify admin passcode
router
  .route("/verify-passcode")
  .post(verifyPasscode)
  .all((req, res) => {
    res
      .status(405)
      .json({
        success: false,
        message: "Method not allowed. Use POST /api/news/verify-passcode.",
      });
  });

// Special routes (must be before /:id to avoid conflict)
router.get("/featured", getFeaturedNews);
router.get("/trending", getTrendingNews);
router.get("/mostread", getMostReadNews);
router.get("/latest", getLatestNews);
router.get("/breaking", getBreakingNews);
router.get("/search", searchNews);
router.get("/category/:name", getNewsByCategory);

// CRUD
router.get("/", getAllNews);
router.post("/", createNews);
router.get("/:id", getNewsById);
router.put("/:id", updateNews);
router.delete("/:id", deleteNews);
router.post("/:id/view", incrementView);

module.exports = router;
