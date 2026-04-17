'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatDateTime, fetchEntityDetails } from '@/utils/activityUtils';

export const DynamicCallCard = ({ call, isTimelineView, onNavigate }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [entityName, setEntityName] = useState<string>('');

  // Format date and time
  const { date, time } = formatDateTime(call.createdAt);

  // Fetch entity name when component mounts
  useEffect(() => {
    const loadEntityName = async () => {
      if (call.entityType && call.entityId) {
        const name = await fetchEntityDetails(call.entityType, call.entityId);
        setEntityName(name);
      }
    };

    loadEntityName();
  }, [call.entityType, call.entityId]);

  // Convert HTML to plain text
  const convertToPlainText = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const plainDescription = convertToPlainText(call.description || '');

  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white mb-3 shadow-sm transition-all overflow-hidden">
      {/* Header - Always Visible */}
      <div
        className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <ChevronDown
            size={18}
            className={`text-[#5948DB] transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`}
          />

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-normal text-gray-900">Call</span>
              <span className="text-gray-500 font-normal">
                for {entityName || 'Loading...'}
              </span>
            </div>

            {/* Plain text subject */}
            <div className="text-[13px] mt-1 font-normal text-gray-700">
              {call.subject || 'Phone Call'}
            </div>
          </div>
        </div>

        {/* Plain timestamp */}
        <div className="text-[13px] text-gray-400 font-normal">
          {date} at {time}
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="px-12 pb-4 border-t border-gray-100 bg-white pt-4 animate-in slide-in-from-top-2 duration-200">
          {isTimelineView ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.();
              }}
              className="text-[13px] text-[#5948DB] font-medium hover:underline text-left"
            >
              Click to see call details →
            </button>
          ) : (
            <>
              {/* Plain text description */}
              <div className="text-[14px] text-gray-600 leading-relaxed mb-4">
                {plainDescription || "No description available"}
              </div>

              {/* Call details in plain text */}
              <div className="text-[12px] text-gray-500">
                {call.duration && <div>Duration: {call.duration}</div>}
                {call.phoneNumber && <div>Phone: {call.phoneNumber}</div>}
                {call.callType && <div>Type: {call.callType}</div>}
                {call.outcome && <div>Outcome: {call.outcome}</div>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
