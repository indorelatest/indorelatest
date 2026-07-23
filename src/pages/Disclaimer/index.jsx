import React from 'react';
import { motion } from 'framer-motion';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16 font-sans">
      {/* Page Title / Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-black text-zinc-950 dark:text-white font-display mb-4">
          Disclaimer
        </h1>
        <div className="w-16 h-1 bg-brand-red mx-auto" />
      </motion.div>

      {/* Main Content Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 md:p-10 shadow-sm space-y-6 text-zinc-850 dark:text-zinc-200 leading-relaxed text-base md:text-lg"
      >
        <p>
          IndoreLatest.com पर प्रकाशित सभी समाचार, लेख और अन्य सामग्री केवल सूचना प्रदान करने के उद्देश्य से प्रकाशित की जाती है।
        </p>

        <p>
          हम समाचारों को प्रकाशित करने से पहले उपलब्ध तथ्यों और विश्वसनीय स्रोतों के आधार पर सत्यापन का प्रयास करते हैं। फिर भी किसी समाचार में अनजाने में त्रुटि रह जाने की संभावना से पूरी तरह इनकार नहीं किया जा सकता।
        </p>

        <p>
          वेबसाइट पर प्रकाशित विचार, लेख या अतिथि लेख संबंधित लेखक के व्यक्तिगत विचार हो सकते हैं और आवश्यक नहीं कि वे IndoreLatest.com की आधिकारिक राय का प्रतिनिधित्व करें।
        </p>

        <p>
          यदि किसी प्रकाशित सामग्री में तथ्यात्मक त्रुटि दिखाई देती है या किसी व्यक्ति अथवा संस्था को आपत्ति है, तो कृपया हमें ईमेल करें। आवश्यक जांच के बाद उचित संशोधन या अपडेट किया जाएगा।
        </p>

        <p className="font-bold text-zinc-900 dark:text-white pt-2">
          संपर्क ईमेल:
        </p>

        <p>
          <a href="mailto:indorelatest@gmail.com" className="text-brand-red hover:underline font-semibold">indorelatest@gmail.com</a>
        </p>
      </motion.div>
    </div>
  );
}
