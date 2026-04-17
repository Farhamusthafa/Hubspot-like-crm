import { FieldDef } from '../shared/FormBuilder';

export const companiesFields: FieldDef[] = [
    {
        key: 'name',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Enter company name'
    },
    {
        key: 'industry',
        label: 'Industry Type',
        type: 'text',
        required: true,
        placeholder: 'Enter industry'
    },
    {
        key: 'phone',
        label: 'Phone',
        type: 'tel',
        required: true,
        icon: 'phone',
        placeholder: 'Enter phone'
    },
    {
        key: 'city',
        label: 'City',
        type: 'text',
        required: true,
        placeholder: 'Enter city'
    },
    {
        key: 'country',
        label: 'Country',
        type: 'text',
        required: true,
        placeholder: 'Enter country'
    },
    {
        key: 'owner',
        label: 'Company Owner',
        type: 'text',
        placeholder: 'Enter owner name'
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { value: 'New', label: 'New' },
            { value: 'Open', label: 'Open' },
            { value: 'Inprogress', label: 'In Progress' },
            { value: 'Contacted', label: 'Contacted' },
            { value: 'Won', label: 'Won' },
            { value: 'Lost', label: 'Lost' }
        ]
    }
];
