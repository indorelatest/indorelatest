import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 flex flex-col items-center justify-center text-center font-sans">
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-6"
      >
        <span className="font-display font-black text-7xl md:text-9xl text-brand-red select-none">
          404
        </span>
        <h1 className="font-display font-black text-2xl md:text-4xl text-zinc-900 dark:text-zinc-50 leading-tight">
          पृष्ठ नहीं मिला (Page Not Found)
        </h1>
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          क्षमा करें, जिस पृष्ठ को आप खोजने का प्रयास कर रहे हैं वह मौजूद नहीं है या उसे हटा दिया गया है।
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-red-hover transition-all active:scale-95 shadow-md shadow-brand-red/10 cursor-pointer"
          >
            <Home className="w-4.5 h-4.5" />
            <span>मुख्य पृष्ठ पर जाएं</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 px-6 py-3 rounded-xl font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
            <span>पीछे जाएं</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
