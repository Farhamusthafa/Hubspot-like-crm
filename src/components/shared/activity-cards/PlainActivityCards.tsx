// 'use client';

// import React, { useState, useEffect } from 'react';
// import { formatDateTime, fetchEntityDetails } from '@/utils/activityUtils';

// export const PlainNoteCard = ({ note, onNavigate }: any) => {
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

//   return (
//     <div className="w-full border border-gray-200 rounded-lg p-4 bg-white mb-3 shadow-sm">
//       <div className="flex justify-between items-start">
//         <div className="flex flex-col">
//           <div className="flex items-center gap-1.5 text-sm">
//             <span className="font-bold text-gray-900">Note</span>
//             <span className="text-gray-500 font-normal">
//               for {entityName || 'Loading...'}
//             </span>
//           </div>

//           <div className="text-[13px] mt-1 font-medium text-gray-700">
//             {note.title || 'Note'}
//           </div>

//           {/* Plain text content */}
//           <div className="text-[14px] text-gray-600 leading-relaxed mt-2">
//             {note.description || note.content || "No content available"}
//           </div>
//         </div>

//         {/* Timestamp */}
//         <div className="text-[13px] text-gray-400 font-medium whitespace-nowrap ml-4">
//           {date} at {time}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const PlainTaskCard = ({ task, onNavigate }: any) => {
//   const [entityName, setEntityName] = useState<string>('');

//   // Format date and time
//   const { date, time } = formatDateTime(task.createdAt);

//   // Fetch entity name when component mounts
//   useEffect(() => {
//     const loadEntityName = async () => {
//       if (task.entityType && task.entityId) {
//         const name = await fetchEntityDetails(task.entityType, task.entityId);
//         setEntityName(name);
//       }
//     };

//     loadEntityName();
//   }, [task.entityType, task.entityId]);

//   return (
//     <div className="w-full border border-gray-200 rounded-lg p-4 bg-white mb-3 shadow-sm">
//       <div className="flex justify-between items-start">
//         <div className="flex flex-col">
//           <div className="flex items-center gap-1.5 text-sm">
//             <span className="font-bold text-gray-900">Task</span>
//             <span className="text-gray-500 font-normal">
//               for {entityName || 'Loading...'}
//             </span>
//           </div>

//           <div className="text-[13px] mt-1 font-medium text-gray-700">
//             {task.title || 'Task'}
//           </div>

//           {/* Plain text content */}
//           <div className="text-[14px] text-gray-600 leading-relaxed mt-2">
//             {task.description || task.content || "No content available"}
//           </div>

//           {/* Status */}
//           {task.status && (
//             <div className="text-[12px] text-gray-500 mt-2">
//               Status: {task.status}
//             </div>
//           )}
//         </div>

//         {/* Timestamp */}
//         <div className="text-[13px] text-gray-400 font-medium whitespace-nowrap ml-4">
//           {date} at {time}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const PlainCallCard = ({ call, onNavigate }: any) => {
//   const [entityName, setEntityName] = useState<string>('');

//   // Format date and time
//   const { date, time } = formatDateTime(call.createdAt);

//   // Fetch entity name when component mounts
//   useEffect(() => {
//     const loadEntityName = async () => {
//       if (call.entityType && call.entityId) {
//         const name = await fetchEntityDetails(call.entityType, call.entityId);
//         setEntityName(name);
//       }
//     };

//     loadEntityName();
//   }, [call.entityType, call.entityId]);

//   return (
//     <div className="w-full border border-gray-200 rounded-lg p-4 bg-white mb-3 shadow-sm">
//       <div className="flex justify-between items-start">
//         <div className="flex flex-col">
//           <div className="flex items-center gap-1.5 text-sm">
//             <span className="font-bold text-gray-900">Call</span>
//             <span className="text-gray-500 font-normal">
//               for {entityName || 'Loading...'}
//             </span>
//           </div>

//           <div className="text-[13px] mt-1 font-medium text-gray-700">
//             {call.title || 'Phone Call'}
//           </div>

//           {/* Plain text content */}
//           <div className="text-[14px] text-gray-600 leading-relaxed mt-2">
//             {call.description || call.content || "No content available"}
//           </div>

//           {/* Call details */}
//           <div className="text-[12px] text-gray-500 mt-2">
//             {call.duration && <span>Duration: {call.duration}</span>}
//             {call.phoneNumber && <span> • Phone: {call.phoneNumber}</span>}
//           </div>
//         </div>

//         {/* Timestamp */}
//         <div className="text-[13px] text-gray-400 font-medium whitespace-nowrap ml-4">
//           {date} at {time}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const PlainMeetingCard = ({ meeting, onNavigate }: any) => {
//   const [entityName, setEntityName] = useState<string>('');

//   // Format date and time
//   const { date, time } = formatDateTime(meeting.createdAt);

//   // Fetch entity name when component mounts
//   useEffect(() => {
//     const loadEntityName = async () => {
//       if (meeting.entityType && meeting.entityId) {
//         const name = await fetchEntityDetails(meeting.entityType, meeting.entityId);
//         setEntityName(name);
//       }
//     };

//     loadEntityName();
//   }, [meeting.entityType, meeting.entityId]);

//   return (
//     <div className="w-full border border-gray-200 rounded-lg p-4 bg-white mb-3 shadow-sm">
//       <div className="flex justify-between items-start">
//         <div className="flex flex-col">
//           <div className="flex items-center gap-1.5 text-sm">
//             <span className="font-bold text-gray-900">Meeting</span>
//             <span className="text-gray-500 font-normal">
//               for {entityName || 'Loading...'}
//             </span>
//           </div>

//           <div className="text-[13px] mt-1 font-medium text-gray-700">
//             {meeting.title || 'Meeting'}
//           </div>

//           {/* Plain text content */}
//           <div className="text-[14px] text-gray-600 leading-relaxed mt-2">
//             {meeting.description || meeting.content || "No content available"}
//           </div>

//           {/* Meeting details */}
//           <div className="text-[12px] text-gray-500 mt-2">
//             {meeting.location && <span>Location: {meeting.location}</span>}
//             {meeting.duration && <span> • Duration: {meeting.duration}</span>}
//           </div>
//         </div>

//         {/* Timestamp */}
//         <div className="text-[13px] text-gray-400 font-medium whitespace-nowrap ml-4">
//           {date} at {time}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Plain text activity renderer
// export const PlainActivityCard = ({ activity, onNavigate }: any) => {
//   const activityType = activity.type || activity.activityType || 'note';
  
//   switch (activityType.toLowerCase()) {
//     case 'note':
//       return <PlainNoteCard note={activity} onNavigate={onNavigate} />;
//     case 'task':
//       return <PlainTaskCard task={activity} onNavigate={onNavigate} />;
//     case 'call':
//       return <PlainCallCard call={activity} onNavigate={onNavigate} />;
//     case 'meeting':
//       return <PlainMeetingCard meeting={activity} onNavigate={onNavigate} />;
//     default:
//       return <PlainNoteCard note={activity} onNavigate={onNavigate} />;
//   }
// };
