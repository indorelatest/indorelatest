const sharp = require('sharp');

/**
 * Generate clean SEO-friendly slug for image filename
 * @param {string} str - Input title or original filename
 * @returns {string} Clean slug string (e.g. indore-metro-station)
 */
const slugifyFilename = (str) => {
  if (!str) return 'news-image';
  
  // Remove file extension if present
  const nameWithoutExt = str.replace(/\.[^/.]+$/, '');

  return nameWithoutExt
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_\W]+/g, '-') // Replace spaces and special chars with hyphen
    .replace(/^-+|-+$/g, '');   // Remove leading/trailing hyphens
};

/**
 * Process image buffer using sharp: extract dimensions, convert to WebP for maximum compression and performance
 * @param {Buffer} inputBuffer - Original uploaded image buffer
 * @param {string} [customFilename] - Optional custom SEO filename
 * @param {string} [folder='news'] - Target folder inside R2 bucket (news, authors, gallery)
 * @returns {Promise<{ buffer: Buffer, width: number, height: number, mimeType: string, filename: string, key: string }>}
 */
const processImageForUpload = async (inputBuffer, customFilename = '', folder = 'news') => {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '') || 'news';
  const slug = slugifyFilename(customFilename || 'news-image');
  const timestamp = Date.now();
  const filename = `${slug}-${timestamp}.webp`;
  const key = `${cleanFolder}/${filename}`;

  // Process with sharp: auto-rotate according to EXIF data, convert to WebP
  const sharpInstance = sharp(inputBuffer).rotate();
  const metadata = await sharpInstance.metadata();

  const processedBuffer = await sharpInstance
    .webp({ quality: 82, effort: 4 })
    .toBuffer();

  const finalMetadata = await sharp(processedBuffer).metadata();

  return {
    buffer: processedBuffer,
    width: finalMetadata.width || metadata.width || 0,
    height: finalMetadata.height || metadata.height || 0,
    mimeType: 'image/webp',
    filename,
    key,
  };
};

module.exports = {
  slugifyFilename,
  processImageForUpload,
};
