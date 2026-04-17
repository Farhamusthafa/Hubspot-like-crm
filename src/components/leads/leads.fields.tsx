import { FieldDef } from '../shared/FormBuilder';

export const leadsFields: FieldDef[] = [
    {
        key: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        icon: 'email',
        placeholder: 'Enter'
    },
    {
        key: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'Enter'
    },
    {
        key: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'Enter'
    },
    {
        key: 'phone',
        label: 'Phone Number',
        type: 'tel',
        required: true,
        icon: 'phone',
        placeholder: 'Enter'
    },
    {
        key: 'jobTitle',
        label: 'Job Title',
        type: 'text',
        placeholder: 'Enter'
    },
    {
        key: 'assignedTo',
        label: 'Contact Owner',
        type: 'select',
        placeholder: 'Choose',
        options: [
            { value: 'Salesperson', label: 'Salesperson' },
            { value: 'Manager', label: 'Manager' },
            { value: 'Agent', label: 'Agent' }
        ]
    },
    {
        key: 'status',
        label: 'Lead Status',
        type: 'select',
        placeholder: 'Choose',
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
