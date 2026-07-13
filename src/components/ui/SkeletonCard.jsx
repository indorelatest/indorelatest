import React from 'react';

export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-[16/10] bg-zinc-200 dark:bg-zinc-800" />

      {/* Body Skeleton */}
      <div className="flex flex-col p-4 md:p-5 space-y-3">
        {/* Date Skeleton */}
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />

        {/* Title Skeletons */}
        <div className="space-y-2">
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
        </div>

        {/* Summary Skeletons */}
        <div className="space-y-1.5 pt-2">
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
        </div>

        {/* Button Skeleton */}
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4 pt-2" />
      </div>
    </div>
  );
}
