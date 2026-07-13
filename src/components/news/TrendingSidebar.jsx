import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Award, Clock } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TrendingSidebar({ trendingNews = [], mostReadNews = [], latestNews = [] }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('trending'); // trending, read, latest

  const getActiveList = () => {
    switch (activeTab) {
      case 'trending':
        return trendingNews.slice(0, 5);
      case 'read':
        return mostReadNews.slice(0, 5);
      case 'latest':
        return latestNews.slice(0, 5);
      default:
        return trendingNews.slice(0, 5);
    }
  };

  return (
    <aside className="space-y-6 lg:sticky lg:top-36 self-start font-sans">
      
      {/* Tabbed Widgets */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Tabs Header */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-3 px-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'trending'
                ? 'border-b-2 border-brand-red text-brand-red bg-white dark:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-250'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('trending')}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 py-3 px-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'read'
                ? 'border-b-2 border-brand-red text-brand-red bg-white dark:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-250'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Read' : 'पढ़ें'}</span>
          </button>
          
          <button
            onClick={() => setActiveTab('latest')}
            className={`flex-1 py-3 px-2 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors ${
              activeTab === 'latest'
                ? 'border-b-2 border-brand-red text-brand-red bg-white dark:bg-zinc-900'
                : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-250'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Fresh' : 'ताज़ा'}</span>
          </button>
        </div>

        {/* List Content */}
        <div className="p-4 space-y-4">
          {getActiveList().map((item, index) => {
            const title = item[`title_${lang}`] || item.title_hi;
            const category = item[`category_${lang}`] || item.category_hi;

            return (
              <div key={item.id} className="flex gap-3 items-start group">
                {/* Number indicator */}
                <span className="font-display font-black text-2xl text-zinc-300 dark:text-zinc-700 w-6 shrink-0 text-center leading-none mt-1 group-hover:text-brand-red transition-colors">
                  {String(index + 1).padStart(2, '0')}
                </span>
                
                {/* Content */}
                <div className="min-w-0">
                  <Link
                    to={`/news/${item.id}`}
                    className="font-display font-bold text-xs md:text-sm text-zinc-800 dark:text-zinc-100 group-hover:text-brand-red transition-colors line-clamp-2 leading-snug"
                  >
                    {title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-zinc-450 dark:text-zinc-500 font-sans">
                    <span className="font-semibold text-brand-red uppercase">{category}</span>
                    <span>•</span>
                    <span>{item.views.toLocaleString(lang === 'en' ? 'en-US' : 'hi-IN')} {lang === 'en' ? 'views' : 'व्यूज'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </aside>
  );
}
