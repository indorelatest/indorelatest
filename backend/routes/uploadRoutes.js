const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadImage,
  proxyImage,
  deleteImage,
  replaceImage,
} = require('../controllers/uploadController');

// Upload single image
router.post('/', upload.single('image'), uploadImage);

// Stream / proxy image from R2 by key (for admin dashboard preview)
// Handles keys like: news/indore-metro-123.webp  → /api/upload/image/news/indore-metro-123.webp
router.get('/image/:folder/:filename', proxyImage);
router.get('/image/:filename', proxyImage);

// Delete image from R2
router.delete('/', deleteImage);

// Replace existing image
router.put('/replace', upload.single('image'), replaceImage);

module.exports = router;
