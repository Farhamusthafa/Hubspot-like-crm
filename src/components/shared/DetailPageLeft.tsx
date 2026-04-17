// 'use client';

// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Stack,
//   IconButton,
// } from '@mui/material';
// import {
//   ChevronLeft,
//   ChevronDown,
//   Edit3,
//   Copy,
//   Mail,
//   Phone,
//   CheckSquare,
//   Calendar,
//   FileText
// } from 'lucide-react';
// import { useSnackbar } from 'notistack';
// import { Lead } from '@/app/types/leadtypes';
// import { Deal } from '@/app/types/dealtypes';
// import { Ticket } from '@/app/types/tickettypes';
// import { Company } from '@/app/types/companytypes';
// import { entityConfigs, getActionButtons, EntityType } from '@/components/common/entityConfig';
// import { DynamicActivityDrawer } from './DynamicActivityDrawer';
// import { ActivityType } from './DynamicActivityDrawer';
// import CreateLeadModal from '@/components/modals/CreateLeadModal';
// import CreateCompanyModal from '../modals/CreateCompanyModal';
// import CreateDealModal from '../modals/CreateDealModal';
// import CreateTicketModal from '@/components/modals/CreateTicketModal';
// import { updateLead, updateCompany, updateDeal, updateTicket, createNote, createTask, createCall, createMeeting, sendEmail } from '@/lib/api';

// interface DetailPageLeftProps {
//   type: EntityType;
//   data: Lead | Deal | Ticket | Company;
//   onBack: () => void;
// }

// export const DetailPageLeft: React.FC<DetailPageLeftProps> = ({ type, data, onBack }) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAboutEdit, setIsAboutEdit] = useState(false);
//   const [isStatusEdit, setIsStatusEdit] = useState(false);
//   const [isInlineEditing, setIsInlineEditing] = useState(false);
//   const [isNameEditing, setIsNameEditing] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState<string>('');
//   const [currentName, setCurrentName] = useState<string>('');
//   const [selectedActivity, setSelectedActivity] = useState<ActivityType>('note');

//   const config = entityConfigs[type];
//   const actionButtons = getActionButtons();

//   // Initialize values from data
//   React.useEffect(() => {
//     if (data) {
//       setCurrentStatus(type === 'company' ? (data as Company).industry : config.getStatus(data));
//       setCurrentName(config.getTitle(data));
//     }
//   }, [data, type, config]);

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//     enqueueSnackbar('Copied to clipboard!', { variant: 'success' });
//   };

//   const getIconComponent = (iconName: string) => {
//     switch (iconName) {
//       case 'NoteAltOutlined':
//         return <FileText size={16} />;
//       case 'EmailOutlined':
//         return <Mail size={16} />;
//       case 'CallOutlined':
//         return <Phone size={16} />;
//       case 'TaskAltOutlined':
//         return <CheckSquare size={16} />;
//       case 'EventOutlined':
//         return <Calendar size={16} />;
//       default:
//         return <FileText size={16} />;
//     }
//   };

//   const handleActionClick = (activityType: ActivityType) => {
//     setSelectedActivity(activityType);
//     setIsDrawerOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };

//   const handleActivitySave = async (activityData: any) => {
//     try {
//       console.log(`Saving ${selectedActivity} for ${type} ID: ${data.id}`, activityData);

//       const entityId = Number(data.id);

//       switch (selectedActivity) {
//         case 'note':
//           await createNote(type, entityId, {description: activityData.description });
//           break;
//         case 'email':
//           await sendEmail(activityData.to || [], activityData.subject, activityData.body);
//           break;
//         case 'call':
//           // await createCall(type, entityId, {
//           //   connectedTo: activityData.connectedTo,
//           //   outcome: activityData.outcome,
//           //   date: activityData.date,
//           //   time: activityData.time,
//           //   description: activityData.description
//           // });
//           await createCall(type, entityId, {
//   subject: activityData.connectedTo || 'Call',
//   duration: activityData.time || null,
//   outcome: activityData.outcome,
//   description: activityData.description
// });
//           break;
//         case 'task':
//           // await createTask(type, entityId, {
//           //   title: activityData.title,
//           //   dueDate: activityData.dueDate,
//           //   time: activityData.time,
//           //   taskType: activityData.taskType,
//           //   priority: activityData.priority,
//           //   description: activityData.description
//           // });
//           await createTask(type, entityId, {
//   title: activityData.title,
//   dueDate: activityData.dueDate,
//   priority: activityData.priority,
//   description: activityData.description
// });
//           break;
//         case 'meeting':
//           await createMeeting(type, entityId, {
//             title: activityData.title,
//             date: activityData.date,
//             time: activityData.time,
//             attendees: activityData.attendees,
//             location: activityData.location,
//             // reminder: activityData.reminder,
//             duration: activityData.duration,
//             description: activityData.description
//           });
//           break;
//       }

//       enqueueSnackbar(`${selectedActivity.charAt(0).toUpperCase() + selectedActivity.slice(1)} created successfully!`, { variant: 'success' });
//       setIsDrawerOpen(false);
//     } catch (error: any) {
//       console.error(`Error creating ${selectedActivity}:`, error);
//       enqueueSnackbar(error.message || `Failed to create ${selectedActivity}`, { variant: 'error' });
//     }
//   };

//   const handleInlineFieldSave = async (fieldLabel: string, newValue: string) => {
//     try {
//       console.log(`Saving ${fieldLabel}: ${newValue} for ${type} ID: ${data.id}`);

//       // Map field labels to actual API field names based on entity type
//       let updateData: any = {};

//       if (type === 'lead') {
//         switch (fieldLabel) {
//           case 'Email':
//             updateData = { email: newValue };
//             break;
//           case 'Phone':
//             updateData = { phone: newValue };
//             break;
//           case 'Company':
//             updateData = { company: newValue };
//             break;
//           case 'Job Title':
//             updateData = { jobTitle: newValue };
//             break;
//           case 'Lead Owner':
//             updateData = { assignedTo: newValue };
//             break;
//           case 'Lead Source':
//             updateData = { source: newValue };
//             break;
//           default:
//             console.log(`Unhandled field: ${fieldLabel}`);
//             return;
//         }
//         console.log('Calling updateLead with:', updateData);
//         await updateLead(Number((data as Lead).id), updateData);
//       } else if (type === 'company') {
//         switch (fieldLabel) {
//           case 'Domain':
//             updateData = { domain: newValue };
//             break;
//           case 'Email':
//             updateData = { domain: newValue };
//             break;
//           case 'Phone':
//             updateData = { phone: newValue };
//             break;
//           case 'Industry':
//             // Map common industry terms to valid enum values with partial matching
//             const industryMap: { [key: string]: string } = {
//               'IT': 'Technology',
//               'Information Technology': 'Technology',
//               'Tech': 'Technology',
//               'Technology': 'Technology',
//               'Software': 'Technology',
//               'Hardware': 'Technology',
//               'Fin': 'Finance',
//               'Fina': 'Finance',
//               'Finance': 'Finance',
//               'Banking': 'Finance',
//               'Financial': 'Finance',
//               'Investment': 'Finance',
//               'Med': 'Healthcare',
//               'Medical': 'Healthcare',
//               'Health': 'Healthcare',
//               'Healthcare': 'Healthcare',
//               'Pharma': 'Healthcare',
//               'Pharmaceutical': 'Healthcare',
//               'Edu': 'Education',
//               'Education': 'Education',
//               'School': 'Education',
//               'University': 'Education',
//               'College': 'Education',
//               'Law': 'Legal service',
//               'Legal': 'Legal service',
//               'Legal Service': 'Legal service'
//             };

//             // Try exact match first
//             if (industryMap[newValue]) {
//               updateData = { industry: industryMap[newValue] };
//             } else {
//               // Try partial matching for common prefixes
//               const lowerValue = newValue.toLowerCase();
//               if (lowerValue.includes('tech') || lowerValue.includes('it') || lowerValue.includes('software')) {
//                 updateData = { industry: 'Technology' };
//               } else if (lowerValue.includes('fin') || lowerValue.includes('bank') || lowerValue.includes('invest')) {
//                 updateData = { industry: 'Finance' };
//               } else if (lowerValue.includes('med') || lowerValue.includes('health') || lowerValue.includes('pharma')) {
//                 updateData = { industry: 'Healthcare' };
//               } else if (lowerValue.includes('edu') || lowerValue.includes('school') || lowerValue.includes('univ') || lowerValue.includes('college')) {
//                 updateData = { industry: 'Education' };
//               } else if (lowerValue.includes('law') || lowerValue.includes('legal')) {
//                 updateData = { industry: 'Legal service' };
//               } else {
//                 // Default to Technology if no match found
//                 updateData = { industry: 'Technology' };
//               }
//             }
//             console.log('Original value:', newValue);
//             console.log('Mapped industry value:', updateData.industry);
//             break;
//           case 'Company Owner':
//             updateData = { owner: newValue };
//             break;
//           case 'City':
//             updateData = { city: newValue };
//             break;
//           case 'Country':
//             updateData = { country: newValue };
//             break;
//           case 'No of Employees':
//             updateData = { employees: parseInt(newValue) || null };
//             break;
//           case 'Annual Revenue':
//             // Parse revenue string and convert to number
//             const revenueNum = parseFloat(newValue.replace(/,/g, ''));
//             updateData = { annualRevenue: isNaN(revenueNum) ? null : revenueNum };
//             break;
//           default:
//             console.log(`Unhandled field: ${fieldLabel}`);
//             return;
//         }
//         console.log('Calling updateCompany with:', updateData);
//         await updateCompany(Number((data as Company).id), updateData);
//       } else if (type === 'deal') {
//         switch (fieldLabel) {
//           case 'Deal Name':
//             updateData = { name: newValue };
//             break;
//           case 'Account Name':
//             updateData = { name: newValue };
//             break;
//           case 'Deal Owner':
//             updateData = { owner: newValue };
//             break;
//           case 'Amount':
//             // Parse amount string and convert to number
//             const amountNum = parseFloat(newValue.replace(/[$,]/g, ''));
//             updateData = { amount: isNaN(amountNum) ? 0 : amountNum };
//             break;
//           case 'Close Date':
//             updateData = { closeDate: newValue };
//             break;
//           default:
//             console.log(`Unhandled field: ${fieldLabel}`);
//             return;
//         }
//         console.log('Calling updateDeal with:', updateData);
//         await updateDeal(Number((data as Deal).id), updateData);
//       } else if (type === 'ticket') {
//         switch (fieldLabel) {
//           case 'Ticket ID':
//             // Ticket ID is read-only, but we'll handle it just in case
//             console.log('Ticket ID is read-only');
//             return;
//           case 'Subject':
//             updateData = { title: newValue };
//             break;
//           case 'Status':
//             // Map common status terms to valid enum values
//             const statusMap: { [key: string]: string } = {
//               'new': 'New',
//               'open': 'New',
//               'waiting on contact': 'Waiting on contact',
//               'waiting on us': 'Waiting on us',
//               'closed': 'Closed',
//               'resolved': 'Closed'
//             };
//             updateData = { status: statusMap[newValue.toLowerCase()] || newValue };
//             break;
//           case 'Priority':
//             // Map common priority terms to valid enum values
//             const priorityMap: { [key: string]: string } = {
//               'high': 'High',
//               'medium': 'Medium',
//               'low': 'Low',
//               'critical': 'Critical',
//               'urgent': 'Critical'
//             };
//             updateData = { priority: priorityMap[newValue.toLowerCase()] || newValue };
//             break;
//           case 'Source':
//             // Map common source terms to valid enum values
//             const sourceMap: { [key: string]: string } = {
//               'email': 'Email',
//               'mail': 'Email',
//               'phone': 'Phone',
//               'call': 'Phone',
//               'chat': 'Chat',
//               'live chat': 'Chat'
//             };
//             updateData = { source: sourceMap[newValue.toLowerCase()] || newValue };
//             break;
//           default:
//             console.log(`Unhandled field: ${fieldLabel}`);
//             return;
//         }
//         console.log('Calling updateTicket with:', updateData);
//         await updateTicket(Number((data as Ticket).id), updateData);
//       }

//       console.log(`${fieldLabel} updated successfully!`);
//       enqueueSnackbar(`${fieldLabel} updated successfully!`, { variant: 'success' });
//     } catch (error: any) {
//       console.error(`Error saving ${fieldLabel}:`, error);
//       console.error('Full error object:', error);
//       enqueueSnackbar(error.message || `Failed to update ${fieldLabel}`, { variant: 'error' });
//     }
//   };

//   const handleEditClick = () => {
//     setIsAboutEdit(true);
//     setIsStatusEdit(false);
//     // Don't open the modal - only enable inline editing
//     // setIsEditModalOpen(true);
//   };

//   const handleStatusEditClick = () => {
//     setIsInlineEditing(true);
//   };

//   const handleStatusSave = async (newValue: string) => {
//     try {
//       setCurrentStatus(newValue);
//       setIsInlineEditing(false);

//       // Save to backend based on entity type
//       if (type === 'deal') {
//         await updateDeal(Number((data as Deal).id), { stage: newValue });
//       } else if (type === 'ticket') {
//         await updateTicket(Number((data as Ticket).id), { status: newValue });
//       }

//       enqueueSnackbar('Status updated successfully!', { variant: 'success' });
//     } catch (error: any) {
//       // Revert on error
//       // setCurrentStatus(data.status || '');
      
//       if (type === 'deal') {
//   setCurrentStatus((data as Deal).stage || '');
// } else if (type === 'ticket') {
//   setCurrentStatus((data as Ticket).status || '');
// }
//       setIsInlineEditing(false);
//       enqueueSnackbar(error.message || 'Failed to update status', { variant: 'error' });
//     }
//   };




//   const handleNameEditClick = () => {
//     setIsNameEditing(true);
//   };

//   const handleNameSave = async (newValue: string) => {
//     try {
//       setCurrentName(newValue);
//       setIsNameEditing(false);

//       // Save to backend based on entity type
//       // if (type === 'lead') {
//       //   const leadData = data as Lead;
//       //   const nameParts = newValue.split(' ');
//       //   await updateLead(Number(leadData.id), {
//       //     firstName: nameParts[0] || '',
//       //     lastName: nameParts.slice(1).join(' ') || ''
//       //   });
//       // } else if (type === 'company') {
//       //   await updateCompany(Number((data as Company).id), { name: newValue });
//       // } else if (type === 'deal') {
//       //   await updateDeal(Number((data as Deal).id), { name: newValue });
//       // } else if (type === 'ticket') {
//       //   // await updateTicket(Number((data as Ticket).id), { subject: newValue });
//       //   await updateTicket(Number((data as Ticket).id), { title: newValue });
//       // }

// // if (type === 'lead') {
// //   const lead = data as Lead;
// //   setCurrentName(
// //     `${lead.firstName || ''} ${lead.lastName || ''}`.trim()
// //   );

// if (type === 'lead') {
//   setCurrentName((data as Lead).name || '');

// } else if (type === 'company') {
//   setCurrentName((data as Company).name || '');
// } else if (type === 'deal') {
//   setCurrentName((data as Deal).name || '');
// } else if (type === 'ticket') {
//   setCurrentName((data as Ticket).title || '');
// }


//       enqueueSnackbar('Name updated successfully!', { variant: 'success' });
//     } catch (error: any) {
//       // Revert on error
//       // setCurrentName(data.name || data.subject || '');

// // if (type === 'lead') {
// //   setCurrentName((data as Lead).name || '');
// // } else if (type === 'company') {
// //   setCurrentName((data as Company).name || '');
// // } else if (type === 'deal') {
// //   setCurrentName((data as Deal).name || '');
// // } else if (type === 'ticket') {
// //   setCurrentName((data as Ticket).title || '');
// // }
// if (type === 'lead') {
//   setCurrentName((data as Lead).name || '');
// } else if (type === 'company') {
//   setCurrentName((data as Company).name || '');
// } else if (type === 'deal') {
//   setCurrentName((data as Deal).name || '');
// } else if (type === 'ticket') {
//   setCurrentName((data as Ticket).title || '');
// }




//       setIsNameEditing(false);
//       enqueueSnackbar(error.message || 'Failed to update name', { variant: 'error' });
//     }
//   };

//   const handleFullEditClick = () => {
//     setIsAboutEdit(false);
//     setIsStatusEdit(false);
//     setIsEditModalOpen(true);
//   };

//   const getLeadInitialData = (lead: Lead) => {
//     const names = lead.name.split(' ');
//     return {
//       firstName: names[0] || '',
//       lastName: names.slice(1).join(' ') || '',
//       email: lead.email,
//       phoneNumber: lead.phone,
//       jobTitle: lead.jobTitle,
//       contactOwner: lead.assignedTo,
//       leadStatus: lead.status?.toLowerCase()
//     };
//   };

//   const getCompanyInitialData = (company: Company) => {
//     return {
//       name: company.name,
//       owner: company.owner,
//       industry: company.industry,
//       type: (company as any).type || 'Private',
//       phone: company.phone,
//       city: company.city,
//       country: company.country,
//       employees: (company as any).employees || '',
//       revenue: (company as any).revenue || '',
//       domain: company.domain || ''
//     };
//   };

//   const getDealInitialData = (deal: Deal) => {
//     return {
//       name: deal.name,
//       stage: deal.stage,
//       amount: deal.amount.toString(),
//       owner: deal.owner,
//       closeDate: deal.closeDate,
//       priority: (deal as any).priority || 'medium'
//     };
//   };

//   const getTicketInitialData = (ticket: Ticket) => {
//     return {
//       title: ticket.title,
//       description: ticket.description || '',
//       status: ticket.status,
//       source: (ticket as any).source || 'Email',
//       priority: ticket.priority,
//       owner: ticket.owner
//     };
//   };

//   return (
//     <>
//       <Box sx={{ width: 250 }}>
//         {/* Back Button */}
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-[#344054] hover:text-[#5948DB] transition-all mb-4 group"
//         >
//           <ChevronLeft size={18} strokeWidth={2} />
//           <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>
//             {type === 'company' ? 'Companies' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
//           </Typography>
//         </button>

//         {/* Entity header */}
//         <Box mb={3}>
//           {(type === 'lead' || type === 'company') ? (
//             <Stack direction="row" spacing={1.5} alignItems="flex-start">
//               <Box
//                 sx={{
//                   width: 44,
//                   height: 44,
//                   bgcolor: '#E0E0E0',
//                   borderRadius: 1,
//                   flexShrink: 0
//                 }}
//               />
//               <Box>
//                 <Stack direction="row" spacing={0.5} alignItems="center">
//                   {isNameEditing ? (
//                     <input
//                       type="text"
//                       value={currentName}
//                       onChange={(e) => setCurrentName(e.target.value)}
//                       onBlur={() => setIsNameEditing(false)}
//                       onKeyDown={(e) => e.key === 'Enter' && handleNameSave(currentName)}
//                       autoFocus
//                       className="text-[14px] font-semibold border-b border-[#5948DB] focus:outline-none w-full bg-transparent text-[#101828]"
//                     />
//                   ) : (
//                     <Typography
//                       fontWeight={600}
//                       onClick={handleNameEditClick}
//                       sx={{ cursor: 'pointer', fontSize: '14px' }}
//                     >
//                       {currentName}
//                     </Typography>
//                   )}
//                 </Stack>

//                 <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.2 }}>
//                   {type === 'lead' ? (data as Lead).jobTitle || 'Salesperson' : (data as Company).industry}
//                 </Typography>

//                 <Stack direction="row" spacing={0.5} alignItems="center" mt={0.2}>
//                   <Typography sx={{ fontSize: '12px', color: '#5948DB' }}>
//                     {config.getSubtitle(data)}
//                   </Typography>
//                   <IconButton
//                     size="small"
//                     onClick={() => handleCopy(config.getSubtitle(data))}
//                     sx={{ p: 0.5, color: '#5948DB' }}
//                   >
//                     <Copy size={13} />
//                   </IconButton>
//                 </Stack>
//               </Box>
//             </Stack>
//           ) : (
//             <Box>
//               <Stack direction="row" spacing={0.5} alignItems="flex-start">
//                 {isNameEditing ? (
//                   <input
//                     type="text"
//                     value={currentName}
//                     onChange={(e) => setCurrentName(e.target.value)}
//                     onBlur={() => setIsNameEditing(false)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleNameSave(currentName)}
//                     autoFocus
//                     className="text-[14px] font-semibold border-b border-[#5948DB] focus:outline-none w-full bg-transparent text-[#1D2939]"
//                   />
//                 ) : (
//                   <Typography
//                     fontWeight={600}
//                     onClick={handleNameEditClick}
//                     sx={{
//                       fontSize: '14px',
//                       cursor: 'pointer',
//                       wordBreak: 'break-word',
//                       lineHeight: 1.2,
//                       flex: 1
//                     }}
//                   >
//                     {currentName}
//                   </Typography>
//                 )}
//               </Stack>

//               {type === 'deal' && (
//                 <Box mt={0.5}>
//                   <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
//                     Amount : <span style={{ fontWeight: 600, color: '#1D2939' }}>${(data as Deal).amount}</span>
//                   </Typography>
//                   <Stack direction="row" spacing={0.5} alignItems="center">
//                     <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
//                       Stage :
//                     </Typography>
//                     {isInlineEditing ? (
//                       <select
//                         value={currentStatus}
//                         onChange={(e) => handleStatusSave(e.target.value)}
//                         onBlur={() => setIsInlineEditing(false)}
//                         autoFocus
//                         className="text-[13px] font-semibold border-b border-[#5948DB] focus:outline-none bg-transparent text-[#1D2939] cursor-pointer"
//                       >
//                         {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Presentation Scheduled'].map(s => <option key={s} value={s}>{s}</option>)}
//                       </select>
//                     ) : (
//                       <Stack direction="row" spacing={0.2} alignItems="center">
//                         <span style={{ fontWeight: 600, color: '#1D2939', fontSize: '13px' }}>{currentStatus}</span>
//                         <IconButton size="small" onClick={handleStatusEditClick} sx={{ p: 0.2, color: '#5948DB' }}>
//                           <ChevronDown size={16} />
//                         </IconButton>
//                       </Stack>
//                     )}
//                   </Stack>
//                 </Box>
//               )}

//               {type === 'ticket' && (
//                 <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
//                   <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
//                     Status :
//                   </Typography>
//                   {isInlineEditing ? (
//                     <select
//                       value={currentStatus}
//                       onChange={(e) => handleStatusSave(e.target.value)}
//                       onBlur={() => setIsInlineEditing(false)}
//                       autoFocus
//                       className="text-[13px] font-semibold border-b border-[#5948DB] focus:outline-none bg-transparent text-[#1D2939] cursor-pointer"
//                     >
//                       {['New', 'Waiting on contact', 'Waiting on us', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
//                     </select>
//                   ) : (
//                     <Stack direction="row" spacing={0.2} alignItems="center">
//                       <span style={{ fontWeight: 600, color: '#1D2939', fontSize: '13px' }}>{currentStatus}</span>
//                       <IconButton size="small" onClick={handleStatusEditClick} sx={{ p: 0.2, color: '#5948DB' }}>
//                         <ChevronDown size={16} />
//                       </IconButton>
//                     </Stack>
//                   )}
//                 </Stack>
//               )}
//             </Box>
//           )}
//         </Box>

//         {/* Actions */}
//         <Box
//           mb={3}
//           sx={{
//             bgcolor: '#F3F4F6',
//             py: 1,
//             px: 1,
//             borderRadius: 2,
//           }}
//         >
//           <Stack
//             direction="row"
//             spacing={1}
//             justifyContent="space-between"
//           >
//             {actionButtons.map((item) => (
//               <Box key={item.label} textAlign="center">
//                 <IconButton
//                   size="small"
//                   onClick={() => handleActionClick(item.label.toLowerCase() as ActivityType)}
//                   sx={{
//                     border: '2px solid #E5E7EB',
//                     color: '#5948DB',
//                     width: 30,
//                     height: 30,
//                     bgcolor: '#ffffff',
//                     borderRadius: 1.5,
//                     transition: 'all 0.2s',
//                     '&:hover': {
//                       bgcolor: '#E5E7EB',
//                     },
//                   }}
//                 >
//                   {getIconComponent(item.icon)}
//                 </IconButton>
//                 <Typography
//                   sx={{
//                     fontSize: '10px',
//                     mt: 0.5,
//                     color: 'text.secondary',
//                     textAlign: 'center'
//                   }}
//                 >
//                   {item.label}
//                 </Typography>
//               </Box>
//             ))}
//           </Stack>
//         </Box>

//         {/* About Section Header */}
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <ChevronDown size={20} className="text-[#6941C6]" />
//             <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#344054' }}>
//               About this {type.charAt(0).toUpperCase() + type.slice(1)}
//             </Typography>
//           </Stack>
//           <IconButton
//             size="small"
//             onClick={handleEditClick}
//             sx={{ color: '#6941C6' }}
//           >
//             <Edit3 size={18} />
//           </IconButton>
//         </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
//           {config.getAboutSections(data).map((section) => (
//             <Box key={section.label}>
//               <Typography sx={{ fontSize: '13px', color: '#667085', mb: 0.5, fontWeight: 500 }}>
//                 {section.label}
//               </Typography>
//               {isAboutEdit ? (
//                 <input
//                   type="text"
//                   defaultValue={section.value}
//                   className="w-full text-[14px] font-medium text-[#1D2939] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#5948DB]"
//                   onBlur={(e) => {
//                     handleInlineFieldSave(section.label, e.target.value);
//                   }}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       e.currentTarget.blur();
//                     }
//                   }}
//                 />
//               ) : (
//                 <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1D2939' }}>
//                   {section.value}
//                 </Typography>
//               )}
//             </Box>
//           ))}
//           {isAboutEdit && (
//             <div className="mt-2 flex gap-2">
//               <button
//                 onClick={() => {
//                   setIsAboutEdit(false);
//                   enqueueSnackbar('Changes saved successfully!', { variant: 'success' });
//                 }}
//                 className="flex-1 py-2 bg-[#5948DB] text-white rounded-lg text-sm font-medium hover:bg-[#4838b8] transition-colors"
//               >
//                 Save All Changes
//               </button>
//               <button
//                 onClick={() => {
//                   setIsAboutEdit(false);
//                 }}
//                 className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           )}
//         </Box>
//       </Box>

//       {/* Activity Drawer */}
//       <DynamicActivityDrawer
//         isOpen={isDrawerOpen}
//         onClose={handleDrawerClose}
//         activityType={selectedActivity}
//         entityData={data}
//         onSave={handleActivitySave}
//       />

//       {/* Edit Modals */}
//       {type === 'lead' && (
//         <CreateLeadModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getLeadInitialData(data as Lead)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Lead:', updatedData);
//           }}
//         />
//       )}

//       {type === 'company' && (
//         <CreateCompanyModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getCompanyInitialData(data as Company)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Company:', updatedData);
//           }}
//         />
//       )}

//       {type === 'deal' && (
//         <CreateDealModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getDealInitialData(data as Deal)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Deal:', updatedData);
//           }}
//         />
//       )}

//       {type === 'ticket' && (
//         <CreateTicketModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getTicketInitialData(data as Ticket)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Ticket:', updatedData);
//           }}
//         />
//       )}
//     </>
//   );
// };

// 'use client';

// import React, { useState } from 'react';
// import {
//   Box,
//   Typography,
//   Stack,
//   IconButton,
// } from '@mui/material';
// import { 
//   ChevronLeft, 
//   ChevronDown, 
//   Edit3,
//   Copy,
//   Mail,
//   Phone,
//   CheckSquare,
//   Calendar,
//   FileText
// } from 'lucide-react';
// import { useSnackbar } from 'notistack';
// import { Lead } from '@/app/types/leadtypes';
// import { Deal } from '@/app/types/dealtypes';
// import { Ticket } from '@/app/types/tickettypes';
// import { Company } from '@/app/types/companytypes';
// import { entityConfigs, getActionButtons, EntityType } from '@/components/common/entityConfig';
// import { DynamicActivityDrawer } from './DynamicActivityDrawer';
// import { ActivityType } from './DynamicActivityDrawer';
// import CreateLeadModal from '@/components/modals/CreateLeadModal';
// import CreateCompanyModal from '../modals/CreateCompanyModal';
// import CreateDealModal from '../modals/CreateDealModal';
// import CreateTicketModal from '@/components/modals/CreateTicketModal';
// import { API, updateLead } from '@/lib/api';
// import { useEffect } from 'react';
// interface DetailPageLeftProps {
//   type: EntityType;
//   data: Lead | Deal | Ticket | Company;
//   onBack: () => void;
//     // Add these for editing
//   editedData?: Lead | Deal | Ticket | Company | null;
//   setEditedData?: React.Dispatch<React.SetStateAction<Lead | Deal | Ticket | Company | null>>;
//   isEditing?: boolean;
//   setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
//   // Before
// //onSave?: () => void;

//   // After
// onSave?: (updatedData: Lead | Deal | Ticket | Company ) => void; //  or generic type for all entities

// }

// export const DetailPageLeft: React.FC<DetailPageLeftProps> = ({ type, data, onBack , onSave:parentOnSave}) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isAboutEdit, setIsAboutEdit] = useState(false);
//   const [isStatusEdit, setIsStatusEdit] = useState(false);
//   const [isInlineEditing, setIsInlineEditing] = useState(false);
//   const [isNameEditing, setIsNameEditing] = useState(false);
//   const [currentStatus, setCurrentStatus] = useState<string>('');
//   const [currentName, setCurrentName] = useState<string>('');
//   const [selectedActivity, setSelectedActivity] = useState<ActivityType>('note');
//       const [isEditing, setIsEditing] = useState(false);
// const [editedLead, setEditedLead] = useState<Lead | null>(null);
// const [aboutEdits, setAboutEdits] = useState<Record<string, string>>({});
//   const config = entityConfigs[type];
//   const currentData = editedLead || data;
//   const actionButtons = getActionButtons();
  

//   useEffect(() => {
//   setEditedLead(data as Lead);
// }, [data]);
//   const fieldMap: Record<string, string> = {
//   "First Name": "firstName",
//   "Last Name": "lastName",
//   "Email": "email",
//   "Phone": "phone",
//   "Job Title": "jobTitle",
//   "Status": "status",
//   "Assigned To": "assignedTo"
// };

// const handleFieldEdit = async (label: string, value: string) => {
//   const field = fieldMap[label];
//   if (!field) return;

//   setAboutEdits(prev => ({ ...prev, [label]: value }));

//   try {
//    await updateLead(Number(currentData.id), {
//   [field]: value
// });
// // ✅ notify parent
// parentOnSave?.({
//   ...currentData,
//   [field]: value
// });
//     enqueueSnackbar(`${label} updated successfully!`, { variant: 'success' });
//   } catch (err) {
//     enqueueSnackbar(`Failed to update ${label}`, { variant: 'error' });
//   }
// };
//   // Initialize values from data
// useEffect(() => {
//   if (currentData) {
//     setCurrentStatus(
//       type === 'company'
//         ? (currentData as Company).industry
//         : config.getStatus(currentData)
//     );

//     setCurrentName(config.getTitle(currentData));
//   }
// }, [currentData, type, config]);

//   const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//     enqueueSnackbar('Copied to clipboard!', { variant: 'success' });
//   };
//   const handleSaveAllChanges = async () => {
//   try {
//     // Convert label-based edits → backend fields
//     const formattedData: any = {};

//     Object.entries(aboutEdits).forEach(([label, value]) => {
//       const field = fieldMap[label];
//       if (field) {
//         formattedData[field] = value;
//       }
//     });

//     await updateLead(Number(data.id), formattedData);
//     // ✅ update parent UI
//     parentOnSave?.({
//     ...currentData,
//    ...formattedData
//   }) ;

//     enqueueSnackbar('Changes saved!', { variant: 'success' });
//     setIsAboutEdit(false);
//   } catch (err) {
//     enqueueSnackbar('Failed to save changes', { variant: 'error' });
//   }
// };

//   const getIconComponent = (iconName: string) => {
//     switch (iconName) {
//       case 'NoteAltOutlined':
//         return <FileText size={16} />;
//       case 'EmailOutlined':
//         return <Mail size={16} />;
//       case 'CallOutlined':
//         return <Phone size={16} />;
//       case 'TaskAltOutlined':
//         return <CheckSquare size={16} />;
//       case 'EventOutlined':
//         return <Calendar size={16} />;
//       default:
//         return <FileText size={16} />;
//     }
//   };

//   const handleActionClick = (activityType: ActivityType) => {
//     setSelectedActivity(activityType);
//     setIsDrawerOpen(true);
//   };

//   const handleDrawerClose = () => {
//     setIsDrawerOpen(false);
//   };

//   const handleEditClick = () => {
//     setIsAboutEdit(true);
//     setIsStatusEdit(false);
//     setIsEditModalOpen(true);
//   };

//   const handleStatusEditClick = () => {
//     setIsInlineEditing(true);
//   };

//   const handleStatusSave = (newValue: string) => {
//     setCurrentStatus(newValue);
//     setIsInlineEditing(false);
//     enqueueSnackbar('Updated successfully!', { variant: 'success' });
//   };

//   const handleNameEditClick = () => {
//     setIsNameEditing(true);
//   };

//   const handleNameSave = (newValue: string) => {
//     setCurrentName(newValue);
//     setIsNameEditing(false);
//     enqueueSnackbar('Updated successfully!', { variant: 'success' });
//   };

//   const handleFullEditClick = () => {
//     setIsAboutEdit(false);
//     setIsStatusEdit(false);
//     setIsEditModalOpen(true);
//   };

//   const getLeadInitialData = (lead: Lead) => {
//     const names = lead.name.split(' ');
//     return {
//       firstName: names[0] || '',
//       lastName: names.slice(1).join(' ') || '',
//       email: lead.email,
//       phoneNumber: lead.phone,
//       jobTitle: lead.jobTitle,
//       contactOwner: lead.assignedTo,
//       leadStatus: lead.status?.toLowerCase()
//     };
//   };

//   const getCompanyInitialData = (company: Company) => {
//     return {
//       name: company.name,
//       owner: company.owner,
//       industry: company.industry,
//       type: (company as any).type || 'Private',
//       phone: company.phone,
//       city: company.city,
//       country: company.country,
//       employees: (company as any).employees || '',
//       revenue: (company as any).revenue || '',
//       domain: company.domain || ''
//     };
//   };

//   const getDealInitialData = (deal: Deal) => {
//     return {
//       name: deal.name,
//       stage: deal.stage,
//       amount: deal.amount.toString(),
//       owner: deal.owner,
//       closeDate: deal.closeDate,
//       priority: (deal as any).priority || 'medium'
//     };
//   };

//   const getTicketInitialData = (ticket: Ticket) => {
//     return {
//       title: ticket.title,
//       description: ticket.description || '',
//       status: ticket.status,
//       source: (ticket as any).source || 'Email',
//       priority: ticket.priority,
//       owner: ticket.owner
//     };
//   };

//   return (
//     <>
//       <Box sx={{ width: 250 }}>
//         {/* Back Button */}
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-[#344054] hover:text-[#5948DB] transition-all mb-4 group"
//         >
//           <ChevronLeft size={18} strokeWidth={2} />
//           <Typography sx={{ fontSize: '15px', fontWeight: 700 }}>
//             {type === 'company' ? 'Companies' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
//           </Typography>
//         </button>

//         {/* Entity header */}
//         <Box mb={3}>
//           {(type === 'lead' || type === 'company') ? (
//             <Stack direction="row" spacing={1.5} alignItems="flex-start">
//               <Box
//                 sx={{
//                   width: 44,
//                   height: 44,
//                   bgcolor: '#E0E0E0',
//                   borderRadius: 1,
//                   flexShrink: 0
//                 }}
//               />
//               <Box>
//                 <Stack direction="row" spacing={0.5} alignItems="center">
//                   {isNameEditing ? (
//                     <input
//                       type="text"
//                       value={currentName}
//                       onChange={(e) => setCurrentName(e.target.value)}
//                       onBlur={() => setIsNameEditing(false)}
//                       onKeyDown={(e) => e.key === 'Enter' && handleNameSave(currentName)}
//                       autoFocus
//                       className="text-[14px] font-semibold border-b border-[#5948DB] focus:outline-none w-full bg-transparent text-[#101828]"
//                     />
//                   ) : (
//                     <Typography 
//                       fontWeight={600}
//                       onClick={handleNameEditClick}
//                       sx={{ cursor: 'pointer', fontSize: '14px' }}
//                     >
//                       {currentName}
//                     </Typography>
//                   )}
//                 </Stack>
                
//                 <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 0.2 }}>
//                   {type === 'lead' ? (currentData as Lead).jobTitle || 'Salesperson' : (data as Company).industry}
//                 </Typography>

//                 <Stack direction="row" spacing={0.5} alignItems="center" mt={0.2}>
//                   <Typography sx={{ fontSize: '12px', color: '#5948DB' }}>
//                     {config.getSubtitle(currentData)}
//                   </Typography>
//                   <IconButton 
//                     size="small" 
//                     onClick={() => handleCopy(config.getSubtitle(currentData))}
//                     sx={{ p: 0.5, color: '#5948DB' }}
//                   >
//                     <Copy size={13} />
//                   </IconButton>
//                 </Stack>
//               </Box>
//             </Stack>
//           ) : (
//             <Box>
//               <Stack direction="row" spacing={0.5} alignItems="flex-start">
//                 {isNameEditing ? (
//                   <input
//                     type="text"
//                     value={currentName}
//                     onChange={(e) => setCurrentName(e.target.value)}
//                     onBlur={() => setIsNameEditing(false)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleNameSave(currentName)}
//                     autoFocus
//                     className="text-[14px] font-semibold border-b border-[#5948DB] focus:outline-none w-full bg-transparent text-[#1D2939]"
//                   />
//                 ) : (
//                     <Typography 
//                       fontWeight={600}
//                       onClick={handleNameEditClick}
//                       sx={{ 
//                         fontSize: '14px',
//                         cursor: 'pointer',
//                         wordBreak: 'break-word',
//                         lineHeight: 1.2,
//                         flex: 1
//                       }}
//                     >
//                       {currentName}
//                     </Typography>
//                 )}
//               </Stack>

//               {type === 'deal' && (
//                 <Box mt={0.5}>
//                   <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
//                     Amount : <span style={{ fontWeight: 600, color: '#1D2939' }}>${(currentData as Deal).amount}</span>
//                   </Typography>
//                   <Stack direction="row" spacing={0.5} alignItems="center">
//                     <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
//                       Stage : 
//                     </Typography>
//                     {isInlineEditing ? (
//                       <select
//                         value={currentStatus}
//                         onChange={(e) => handleStatusSave(e.target.value)}
//                         onBlur={() => setIsInlineEditing(false)}
//                         autoFocus
//                         className="text-[13px] font-semibold border-b border-[#5948DB] focus:outline-none bg-transparent text-[#1D2939] cursor-pointer"
//                       >
//                         {['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Presentation Scheduled'].map(s => <option key={s} value={s}>{s}</option>)}
//                       </select>
//                     ) : (
//                       <Stack direction="row" spacing={0.2} alignItems="center">
//                         <span style={{ fontWeight: 600, color: '#1D2939', fontSize: '13px' }}>{currentStatus}</span>
//                         <IconButton size="small" onClick={handleStatusEditClick} sx={{ p: 0.2, color: '#5948DB' }}>
//                           <ChevronDown size={16} />
//                         </IconButton>
//                       </Stack>
//                     )}
//                   </Stack>
//                 </Box>
//               )}

//               {type === 'ticket' && (
//                 <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
//                   <Typography sx={{ fontSize: '13px', color: 'text.secondary' }}>
//                     Status : 
//                   </Typography>
//                   {isInlineEditing ? (
//                     <select
//                       value={currentStatus}
//                       onChange={(e) => handleStatusSave(e.target.value)}
//                       onBlur={() => setIsInlineEditing(false)}
//                       autoFocus
//                       className="text-[13px] font-semibold border-b border-[#5948DB] focus:outline-none bg-transparent text-[#1D2939] cursor-pointer"
//                     >
//                       {['New', 'Waiting on contact', 'Waiting on us', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
//                     </select>
//                   ) : (
//                     <Stack direction="row" spacing={0.2} alignItems="center">
//                       <span style={{ fontWeight: 600, color: '#1D2939', fontSize: '13px' }}>{currentStatus}</span>
//                       <IconButton size="small" onClick={handleStatusEditClick} sx={{ p: 0.2, color: '#5948DB' }}>
//                         <ChevronDown size={16} />
//                       </IconButton>
//                     </Stack>
//                   )}
//                 </Stack>
//               )}
//             </Box>
//           )}
//         </Box>

//         {/* Actions */}
//         <Box
//           mb={3}
//           sx={{
//             bgcolor: '#F3F4F6',
//             py: 1,
//             px: 1,
//             borderRadius: 2,
//           }}
//         >
//           <Stack
//             direction="row"
//             spacing={1}
//             justifyContent="space-between"
//           >
//             {actionButtons.map((item) => (
//               <Box key={item.label} textAlign="center">
//                 <IconButton
//                   size="small"
//                   onClick={() => handleActionClick(item.label.toLowerCase() as ActivityType)}
//                   sx={{
//                     border: '2px solid #E5E7EB',
//                     color: '#5948DB',
//                     width: 30,
//                     height: 30,
//                     bgcolor: '#ffffff',
//                     borderRadius: 1.5,
//                     transition: 'all 0.2s',
//                     '&:hover': {
//                       bgcolor: '#E5E7EB',
//                     },
//                   }}
//                 >
//                   {getIconComponent(item.icon)}
//                 </IconButton>
//                 <Typography
//                   sx={{
//                     fontSize: '10px',
//                     mt: 0.5,
//                     color: 'text.secondary',
//                     textAlign: 'center'
//                   }}
//                 >
//                   {item.label}
//                 </Typography>
//               </Box>
//             ))}
//           </Stack>
//         </Box>

//         {/* About Section Header */}
//         <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <ChevronDown size={20} className="text-[#6941C6]" />
//             <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#344054' }}>
//               About this {type.charAt(0).toUpperCase() + type.slice(1)}
//             </Typography>
//           </Stack>
//           <IconButton 
//             size="small" 
//             onClick={() => setIsAboutEdit(!isAboutEdit)}
//             sx={{ color: '#6941C6' }}
//           >
//             <Edit3 size={18} />
//           </IconButton>
//         </Box>

//         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
//           {config.getAboutSections(currentData).map((section) => (
//             <Box key={section.label}>
//               <Typography sx={{ fontSize: '13px', color: '#667085', mb: 0.5, fontWeight: 500 }}>
//                 {section.label}
//               </Typography>
//               {isAboutEdit ? (
//                 <input
//                   type="text"
//                   defaultValue={section.value}
//                   className="w-full text-[14px] font-medium text-[#1D2939] border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#5948DB]"
//   onChange={(e) => setAboutEdits(prev => ({ ...prev, [section.label]: e.target.value }))}
//   onBlur={(e) => handleFieldEdit(section.label, e.target.value)}

//                 />
//               ) : (
//                 <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#1D2939' }}>
//                   {section.value}
//                 </Typography>
//               )}
//             </Box>
//           ))}
//           {isAboutEdit && (
//             <button 
//               onClick={async() => {
//                       try {
//        await handleSaveAllChanges()// save only the changed fields
//         enqueueSnackbar('Changes saved!', { variant: 'success' });
//         setIsAboutEdit(false);
//       } catch (err) {
//         enqueueSnackbar('Failed to save changes', { variant: 'error' });
//       }
               
//               }}
//               className="mt-2 w-full py-2 bg-[#5948DB] text-white rounded-lg text-sm font-medium hover:bg-[#4838b8] transition-colors"
//             >
//               Save All Changes
//             </button>
//           )}
//         </Box>
//       </Box>

//       {/* Activity Drawer */}
//       <DynamicActivityDrawer
//         isOpen={isDrawerOpen}
//         onClose={handleDrawerClose}
//         activityType={selectedActivity}
//         //onSave={handleActivitySave}
//         entityData={currentData}
//       />

//       {/* Edit Modals */}
//       {type === 'lead' && (
//         <CreateLeadModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//   initialData={getLeadInitialData(currentData as Lead)}
//   editedDetailsOnly={isAboutEdit}
//   statusOnly={isStatusEdit}
//   onSave={(updatedData) => {
//     parentOnSave?.(updatedData); // ✅ works now
  
//           }}
//         />
//       )}

//       {type === 'company' && (
//         <CreateCompanyModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getCompanyInitialData(currentData as Company)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Company:', updatedData);
//           }}
//         />
//       )}

//       {type === 'deal' && (
//         <CreateDealModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getDealInitialData(currentData as Deal)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Deal:', updatedData);
//           }}
//         />
//       )}

//       {type === 'ticket' && (
//         <CreateTicketModal
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setIsAboutEdit(false);
//             setIsStatusEdit(false);
//           }}
//           initialData={getTicketInitialData(currentData as Ticket)}
//           editedDetailsOnly={isAboutEdit}
//           statusOnly={isStatusEdit}
//           onSave={(updatedData) => {
//             console.log('Updated Ticket:', updatedData);
//           }}
//         />
//       )}
//     </>
//   );
// };

// 'use client';

// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Typography,
//   Stack,
//   IconButton,
// } from '@mui/material';
// import {
//   ChevronLeft,
//   ChevronDown,
//   Edit3,
//   Mail,
//   Phone,
//   CheckSquare,
//   Calendar,
//   FileText,
//   Edit2,
//   SquarePen
// } from 'lucide-react';
// import ContentCopyIcon from '@mui/icons-material/ContentCopy';
// import { useSnackbar } from 'notistack';
// import { entityConfigs, getActionButtons, EntityType } from '@/components/common/entityConfig';
// import { EnvelopeIcon , PhoneIcon, ClipboardDocumentListIcon, CalendarDaysIcon} from '@heroicons/react/24/solid';
// import { ActivityType } from './DynamicActivityDrawer';
// import { createCall, createEmail, createMeeting, createNote, createTask } from '@/lib/api';
// import { DynamicActivityDrawer } from './DynamicActivityDrawer';  
// import { on } from 'events';
// import { set } from 'zod';
// interface DetailPageLeftProps<T> {
//   type: EntityType;
//   data: T;
//   onBack: () => void;
//   onSave?: (updatedData: T) => void;
//  onActionClick:(type: ActivityType) => void;
// }

// export const DetailPageLeft = <T extends { id: string | number }>(
//   { type, data, onBack, onSave, onActionClick }: DetailPageLeftProps<T>
// ) => {

//   const { enqueueSnackbar } = useSnackbar();

//   const [currentData, setCurrentData] = useState<T>(data);
//   const [isAboutEdit, setIsAboutEdit] = useState(false);
//     // ✅ ADD HERE
//   const [selectedActivity, setSelectedActivity] = useState<ActivityType>('note');
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [currentName, setCurrentName] = useState('');
//   const [currentStatus, setCurrentStatus] = useState('');

//   const config = entityConfigs[type];
//   const actionButtons = getActionButtons();

  

 
//   useEffect(() => {
//     setCurrentData(data);
//     setCurrentName(config.getTitle(data as any));
//     setCurrentStatus(config.getStatus(data as any));
//   }, [data]);

//     const handleActionClick = (activityType: ActivityType) => {
//   onActionClick(activityType); // 🔥 send to parent
// };
//       const handleCopy = (text: string) => {
//     navigator.clipboard.writeText(text);
//     enqueueSnackbar('Copied!', { variant: 'success' });
//   };

//   const getIconComponent = (iconName: string) => {
//     switch (iconName) {
//       case 'NoteAltOutlined': return <SquarePen size={16} />;
//       case 'EmailOutlined':return <EnvelopeIcon className="w-4 h-4" />;
//       case 'CallOutlined': return <PhoneIcon className="w-4 h-4" />;
//       case 'TaskAltOutlined': return <ClipboardDocumentListIcon className="w-4 h-4" />;
//       case 'EventOutlined': return <CalendarDaysIcon className="w-4 h-4"/>;
//       default: return <FileText size={16} />;
//     }
//   };

//   return (
    
//     <Box sx={{ width: 260, p: 2 }}>

//       {/* 🔙 Back Button (FIXED TEXT) */}
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 text-[#344054] hover:text-[#5948DB] mb-4"
//       >
//         <ChevronLeft size={18} />
//         <Typography fontWeight={700} fontSize={15}>
//           {type.charAt(0).toUpperCase() + type.slice(1)}s
//         </Typography>
//       </button>

//       {/* 👤 Profile Section */}
//       <Box mb={3}>
//         <Stack direction="row" spacing={1.5}>
          
//           {/* Avatar */}
//           <Box sx={{
//             width: 58,
//             height: 58,
//             bgcolor: '#E0E0E0',
//             borderRadius: 1
//           }} />

//           <Box>

//             {/* Name */}
//             <Stack direction="row" alignItems="center" spacing={0.5}>
//               <Typography fontWeight={600} fontSize={14}>
//                // {currentName}
//               </Typography>
//               {/* <IconButton size="small">
//                 <Edit3 size={14} />
//               </IconButton> */}
//             </Stack>

//             {/* Job Title */}
//             <Typography fontSize={12} color="text.secondary">
//               {(currentData as any).jobTitle || 'no jobtitle provided'}
//             </Typography>

//             {/* Email + Copy */}
//             <Stack direction="row" alignItems="center" spacing={0.5}>
//               <Typography fontSize={12} color="text.secondary">
//                 {(currentData as any).email || 'no email provided'}
//               </Typography >
//              <IconButton
//   size="small"
//   onClick={() => handleCopy((currentData as any).email || '')}
//   sx={{
//     backgroundColor: '#5948DB !important', // force
//     color: '#fff !important',
//     '&:hover': {
//       backgroundColor: '#4838b8 !important',
//     },
//   }}
// >
//   <ContentCopyIcon sx={{ fontSize: 10 }} />
// </IconButton>
//             </Stack>

//           </Box>
//         </Stack>
//       </Box>

//       {/* ⚡ Action Buttons (FIXED STYLE) */}
//       <Box
//         mb={3}
//         sx={{
//           bgcolor: '#F3F4F6',
//           py: 1,
//           px: 1,
//           borderRadius: 2,
//         }}
//       >
//         <Stack direction="row" justifyContent="space-between">
//           {actionButtons.map((item) => (
//             <Box key={item.label} textAlign="center">
//               <IconButton
//                 size="small"
//                 onClick={() => handleActionClick(item.label.toLowerCase() as ActivityType)} // ✅ IMPORTAN
//                 sx={{
//                   border: '2px solid #E5E7EB',
//                   color: '#5948DB',
//                   width: 30,
//                   height: 30,
//                   bgcolor: '#fff',
//                   borderRadius: 1.5
//                 }}
//               >
//                 {getIconComponent(item.icon)}
//               </IconButton>
//               <Typography fontSize={10} color="text.secondary">
//                 {item.label}
//               </Typography>
//             </Box>
//           ))}
//         </Stack>
//       </Box>

//       {/* 📄 About Section */}
//       <Box display="flex" justifyContent="space-between" mb={2}>
//         <Stack direction="row" spacing={1}>
//           <ChevronDown size={18} />
//           <Typography fontWeight={700} fontSize={14}>
//             About this {type}
//           </Typography>
//         </Stack>

//         <IconButton 
//         onClick={() => setIsAboutEdit(!isAboutEdit)}
//             size="small"
//   disableRipple
//   sx={{
//     color: '#5948DB',
//     '&:hover': {
//       backgroundColor: '#EEF2FF',
//     },
//   }}
// >
//           <SquarePen size={13} />
//         </IconButton>
//       </Box>

//       {/* Fields */}
//       <Stack spacing={2}>
//         {config.getAboutSections(currentData as any).map((section) => (
//           <Box key={section.label}>
//             <Typography fontSize={12} color="#667085">
//               {section.label}
//             </Typography>

//             {isAboutEdit ? (
//               <input
//                 className="w-full border px-2 py-1 text-sm"
//                 defaultValue={section.value}
//                 //autosave updated value when we click outside the field
//                 onBlur={(e) => {
//                   const updated = {
//                     ...currentData,
//                     [section.key]: e.target.value
//                   };
//                   setCurrentData(updated);
//                   onSave?.(updated);
//                 }}
//               />
//             ) : (
//               <Typography fontSize={14} fontWeight={500}>
//                 {section.value}
//               </Typography>
//             )}
//           </Box>
//         ))}
//       </Stack>

//     </Box>

// )}


'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronDown,
  SquarePen,
  FileText,
} from 'lucide-react';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from 'notistack';

import {
  entityConfigs,
  getActionButtons,
  EntityType,
} from '@/components/common/entityConfig';

import {
  EnvelopeIcon,
  PhoneIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/solid';

import { ActivityType } from './DynamicActivityDrawer';

// ✅ IMPORT TYPES
import { Lead } from '@/app/types/leadtypes';
import { Deal } from '@/app/types/dealtypes';
import { Ticket } from '@/app/types/tickettypes';
import { Company } from '@/app/types/companytypes';


// ✅ ENTITY MAP
type EntityMap = {
  lead: Lead;
  deal: Deal;
  ticket: Ticket;
  company: Company;
};

// ✅ PROPS
interface DetailPageLeftProps<K extends EntityType> {
  type: K;
  data: EntityMap[K];
  onBack: () => void;
  onSave?: (updatedData: EntityMap[K]) => void;
  onActionClick: (type: ActivityType) => void;
}

// ✅ COMPONENT
export const DetailPageLeft = <K extends EntityType>({
  type,
  data,
  onBack,
  onSave,
  onActionClick,
}: DetailPageLeftProps<K>) => {

  const { enqueueSnackbar } = useSnackbar();

  const [currentData, setCurrentData] = useState<EntityMap[K]>(data);
  const [isAboutEdit, setIsAboutEdit] = useState(false);

  const config = entityConfigs[type];
  const actionButtons = getActionButtons();
  const profile = config.getProfileFields(currentData);

  // Sync when data changes
  useEffect(() => {
    setCurrentData(data);
  }, [data]);

  // Copy handler
  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied!', { variant: 'success' });
  };

  // Action click
  const handleActionClick = (activityType: ActivityType) => {
    onActionClick(activityType);
  };

  // Icons
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'NoteAltOutlined':
        return <SquarePen size={16} />;
      case 'EmailOutlined':
        return <EnvelopeIcon className="w-4 h-4" />;
      case 'CallOutlined':
        return <PhoneIcon className="w-4 h-4" />;
      case 'TaskAltOutlined':
        return <ClipboardDocumentListIcon className="w-4 h-4" />;
      case 'EventOutlined':
        return <CalendarDaysIcon className="w-4 h-4" />;
      default:
        return <FileText size={16} />;
    }
  };

  return (
    <Box sx={{ width: 260, p: 2 }}>

      {/* 🔙 Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#344054] hover:text-[#5948DB] mb-4"
      >
        <ChevronLeft size={18} />
        <Typography fontWeight={700} fontSize={15}>
          {type.charAt(0).toUpperCase() + type.slice(1)}s
        </Typography>
      </button>

      {/* 👤 Profile */}
      {profile.type === 'ticket' ? (
  <Box>
    <Typography fontWeight={600} fontSize={14}>
      {profile.fields.title}
    </Typography>

    <select
      value={profile.fields.status}
      onChange={(e) => {
        const updated = {
          ...currentData,
          status: e.target.value,
        };
        setCurrentData(updated);
        onSave?.(updated);
      }}
      className="mt-1 px-2 py-1 text-sm border rounded"
    >
      <option value="open">Open</option>
      <option value="in progress">In Progress</option>
      <option value="closed">Closed</option>
    </select>
  </Box>
) :
    <Box mb={3}>
  {profile.type === 'deal' ? (
    // ✅ DEAL UI
    <Box>
      <Typography fontWeight={700} fontSize={15}>
        {profile.fields.title}
      </Typography>

      <Typography fontSize={13} color="text.secondary">
       Amount:₹ {profile.fields.amount?.toLocaleString()}
      </Typography>

      {/* Stage Dropdown */}

      <select
        value={profile.fields.stage}
        onChange={(e) => {
          const updated = {
            ...currentData,
            stage: e.target.value,
          };
          setCurrentData(updated);
          onSave?.(updated);
        }}
        className="mt-1 px-2 py-1 text-sm border rounded"
      >
        <option value="Appointment Scheduled">Appointment Scheduled</option>
        <option value="Qualified to Buy">Qualified to Buy</option>
        <option value="Presentation Scheduled">Presentation Scheduled</option>
        <option value="Decision Maker Bought-In">Decision Maker Bought-In</option>
        <option value="Contract Sent">Contract Sent</option>
        <option value="Closed Won">Closed Won</option>
        <option value="Closed Lost">Closed Lost</option>
      </select>
    </Box>
  ) : (
    // ✅ DEFAULT UI (Lead, Company, Ticket)
    <Stack direction="row" spacing={1.5}>
      <Box
        sx={{
          width: 58,
          height: 58,
          bgcolor: '#E0E0E0',
          borderRadius: 1,
        }}
      />

      <Box>
        <Typography fontWeight={600} fontSize={14}>
          {profile.fields.title}
        </Typography>

        <Typography fontSize={12} color="text.secondary">
          {profile.fields.status}
        </Typography>

        {'subtitle' in profile.fields && profile.fields.subtitle && (
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Typography fontSize={12} color="text.secondary">
              {profile.fields.subtitle}
            </Typography>

            <IconButton
              size="small"
              onClick={() => handleCopy(profile.fields.subtitle!)}
              sx={{
                backgroundColor: '#5948DB !important',
                color: '#fff !important',
                '&:hover': {
                  backgroundColor: '#4838b8 !important',
                },
              }}
            >
              <ContentCopyIcon sx={{ fontSize: 10 }} />
            </IconButton>
          </Stack>
        )}
      </Box>
    </Stack>
  )}
</Box>
}
      {/* ⚡ Actions */}
      <Box
        mb={3}
        sx={{
          bgcolor: '#F3F4F6',
          py: 1,
          px: 1,
          borderRadius: 2,
        }}
      >
        <Stack direction="row" justifyContent="space-between">
          {actionButtons.map((item) => (
            <Box key={item.label} textAlign="center">
              <IconButton
                size="small"
                onClick={() =>
                  handleActionClick(item.type)
                }
                sx={{
                  border: '2px solid #E5E7EB',
                  color: '#5948DB',
                  width: 30,
                  height: 30,
                  bgcolor: '#fff',
                  borderRadius: 1.5,
                }}
              >
                {getIconComponent(item.icon)}
              </IconButton>
              <Typography fontSize={10} color="text.secondary">
                {item.label}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* 📄 About */}
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Stack direction="row" spacing={1}>
          <ChevronDown size={18} />
          <Typography fontWeight={700} fontSize={14}>
            About this {type}
          </Typography>
        </Stack>

        <IconButton
          onClick={() => setIsAboutEdit(!isAboutEdit)}
          size="small"
          disableRipple
          sx={{
            color: '#5948DB',
            '&:hover': {
              backgroundColor: '#EEF2FF',
            },
          }}
        >
          <SquarePen size={13} />
        </IconButton>
      </Box>

      {/* Fields */}
      <Stack spacing={2}>
        {config.getAboutSections(currentData).map((section) => (
          <Box key={section.key}>
            <Typography fontSize={12} color="#667085">
              {section.label}
            </Typography>

            {isAboutEdit ? (
              <input
                className="w-full border px-2 py-1 text-sm"
                defaultValue={section.value}
                onBlur={(e) => {
                  const updated = {
                    ...currentData,
                    [section.key]: e.target.value,
                  };
                  setCurrentData(updated);
                  onSave?.(updated);
                }}
              />
            ) : (
              <Typography fontSize={14} fontWeight={500}>
                {section.value}
              </Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};