import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BreakingNewsTicker from './components/news/BreakingNewsTicker';
import SearchModal from './components/common/SearchModal';
import BackToTopButton from './components/common/BackToTopButton';
import AppRoutes from './routes/AppRoutes';
import useNews from './hooks/useNews';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { news, searchNews } = useNews();

  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-300">
          
          {/* Sticky Header with Language Dropdown inside */}
          <Header onSearchClick={() => setIsSearchOpen(true)} />
          
          {/* Sticky Navbar (Sub-header) */}
          <Navbar />

          {/* Breaking News Ticker */}
          <BreakingNewsTicker news={news} />

          {/* Main Content Area */}
          <main className="flex-grow">
            <AppRoutes />
          </main>

          {/* Footer */}
          <Footer />

          {/* Global Action Overlays & Helper UI */}
          <SearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            searchNews={searchNews}
          />
          
          <BackToTopButton />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}
