import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
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
              src="/logo.jpg"
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
          <p className="text-sm text-zinc-400 leading-relaxed">
            {t('aboutText')}
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-brand-red hover:text-white transition-colors cursor-pointer flex items-center justify-center w-8 h-8" aria-label="Facebook">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
              </svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-brand-red hover:text-white transition-colors cursor-pointer flex items-center justify-center w-8 h-8" aria-label="Twitter">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-brand-red hover:text-white transition-colors cursor-pointer flex items-center justify-center w-8 h-8" aria-label="Instagram">
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" className="p-2 rounded-full bg-zinc-900 hover:bg-brand-red hover:text-white transition-colors cursor-pointer flex items-center justify-center w-8 h-8" aria-label="Youtube">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.507a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.507 9.388.507 9.388.507s7.517 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
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
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-brand-red shrink-0 mt-0.5" />
              <span className="text-zinc-400">
                {t('address')}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand-red shrink-0" />
              <span className="text-zinc-400">+91 731 4455660</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-brand-red shrink-0" />
              <span className="text-zinc-400">editor@dailynews.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Footer: Copyright & Legal */}
      <div className="bg-zinc-990 py-6 border-t border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {t('copyright')}</p>
          <div className="flex items-center gap-4">
            <Link to="#" className="hover:text-brand-red transition-colors">{t('terms')}</Link>
            <span className="text-zinc-800">|</span>
            <Link to="/privacy-policy" className="hover:text-brand-red transition-colors">{t('privacy')}</Link>
            <span className="text-zinc-800">|</span>
            <Link to="/disclaimer" className="hover:text-brand-red transition-colors">{t('disclosure')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
