
'use client';

import React from 'react';
import SearchInput from './SearchInput';
import Pagination from './Pagination';

export interface ModuleButton {
  id: string;
  label: string;
  variant: 'primary' | 'secondary';
  onClick: () => void;
  disabled?: boolean;
}

export interface ModuleHeaderProps {
  title: string;
  searchPlaceholder: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  buttons: ModuleButton[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({
  title,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  buttons,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
<div className="flex flex-col w-full bg-white rounded-t-xl border-x border-t border-gray-200 overflow-hidden mb-0">      {/* Top Row: Title and Actions */}
      <div className="flex flex-row items-center justify-between px-8 py-5 border-b border-gray-100">
        <h3 className="font-bold text-[24px] text-[#101828] tracking-tight">{title}</h3>
        <div className="flex items-center gap-3">
          {buttons.map((btn) => (
            <button
              key={btn.id}
              onClick={btn.onClick}
              disabled={btn.disabled}
              className={`
                px-8 py-2.5 
                text-[15px] 
                font-semibold 
                rounded-xl 
                transition-all 
                active:scale-95 
                disabled:opacity-50
                ${btn.variant === 'primary' 
                  ? 'bg-[#5948DB] text-white hover:bg-[#4838b8] border border-transparent' 
                  : 'bg-white text-[#5948DB] border-[1.5px] border-[#D0D5DD] hover:bg-gray-50'
                }
              `}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Bottom Row: Search and Pagination */}
      <div className="flex flex-row items-center justify-between px-6 py-4 bg-white">
        <div className="w-[420px]">
          <SearchInput placeholder={searchPlaceholder} value={searchValue} onChange={onSearchChange} />
        </div>
        <div className="flex-shrink-0">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>
    </div>
  );
};

export default ModuleHeader;