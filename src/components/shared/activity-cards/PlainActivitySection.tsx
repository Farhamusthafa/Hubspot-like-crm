// 'use client';
// import React from 'react';
// import { PlainActivityCard } from './PlainActivityCards';

// interface Props {
//   title: string;
//   buttonLabel: string;
//   onCreateClick: () => void;
//   activities: any[];
//   onNavigate?: (activity: any) => void;
// }

// export const PlainActivitySection: React.FC<Props> = ({ 
//   title, 
//   buttonLabel, 
//   onCreateClick, 
//   activities,
//   onNavigate 
// }) => {
//   return (
//     <div className="w-full space-y-6 mb-10">
//       <div className="flex items-center justify-between">
//         <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">{title}</h3>
//         <button 
//           onClick={onCreateClick}
//           className="flex items-center gap-2 bg-[#5948DB] text-white px-5 py-2.5 rounded-lg text-sm font-medium"
//         >
//           {buttonLabel}
//         </button>
//       </div>
      
//       <div className="space-y-4">
//         <h4 className="text-sm font-bold text-gray-900">
//           {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//         </h4>
        
//         <div className="space-y-3">
//           {activities && activities.length > 0 ? (
//             activities.map((activity, index) => (
//               <PlainActivityCard 
//                 key={activity.id || index} 
//                 activity={activity} 
//                 onNavigate={() => onNavigate?.(activity)}
//               />
//             ))
//           ) : (
//             <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
//               <p>No activities found</p>
//               <p className="text-sm mt-2">Activities will appear here once they are created.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };
