import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkeletonCard from '../components/ui/SkeletonCard';

// Lazy loading pages for optimized performance
const Home = lazy(() => import('../pages/Home'));
const Category = lazy(() => import('../pages/Category'));
const News = lazy(() => import('../pages/News'));
const NotFound = lazy(() => import('../pages/NotFound'));

// Page skeleton loader wrapper
function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
      <div className="h-40 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryName" element={<Category />} />
        <Route path="/news/:id" element={<News />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
