import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const { lang, t } = useLanguage();

  const categories = [
    { name_hi: 'इंदौर', name_en: 'Indore', path: '/category/इंदौर' },
    { name_hi: 'मध्यप्रदेश', name_en: 'Madhya Pradesh', path: '/category/मध्यप्रदेश' },
    { name_hi: 'देश', name_en: 'India', path: '/category/देश' },
    { name_hi: 'विदेश', name_en: 'World', path: '/category/विदेश' },
    { name_hi: 'सिंहस्थ', name_en: 'Simhastha', path: '/category/सिंहस्थ' },
    { name_hi: 'टेक्नोलॉजी', name_en: 'Technology', path: '/category/टेक्नोलॉजी' },
    { name_hi: 'Jobs & Education', name_en: 'Jobs & Education', path: '/category/Jobs & Education' },
  ];

  return (
    <nav className="sticky top-16 md:top-20 z-30 w-full bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-300 hidden md:block">
      <div className="max-w-7xl mx-auto px-6">
        <ul className="flex items-center justify-start space-x-1 lg:space-x-2 py-3 overflow-x-auto no-scrollbar scroll-smooth">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide transition-all uppercase cursor-pointer ${
                  isActive
                    ? 'bg-brand-red text-white'
                    : 'text-zinc-700 dark:text-zinc-300 hover:text-brand-red dark:hover:text-brand-red hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                }`
              }
              end
            >
              {lang === 'en' ? 'Home' : 'गृह (Home)'}
            </NavLink>
          </li>
          {categories.map((cat) => (
            <li key={cat.name_en} className="shrink-0">
              <NavLink
                to={cat.path}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-md text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-brand-red text-white'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-brand-red dark:hover:text-brand-red hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`
                }
              >
                {cat[`name_${lang}`]}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
