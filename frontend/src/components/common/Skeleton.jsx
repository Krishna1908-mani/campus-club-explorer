import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-[#E5E5E5] dark:bg-[#292929] rounded-[10px] ${className}`}
        />
      ))}
    </>
  );
};

export const ClubCardSkeleton = () => (
  <div className="bg-[#FFFFFF] dark:bg-[#1C1C1C] border border-[#E5E5E5] dark:border-[#383838] rounded-2xl overflow-hidden p-0 shadow-sm animate-pulse">
    <div className="h-44 bg-[#F5F3F2] dark:bg-[#292929] w-full" />
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#E5E5E5] dark:bg-[#383838]" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-[#E5E5E5] dark:bg-[#383838] rounded w-3/4" />
          <div className="h-3 bg-[#F5F3F2] dark:bg-[#292929] rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-[#F5F3F2] dark:bg-[#292929] rounded w-full" />
      <div className="h-3 bg-[#F5F3F2] dark:bg-[#292929] rounded w-5/6" />
      <div className="pt-4 border-t border-[#E5E5E5] dark:border-[#383838] flex justify-between">
        <div className="h-3 bg-[#F5F3F2] dark:bg-[#292929] rounded w-1/4" />
        <div className="h-3 bg-[#E5E5E5] dark:bg-[#383838] rounded w-1/4" />
      </div>
    </div>
  </div>
);

