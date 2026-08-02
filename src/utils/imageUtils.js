/**
 * Utility to generate Cloudflare Image Transformation URLs for responsive image delivery
 * @param {string} url - Base image URL
 * @param {number} [width] - Desired image width
 * @param {string} [format='auto'] - Image format (avif, webp, auto)
 * @param {number} [quality=80] - Compression quality (1-100)
 * @returns {string} Optimized URL
 */
export const getOptimizedImageUrl = (
  url,
  width,
  format = "auto",
  quality = 80,
) => {
  if (!url || typeof url !== "string") return "";

  const normalizedUrl = url.trim();

  if (!normalizedUrl) return "";

  // Use the direct URL whenever possible because the proxy and public R2 domain are already serving the image.
  if (
    normalizedUrl.includes("images.indorelatest.com") ||
    normalizedUrl.includes("/api/upload/image/")
  ) {
    return normalizedUrl;
  }

  return normalizedUrl;
};

/**
 * Generate srcset attribute string for responsive images (400w, 800w, 1200w, 1600w)
 * @param {string} url - Base image URL
 * @returns {string} Srcset string
 */
export const getSrcSet = (url) => {
  if (!url || typeof url !== "string") return "";

  const normalizedUrl = url.trim();
  if (!normalizedUrl) return "";

  if (
    !normalizedUrl.includes("images.indorelatest.com") &&
    !normalizedUrl.includes("/api/upload/image/")
  ) {
    return "";
  }

  const widths = [400, 800, 1200, 1600];
  return widths
    .map((w) => `${getOptimizedImageUrl(normalizedUrl, w)} ${w}w`)
    .join(", ");
};

/**
 * Standard sizes string for responsive news layouts
 */
export const DEFAULT_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px";
