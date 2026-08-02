export const getCategorySlugName = (catName) => {
  switch (catName) {
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

export const getCategorySlug = (catName) => {
  const slug = getCategorySlugName(catName);
  return slug === 'article' ? `/category/${catName}` : `/${slug}`;
};
