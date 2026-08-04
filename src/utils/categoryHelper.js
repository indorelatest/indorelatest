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

const normalizeCategory = (catName = '') =>
  String(catName).trim().toLowerCase().replace(/\s+/g, ' ');

export const getCategorySlugName = (catName, fallbackCatName = '') => {
  const normalized = normalizeCategory(catName);
  const normalizedFallback = normalizeCategory(fallbackCatName);

  if (CATEGORY_SLUGS[normalized]) return CATEGORY_SLUGS[normalized];
  if (CATEGORY_SLUGS[normalizedFallback]) return CATEGORY_SLUGS[normalizedFallback];

  switch (catName) {
    case 'इंदौर': return 'indore';
    case 'मध्यप्रदेश': return 'madhya-pradesh';
    case 'देश': return 'india';
    case 'विदेश': return 'world';
    case 'सिंहस्थ': return 'simhastha';
    case 'टेक्नोलॉजी': return 'technology';
    case 'नौकरी और शिक्षा': return 'jobs-education';
    default: return 'article';
  }
};

export const getCategorySlug = (catName, fallbackCatName = '') => {
  const slug = getCategorySlugName(catName, fallbackCatName);
  return slug === 'article' ? `/category/${catName}` : `/${slug}`;
};
