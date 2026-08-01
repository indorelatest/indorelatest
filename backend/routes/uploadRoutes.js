const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadImage,
  proxyImage,
  deleteImage,
  replaceImage,
} = require('../controllers/uploadController');

// Upload single image to Cloudflare R2
router.post('/', upload.single('image'), uploadImage);

// ─── Proxy / stream image from R2 by key for admin preview ───────────────────
// Route matches any key depth: news/filename.webp  OR  gallery/sub/img.webp
// The wildcard captures the full path after /image/
router.get('/image/*', proxyImage);

// Delete image from R2
router.delete('/', deleteImage);

// Replace existing image
router.put('/replace', upload.single('image'), replaceImage);

module.exports = router;
