import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calendar, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function SearchModal({ isOpen, onClose, searchNews }) {
  const { lang, t } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const filtered = searchNews(query, lang);
    setResults(filtered);
  }, [query, lang, searchNews]);

  const handleResultClick = (id) => {
    onClose();
    navigate(`/article/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 md:px-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Area */}
            <div className="flex items-center gap-3 px-4 border-b border-zinc-200 dark:border-zinc-800 py-4 bg-zinc-50 dark:bg-zinc-900/50">
              <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full bg-transparent text-lg text-zinc-900 dark:text-zinc-50 outline-none placeholder-zinc-400 dark:placeholder-zinc-500 font-sans"
              />
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 font-sans">
              {query.trim() === '' ? (
                <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">{t('startSearching')}</p>
                  <p className="text-xs mt-1">{t('searchDesc')}</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 px-1 uppercase tracking-wider">
                    {t('searchHeading')} ({results.length})
                  </p>
                  {results.map((item) => {
                    const title = item[`title_${lang}`] || item.title_hi;
                    const summary = item[`summary_${lang}`] || item.summary_hi;
                    const category = item[`category_${lang}`] || item.category_hi;

                    return (
                      <div
                        key={item.id}
                        onClick={() => handleResultClick(item.id)}
                        className="group flex gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 cursor-pointer transition-all duration-200"
                      >
                        <img
                          src={item.image}
                          alt={title}
                          className="w-20 h-16 object-cover rounded-lg bg-zinc-100 dark:bg-zinc-800 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-brand-red/10 text-brand-red dark:bg-brand-red/20 mb-1">
                            {category}
                          </span>
                          <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-brand-red transition-colors line-clamp-1">
                            {title}
                          </h4>
                          <p className="text-xs text-zinc-450 dark:text-zinc-550 mt-0.5 line-clamp-1">
                            {summary}
                          </p>
                        </div>
                        <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-brand-red" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center text-zinc-400 dark:text-zinc-500">
                  <p className="text-sm">"{query}" {t('noResults')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
