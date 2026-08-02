import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkeletonCard from '../components/ui/SkeletonCard';

const Home = lazy(() => import('../pages/Home'));
const Category = lazy(() => import('../pages/Category'));
const News = lazy(() => import('../pages/News'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Admin = lazy(() => import('../pages/Admin'));
const Contact = lazy(() => import('../pages/Contact'));
const About = lazy(() => import('../pages/About'));
const Privacy = lazy(() => import('../pages/Privacy'));
const Disclaimer = lazy(() => import('../pages/Disclaimer'));

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
        <Route path="/indore" element={<Category categoryName="इंदौर" />} />
        <Route path="/madhya-pradesh" element={<Category categoryName="मध्यप्रदेश" />} />
        <Route path="/india" element={<Category categoryName="देश" />} />
        <Route path="/world" element={<Category categoryName="विदेश" />} />
        <Route path="/simhastha" element={<Category categoryName="सिंहस्थ" />} />
        <Route path="/technology" element={<Category categoryName="टेक्नोलॉजी" />} />
        <Route path="/jobs-education" element={<Category categoryName="नौकरी और शिक्षा" />} />
        <Route path="/article/:id" element={<News />} />
        <Route path="/:categorySlug/:id" element={<News />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/admin/*" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
