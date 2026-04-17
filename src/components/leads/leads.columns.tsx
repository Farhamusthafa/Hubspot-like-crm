import { ColumnDef } from '../shared/DataTable';
import { StatusBadge } from '../common/StatusBadge';

export const leadsColumns: ColumnDef[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone Number' },
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
            }) + ' GMT+5:30';
        }
    },
    {
        key: 'status',
        label: 'Lead Status',
        className: 'text-center',
        render: (row) => <StatusBadge status={row.status} />
    },
];
