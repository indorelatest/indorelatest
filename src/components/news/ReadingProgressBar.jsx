import React, { useState, useEffect } from 'react';

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Avoid divide by zero
      if (documentHeight - windowHeight <= 0) {
        setProgress(0);
        return;
      }

      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      setProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-16 md:top-20 left-0 w-full h-1 bg-zinc-200 dark:bg-zinc-800 z-40">
      <div
        className="h-full bg-brand-red reading-progress-bar transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
