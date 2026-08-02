import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function CategorySection({ categoryName, articles = [] }) {
  const { lang, t } = useLanguage();

  if (articles.length === 0) return null;

  // Category name dictionary
  const categoryTranslations = {
    'इंदौर': { hi: 'इंदौर', en: 'Indore' },
    'मध्यप्रदेश': { hi: 'मध्यप्रदेश', en: 'Madhya Pradesh' },
    'देश': { hi: 'देश', en: 'India' },
    'विदेश': { hi: 'विदेश', en: 'World' },
    'सिंहस्थ': { hi: 'सिंहस्थ', en: 'Simhastha' },
    'टेक्नोलॉजी': { hi: 'टेक्नोलॉजी', en: 'Technology' },
    'नौकरी और शिक्षा': { hi: 'नौकरी और शिक्षा', en: 'Jobs & Education' },
  };

  const displayName = categoryTranslations[categoryName]?.[lang] || categoryName;

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

  // Split into 1 featured and up to 4 smaller ones
  const featured = articles.find(a => a.featured) || articles[0];
  const items = articles.filter(a => a.id !== featured.id).slice(0, 4);

  const featTitle = featured[`title_${lang}`] || featured.title_hi;
  const featSummary = featured[`summary_${lang}`] || featured.summary_hi;
  const featPublishDate = featured[`publishDate_${lang}`] || featured.publishDate_hi;

  return (
    <section className="border-t border-zinc-200 dark:border-zinc-800 pt-8 pb-10 font-sans">
      
      {/* Category Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-6 bg-brand-red inline-block" />
          <h2 className="font-display font-black text-xl md:text-2xl text-zinc-900 dark:text-zinc-50 tracking-wide">
            {displayName}
          </h2>
        </div>
        <Link
          to={getCategorySlug(categoryName)}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-red-hover transition-colors uppercase tracking-wider group"
        >
          <span>{t('viewAll')}</span>
          <ChevronRight className="w-4.5 h-4.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Editorial Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Large Featured Article */}
        <div className="lg:col-span-5">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4 }}
            className="group flex flex-col h-full bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
              <img
                src={featured.image}
                alt={featTitle}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </div>
            <div className="flex flex-col flex-1 p-5">
              <div className="flex items-center gap-1.5 text-xs text-zinc-450 dark:text-zinc-500 mb-2.5 font-sans">
                <Calendar className="w-3.5 h-3.5" />
                <span>{featPublishDate}</span>
              </div>
              <h3 className="font-display font-bold text-lg md:text-xl text-zinc-900 dark:text-zinc-50 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug mb-3">
                <Link to={`/article/${featured.id}`}>
                  {featTitle}
                </Link>
              </h3>
              <p className="text-xs md:text-sm text-zinc-550 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                {featSummary}
              </p>
              <Link
                to={`/article/${featured.id}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-red-hover transition-colors uppercase tracking-wider mt-auto group-hover:translate-x-1 duration-200"
              >
                <span>{t('readMore')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.article>
        </div>

        {/* Right: Grid of 4 Smaller Cards */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {items.map((item) => {
              const cardTitle = item[`title_${lang}`] || item.title_hi;
              const cardPublishDate = item[`publishDate_${lang}`] || item.publishDate_hi;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.35 }}
                  className="group flex flex-col p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
                >
                  {/* Small Image */}
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-800 mb-3">
                    <img
                      src={item.image}
                      alt={cardTitle}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  
                  {/* Info */}
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-sans mb-1 block">
                      {cardPublishDate}
                    </span>
                    <h4 className="font-display font-bold text-xs md:text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug mb-3">
                      <Link to={`/article/${item.id}`}>
                        {cardTitle}
                      </Link>
                    </h4>
                    <Link
                      to={`/article/${item.id}`}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-red hover:text-brand-red-hover transition-colors uppercase tracking-wider mt-auto group-hover:translate-x-0.5 duration-200"
                    >
                      <span>{t('read')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
