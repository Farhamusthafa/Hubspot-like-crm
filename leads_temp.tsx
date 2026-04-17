"use client";

import { useState } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { DrawerWrapper } from '@/components/shared/DrawerWrapper';
import { FormBuilder } from '@/components/shared/FormBuilder';
import { leadsColumns } from '@/components/leads/leads.columns';
import { leadsFields } from '@/components/leads/leads.fields';
import { Lead } from '@/app/types/leadtypes';

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Jane Cooper',
    email: 'janecooper@gmail.com',
    phone: '078 542 8505',
    company: 'Company 1',
    status: 'Open',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '2',
    name: 'Wade Warren',
    email: 'wadewarren@gmail.com',
    phone: '077 546 8785',
    company: 'Company 2',
    status: 'New',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '3',
    name: 'Brooklyn Simmons',
    email: 'brooklynsimmons@gmail.com',
    phone: '070 4531 9507',
    company: 'Company 3',
    status: 'New',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '4',
    name: 'Leslie Alexander',
    email: 'lesliealexander@gmail.com',
    phone: '078 8242 3534',
    company: 'Company 4',
    status: 'New',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '5',
    name: 'Jenny Wilson',
    email: 'jennywilson@gmail.com',
    phone: '079 8761 9681',
    company: 'Company 5',
    status: 'New',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '6',
    name: 'Guy Hawkins',
    email: 'guyhawkins@gmail.com',
    phone: '078 5432 8505',
    company: 'Company 6',
    status: 'New',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '7',
    name: 'Robert Fox',
    email: 'robertfox@gmail.com',
    phone: '077 546 8785',
    company: 'Company 7',
    status: 'New',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
  {
    id: '8',
    name: 'Cameron Williamson',
    email: 'cameronwilliamson@gmail.com',
    phone: '078 8242 3534',
    company: 'Company 8',
    status: 'Inprogress',
    value: 0,
    source: 'Website',
    assignedTo: 'Salesperson',
    lastContact: '2025-04-08T14:55:00+05:30',
    createdAt: '2025-04-08T14:55:00+05:30',
    updatedAt: '2025-04-08T14:55:00+05:30',
  },
];

const leadsFilters: FilterDef[] = [
  {
    key: 'status',
    label: 'Lead Status',
    type: 'select',
    options: [
      { value: 'New', label: 'New' },
      { value: 'Open', label: 'Open' },
      { value: 'Inprogress', label: 'In Progress' },
      { value: 'Contacted', label: 'Contacted' },
      { value: 'Won', label: 'Won' },
      { value: 'Lost', label: 'Lost' }
    ]
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date'
  }
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleDeleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
  };

  const handleSaveLead = (data: any) => {
    const fullName = `${data.firstName} ${data.lastName}`.trim();

    if (editingLead) {
      setLeads(prev => prev.map(l =>
        l.id === editingLead.id
          ? { ...l, ...data, name: fullName, updatedAt: new Date().toISOString() }
          : l
      ));
    } else {
      const newLead: Lead = {
        ...data,
        name: fullName,
        id: Math.random().toString(36).substr(2, 9),
        company: data.company || 'N/A',
        value: 0,
        source: 'Website',
        lastContact: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setLeads(prev => [newLead, ...prev]);
    }
    setIsFormOpen(false);
    setEditingLead(null);
  };

  // Prepare initial data for form
  const formInitialData = editingLead ? {
    ...editingLead,
    firstName: editingLead.name.split(' ')[0] || '',
    lastName: editingLead.name.split(' ').slice(1).join(' ') || '',
  } : undefined;

  return (
    <PageLayout>
      <DataTable
        columns={leadsColumns}
        data={leads}
        filters={leadsFilters}
        onEdit={handleEditLead}
        onDelete={handleDeleteLead}
        onAdd={() => setIsFormOpen(true)}
        nameColumn="name"
        detailRoute="/dashboard/leads"
      />

      {isFormOpen && (
        <DrawerWrapper
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingLead(null);
          }}
          title={editingLead ? 'Edit Lead' : 'Create Lead'}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingLead(null);
                }}
                className="w-[213px] h-[44px] border border-[#D0D5DD] text-[#344054] rounded-[8px] hover:bg-gray-50 transition font-medium text-[16px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="lead-form"
                className="w-[213px] h-[44px] bg-[#5948DB] text-white rounded-[8px] hover:bg-[#4a3ea3] transition font-medium text-[16px]"
              >
                Save
              </button>
            </>
          }
        >
          <FormBuilder
            fields={leadsFields}
            initialData={formInitialData}
            onSubmit={handleSaveLead}
            formId="lead-form"
          />
        </DrawerWrapper>
      )}
    </PageLayout>
  );
}
