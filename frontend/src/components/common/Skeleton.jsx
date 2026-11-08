import React from 'react';

export const Skeleton = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-[#E8E3E5] dark:bg-[#2A2A2A] rounded-[10px] ${className}`}
        />
      ))}
    </>
  );
};

export const ClubCardSkeleton = () => (
  <div className="bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl overflow-hidden p-0 shadow-2xs animate-pulse">
    <div className="h-44 bg-[#F8F7F8] dark:bg-[#242424] w-full" />
    <div className="p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-[#E8E3E5] dark:bg-[#2A2A2A]" />
        <div className="space-y-1.5 flex-1">
          <div className="h-4 bg-[#E8E3E5] dark:bg-[#2A2A2A] rounded w-3/4" />
          <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-full" />
      <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-5/6" />
      <div className="pt-4 border-t border-[#E8E3E5] dark:border-[#2E2E2E] flex justify-between">
        <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-1/4" />
        <div className="h-3 bg-[#E8E3E5] dark:bg-[#2A2A2A] rounded w-1/4" />
      </div>
    </div>
  </div>
);

export const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-[#1A1A1A] border border-[#E8E3E5] dark:border-[#2E2E2E] rounded-2xl overflow-hidden shadow-2xs animate-pulse flex flex-col justify-between">
    <div className="h-40 bg-[#F8F7F8] dark:bg-[#242424] w-full" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-[#E8E3E5] dark:bg-[#2A2A2A] rounded w-2/3" />
      <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-full" />
      <div className="space-y-1.5 pt-2">
        <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-1/2" />
        <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-1/3" />
      </div>
      <div className="pt-4 border-t border-[#E8E3E5] dark:border-[#2E2E2E] flex justify-between items-center">
        <div className="h-3 bg-[#F8F7F8] dark:bg-[#242424] rounded w-1/4" />
        <div className="h-8 bg-[#E8E3E5] dark:bg-[#2A2A2A] rounded-[10px] w-24" />
      </div>
    </div>
  </div>
);

export default Skeleton;
