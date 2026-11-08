import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination Navigation">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-[10px] border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1A1A1A] text-[#151515] dark:text-[#FAF9F7] hover:border-[#800020]/40 hover:bg-[#F8F7F8] dark:hover:bg-[#242424] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        if (
          pageNumber === 1 ||
          pageNumber === totalPages ||
          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
        ) {
          const isCurrent = currentPage === pageNumber;
          return (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-10 h-10 rounded-[10px] text-sm font-semibold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#800020] ${
                isCurrent
                  ? 'bg-[#800020] text-white shadow-xs'
                  : 'border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1A1A1A] text-[#151515] dark:text-[#FAF9F7] hover:border-[#800020]/40 hover:bg-[#F8F7F8] dark:hover:bg-[#242424]'
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
            <span key={pageNumber} className="px-1 text-[#777777] dark:text-[#A3A3A3] select-none" aria-hidden="true">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-[10px] border border-[#E8E3E5] dark:border-[#2E2E2E] bg-white dark:bg-[#1A1A1A] text-[#151515] dark:text-[#FAF9F7] hover:border-[#800020]/40 hover:bg-[#F8F7F8] dark:hover:bg-[#242424] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#800020]"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </nav>
  );
};

export default Pagination;
