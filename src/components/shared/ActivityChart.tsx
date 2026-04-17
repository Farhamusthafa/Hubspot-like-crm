'use client';

import React from 'react';

export const ActivityChart = () => {
  const data = [
    { day: 'Mon', count: 12, color: 'bg-indigo-400' },
    { day: 'Tue', count: 18, color: 'bg-indigo-300' },
    { day: 'Wed', count: 15, color: 'bg-[#5948DB]' },
    { day: 'Thu', count: 25, color: 'bg-indigo-600' },
    { day: 'Fri', count: 20, color: 'bg-indigo-400' },
    { day: 'Sat', count: 8, color: 'bg-indigo-200' },
    { day: 'Sun', count: 5, color: 'bg-indigo-100' },
  ];

  const max = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white border border-indigo-50 p-6 rounded-3xl mb-8 animate-in slide-in-from-top-4 duration-700">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-[15px] font-bold text-gray-900">Activity Overview</h4>
          <p className="text-[12px] text-gray-400 font-medium">Weekly engagement metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#5948DB]" />
            <span className="text-[11px] font-bold text-gray-500 uppercase">Interactive</span>
          </div>
          <select className="bg-gray-50 border-0 text-[11px] font-bold text-gray-500 rounded-lg px-2 py-1 outline-none">
            <option>This Week</option>
            <option>Last Week</option>
          </select>
        </div>
      </div>

      <div className="flex items-end justify-between h-40 gap-4">
        {data.map((d, i) => (
          <div key={d.day} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full flex flex-col items-center">
              {/* Tooltip */}
              <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-300 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 pointer-events-none z-10">
                {d.count} Activities
              </div>
              
              {/* Bar */}
              <div 
                className={`w-full max-w-[32px] rounded-t-xl transition-all duration-1000 ease-out ${d.color} opacity-80 group-hover:opacity-100 group-hover:shadow-lg group-hover:shadow-indigo-100`}
                style={{ 
                  height: `${(d.count / max) * 100}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            </div>
            <span className="text-[11px] font-bold text-gray-400 mt-4 uppercase tracking-tighter">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
