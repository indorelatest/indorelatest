import React from 'react';
import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-16 font-sans">
      {/* Page Title / Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-black text-zinc-950 dark:text-white font-display mb-4">
          Privacy Policy
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
        <p className="font-semibold text-zinc-600 dark:text-zinc-400">
          प्रभावी तिथि: जुलाई 2026
        </p>

        <p>
          IndoreLatest.com अपने पाठकों की गोपनीयता का सम्मान करता है। इस वेबसाइट का उपयोग करने पर आप इस प्राइवेसी पॉलिसी से सहमत होते हैं।
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white pt-4">
          हम कौन-सी जानकारी एकत्र कर सकते हैं?
        </h2>

        <ul className="list-none space-y-2 pl-2">
          <li className="flex items-start">
            <span className="mr-2 text-brand-red">•</span>
            <span>आपका ईमेल पता (यदि आप हमसे संपर्क करते हैं)</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand-red">•</span>
            <span>ब्राउज़र, डिवाइस और उपयोग संबंधी सामान्य तकनीकी जानकारी</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand-red">•</span>
            <span>कुकीज़ के माध्यम से सीमित जानकारी</span>
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white pt-4">
          जानकारी का उपयोग
        </h2>

        <p>
          हम आपकी जानकारी का उपयोग केवल:
        </p>

        <ul className="list-none space-y-2 pl-2">
          <li className="flex items-start">
            <span className="mr-2 text-brand-red">•</span>
            <span>आपके संदेश का उत्तर देने के लिए</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand-red">•</span>
            <span>वेबसाइट को बेहतर बनाने के लिए</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-brand-red">•</span>
            <span>सुरक्षा और तकनीकी समस्याओं के समाधान के लिए</span>
          </li>
        </ul>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white pt-4">
          कुकीज़
        </h2>

        <p>
          यह वेबसाइट उपयोगकर्ता अनुभव बेहतर बनाने और वेबसाइट के प्रदर्शन का विश्लेषण करने के लिए कुकीज़ का उपयोग कर सकती है।
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white pt-4">
          तृतीय पक्ष सेवाएं
        </h2>

        <p>
          वेबसाइट भविष्य में Google Analytics, Google AdSense या अन्य विश्वसनीय सेवाओं का उपयोग कर सकती है। इन सेवाओं की अपनी-अपनी प्राइवेसी नीतियां लागू होंगी।
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white pt-4">
          आपकी जानकारी की सुरक्षा
        </h2>

        <p>
          हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उचित प्रयास करते हैं। हालांकि, इंटरनेट पर किसी भी डेटा ट्रांसमिशन की 100% सुरक्षा की गारंटी नहीं जा सकती।
        </p>

        <h2 className="text-xl md:text-2xl font-bold text-zinc-900 dark:text-white pt-4">
          संपर्क
        </h2>

        <p>
          यदि इस प्राइवेसी पॉलिसी से संबंधित कोई प्रश्न हो, तो हमें ईमेल करें:
        </p>

        <p>
          <a href="mailto:indorelatest@gmail.com" className="text-brand-red hover:underline font-semibold">indorelatest@gmail.com</a>
        </p>
      </motion.div>
    </div>
  );
}
