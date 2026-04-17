"use client";

import { useState } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { DrawerWrapper } from '@/components/shared/DrawerWrapper';
import { FormBuilder } from '@/components/shared/FormBuilder';
import { ticketsColumns } from '@/components/tickets/tickets.columns';
import { ticketsFields } from '@/components/tickets/tickets.fields';
import { Ticket } from '@/app/types/tickettypes';

const initialTickets: Ticket[] = [
  { id: '1', title: 'Payment Failure Issue', status: 'Waiting on contact', priority: 'High', source: 'Chat', owner: 'Jane Cooper', createdAt: '2025-04-08T14:35:00' },
  { id: '2', title: 'Product Inquiry', status: 'Waiting on us', priority: 'Medium', source: 'Email', owner: 'Wade Warren', createdAt: '2025-04-08T14:35:00' },
  { id: '3', title: 'Subscription Upgrade', status: 'New', priority: 'High', source: 'Chat', owner: 'Brooklyn Simmons', createdAt: '2025-04-08T14:35:00' },
  { id: '4', title: 'Refund Request – Order #456', status: 'New', priority: 'Low', source: 'Phone', owner: 'Leslie Alexander', createdAt: '2025-04-08T14:35:00' },
  { id: '5', title: 'Pricing Clarification', status: 'Closed', priority: 'Medium', source: 'Chat', owner: 'Jenny Wilson', createdAt: '2025-04-08T14:35:00' },
  { id: '6', title: 'Login Not Working', status: 'Waiting on us', priority: 'Critical', source: 'Phone', owner: 'Guy Hawkins', createdAt: '2025-04-08T14:35:00' },
  { id: '7', title: 'Feature Request: Reports', status: 'Waiting on contact', priority: 'High', source: 'Phone', owner: 'Robert Fox', createdAt: '2025-04-08T14:35:00' },
  { id: '8', title: 'SLA Violation Complaint', status: 'Closed', priority: 'Medium', source: 'Chat', owner: 'Cameron Williamson', createdAt: '2025-04-08T14:35:00' },
];

const ticketsFilters: FilterDef[] = [
  {
    key: 'owner',
    label: 'Ticket Owner',
    type: 'select',
    getValue: (item) => item.owner,
    options: Array.from(new Set(initialTickets.map(t => t.owner))).map(o => ({ value: o, label: o }))
  },
  {
    key: 'status',
    label: 'Ticket Status',
    type: 'select',
    options: [
      { value: 'Waiting on contact', label: 'Waiting on contact' },
      { value: 'Waiting on us', label: 'Waiting on us' },
      { value: 'New', label: 'New' },
      { value: 'Closed', label: 'Closed' }
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
    key: 'priority',
    label: 'Priority',
    type: 'select',
    options: [
      { value: 'High', label: 'High' },
      { value: 'Medium', label: 'Medium' },
      { value: 'Low', label: 'Low' },
      { value: 'Critical', label: 'Critical' }
    ]
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date'
  }
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsFormOpen(true);
  };

  const handleDeleteTicket = (id: string) => {
    setTickets(prev => prev.filter(t => t.id !== id));
  };

  const handleSaveTicket = (data: any) => {
    if (editingTicket) {
      setTickets(prev => prev.map(t =>
        t.id === editingTicket.id ? { ...t, ...data } : t
      ));
    } else {
      const newTicket: Ticket = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      setTickets(prev => [newTicket, ...prev]);
    }
    setIsFormOpen(false);
    setEditingTicket(null);
  };

  return (
    <PageLayout>
      <DataTable
        columns={ticketsColumns}
        data={tickets}
        filters={ticketsFilters}
        onEdit={handleEditTicket}
        onDelete={handleDeleteTicket}
        onAdd={() => setIsFormOpen(true)}
        nameColumn="title"
        detailRoute="/dashboard/tickets"
      />

      {isFormOpen && (
        <DrawerWrapper
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTicket(null);
          }}
          title={editingTicket ? 'Edit Ticket' : 'Create Ticket'}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingTicket(null);
                }}
                className="w-[213px] h-[44px] border border-[#D0D5DD] text-[#344054] rounded-[8px] hover:bg-gray-50 transition font-medium text-[16px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="ticket-form"
                className="w-[213px] h-[44px] bg-[#5948DB] text-white rounded-[8px] hover:bg-[#4a3ea3] transition font-medium text-[16px]"
              >
                Save
              </button>
            </>
          }
        >
          <FormBuilder
            fields={ticketsFields}
            initialData={editingTicket || undefined}
            onSubmit={handleSaveTicket}
            formId="ticket-form"
          />
        </DrawerWrapper>
      )}
    </PageLayout>
  );
}
