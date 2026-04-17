// 'use client';

// import React, { useState, useEffect } from 'react';
// import { ChevronDown, Mail } from 'lucide-react';
// import { formatDateTime, fetchEntityDetails } from '@/utils/activityUtils';
// import { sendEmail } from '@/lib/api';
// import { useSnackbar } from 'notistack';

// export const DynamicEmailCard = ({ email, isTimelineView, onNavigate }: any) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [entityName, setEntityName] = useState<string>('');
//   const [isSending, setIsSending] = useState(false);
//   const { enqueueSnackbar } = useSnackbar();

//   // Format date and time
//   const { date, time } = formatDateTime(email.createdAt);

//   // Fetch entity name when component mounts
//   useEffect(() => {
//     const loadEntityName = async () => {
//       if (email.entityType && email.entityId) {
//         const name = await fetchEntityDetails(email.entityType, email.entityId);
//         setEntityName(name);
//       }
//     };

//     loadEntityName();
//   }, [email.entityType, email.entityId]);

//   // Convert HTML to plain text
//   const convertToPlainText = (html: string) => {
//     if (!html) return '';
//     return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
//   };

//   const plainContent = convertToPlainText(email.content || email.body || '');

//   // Handle recipients array and format for display
//   const recipients = email.recipients || [];
//   const recipientDisplay = Array.isArray(recipients)
//     ? recipients.join(', ')
//     : recipients || 'Unknown Recipient';

//   // Handle sending email
//   const handleSendEmail = async () => {
//     if (!recipientDisplay || recipientDisplay === 'Unknown Recipient') {
//       enqueueSnackbar('No valid email address found', { variant: 'error' });
//       return;
//     }

//     try {
//       setIsSending(true);

//       const emailContent = `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2 style="color: #333; border-bottom: 2px solid #5948DB; padding-bottom: 10px;">
//             ${email.subject || 'No Subject'}
//           </h2>
          
//           <div style="margin: 20px 0;">
//             <p style="color: #666; font-size: 14px;">
//               <strong>From:</strong> ${email.from || 'CRM System'}
//             </p>
//             <p style="color: #666; font-size: 14px;">
//               <strong>To:</strong> ${recipientDisplay}
//             </p>
//             <p style="color: #666; font-size: 14px;">
//               <strong>Date:</strong> ${date} at ${time}
//             </p>
//           </div>
          
//           <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
//             <h3 style="color: #333; margin-top: 0;">Message:</h3>
//             <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">
//               ${plainContent || 'No content available'}
//             </div>
//           </div>
          
//           <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
//             <p>This email was sent from CRM System</p>
//             <p>If you have any questions, please contact your administrator.</p>
//           </div>
//         </div>
//       `;

//       await sendEmail(recipientDisplay, email.subject || 'CRM Communication', emailContent);
//       enqueueSnackbar('Email sent successfully!', { variant: 'success' });
//     } catch (error: any) {
//       console.error('Error sending email:', error);
//       enqueueSnackbar(error.message || 'Failed to send email', { variant: 'error' });
//     } finally {
//       setIsSending(false);
//     }
//   };

//   return (
//     <div className="w-full border border-gray-200 rounded-lg bg-white mb-3 shadow-sm transition-all overflow-hidden">
//       {/* Header */}
//       <div
//         className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex items-center gap-3">
//           <ChevronDown
//             size={18}
//             className={`text-[#5948DB] transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`}
//           />

//           <div className="flex flex-col">
//             <div className="flex items-center gap-1.5 text-sm">
//               <span className="font-normal text-gray-900">Email</span>
//               <span className="text-gray-500 font-normal">
//                 for {entityName || 'Loading...'}
//               </span>
//             </div>

//             {/* Plain text subject */}
//             <div className="text-[13px] mt-1 font-normal text-gray-700">
//               {email.subject || 'No Subject'}
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
//         <div className="px-12 py-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
//           {isTimelineView ? (
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 onNavigate?.();
//               }}
//               className="text-[13px] text-[#5948DB] font-medium hover:underline text-left"
//             >
//               Click to see email details →
//             </button>
//           ) : (
//             <>
//               {/* Email details in plain text */}
//               <div className="text-[13px] text-gray-600 mb-4">
//                 {email.from && <div className="mb-2"><strong>From:</strong> {email.from}</div>}
//                 {recipientDisplay && <div className="mb-2"><strong>To:</strong> {recipientDisplay}</div>}
//                 {email.emailType && <div className="mb-2"><strong>Type:</strong> {email.emailType}</div>}
//               </div>

//               {/* Plain text content */}
//               <div className="text-[13px] text-gray-600 leading-relaxed mb-4">
//                 {plainContent || "No content available"}
//               </div>

//               {/* Send Email Button */}
//               {recipientDisplay && recipientDisplay !== 'Unknown Recipient' && (
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleSendEmail();
//                   }}
//                   disabled={isSending}
//                   className="flex items-center gap-2 px-4 py-2 bg-[#5948DB] text-white text-sm font-medium rounded-lg hover:bg-[#4A3BC7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                 >
//                   <Mail size={16} />
//                   {isSending ? 'Sending...' : 'Send Email'}
//                 </button>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };
'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { formatDateTime } from '@/utils/activityUtils';

export const DynamicEmailCard = ({ email, isTimelineView, onNavigate }: any) => {
  const { date, time } = formatDateTime(email.createdAt);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg bg-white mb-3 overflow-hidden transition-all shadow-sm">
      {/* Header */}
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <ChevronDown 
            size={18} 
            className={`text-[#5948DB] transition-transform duration-200 ${!isExpanded ? '-rotate-90' : ''}`} 
          />
          <div className="flex flex-col">
            <span className="font-semibold text-[14px] text-gray-700">
              {email.status} Email - {email.subject} <span className="font-normal text-gray-500 ml-1 text-[13px]">by {email.createdBy || 'User'}</span>
            </span>
            {isTimelineView && (
              <span className="text-[13px] text-slate-500 mt-0.5">
                {email.recipientName|| 'Client'} opened {email.subject}
              </span>
            )}
          </div>
        </div>
              <span className="text-[12px] text-gray-400">{date} at {time}</span>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-12 py-4 border-t border-gray-100 bg-white animate-in slide-in-from-top-2 duration-200">
          {isTimelineView ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.();
              }}
              className="text-[13px] text-[#5948DB] font-medium hover:underline text-left"
            >
              Click to see email details →
            </button>
          ) : (
            <>
              <p className="text-[13px] text-gray-600 mb-4 font-medium">To {email.recipients || 'No recipient'}</p>
              <div 
                className="text-[13px] text-gray-600 leading-relaxed space-y-2"
                dangerouslySetInnerHTML={{ __html: email.body || 'No content' }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};
