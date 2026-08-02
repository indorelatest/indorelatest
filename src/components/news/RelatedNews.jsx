import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { getCategorySlugName } from '../../utils/categoryHelper';

export default function RelatedNews({ relatedArticles = [] }) {
  const { lang, t } = useLanguage();

  if (relatedArticles.length === 0) return null;

  return (
    <div className="pt-8 mt-10 border-t border-zinc-200 dark:border-zinc-800 font-sans">
      <h3 className="font-display font-extrabold text-lg md:text-xl text-zinc-900 dark:text-zinc-50 border-l-4 border-brand-red pl-3 mb-6">
        {t('relatedNews')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((article) => {
          const title = article[`title_${lang}`] || article.title_hi;
          const publishDate = article[`publishDate_${lang}`] || article.publishDate_hi;

          return (
            <div
              key={article.id}
              className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
                <img
                  src={article.image}
                  alt={title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col flex-1">
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-sans mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {publishDate}
                </span>
                <h4 className="font-display font-bold text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug">
                  <RouterLink to={`/${getCategorySlugName(article.category_hi)}/${article.id}`}>
                    {title}
                  </RouterLink>
                </h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
