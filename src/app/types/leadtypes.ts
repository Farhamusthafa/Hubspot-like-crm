export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    jobTitle?: string;
    status: 'New' | 'Contacted' | 'Open' | 'Inprogress' | 'Converted' | 'Lost' | 'Qualified';
    value: number;
    source: string;
    assignedTo: string;
    lastContact: string;
    createdAt: string;
    updatedAt: string;
}

export interface LeadFormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    jobTitle?: string;
    status: Lead['status'];
    value: number;
    source: string;
    assignedTo: string;
}
