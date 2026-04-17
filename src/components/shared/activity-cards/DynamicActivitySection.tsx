'use client';
import React from 'react';
import { formatMonth } from '@/utils/activityUtils';

interface Props {
  title: string;
  buttonLabel: string;
  onCreateClick: () => void;
  children: React.ReactNode;
}

export const DynamicActivitySection: React.FC<Props> = ({ title, buttonLabel, onCreateClick, children }) => {
  const month = formatMonth(new Date().toISOString());
  return (
    <div className="w-full space-y-6 mb-10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
        <button 
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-[#5948DB] text-white px-5 py-2.5 rounded-lg text-sm font-medium"
        >
          {buttonLabel}
        </button>
      </div>
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-gray-900">{month}</h4>
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
