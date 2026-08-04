const News = require('../models/News');

const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'yandexbot',
  'duckduckbot',
  'slurp',
  'twitterbot',
  'facebookexternalhit',
  'linkedinbot',
  'whatsapp',
  'telegrambot',
  'skypeuripreview',
  'discordbot',
];

const SITE_ORIGIN = 'https://indorelatest.com';
const IMAGE_ORIGIN = (process.env.R2_PUBLIC_DOMAIN || 'https://images.indorelatest.com').replace(/\/$/, '');

const CATEGORY_SLUGS = {
  indore: 'indore',
  'madhya pradesh': 'madhya-pradesh',
  'madhya-pradesh': 'madhya-pradesh',
  india: 'india',
  world: 'world',
  simhastha: 'simhastha',
  technology: 'technology',
  'jobs & education': 'jobs-education',
  'jobs and education': 'jobs-education',
  'jobs-education': 'jobs-education',
};

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));
};

const normalizeCategory = (catName = '') =>
  String(catName).trim().toLowerCase().replace(/\s+/g, ' ');

const getCategorySlugName = (...categoryValues) => {
  for (const categoryValue of categoryValues) {
    const normalized = normalizeCategory(categoryValue);
    if (CATEGORY_SLUGS[normalized]) return CATEGORY_SLUGS[normalized];

    switch (categoryValue) {
      case 'इंदौर': return 'indore';
      case 'मध्यप्रदेश': return 'madhya-pradesh';
      case 'देश': return 'india';
      case 'विदेश': return 'world';
      case 'सिंहस्थ': return 'simhastha';
      case 'टेक्नोलॉजी': return 'technology';
      case 'नौकरी और शिक्षा': return 'jobs-education';
      default:
        break;
    }
  }

  return 'article';
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const absoluteUrl = (url = '') => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  return `${SITE_ORIGIN}${url.startsWith('/') ? '' : '/'}${url}`;
};

const getArticleImageUrl = (article) => {
  const imageUrl = article.imageUrl || article.image || '';
  const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(imageUrl);
  const isDefaultLogo = /\/logo\.(png|jpe?g|webp)$/i.test(imageUrl);

  if (article.imageKey && (!imageUrl || isLocalhost || isDefaultLogo)) {
    return `${IMAGE_ORIGIN}/${String(article.imageKey).replace(/^\/+/, '')}`;
  }

  return absoluteUrl(imageUrl || '/logo.png');
};

const seoCrawlerMiddleware = async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';

  // Only intercept article routes for crawler user agents.
  const articleMatch = req.path.match(/^\/(article|news|indore|madhya-pradesh|india|world|simhastha|technology|jobs-education)\/([^/]+)/);

  if (!articleMatch || !isCrawler(userAgent)) {
    return next();
  }

  const articleId = articleMatch[2];

  try {
    const article = await News.findOne({ id: articleId });
    if (!article) return next();

    const title = article.title_hi || article.title_en || 'Indore Latest News';
    const description = article.summary_hi || article.summary_en || title;
    const imageUrl = getArticleImageUrl(article);
    const imageWidth = article.width || 1200;
    const imageHeight = article.height || 675;
    const imageAlt = article.alt || title;
    const categorySlug = getCategorySlugName(article.category_hi, article.category_en);
    const siteUrl = `${SITE_ORIGIN}/${categorySlug}/${article.id}`;
    const publishedIso = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
    const modifiedIso = article.updatedAt ? new Date(article.updatedAt).toISOString() : publishedIso;

    const schemaJson = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': siteUrl,
      },
      headline: title,
      description,
      image: [imageUrl],
      datePublished: publishedIso,
      dateModified: modifiedIso,
      author: {
        '@type': 'Person',
        name: article.author_hi || article.author_en || 'Indore Latest Desk',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Indore Latest',
        logo: {
          '@type': 'ImageObject',
          url: 'https://images.indorelatest.com/logo.png',
        },
      },
    });

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} | Indore Latest</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${siteUrl}" />

  <meta property="og:type" content="article" />
  <meta property="og:url" content="${siteUrl}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:secure_url" content="${imageUrl}" />
  <meta property="og:image:type" content="${article.mimeType || 'image/webp'}" />
  <meta property="og:image:width" content="${imageWidth}" />
  <meta property="og:image:height" content="${imageHeight}" />
  <meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />
  <meta property="og:site_name" content="Indore Latest" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${siteUrl}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <script type="application/ld+json">
    ${schemaJson}
  </script>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <img src="${imageUrl}" alt="${escapeHtml(imageAlt)}" />
</body>
</html>`;

    return res.status(200).send(html);
  } catch (err) {
    console.error('SEO Crawler Middleware Error:', err);
    next();
  }
};

module.exports = seoCrawlerMiddleware;
