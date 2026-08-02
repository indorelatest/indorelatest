import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { lang, t } = useLanguage();

  const categories = [
    { name_hi: 'इंदौर', name_en: 'Indore', path: '/indore' },
    { name_hi: 'मध्यप्रदेश', name_en: 'Madhya Pradesh', path: '/madhya-pradesh' },
    { name_hi: 'देश', name_en: 'India', path: '/india' },
    { name_hi: 'विदेश', name_en: 'World', path: '/world' },
    { name_hi: 'सिंहस्थ', name_en: 'Simhastha', path: '/simhastha' },
    { name_hi: 'टेक्नोलॉजी', name_en: 'Technology', path: '/technology' },
    { name_hi: 'Jobs & Education', name_en: 'Jobs & Education', path: '/jobs-education' },
  ];

  const quickLinks = [
    { name_hi: 'गृह (Home)', name_en: 'Home', path: '/' },
    { name_hi: 'हमारे बारे में (About Us)', name_en: 'About Us', path: '/about' },
    { name_hi: 'संपर्क करें (Contact Us)', name_en: 'Contact Us', path: '/contact' },
    { name_hi: 'अस्वीकरण (Disclaimer)', name_en: 'Disclaimer', path: '/disclaimer' },
    { name_hi: 'निजता नीति (Privacy Policy)', name_en: 'Privacy Policy', path: '/privacy-policy' },
  ];

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 border-t-4 border-brand-red font-sans transition-colors duration-300">
      
      {/* Upper Footer: Branding & Quick Information */}
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Info Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3 focus:outline-none">
            <img
              src="/logo.png"
              alt="Indore Latest Logo"
              className="w-12 h-12 rounded-full object-cover border border-zinc-800"
            />
            <div className="flex flex-col">
              <span className="font-display font-black text-2xl leading-none uppercase text-white tracking-wide">
                {t('websiteName')}
              </span>
              <span className="text-[10px] text-zinc-500 tracking-widest font-semibold uppercase mt-1 leading-none">
                {lang === 'en' ? 'TRUSTED NEWS PORTAL' : 'विश्वसनीय समाचार पोर्टल'}
              </span>
            </div>
          </Link>
          <p className="text-sm text-zinc-450 leading-relaxed pt-1">
            {t('aboutText')}
          </p>
        </div>

        {/* Categories Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-base border-b border-zinc-800 pb-2 uppercase tracking-wider">
            {lang === 'en' ? 'Categories' : 'श्रेणियां'}
          </h3>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {categories.map((cat) => (
              <li key={cat.name_en}>
                <Link
                  to={cat.path}
                  className="hover:text-brand-red transition-colors flex items-center gap-1 group py-0.5"
                >
                  <span className="text-zinc-650 group-hover:text-brand-red">•</span>
                  <span>{cat[`name_${lang}`]}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-base border-b border-zinc-800 pb-2 uppercase tracking-wider">
            {lang === 'en' ? 'Quick Links' : 'त्वरित संपर्क'}
          </h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.name_en}>
                <Link
                  to={link.path}
                  className="hover:text-brand-red transition-colors flex items-center justify-between group"
                >
                  <span>{link[`name_${lang}`]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h3 className="text-white font-bold text-base border-b border-zinc-800 pb-2 uppercase tracking-wider">
            {lang === 'en' ? 'Contact Us' : 'संपर्क करें'}
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-red shrink-0" />
              <a href="mailto:indorelatest@gmail.com" className="text-zinc-400 hover:text-brand-red transition-colors">
                indorelatest@gmail.com
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer: Copyright */}
      <div className="bg-zinc-990 py-6 border-t border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center text-xs text-zinc-500">
          <p className="text-center">© {new Date().getFullYear()} {t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
