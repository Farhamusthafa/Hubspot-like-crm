import { FieldDef } from '../shared/FormBuilder';

export const dealsFields: FieldDef[] = [
    {
        key: 'name',
        label: 'Deal Name',
        type: 'text',
        required: true,
        placeholder: 'Enter deal name'
    },
    {
        key: 'stage',
        label: 'Deal Stage',
        type: 'select',
        required: true,
        options: [
            { value: 'Presentation Scheduled', label: 'Presentation Scheduled' },
            { value: 'Qualified to Buy', label: 'Qualified to Buy' },
            { value: 'Contract Sent', label: 'Contract Sent' },
            { value: 'Closed Won', label: 'Closed Won' },
            { value: 'Appointment Scheduled', label: 'Appointment Scheduled' },
            { value: 'Decision Maker Bought In', label: 'Decision Maker Bought In' },
            { value: 'Closed Lost', label: 'Closed Lost' }
        ]
    },
    {
        key: 'closeDate',
        label: 'Close Date',
        type: 'date',
        required: true
    },
    {
        key: 'amount',
        label: 'Amount ($)',
        type: 'number',
        required: true,
        min: 0,
        //step: 0.01,
        placeholder: '0.00'
    },
    {
        key: 'owner',
        label: 'Deal Owner',
        type: 'select',
        //required: true,
        placeholder: 'Select owner'
    }
];
