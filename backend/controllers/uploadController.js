const { uploadToR2, deleteFromR2, streamFromR2, getProxyUrl } = require('../utils/r2Storage');
const { processImageForUpload } = require('../utils/imageProcessor');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Upload image to Cloudflare R2 (or local fallback)
 * @route   POST /api/upload
 * @access  Admin
 */
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select an image file to upload' });
    }

    const folder = req.body.folder || 'news';
    const customFilename = req.body.filename || req.file.originalname;
    const alt = req.body.alt || '';
    const caption = req.body.caption || '';
    const oldKey = req.body.oldKey || '';

    // If an old key exists (editing an article), clean up the old image
    if (oldKey) {
      try {
        await deleteFromR2(oldKey);
      } catch (err) {
        console.warn(`Failed to clean up old image key ${oldKey}:`, err.message);
      }
    }

    // Process image with Sharp (extract width, height, convert to WebP)
    const processed = await processImageForUpload(req.file.buffer, customFilename, folder);

    // Upload processed buffer to Cloudflare R2 or local disk
    const uploadResult = await uploadToR2(processed.buffer, processed.key, processed.mimeType);

    // Generate a proxy URL (via our own backend) for immediate admin preview
    // This works regardless of whether images.indorelatest.com is configured or accessible
    const previewUrl = getProxyUrl(uploadResult.imageKey);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        imageUrl: uploadResult.imageUrl,      // Public CDN URL — stored in MongoDB
        previewUrl,                            // Backend proxy URL — used for admin preview only
        imageKey: uploadResult.imageKey,
        alt,
        caption,
        width: processed.width,
        height: processed.height,
        mimeType: processed.mimeType,
        filename: processed.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Stream / proxy image from Cloudflare R2 by object key
 *          This lets the admin dashboard preview uploaded images directly
 *          without needing the public domain (images.indorelatest.com) to be live.
 * @route   GET /api/upload/image/:folder/:filename  (or  /api/upload/image/:filename)
 * @access  Public (admin UI preview)
 */
const proxyImage = async (req, res, next) => {
  try {
    // Reconstruct the full key from URL params
    const { folder, filename } = req.params;
    const key = folder ? `${folder}/${filename}` : filename;
    const cleanKey = decodeURIComponent(key);

    // Try to stream from R2 first
    const streamedFromR2 = await streamFromR2(cleanKey, res);
    if (streamedFromR2) return;

    // Fallback: serve from local uploads directory
    const localPath = path.join(__dirname, '../uploads', cleanKey);
    if (fs.existsSync(localPath)) {
      return res.sendFile(localPath);
    }

    res.status(404).json({ success: false, message: 'Image not found' });
  } catch (error) {
    // If R2 says 'NoSuchKey', return 404 cleanly
    if (error.name === 'NoSuchKey' || error.$metadata?.httpStatusCode === 404) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }
    next(error);
  }
};

/**
 * @desc    Delete image from Cloudflare R2 / local storage
 * @route   DELETE /api/upload
 * @access  Admin
 */
const deleteImage = async (req, res, next) => {
  try {
    const key = req.body.key || req.query.key;
    if (!key) {
      return res.status(400).json({ success: false, message: 'Image object key is required' });
    }

    await deleteFromR2(key);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Replace existing image on Cloudflare R2 / local storage
 * @route   PUT /api/upload/replace
 * @access  Admin
 */
const replaceImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a new image file' });
    }

    const { oldKey, folder = 'news', filename, alt, caption } = req.body;

    // Delete old image if key exists
    if (oldKey) {
      try {
        await deleteFromR2(oldKey);
      } catch (err) {
        console.warn(`Failed to remove old key ${oldKey}:`, err.message);
      }
    }

    // Process & upload new image
    const customFilename = filename || req.file.originalname;
    const processed = await processImageForUpload(req.file.buffer, customFilename, folder);
    const uploadResult = await uploadToR2(processed.buffer, processed.key, processed.mimeType);
    const previewUrl = getProxyUrl(uploadResult.imageKey);

    res.status(200).json({
      success: true,
      message: 'Image replaced successfully',
      data: {
        imageUrl: uploadResult.imageUrl,
        previewUrl,
        imageKey: uploadResult.imageKey,
        alt: alt || '',
        caption: caption || '',
        width: processed.width,
        height: processed.height,
        mimeType: processed.mimeType,
        filename: processed.filename,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  proxyImage,
  deleteImage,
  replaceImage,
};
