import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, Calendar, Globe, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DarkModeToggle from '../common/DarkModeToggle';
import { useLanguage } from '../../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header({ onSearchClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const dropdownRef = useRef(null);
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

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMobileNavClick = (path) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleLangSelect = (selectedLang) => {
    toggleLanguage(selectedLang);
    setIsLangDropdownOpen(false);
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
          
          {/* Language Selector Dropdown */}
          <div className="relative font-sans" ref={dropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center justify-center md:gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-brand-red dark:hover:text-brand-red hover:border-brand-red/20 transition-all cursor-pointer w-9 h-9 md:w-auto md:h-10 md:px-3 md:py-2 shrink-0"
              aria-expanded={isLangDropdownOpen}
              aria-haspopup="true"
              aria-label="Toggle Language"
            >
              <Globe className="w-4.5 h-4.5 md:w-4 md:h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <span className="hidden md:inline">{lang === 'hi' ? 'हिंदी' : 'English'}</span>
              <ChevronDown className={`hidden md:inline w-3.5 h-3.5 text-zinc-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl py-1 z-55 overflow-hidden"
                >
                  <button
                    onClick={() => handleLangSelect('en')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer ${
                      lang === 'en' ? 'text-brand-red bg-zinc-50/50 dark:bg-zinc-800/30' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLangSelect('hi')}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer ${
                      lang === 'hi' ? 'text-brand-red bg-zinc-50/50 dark:bg-zinc-800/30' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    Hindi
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


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
