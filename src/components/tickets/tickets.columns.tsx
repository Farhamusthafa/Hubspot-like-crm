import { ColumnDef } from '../shared/DataTable';

export const ticketsColumns: ColumnDef[] = [
    { key: 'title', label: 'Ticket Name' },
    { key: 'status', label: 'Ticket Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'source', label: 'Source' },
    { key: 'owner', label: 'Ticket Owner' },
    {
        key: 'createdAt',
        label: 'Created Date',
        render: (row) => {
            return new Date(row.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }) + ' ' + new Date(row.createdAt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        }
    },
];
