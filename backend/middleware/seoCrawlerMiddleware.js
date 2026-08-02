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

const isCrawler = (userAgent) => {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_USER_AGENTS.some((bot) => ua.includes(bot));
};

const seoCrawlerMiddleware = async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';

  // Only intercept article routes for crawler user agents
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
    const imageUrl = article.imageUrl || article.image || 'https://images.indorelatest.com/logo.png';
    
    const getCategorySlugName = (catHi) => {
      switch (catHi) {
        case 'इंदौर': return 'indore';
        case 'मध्यप्रदेश': return 'madhya-pradesh';
        case 'देश': return 'india';
        case 'विदेश': return 'world';
        case 'सिंहस्थ': return 'simhastha';
        case 'टेक्नोलॉजी': return 'technology';
        case 'Jobs & Education': return 'jobs-education';
        default: return 'article';
      }
    };
    const categorySlug = getCategorySlugName(article.category_hi);
    const siteUrl = `https://indorelatest.com/${categorySlug}/${article.id}`;
    const publishedIso = article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString();
    const modifiedIso = article.updatedAt ? new Date(article.updatedAt).toISOString() : publishedIso;

    const schemaJson = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': siteUrl,
      },
      'headline': title,
      'description': description,
      'image': [imageUrl],
      'datePublished': publishedIso,
      'dateModified': modifiedIso,
      'author': {
        '@type': 'Person',
        'name': article.author_hi || article.author_en || 'Indore Latest Desk',
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Indore Latest',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://images.indorelatest.com/logo.png',
        },
      },
    });

    const html = `<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <title>${title} | Indore Latest</title>
  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />
  <link rel="canonical" href="${siteUrl}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${siteUrl}" />
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:site_name" content="Indore Latest" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${siteUrl}" />
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta name="twitter:image" content="${imageUrl}" />
  
  <!-- Schema.org NewsArticle JSON-LD -->
  <script type="application/ld+json">
    ${schemaJson}
  </script>
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${imageUrl}" alt="${title.replace(/"/g, '&quot;')}" />
</body>
</html>`;

    return res.status(200).send(html);
  } catch (err) {
    console.error('SEO Crawler Middleware Error:', err);
    next();
  }
};

module.exports = seoCrawlerMiddleware;
