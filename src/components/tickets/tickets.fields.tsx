import { FieldDef } from '../shared/FormBuilder';

export const ticketsFields: FieldDef[] = [
    {
        key: 'title',
        label: 'Ticket Name',
        type: 'text',
        required: true,
        placeholder: 'Enter ticket name'
    },
    {
        key: 'status',
        label: 'Ticket Status',
        type: 'select',
        required: true,
        options: [
            { value: 'New', label: 'New' },
            { value: 'Waiting on contact', label: 'Waiting on contact' },
            { value: 'Waiting on us', label: 'Waiting on us' },
            { value: 'Closed', label: 'Closed' }
        ]
    },
    {
        key: 'priority',
        label: 'Priority',
        type: 'select',
        required: true,
        options: [
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium' },
            { value: 'Low', label: 'Low' },
            { value: 'Critical', label: 'Critical' }
        ]
    },
    {
        key: 'source',
        label: 'Source',
        type: 'select',
        options: [
            { value: 'Chat', label: 'Chat' },
            { value: 'Email', label: 'Email' },
            { value: 'Phone', label: 'Phone' }
        ]
    },
    {
        key: 'owner',
        label: 'Ticket Owner',
        type: 'text',
        placeholder: 'Enter owner name'
    }
];
