'use client';

import React from 'react';

export interface SearchInputProps {
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  value = '',
  onChange,
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="#98A2B3"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full pl-12 pr-4 h-[48px] bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-[16px] text-[#667085] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#5948DB]/10 focus:border-[#5948DB] transition-all"
      />
    </div>
  );
};

export default SearchInput;