import React, { useEffect } from 'react';

export default function SEO({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type = 'article',
  publishedAt,
  updatedAt,
  author,
  category,
  breadcrumbs = [],
}) {
  const siteName = 'Indore Latest';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const metaDescription = description || 'इंदौर और मध्यप्रदेश की ताज़ा खबरें, लाइव अपडेट्स, और समाचार | Indore Latest News';
  const metaImage = imageUrl || 'https://images.indorelatest.com/logo.png';
  const pageUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://indorelatest.com');

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to set/update meta tag
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace('meta[', '').replace(']', '').split('=');
        element.setAttribute(attrName, attrVal.replace(/"/g, ''));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Helper to set link tag
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta
    setMetaTag('meta[name="description"]', 'content', metaDescription);
    setLinkTag('canonical', pageUrl);

    // 3. OpenGraph Tags
    setMetaTag('meta[property="og:title"]', 'content', title || siteName);
    setMetaTag('meta[property="og:description"]', 'content', metaDescription);
    setMetaTag('meta[property="og:image"]', 'content', metaImage);
    setMetaTag('meta[property="og:url"]', 'content', pageUrl);
    setMetaTag('meta[property="og:type"]', 'content', type);
    setMetaTag('meta[property="og:site_name"]', 'content', siteName);

    // 4. Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'content', title || siteName);
    setMetaTag('meta[name="twitter:description"]', 'content', metaDescription);
    setMetaTag('meta[name="twitter:image"]', 'content', metaImage);

    // 5. NewsArticle JSON-LD Schema
    let newsSchemaElement = document.getElementById('newsarticle-ld-json');
    if (!newsSchemaElement) {
      newsSchemaElement = document.createElement('script');
      newsSchemaElement.id = 'newsarticle-ld-json';
      newsSchemaElement.type = 'application/ld+json';
      document.head.appendChild(newsSchemaElement);
    }

    const newsSchema = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': pageUrl,
      },
      'headline': title || siteName,
      'description': metaDescription,
      'image': [metaImage],
      'datePublished': publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      'dateModified': updatedAt ? new Date(updatedAt).toISOString() : (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()),
      'author': {
        '@type': 'Person',
        'name': author || 'Indore Latest Desk',
      },
      'publisher': {
        '@type': 'Organization',
        'name': siteName,
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://images.indorelatest.com/logo.png',
        },
      },
    };
    if (category) newsSchema['articleSection'] = category;
    newsSchemaElement.textContent = JSON.stringify(newsSchema);

    // 6. Breadcrumb JSON-LD Schema
    let breadcrumbSchemaElement = document.getElementById('breadcrumb-ld-json');
    if (!breadcrumbSchemaElement) {
      breadcrumbSchemaElement = document.createElement('script');
      breadcrumbSchemaElement.id = 'breadcrumb-ld-json';
      breadcrumbSchemaElement.type = 'application/ld+json';
      document.head.appendChild(breadcrumbSchemaElement);
    }

    const listItems = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://indorelatest.com',
      },
    ];

    if (category) {
      listItems.push({
        '@type': 'ListItem',
        'position': 2,
        'name': category,
        'item': `https://indorelatest.com/category/${encodeURIComponent(category)}`,
      });
    }

    if (title) {
      listItems.push({
        '@type': 'ListItem',
        'position': listItems.length + 1,
        'name': title,
        'item': pageUrl,
      });
    }

    breadcrumbSchemaElement.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': listItems,
    });
  }, [title, description, canonicalUrl, imageUrl, type, publishedAt, updatedAt, author, category]);

  return null;
}
