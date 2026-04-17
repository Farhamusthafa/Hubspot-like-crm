import { Lead } from '@/app/types/leadtypes';

export const mockLeads: Lead[] = [
    {
        id: '1',
        name: 'Jane Cooper',
        email: 'janecooper@gmail.com',
        phone: '078 542 8505',
        company: 'Company 1',
        status: 'Open',
        value: 0,
        source: 'Website',
        assignedTo: 'Salesperson',
        lastContact: '2025-04-08T14:55:00+05:30',
        createdAt: '2025-04-08T14:55:00+05:30',
        updatedAt: '2025-04-08T14:55:00+05:30',
    },
    {
        id: '2',
        name: 'Wade Warren',
        email: 'wadewarren@gmail.com',
        phone: '077 546 8785',
        company: 'Company 2',
        status: 'New',
        value: 0,
        source: 'Website',
        assignedTo: 'Salesperson',
        lastContact: '2025-04-08T14:55:00+05:30',
        createdAt: '2025-04-08T14:55:00+05:30',
        updatedAt: '2025-04-08T14:55:00+05:30',
    },
    {
        id: '3',
        name: 'Brooklyn Simmons',
        email: 'brooklynsimmons@gmail.com',
        phone: '070 4531 9507',
        company: 'Company 3',
        status: 'Qualified',
        value: 0,
        source: 'Website',
        assignedTo: 'Salesperson',
        lastContact: '2025-04-08T14:55:00+05:30',
        createdAt: '2025-04-08T14:55:00+05:30',
        updatedAt: '2025-04-08T14:55:00+05:30',
    },
    {
        id: '4',
        name: 'Leslie Alexander',
        email: 'lesliealexander@gmail.com',
        phone: '078 8242 3534',
        company: 'Company 4',
        status: 'Qualified',
        value: 0,
        source: 'Website',
        assignedTo: 'Salesperson',
        lastContact: '2025-04-08T14:55:00+05:30',
        createdAt: '2025-04-08T14:55:00+05:30',
        updatedAt: '2025-04-08T14:55:00+05:30',
    }
];

export const mockDeals = [
    { id: '1', name: 'Cloud Migration', stage: 'Prospecting', amount: '5000', owner: 'John Doe', closeDate: '2025-12-31', priority: 'high' },
    { id: '2', name: 'Software License', stage: 'Proposal', amount: '2000', owner: 'Jane Smith', closeDate: '2025-11-30', priority: 'medium' },
];

export const mockCompanies = [
    { id: '1', name: 'TechCorp', industry: 'Technology', owner: 'John Doe', domain: 'techcorp.com' },
    { id: '2', name: 'BizGrow', industry: 'Finance', owner: 'Jane Smith', domain: 'bizgrow.com' },
];

export const mockTickets = [
    { id: '1', title: 'Payment Issue', status: 'New', priority: 'High', owner: 'John Doe', description: 'User is unable to process credit card payments.' },
];
