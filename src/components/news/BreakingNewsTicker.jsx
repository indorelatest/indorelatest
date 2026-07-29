import React from 'react';
import { Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export default function BreakingNewsTicker({ news = [] }) {
  const { lang, t } = useLanguage();

  const breakingNews = news.length > 0 ? news.slice(0, 5) : [
    {
      id: 'indore-1',
      title_hi: 'स्वच्छता में फिर नंबर-1 बनने की तैयारी: इंदौर नगर निगम ने शुरू किया विशेष अभियान',
      title_en: 'Preparing to Be Number 1 Again in Cleanliness: Indore Municipal Corporation Launches Special Campaign'
    },
    {
      id: 'india-1',
      title_hi: 'इसरो का नया इतिहास: गगनयान मिशन के लिए क्रू मॉड्यूल का अंतिम परीक्षण सफलतापूर्वक पूरा',
      title_en: 'ISRO Makes History: Crew Module Final Test for Gaganyaan Mission Successfully Completed'
    },
    {
      id: 'mp-1',
      title_hi: 'मध्य प्रदेश कैबिनेट का बड़ा फैसला: प्रदेश में खुलेंगे 15 नए औद्योगिक पार्क',
      title_en: 'MP Cabinet Decision: 15 New Industrial Parks to Open'
    },
    {
      id: 'tech-1',
      title_hi: 'भारत का पहला स्वदेशी क्वांटम कंप्यूटर बनकर तैयार: सुरक्षा में आएगा क्रांतिकारी बदलाव',
      title_en: 'India\'s First Indigenous Quantum Computer Complete: Paradigm Shift in Security'
    },
  ];

  return (
    <div className="w-full bg-brand-red text-white h-10 md:h-12 flex items-center overflow-hidden border-y border-brand-red shadow-md font-sans transition-colors">
      
      {/* Label */}
      <div className="bg-zinc-950 px-4 md:px-6 h-full flex items-center gap-1.5 md:gap-2 shrink-0 z-10 select-none border-r border-brand-red font-extrabold tracking-wider text-xs md:text-sm uppercase italic">
        <Flame className="w-4.5 h-4.5 text-brand-red animate-pulse" />
        <span>{t('breakingNews')}</span>
      </div>

      {/* Scrolling Container */}
      <div className="relative flex items-center flex-1 h-full overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap gap-16 py-1 select-none hover:[animation-play-state:paused] cursor-pointer">
          {[...breakingNews, ...breakingNews].map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              to={`/article/${item.id}`}
              className="text-xs md:text-sm font-semibold tracking-wide hover:underline inline-flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full inline-block shrink-0" />
              {item[`title_${lang}`]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
