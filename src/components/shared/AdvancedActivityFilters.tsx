'use client';

import React, { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  Calendar, 
  Users, 
  Filter, 
  BarChart3, 
  X,
  Plus
} from 'lucide-react';

interface Owner {
  id: string;
  name: string;
  avatar: string;
}

const OWNERS: Owner[] = [
  { id: '1', name: 'Maria Johnson', avatar: 'MJ' },
  { id: '2', name: 'Jane Cooper', avatar: 'JC' },
  { id: '3', name: 'Guy Hawkins', avatar: 'GH' },
];

export const AdvancedActivityFilters = () => {
  const [selectedOwners, setSelectedOwners] = useState<Owner[]>([]);
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);
  const [timePeriod, setTimePeriod] = useState('All Time');
  const [searchQuery, setSearchQuery] = useState('');

  const toggleOwner = (owner: Owner) => {
    setSelectedOwners(prev => 
      prev.find(o => o.id === owner.id) 
        ? prev.filter(o => o.id !== owner.id)
        : [...prev, owner]
    );
  };

  const removeOwner = (id: string) => {
    setSelectedOwners(prev => prev.filter(o => o.id !== id));
  };

  return (
    <div className="flex flex-col gap-4 mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-3">
        {/* Search Bar - Premium Style */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400 group-focus-within:text-[#5948DB] transition-colors" />
          </div>
          <input 
            type="text"
            placeholder="Search activities, notes, emails..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl text-[14px] outline-none hover:border-gray-200 focus:border-[#5948DB] focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm"
          />
        </div>

        {/* Time Period Dropdown */}
        <div className="relative">
          <button 
            className="h-11 px-4 flex items-center gap-2 bg-white border border-gray-100 rounded-2xl text-[13px] font-semibold text-gray-700 hover:border-indigo-100 hover:bg-gray-50 transition-all shadow-sm"
            onClick={() => {}}
          >
            <Calendar size={15} className="text-[#5948DB]" />
            <span>{timePeriod}</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </div>

        {/* Charts Toggle */}
        <button className="h-11 w-11 flex items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-[#5948DB] hover:border-indigo-100 hover:bg-gray-50 transition-all shadow-sm">
          <BarChart3 size={18} />
        </button>
      </div>

      {/* Advanced Filters Row */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-gray-400">
          <Filter size={14} />
          <span className="text-[11px] font-bold uppercase tracking-wider">Filters:</span>
        </div>

        {/* Owner Multi-select Chips */}
        <div className="flex items-center gap-2 py-1 overflow-x-auto no-scrollbar">
          {selectedOwners.map(owner => (
            <div 
              key={owner.id}
              className="flex items-center gap-2 pl-1 pr-2 py-1 bg-indigo-50 border border-indigo-100 rounded-full animate-in zoom-in-75 duration-200"
            >
              <div className="w-5 h-5 rounded-full bg-[#5948DB] text-white flex items-center justify-center text-[10px] font-bold">
                {owner.avatar}
              </div>
              <span className="text-[12px] font-medium text-indigo-900">{owner.name}</span>
              <button 
                onClick={() => removeOwner(owner.id)}
                className="p-0.5 hover:bg-indigo-200 rounded-full transition-colors"
              >
                <X size={12} className="text-indigo-400" />
              </button>
            </div>
          ))}

          <div className="relative">
            <button 
              onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
              className="flex items-center gap-1.5 px-3 py-1 border border-dashed border-gray-300 rounded-full text-[12px] font-medium text-gray-500 hover:border-[#5948DB] hover:text-[#5948DB] transition-all"
            >
              <Plus size={12} />
              <span>Add Owner</span>
            </button>

            {showOwnerDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowOwnerDropdown(false)} 
                />
                <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 animate-in slide-in-from-top-2 duration-200">
                  <p className="px-4 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Select Owner</p>
                  {OWNERS.map(owner => (
                    <button
                      key={owner.id}
                      onClick={() => { toggleOwner(owner); setShowOwnerDropdown(false); }}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[11px] font-bold text-gray-600">
                        {owner.avatar}
                      </div>
                      <span className="text-[13px] font-medium text-gray-700">{owner.name}</span>
                      {selectedOwners.find(o => o.id === owner.id) && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-[#5948DB]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Clear All */}
        {selectedOwners.length > 0 && (
          <button 
            onClick={() => setSelectedOwners([])}
            className="text-[12px] font-bold text-gray-400 hover:text-rose-500 transition-colors ml-auto"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  );
};
