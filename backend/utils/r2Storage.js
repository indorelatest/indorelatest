const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Cloudflare R2 S3-Compatible configuration
const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';

const bucketName = process.env.R2_BUCKET_NAME || 'indorelatest-images';
const publicDomain = (process.env.R2_PUBLIC_DOMAIN || 'https://images.indorelatest.com').replace(/\/$/, '');

const isR2Configured = Boolean(accountId && accessKeyId && secretAccessKey);

// Create S3 client targeting Cloudflare R2 endpoint if credentials are supplied
let r2Client = null;
if (isR2Configured) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Get full public CDN URL for an R2 object key
 * @param {string} key
 * @returns {string}
 */
const getR2PublicUrl = (key) => {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${publicDomain}/${cleanKey}`;
};

/**
 * Get internal backend proxy URL for admin preview (avoids needing images.indorelatest.com domain).
 * The actual public CDN URL is stored in MongoDB but preview uses this proxy path.
 * @param {string} key
 * @param {string} [baseUrl] - Optional override (e.g. http://localhost:5000)
 * @returns {string}
 */
const getProxyUrl = (key, baseUrl = '') => {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  const encodedKey = cleanKey.split('/').map(encodeURIComponent).join('/');
  return `${baseUrl}/api/upload/image/${encodedKey}`;
};

/**
 * Stream an object from R2 to an Express response
 * @param {string} key - R2 object key
 * @param {import('express').Response} res
 */
const streamFromR2 = async (key, res) => {
  if (!isR2Configured || !r2Client) {
    return false;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const response = await r2Client.send(command);
  res.setHeader('Content-Type', response.ContentType || 'image/webp');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  response.Body.pipe(res);
  return true;
};

/**
 * Save file buffer locally as fallback when R2 credentials are not set
 * @param {Buffer} buffer
 * @param {string} key
 * @returns {string} Local full URL
 */
const saveFileLocally = async (buffer, key) => {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  const targetPath = path.join(__dirname, '../uploads', cleanKey);
  const dir = path.dirname(targetPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await fs.promises.writeFile(targetPath, buffer);
  const host = process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${host}/uploads/${cleanKey}`;
};

/**
 * Upload buffer to Cloudflare R2 (or fallback to local disk storage if R2 is not configured)
 * @param {Buffer} buffer - File data buffer
 * @param {string} key - Object key in bucket (e.g. news/indore-metro.webp)
 * @param {string} mimeType - Content type (e.g. image/webp)
 * @returns {Promise<{ imageUrl: string, imageKey: string }>}
 */
const uploadToR2 = async (buffer, key, mimeType) => {
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;

  if (isR2Configured && r2Client) {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable',
      });

      await r2Client.send(command);

      return {
        imageUrl: getR2PublicUrl(cleanKey),  // CDN URL stored in MongoDB
        imageKey: cleanKey,
      };
    } catch (r2Error) {
      console.warn('Cloudflare R2 Upload Warning (falling back to local storage):', r2Error.message);
    }
  }

  // Local storage fallback
  const localUrl = await saveFileLocally(buffer, cleanKey);
  return {
    imageUrl: localUrl,
    imageKey: cleanKey,
  };
};

/**
 * Delete object from Cloudflare R2 or local storage
 * @param {string} key - Object key
 * @returns {Promise<boolean>}
 */
const deleteFromR2 = async (key) => {
  if (!key) return false;
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;

  if (isR2Configured && r2Client) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: cleanKey,
      });

      await r2Client.send(command);
      return true;
    } catch (r2Error) {
      console.warn('Cloudflare R2 Delete Warning:', r2Error.message);
    }
  }

  // Delete local file fallback
  try {
    const localPath = path.join(__dirname, '../uploads', cleanKey);
    if (fs.existsSync(localPath)) {
      await fs.promises.unlink(localPath);
    }
  } catch (err) {
    console.warn('Failed to delete local file fallback:', err.message);
  }

  return true;
};

module.exports = {
  r2Client,
  bucketName,
  publicDomain,
  isR2Configured,
  getR2PublicUrl,
  getProxyUrl,
  streamFromR2,
  uploadToR2,
  deleteFromR2,
};
