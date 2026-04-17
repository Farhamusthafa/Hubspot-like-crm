import { ColumnDef } from '../shared/DataTable';

export const companiesColumns: ColumnDef[] = [
    { key: 'name', label: 'Company Name' },
    { key: 'owner', label: 'Owner' },
    { key: 'phone', label: 'Phone' },
    { key: 'industry', label: 'Industry' },
    { key: 'city', label: 'City' },
    { key: 'country', label: 'Country/Region' },
    {
        key: 'createdAt',
        label: 'Created Date',
        render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
];
