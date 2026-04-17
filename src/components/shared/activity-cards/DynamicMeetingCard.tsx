'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatDateTime, fetchEntityDetails } from '@/utils/activityUtils';

export const DynamicMeetingCard = ({ meeting, isTimelineView, onNavigate }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [entityName, setEntityName] = useState<string>('');

  // Format date and time
  const { date, time } = formatDateTime(meeting.createdAt);

  // Fetch entity name when component mounts
  useEffect(() => {
    const loadEntityName = async () => {
      if (meeting.entityType && meeting.entityId) {
        const name = await fetchEntityDetails(meeting.entityType, meeting.entityId);
        setEntityName(name);
      }
    };

    loadEntityName();
  }, [meeting.entityType, meeting.entityId]);

  // Convert HTML to plain text
  const convertToPlainText = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  };

  const plainDescription = convertToPlainText(meeting.description || '');

  return (
    <div className="w-full border border-gray-200 rounded-lg bg-white mb-3 shadow-sm transition-all overflow-hidden">
      {/* Header Area */}
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
              <span className="font-normal text-gray-900">Meeting</span>
              <span className="text-gray-500 font-normal">
                for {entityName || 'Loading...'}
              </span>
            </div>

            {/* Plain text title */}
            <div className="text-[13px] mt-1 font-normal text-gray-700">
              {meeting.title || meeting.subject || 'Meeting'}
            </div>
          </div>
        </div>

        {/* Plain timestamp */}
        <div className="text-[13px] text-gray-400 font-normal">
          {date} at {time}
        </div>
      </div>

      {/* Expandable Body Area */}
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
              Click to see meeting details →
            </button>
          ) : (
            <>
              {/* Plain text description */}
              <div className="text-[14px] text-gray-600 leading-relaxed mb-4">
                {plainDescription || "No description available"}
              </div>

              {/* Meeting details in plain text */}
              <div className="text-[12px] text-gray-500">
                {meeting.location && <div>Location: {meeting.location}</div>}
                {meeting.duration && <div>Duration: {meeting.duration}</div>}
                {meeting.meetingType && <div>Type: {meeting.meetingType}</div>}
                {meeting.startTime && <div>Start: {meeting.startTime}</div>}
                {meeting.endTime && <div>End: {meeting.endTime}</div>}
                {meeting.organizedBy && <div>Organized by: {meeting.organizedBy}</div>}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
