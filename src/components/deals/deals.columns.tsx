import { ColumnDef } from '../shared/DataTable';

export const dealsColumns: ColumnDef[] = [
    { key: 'name', label: 'Deal Name' },
    { key: 'stage', label: 'Deal Stage' },
    {
        key: 'closeDate',
        label: 'Close Date',
        render: (row) => new Date(row.closeDate).toLocaleDateString()
    },
    { key: 'ownerName', label: 'Deal Owner' },
    {
        key: 'amount',
        label: 'Amount',
        render: (row) => `$${row.amount.toLocaleString()}`
    },
];
