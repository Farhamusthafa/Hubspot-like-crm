// import React from 'react';
// import {
//   NoteAltOutlined as NoteAltOutlinedIcon,
//   EmailOutlined as EmailOutlinedIcon,
//   CallOutlined as CallOutlinedIcon,
//   TaskAltOutlined as TaskAltOutlinedIcon,
//   EventOutlined as EventOutlinedIcon,
// } from '@mui/icons-material';
// import { Lead } from '@/app/types/leadtypes';
// import { Deal } from '@/app/types/dealtypes';
// import { Ticket } from '@/app/types/tickettypes';
// import { Company } from '@/app/types/companytypes';

// export type EntityType = 'lead' | 'deal' | 'ticket' | 'company';

// export interface EntityConfig {
//   getTitle: (data: Lead | Deal | Ticket | Company) => string;
//   getStatus: (data: Lead | Deal | Ticket | Company) => string;
//   getSubtitle: (data: Lead | Deal | Ticket | Company) => string;
//   getAboutSections: (data: Lead | Deal | Ticket | Company) => Array<{ label: string; value: string; key: string }>;
// }

// export const entityConfigs: Record<EntityType, EntityConfig> = {
//   lead: {
//     getTitle: (data) => (data as Lead).name,
//     getStatus: (data) => (data as Lead).jobTitle || '',
//     getSubtitle: (data) => (data as Lead).name,
//     getAboutSections: (data) => {
//       const lead = data as Lead;
//       return [
//         { label: 'Email', value: lead.email , key: 'email'},
//         { label: 'First Name', value: lead.name.split(' ')[0]  || '' , key: 'firstName'},
//         { label: 'Last Name', value: lead.name.split(' ')[1]  || '' , key: 'lastName'},
//         { label: 'Phone', value: lead.phone || '' ,key: 'phone' },
//         { label: 'Status', value: lead.status || '' , key: 'status'},
//         { label: 'Company', value: lead.company || '' ,key: 'company' },
//         { label: 'Job Title', value: lead.jobTitle || '' ,key: 'jobTitle' },
//         { label: 'Lead Owner', value: lead.assignedTo || '' ,key: 'assignedTo' },
//         //{ label: 'Lead Source', value: lead.source || '' ,key: 'source' },
//         {
//           label: 'Created Date', value: new Intl.DateTimeFormat('en-GB', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//             timeZoneName: 'shortOffset'
//           }).format(new Date(lead.createdAt || '')).replace(',', ''),
//           key: 'createdAt'
//         },
//       ];
//     },
//   },
//   deal: {
//     getTitle: (data) => (data as Deal).name,
//     getStatus: (data) => (data as Deal).stage,
//     getSubtitle: (data) => (data as Deal).name,
//     getAboutSections: (data) => {
//       const deal = data as Deal;
//       return [
//         { label: 'Deal Name', value: deal.name ,key: 'name' },
//        // { label: 'Account Name', value: deal.name ,key: 'accountName' },
//         { label: 'Deal Owner', value: deal.ownerName ,key: 'owner' },
//         { label: 'Amount', value: `$${deal.amount.toLocaleString()}` ,key: 'amount' },
//         { label: 'Close Date', value: new Date(deal.closeDate).toLocaleDateString() ,key: 'closeDate' },
//         {
//           label: 'Created Date', value: new Intl.DateTimeFormat('en-GB', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//             timeZoneName: 'shortOffset'
//           }).format(new Date(deal.createdAt || '')).replace(',', ''),
//           key: 'createdAt'
//         },
//       ];
//     },
//   },
//   ticket: {
//     getTitle: (data) => (data as Ticket).title,
//     getStatus: (data) => (data as Ticket).status,
//     getSubtitle: (data) => (data as Ticket).title,
//     getAboutSections: (data) => {
//       const ticket = data as Ticket;
//       return [
//         { label: 'Ticket ID', value: ticket.id,key: 'id' },
//         { label: 'Subject', value: ticket.title,key: 'title' },
//         { label: 'Status', value: ticket.status,key: 'status' },
//         { label: 'Priority', value: ticket.priority,key: 'priority' },
//         { label: 'Source', value: ticket.source,key: 'source' },
//         {
//           label: 'Created Date', value: new Intl.DateTimeFormat('en-GB', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//             timeZoneName: 'shortOffset'
//           }).format(new Date(ticket.createdAt)).replace(',', '')
//           ,key: 'createdAt'
//         },
//       ];
//     },
//   },
//   company: {
//     getTitle: (data) => (data as Company).name,
//     getStatus: (data) => (data as Company).status || '',
//     getSubtitle: (data) => (data as Company).name,
//     getAboutSections: (data) => {
//       const company = data as Company;
//       return [
//         { label: 'Domain', value: company.domain || '' ,key: 'domain' },
//         { label: 'Phone', value: company.phone,key: 'phone' },
//         { label: 'Industry', value: company.industry,key: 'industry' },
//         { label: 'Company Owner', value: company.owner || '' ,key: 'owner' },
//         { label: 'City', value: company.city || '' ,key: 'city' },
//         { label: 'Country', value: company.country || '' ,key: 'country' },
//         { label: 'No of Employees', value: (company as any).employees ? (company as any).employees.toString() : '' ,key: 'employees' },
//         { label: 'Annual Revenue', value: (company as any).annualRevenue ? (company as any).annualRevenue.toString() : '' ,key: 'annualRevenue' },
//         {
//           label: 'Created Date', value: new Intl.DateTimeFormat('en-GB', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             hour12: true,
//             timeZoneName: 'shortOffset'
//           }).format(new Date(company.createdAt)).replace(',', '')
//           ,key: 'createdAt'
//         },
//       ];
//     },
//   },
// };

// export interface ActionButton {
//   icon: string;
//   label: string;
//   type:'note' | 'email' | 'call' | 'task' | 'meeting';
// }

// export const getActionButtons = (): ActionButton[] => [
//   { icon: 'NoteAltOutlined', label: 'Note' ,type: 'note'},
//   { icon: 'EmailOutlined', label: 'Email' ,type: 'email'},
//   { icon: 'CallOutlined', label: 'Call' ,type: 'call'},
//   { icon: 'TaskAltOutlined', label: 'Task' ,type: 'task'},
//   { icon: 'EventOutlined', label: 'Meeting' ,type: 'meeting'},
// ];

import { Lead } from '@/app/types/leadtypes';
import { Deal } from '@/app/types/dealtypes';
import { Ticket } from '@/app/types/tickettypes';
import { Company } from '@/app/types/companytypes';

export type EntityType = 'lead' | 'deal' | 'ticket' | 'company';

// ✅ Common union type
export type EntityData = Lead | Deal | Ticket | Company;

// ✅ Profile return type
export type ProfileFields =
  | {
      type: 'default';
      fields: {
        title: string;
        status?: string;
        subtitle?: string;
      };
    }
  | {
      type: 'deal';
      fields: {
        title: string;
        amount: number;
        stage: string;
        subtitle?: string;
      };
      }
    | {
      type: 'ticket';
      fields: {
        title: string;
        status: string;
        subtitle?: string;
      };
    };

// ✅ Config Interface
export interface EntityConfig {
  getTitle: (data: EntityData) => string;
  getStatus: (data: EntityData) => string;
  getSubtitle: (data: EntityData) => string;

  getProfileFields: (data: EntityData) => ProfileFields;

  getAboutSections: (
    data: EntityData
  ) => Array<{ label: string; value: string; key: string }>;
}

// ✅ ENTITY CONFIGS
export const entityConfigs: Record<EntityType, EntityConfig> = {
  // 🔵 LEAD
  lead: {
    getTitle: (data) => (data as Lead).name,
    getStatus: (data) => (data as Lead).jobTitle || '',
    getSubtitle: (data) => (data as Lead).email || '',

    getProfileFields: (data) => {
      const lead = data as Lead;
      return {
        type: 'default',
        fields: {
          title: lead.name,
          status: lead.jobTitle,
          subtitle: lead.email,
        },
      };
    },

    getAboutSections: (data) => {
      const lead = data as Lead;
      return [
        { label: 'Email', value: lead.email || '', key: 'email' },
        { label: 'Phone', value: lead.phone || '', key: 'phone' },
      ];
    },
  },

  // 🟣 DEAL
  deal: {
    getTitle: (data) => (data as Deal).name,
    getStatus: (data) => (data as Deal).stage,
    getSubtitle: () => '',

    getProfileFields: (data) => {
      const deal = data as Deal;
      return {
        type: 'deal',
        fields: {
          title: deal.name,
          amount: deal.amount,
          stage: deal.stage,
          subtitle: '', // ✅ IMPORTANT
        },
      };
    },

    getAboutSections: (data) => {
      const deal = data as Deal;
      return [
        { label: 'Deal Owner', value: deal.ownerName, key: 'owner' },
        { label: 'Amount', value: `$${deal.amount}`, key: 'amount' },
      ];
    },
  },

  // 🟠 TICKET
  ticket: {
    getTitle: (data) => (data as Ticket).title,
    getStatus: (data) => `Status: ${(data as Ticket).status}`,
    getSubtitle: () => '',

    getProfileFields: (data) => {
      const ticket = data as Ticket;
      return {
        type: 'ticket',
        fields: {
          title: ticket.title,
          status: `Status: ${ticket.status}`,
        },
      };
    },

    getAboutSections: (data) => {
      const ticket = data as Ticket;
      return [
        { label: 'Priority', value: ticket.priority, key: 'priority' },
      ];
    },
  },

  // 🟢 COMPANY
  company: {
    getTitle: (data) => (data as Company).name,
    getStatus: (data) => (data as Company).industry || '',
    getSubtitle: (data) => (data as Company).domain || '',

    getProfileFields: (data) => {
      const company = data as Company;
      return {
        type: 'default',
        fields: {
          title: company.name,
          status: company.industry,
          subtitle: company.domain,
        },
      };
    },

    getAboutSections: (data) => {
      const company = data as Company;
      return [
        { label: 'Domain', value: company.domain || '', key: 'domain' },
        { label: 'Phone', value: company.phone || '', key: 'phone' },
      ];
    },
  },
};

// ✅ ACTION BUTTONS
export interface ActionButton {
  icon: string;
  label: string;
  type: 'note' | 'email' | 'call' | 'task' | 'meeting';
}

export const getActionButtons = (): ActionButton[] => [
  { icon: 'NoteAltOutlined', label: 'Note', type: 'note' },
  { icon: 'EmailOutlined', label: 'Email', type: 'email' },
  { icon: 'CallOutlined', label: 'Call', type: 'call' },
  { icon: 'TaskAltOutlined', label: 'Task', type: 'task' },
  { icon: 'EventOutlined', label: 'Meeting', type: 'meeting' },
];