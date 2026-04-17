export interface Ticket {
    id: string;
    title: string;
    status: 'Waiting on contact' | 'Waiting on us' | 'New' | 'Closed';
    priority: 'High' | 'Medium' | 'Low' | 'Critical';
    source: 'Chat' | 'Email' | 'Phone';
    owner: string;
    description?: string;
    createdAt: string;
}
