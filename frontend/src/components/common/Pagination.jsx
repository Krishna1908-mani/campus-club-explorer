import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-[10px] border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] text-[#111111] dark:text-[#FAF9F7] hover:border-[#800020]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        // Simple windowing around current page
        if (
          pageNumber === 1 ||
          pageNumber === totalPages ||
          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
        ) {
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`w-10 h-10 rounded-[10px] text-sm font-semibold transition-all duration-150 ${
                currentPage === pageNumber
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] text-[#111111] dark:text-[#FAF9F7] hover:border-[#800020]/40'
              }`}
            >
              {pageNumber}
            </button>
          );
        } else if (
          pageNumber === currentPage - 2 ||
          pageNumber === currentPage + 2
        ) {
          return (
            <span key={pageNumber} className="px-1 text-[#737373]">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-[10px] border border-[#E5E5E5] dark:border-[#383838] bg-white dark:bg-[#1C1C1C] text-[#111111] dark:text-[#FAF9F7] hover:border-[#800020]/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
export default Pagination;

