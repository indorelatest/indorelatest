import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../common/DarkModeToggle';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ onSearchClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();

  const categories = [
    { name_hi: 'इंदौर', name_en: 'Indore', path: '/indore' },
    { name_hi: 'मध्यप्रदेश', name_en: 'Madhya Pradesh', path: '/madhya-pradesh' },
    { name_hi: 'देश', name_en: 'India', path: '/india' },
    { name_hi: 'विदेश', name_en: 'World', path: '/world' },
    { name_hi: 'सिंहस्थ', name_en: 'Simhastha', path: '/simhastha' },
    { name_hi: 'टेक्नोलॉजी', name_en: 'Technology', path: '/technology' },
    { name_hi: 'नौकरी और शिक्षा', name_en: 'Jobs & Education', path: '/jobs-education' },
  ];

  useEffect(() => {
    // Format current date dynamically based on active language
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const locale = lang === 'en' ? 'en-US' : 'hi-IN';
    const dateStr = new Date().toLocaleDateString(locale, options);
    setFormattedDate(dateStr);
  }, [lang]);

  const handleMobileNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-300">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* Branding (Logo + Name) */}
        <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0 focus:outline-none">
          <img
            src="/logo.png"
            alt="Indore Latest Logo"
            className="w-8 h-8 md:w-12 md:h-12 rounded-full object-cover border border-zinc-200 dark:border-zinc-850"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=100&auto=format&fit=crop&q=80";
            }}
          />
          <div className="flex flex-col font-sans">
            <span className="font-display font-extrabold text-base md:text-2xl leading-none uppercase tracking-wide text-brand-red whitespace-nowrap">
              {t('websiteName')}
            </span>
            <span className="text-[7.5px] md:text-[10px] text-zinc-400 dark:text-zinc-500 tracking-widest font-semibold uppercase leading-none mt-0.5 md:mt-1 whitespace-nowrap">
              {lang === 'en' ? 'TRUSTED NEWS PORTAL' : 'विश्वसनीय समाचार पोर्टल'}
            </span>
          </div>
        </Link>

        {/* Date Display (Desktop only) */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 font-sans border-l border-r border-zinc-200 dark:border-zinc-800 px-6 py-2">
          <Calendar className="w-4 h-4 text-brand-red" />
          <span>{formattedDate}</span>
        </div>

        {/* Actions (Language Dropdown, Search, Dark Mode, Hamburger) */}
        <div className="flex items-center gap-1 md:gap-3">
          
          {/* Language Selector Toggle */}
          <button
            onClick={() => toggleLanguage(lang === 'hi' ? 'en' : 'hi')}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-brand-red dark:hover:text-brand-red hover:border-brand-red/30 transition-all cursor-pointer h-8 md:h-9 px-2.5 flex items-center justify-center shrink-0 font-sans font-bold text-[10px] md:text-xs"
            aria-label="Toggle Language"
          >
            {lang === 'hi' ? 'हिंदी' : 'ENG'}
          </button>


          <button
            onClick={onSearchClick}
            className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-brand-red dark:hover:text-brand-red hover:border-brand-red/30 transition-all cursor-pointer w-9 h-9 md:w-10 md:h-10 flex items-center justify-center shrink-0"
            aria-label="Search articles"
          >
            <Search className="w-4.5 h-4.5 md:w-5 md:h-5" />
          </button>
          
          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Mobile Hamburger Menu (Extreme Right) */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer w-9 h-9 flex items-center justify-center shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-1">
              {/* Date in Mobile Drawer */}
              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 font-sans pb-3 mb-2 border-b border-zinc-150 dark:border-zinc-850">
                <Calendar className="w-4 h-4 text-brand-red" />
                <span>{formattedDate}</span>
              </div>
              
              {categories.map((cat) => (
                <button
                  key={cat.name_en}
                  onClick={() => handleMobileNavClick(cat.path)}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-brand-red dark:hover:text-brand-red transition-all cursor-pointer"
                >
                  {cat[`name_${lang}`]}
                </button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
