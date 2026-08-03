import React, { useState } from 'react';
import { Link, Check, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function ShareButtons({ title = '' }) {
  const { lang, t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareText = encodeURIComponent(`इंदौर लेटेस्ट पर पढ़ें: ${title}`);
  const currentUrl = encodeURIComponent(window.location.href);

  return (
    <div className="flex flex-wrap items-center gap-3 py-4 border-y border-zinc-200 dark:border-zinc-800 my-6 font-sans">
      <span className="text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">
        {t('share')}
      </span>
      
      {/* Facebook Share */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-semibold transition-colors cursor-pointer"
        aria-label="Share on Facebook"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
        </svg>
        <span className="hidden sm:inline">{t('facebook')}</span>
      </a>

      {/* Twitter Share */}
      <a
        href={`https://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900/10 dark:bg-zinc-100/10 hover:bg-zinc-900/20 dark:hover:bg-zinc-100/20 text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition-colors cursor-pointer"
        aria-label="Share on X"
      >
        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span className="hidden sm:inline">{t('twitter')}</span>
      </a>

      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${shareText}%20${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] text-xs font-semibold transition-colors cursor-pointer"
        aria-label="Share on WhatsApp"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.588 1.453 5.41 1.454 5.536 0 10.039-4.505 10.043-10.047.002-2.684-1.038-5.207-2.93-7.101C17.279 1.565 14.768.518 12.016.518c-5.54 0-10.044 4.507-10.047 10.05-.001 1.895.501 3.734 1.456 5.329l-.955 3.49 3.578-.933zm11.352-7.795c-.3-.149-1.77-.875-2.044-.974-.275-.098-.476-.149-.675.149-.199.299-.77.975-.944 1.173-.173.199-.348.224-.648.074-.3-.149-1.27-.47-2.42-1.493-.896-.8-1.5-1.787-1.675-2.086-.174-.3-.018-.462.13-.61.135-.133.3-.349.45-.523.15-.174.2-.299.3-.498.1-.199.05-.374-.025-.523-.075-.149-.675-1.63-.925-2.23-.244-.589-.493-.51-.675-.519-.172-.008-.371-.01-.571-.01-.2 0-.524.074-.798.374-.275.299-1.05 1.025-1.05 2.5s1.075 2.902 1.225 3.101c.15.199 2.113 3.227 5.12 4.526.715.309 1.273.494 1.708.633.719.228 1.373.195 1.89.117.577-.087 1.77-.724 2.02-1.42.25-.697.25-1.295.175-1.42-.075-.125-.275-.199-.575-.349z" />
        </svg>
        <span className="hidden sm:inline">{t('whatsapp')}</span>
      </a>

      {/* Telegram Share */}
      <a
        href={`https://t.me/share/url?url=${currentUrl}&text=${shareText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] text-xs font-semibold transition-colors cursor-pointer"
        aria-label="Share on Telegram"
      >
        <Send className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{t('telegram')}</span>
      </a>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-650 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer relative"
        aria-label="Copy Link"
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1 text-emerald-600 font-bold"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('copied')}</span>
            </motion.span>
          ) : (
            <motion.span
              key="link"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex items-center gap-1"
            >
              <Link className="w-3.5 h-3.5" />
              <span>{t('copyLink')}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
