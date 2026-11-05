import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`}
        />
      ))}
    </>
  );
};

export const ClubCardSkeleton = () => (
  <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden p-0 shadow-sm animate-pulse">
    <div className="h-44 bg-gray-200 dark:bg-gray-800 w-full" />
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-700" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-full" />
      <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-5/6" />
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between">
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4" />
        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
      </div>
    </div>
  </div>
);
