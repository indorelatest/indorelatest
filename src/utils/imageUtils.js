/**
 * Utility to generate Cloudflare Image Transformation URLs for responsive image delivery
 * @param {string} url - Base image URL
 * @param {number} [width] - Desired image width
 * @param {string} [format='auto'] - Image format (avif, webp, auto)
 * @param {number} [quality=80] - Compression quality (1-100)
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (url, width, format = 'auto', quality = 80) => {
  if (!url || typeof url !== 'string') return '';

  // If the image is served from Cloudflare R2 or custom domain (images.indorelatest.com)
  if (url.includes('images.indorelatest.com')) {
    const parsedUrl = new URL(url);
    const pathname = parsedUrl.pathname;
    
    // Cloudflare Zone / Worker transformation URL structure
    const options = [`format=${format}`, `quality=${quality}`];
    if (width) options.push(`width=${width}`);

    return `${parsedUrl.origin}/cdn-cgi/image/${options.join(',')}${pathname}`;
  }

  return url;
};

/**
 * Generate srcset attribute string for responsive images (400w, 800w, 1200w, 1600w)
 * @param {string} url - Base image URL
 * @returns {string} Srcset string
 */
export const getSrcSet = (url) => {
  if (!url || typeof url !== 'string') return '';
  if (!url.includes('images.indorelatest.com')) return '';

  const widths = [400, 800, 1200, 1600];
  return widths
    .map((w) => `${getOptimizedImageUrl(url, w)} ${w}w`)
    .join(', ');
};

/**
 * Standard sizes string for responsive news layouts
 */
export const DEFAULT_SIZES = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px';
