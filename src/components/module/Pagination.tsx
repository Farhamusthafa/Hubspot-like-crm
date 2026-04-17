

'use client';

import React, { useMemo } from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push('...');
    
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = start; i <= end; i++) pages.push(i);
    
    if (currentPage < totalPages - 2) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center gap-1 font-sans">
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-2 py-1 text-sm text-[#98A2B3] hover:text-[#5948DB] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span>← Previous</span>
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-1 text-[#98A2B3]">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`
                  w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all
                  ${currentPage === page 
                    ? 'bg-[#5948DB] text-white shadow-sm' 
                    : 'text-[#475467] hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-2 py-1 text-sm text-[#5948DB] hover:text-[#4838b8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <span>Next →</span>
      </button>
    </div>
  );
};

export default Pagination;