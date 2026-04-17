// 'use client';

// import React, { useState, useEffect } from 'react';
// import { ChevronDown } from 'lucide-react';
// import { formatDateTime, fetchEntityDetails } from '@/utils/activityUtils';

// export const DynamicNoteCard = ({ note, isTimelineView, onNavigate }: any) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [entityName, setEntityName] = useState<string>('');

//   // Format date and time
//   const { date, time } = formatDateTime(note.createdAt);

//   // Fetch entity name when component mounts
//   useEffect(() => {
//     const loadEntityName = async () => {
//       if (note.entityType && note.entityId) {
//         const name = await fetchEntityDetails(note.entityType, note.entityId);
//         setEntityName(name);
//       }
//     };

//     loadEntityName();
//   }, [note.entityType, note.entityId]);

//   // Convert HTML to plain text
//   const convertToPlainText = (html: string) => {
//     if (!html) return '';
//     return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
//   };

//   const plainContent = convertToPlainText(note.description || note.content || '');

//   return (
//     <div className="w-full border border-gray-200 rounded-lg bg-white mb-3 shadow-sm transition-all overflow-hidden">
//       {/* Header - Always Visible */}
//       <div
//         className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-3">
//           <ChevronDown
//             size={18}
//             className={`text-[#5948DB] transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`}
//           />

//           <div className="flex flex-col">
//             <div className="flex items-center gap-1.5 text-sm">
//               <span className="font-normal text-gray-900">Note</span>
//               <span className="text-gray-500 font-normal">
//                 for {entityName || 'Loading...'}
//               </span>
//             </div>

//             {/* Plain text title */}
//             <div className="text-[13px] mt-1 font-normal text-gray-700">
//               {note.title || 'Note'}
//             </div>
//           </div>
//         </div>

//         {/* Plain timestamp */}
//         <div className="text-[13px] text-gray-400 font-normal">
//           {date} at {time}
//         </div>
//       </div>

//       {/* Expandable Content Area */}
//       {isExpanded && (
//         <div className="px-12 pb-4 border-t border-gray-100 bg-white pt-4 animate-in slide-in-from-top-2 duration-200">
//           {isTimelineView ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onNavigate?.();
//               }}
//               className="text-[13px] text-[#5948DB] font-medium hover:underline text-left"
//             >
//               Click to see note details →
//             </button>
//           ) : (
//             <div className="text-[14px] text-gray-600 leading-relaxed">
//               {plainContent || "No content available"}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { formatDateTime } from '@/utils/activityUtils';

export const DynamicNoteCard = ({ note, isTimelineView, onNavigate }: any) => {
  const { date, time } = formatDateTime(note.createdAt);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full border border-gray-200 rounded-lg p-4 bg-white mb-3 shadow-sm">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <ChevronDown 
            onClick={() => setIsExpanded(!isExpanded)} 
            size={18} 
            className={`cursor-pointer text-[#5948DB] transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`} 
          />
          
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-sm">
              <span className="font-bold text-gray-900">Note</span>
              <span className="text-gray-500 font-normal">
                by {note.createdBy || 'Maria Johnson'}
              </span>
            </div>
            
            {/* The "Sample Note" link from your image */}
            <button className="text-[#5948DB] text-[13px] mt-1 font-medium hover:underline text-left w-fit">
              {note.status || 'Sample Note'}
            </button>
          </div>
        </div>

        {/* Plain text timestamp on the right */}
        <div className="text-[13px] text-gray-400 font-medium">
          {date || 'June 24, 2025'} at {time || '5:30PM'}
        </div>
      </div>

      {/* Expandable Content Area */}
      {isExpanded && (
        <div className="mt-4 pl-8 pr-4 py-3 border-t border-gray-50 text-[14px] text-gray-600 leading-relaxed animate-in slide-in-from-top-2">
          {isTimelineView ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.();
              }}
              className="text-[13px] text-[#5948DB] font-medium hover:underline text-left"
            >
              Click to see note details →
            </button>
          ) : (
            note.description || "Note content goes here..."
          )}
        </div>
      )}
    </div>
  );
};
