import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useNews from '../../hooks/useNews';
import RelatedNews from '../../components/news/RelatedNews';
import ShareButtons from '../../components/news/ShareButtons';
import ReadingProgressBar from '../../components/news/ReadingProgressBar';
import TrendingSidebar from '../../components/news/TrendingSidebar';
import SEO from '../../components/common/SEO';
import ResponsiveImage from '../../components/common/ResponsiveImage';
import { useLanguage } from '../../context/LanguageContext';
import { ArrowLeft, User, Calendar, Tag, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function News() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { getNewsById, getRelatedNews, getTrendingNews, getMostReadNews, getLatestNews, loading } = useNews();

  const getCategorySlug = (catName) => {
    switch (catName) {
      case 'इंदौर': return '/indore';
      case 'मध्यप्रदेश': return '/madhya-pradesh';
      case 'देश': return '/india';
      case 'विदेश': return '/world';
      case 'सिंहस्थ': return '/simhastha';
      case 'टेक्नोलॉजी': return '/technology';
      case 'नौकरी और शिक्षा': return '/jobs-education';
      default: return `/category/${catName}`;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 space-y-6 animate-pulse">
        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
        <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
        <div className="h-[400px] bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
        <div className="space-y-3">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  const article = getNewsById(id);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center font-sans">
        <SEO title="News Not Found" description="The requested article could not be found." />
        <h2 className="text-2xl font-bold mb-4">{lang === 'en' ? 'News Not Found!' : 'ख़बर नहीं मिली!'}</h2>
        <p className="text-zinc-500 mb-6">
          {lang === 'en'
            ? 'The article might have been removed or the link is invalid.'
            : 'हो सकता है यह खबर हटा दी गई हो या इसका लिंक गलत हो।'}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('backToHome')}</span>
        </Link>
      </div>
    );
  }

  const title = article[`title_${lang}`] || article.title_hi;
  const summary = article[`summary_${lang}`] || article.summary_hi;
  const content = article[`content_${lang}`] || article.content_hi;
  const category = article[`category_${lang}`] || article.category_hi;
  const author = article[`author_${lang}`] || article.author_hi;
  const publishDate = article[`publishDate_${lang}`] || article.publishDate_hi;
  const heroImageSrc = article.imageUrl || article.image;

  const related = getRelatedNews(article.id, canonicalCategory(article.category_hi), 3);
  const trending = getTrendingNews(5);
  const mostRead = getMostReadNews(5);
  const latest = getLatestNews(5);

  function canonicalCategory(catHi) {
    return catHi;
  }

  // Split paragraphs
  const paragraphs = content.split('\n');

  return (
    <div className="w-full pb-16 relative">
      {/* Dynamic News SEO & Schema.org NewsArticle Metadata */}
      <SEO
        title={title}
        description={summary || title}
        canonicalUrl={`https://indorelatest.com/article/${article.id}`}
        imageUrl={heroImageSrc}
        publishedAt={article.publishedAt || article.createdAt}
        updatedAt={article.updatedAt}
        author={author}
        category={category}
      />

      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-brand-red dark:hover:text-brand-red transition-colors mb-6 cursor-pointer group font-sans"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{t('back')}</span>
        </button>

        {/* Main Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: News Detail content */}
          <motion.article
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-8 flex flex-col"
          >
            {/* Category tag */}
            <div className="mb-3">
              <Link
                to={getCategorySlug(article.category_hi)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-red uppercase tracking-wider hover:underline font-sans"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{category}</span>
              </Link>
            </div>

            {/* Headline */}
            <h1 className="font-display font-black text-2xl md:text-4xl lg:text-5xl leading-tight text-zinc-900 dark:text-zinc-50 mb-6">
              {title}
            </h1>

            {/* Author and Date Bar */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4 border-y border-zinc-200/80 dark:border-zinc-800 text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-sans mb-6">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-450" />
                <span className="font-bold text-zinc-700 dark:text-zinc-300">{author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-zinc-450" />
                <span>{t('published')}: {publishDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-zinc-450" />
                <span>{lang === 'en' ? 'Read Time: 3 mins' : 'पढ़ने का समय: 3 मिनट'}</span>
              </div>
            </div>

            {/* Large Hero Image (Eager Loading & High Fetch Priority) */}
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-md mb-6">
              <ResponsiveImage
                src={heroImageSrc}
                alt={article.alt || title}
                width={article.width || 1200}
                height={article.height || 675}
                loading="eager"
                fetchPriority="high"
                caption={article.caption}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Top Share Buttons */}
            <ShareButtons title={title} />

            {/* News Content Paragraphs */}
            <div className="prose prose-zinc dark:prose-invert max-w-none py-6">
              {paragraphs.map((para, idx) => (
                <p
                  key={idx}
                  className="mb-6 text-base md:text-lg leading-relaxed text-zinc-850 dark:text-zinc-200 font-sans"
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Bottom Share Buttons */}
            <ShareButtons title={title} />

            {/* Related News Section */}
            <RelatedNews relatedArticles={related} />

          </motion.article>

          {/* Right Column: Sticky Sidebar */}
          <div className="lg:col-span-4 hidden lg:block">
            <TrendingSidebar
              trendingNews={trending}
              mostReadNews={mostRead}
              latestNews={latest}
            />
          </div>

        </div>
        
      </div>
      
    </div>
  );
}
