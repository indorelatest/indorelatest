import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import ResponsiveImage from '../common/ResponsiveImage';
import { getCategorySlugName } from '../../utils/categoryHelper';

export default function NewsCard({ item }) {
  const { lang, t } = useLanguage();
  const { id, imageUrl, image, alt, width, height } = item;

  const title = item[`title_${lang}`] || item.title_hi;
  const summary = item[`summary_${lang}`] || item.summary_hi;
  const category = item[`category_${lang}`] || item.category_hi;
  const publishDate = item[`publishDate_${lang}`] || item.publishDate_hi;

  const imageSrc = imageUrl || image;

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
    >
      {/* Card Image with Responsive Image optimization */}
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0">
        <ResponsiveImage
          src={imageSrc}
          alt={alt || title}
          width={width || 600}
          height={height || 375}
          loading="lazy"
          fetchPriority="low"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Category Badge overlay */}
        <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] md:text-xs font-bold px-2.5 py-1 rounded shadow-md tracking-wider pointer-events-none">
          {category}
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-4 md:p-5 font-sans">
        {/* Publish Date */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-450 dark:text-zinc-500 mb-2">
          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
          <span>{publishDate}</span>
        </div>

        {/* Title / Headline */}
        <h3 className="font-display font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-50 group-hover:text-brand-red transition-colors duration-200 line-clamp-2 leading-snug mb-2 mb-auto">
          <Link to={`/${getCategorySlugName(item.category_hi, item.category_en)}/${id}`} className="focus:outline-none">
            {title}
          </Link>
        </h3>

        {/* Two-Line Summary */}
        <p className="text-xs md:text-sm text-zinc-550 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {summary}
        </p>

        {/* Read More button */}
        <Link
          to={`/${getCategorySlugName(item.category_hi, item.category_en)}/${id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-red hover:text-brand-red-hover transition-colors uppercase tracking-wider mt-auto group-hover:translate-x-1 duration-200"
        >
          <span>{t('readMore')}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.article>
  );
}
