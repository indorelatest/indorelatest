import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  hi: {
    websiteName: "डेली न्यूज़",
    home: "गृह",
    trending: "ट्रेंडिंग",
    mostRead: "लोकप्रिय",
    latest: "ताज़ा समाचार",
    breakingNews: "ब्रेकिंग न्यूज़",
    viewAll: "सभी देखें",
    topStories: "मुख्य ख़बरें",
    readMore: "विस्तार से पढ़ें",
    read: "पढ़ें",
    relatedNews: "संबंधित ख़बरें",
    share: "खबर शेयर करें:",
    copied: "कॉपीड!",
    copyLink: "लिंक कॉपी करें",
    back: "पीछे जाएं",
    readTime: "पढ़ने का समय: 3 मिनट",
    published: "प्रकाशित",
    searchPlaceholder: "खबरें खोजें (उदा. इंदौर, गगनयान, बजट...)",
    searchHeading: "मिलान परिणाम",
    noResults: "कोई परिणाम नहीं मिले",
    startSearching: "कुछ खोजना शुरू करें...",
    searchDesc: "आप मुख्य समाचार, शहर, तकनीक आदि खोज सकते हैं।",
    adPlaceholder: "विज्ञापन",
    adTitle: "यहाँ विज्ञापन लगाएं",
    adDesc: "अपने व्यवसाय को डेली न्यूज़ के माध्यम से हजारों पाठकों तक पहुंचाएं।",
    contactUs: "हमसे संपर्क करें",
    aboutText: "डेली न्यूज़ मध्य प्रदेश और देश का एक विश्वसनीय हिंदी समाचार पोर्टल है। हम निष्पक्षता और सत्यता के सिद्धांतों पर चलकर पल-पल की ख़बरें आप तक पहुंचाते हैं।",
    copyright: "Daily News. सर्वाधिकार सुरक्षित।",
    address: "101, मीडिया हाइट्स, एबी रोड, इंदौर (म.प्र.) - 452001",
    terms: "नियम और शर्तें",
    privacy: "निजता नीति",
    disclosure: "सम्बद्धता विवरण",
    categoryArchive: "कैटेगरी आर्काइव",
    filter: "फ़िल्टर करें:",
    latestFilter: "नवीनतम",
    popularFilter: "लोकप्रिय",
    oldestFilter: "पुराना",
    prev: "पिछला",
    next: "अगला",
    errorTitle: "पृष्ठ नहीं मिला",
    errorDesc: "क्षमा करें, जिस पृष्ठ को आप खोजने का प्रयास कर रहे हैं वह मौजूद नहीं है या उसे हटा दिया गया है।",
    backToHome: "मुख्य पृष्ठ पर जाएं",
    facebook: "फेसबुक",
    twitter: "X (ट्विटर)",
    whatsapp: "व्हाट्सएप",
    telegram: "टेलीग्राम",
    language: "भाषा",
  },
  en: {
    websiteName: "Daily News",
    home: "Home",
    trending: "Trending",
    mostRead: "Most Read",
    latest: "Latest News",
    breakingNews: "Breaking News",
    viewAll: "View All",
    topStories: "Top Stories",
    readMore: "Read More",
    read: "Read",
    relatedNews: "Related News",
    share: "Share Story:",
    copied: "Copied!",
    copyLink: "Copy Link",
    back: "Back",
    readTime: "Read Time: 3 mins",
    published: "Published",
    searchPlaceholder: "Search news (e.g. Indore, Gaganyaan, Budget...)",
    searchHeading: "Search Results",
    noResults: "No results found",
    startSearching: "Start typing to search...",
    searchDesc: "Search by keywords like politics, cities, tech etc.",
    adPlaceholder: "ADVERTISEMENT",
    adTitle: "Advertise Here",
    adDesc: "Reach thousands of daily readers with your business banner.",
    contactUs: "Contact Us",
    aboutText: "Daily News is a trusted regional and national news portal. Committed to truth and journalistic integrity, we bring you latest updates.",
    copyright: "Daily News. All rights reserved.",
    address: "101, Media Heights, AB Road, Indore (M.P.) - 452001",
    terms: "Terms & Conditions",
    privacy: "Privacy Policy",
    disclosure: "Affiliation details",
    categoryArchive: "Category Archive",
    filter: "Filter By:",
    latestFilter: "Latest",
    popularFilter: "Popular",
    oldestFilter: "Oldest",
    prev: "Previous",
    next: "Next",
    errorTitle: "Page Not Found",
    errorDesc: "Sorry, the page you are looking for does not exist or has been moved.",
    backToHome: "Back to Home",
    facebook: "Facebook",
    twitter: "X (Twitter)",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    language: "Language",
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language');
      return saved === 'en' ? 'en' : 'hi';
    }
    return 'hi';
  });

  const toggleLanguage = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('language', selectedLang);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
