"use client";

import { useState } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { DrawerWrapper } from '@/components/shared/DrawerWrapper';
import { FormBuilder } from '@/components/shared/FormBuilder';
import { dealsColumns } from '@/components/deals/deals.columns';
import { dealsFields } from '@/components/deals/deals.fields';
import { Deal } from '@/app/types/dealtypes';

const initialDeals: Deal[] = [
  { id: '1', name: 'Website Revamp – Atlas Corp', stage: 'Presentation Scheduled', closeDate: '2025-04-08', owner: 'Jane Cooper', amount: 12500, createdAt: '2025-04-08' },
  { id: '2', name: 'Mobile App for FitBuddy', stage: 'Qualified to Buy', closeDate: '2025-04-08', owner: 'Wade Warren', amount: 25000, createdAt: '2025-04-08' },
  { id: '3', name: 'HR Software License – ZenoHR', stage: 'Contract Sent', closeDate: '2025-04-08', owner: 'Brooklyn Simmons', amount: 18750, createdAt: '2025-04-08' },
  { id: '4', name: 'CRM Onboarding – NexTech', stage: 'Closed Won', closeDate: '2025-04-08', owner: 'Leslie Alexander', amount: 32000, createdAt: '2025-04-08' },
  { id: '5', name: 'Marketing Suite – QuickAdz', stage: 'Appointment Scheduled', closeDate: '2025-04-08', owner: 'Jenny Wilson', amount: 14800, createdAt: '2025-04-08' },
  { id: '6', name: 'Inventory Tool – GreenMart', stage: 'Decision Maker Bought In', closeDate: '2025-04-08', owner: 'Guy Hawkins', amount: 9300, createdAt: '2025-04-08' },
  { id: '7', name: 'ERP Integration – BlueChip', stage: 'Qualified to Buy', closeDate: '2025-04-08', owner: 'Robert Fox', amount: 41000, createdAt: '2025-04-08' },
  { id: '8', name: 'Loyalty Program – FoodieFox', stage: 'Closed Lost', closeDate: '2025-04-08', owner: 'Cameron Williamson', amount: 11000, createdAt: '2025-04-08' },
];

const dealsFilters: FilterDef[] = [
  {
    key: 'owner',
    label: 'Deal Owner',
    type: 'select',
    getValue: (item) => item.owner,
    options: Array.from(new Set(initialDeals.map(d => d.owner))).map(o => ({ value: o, label: o }))
  },
  {
    key: 'stage',
    label: 'Deal Stage',
    type: 'select',
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
    type: 'date'
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date'
  }
];

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsFormOpen(true);
  };

  const handleDeleteDeal = (id: string) => {
    setDeals(prev => prev.filter(d => d.id !== id));
  };

  const handleSaveDeal = (data: any) => {
    if (editingDeal) {
      setDeals(prev => prev.map(d =>
        d.id === editingDeal.id ? { ...d, ...data } : d
      ));
    } else {
      const newDeal: Deal = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      setDeals(prev => [newDeal, ...prev]);
    }
    setIsFormOpen(false);
    setEditingDeal(null);
  };

  return (
    <PageLayout>
      <DataTable
        columns={dealsColumns}
        data={deals}
        filters={dealsFilters}
        onEdit={handleEditDeal}
        onDelete={handleDeleteDeal}
        onAdd={() => setIsFormOpen(true)}
        nameColumn="name"
        detailRoute="/dashboard/deals"
      />

      {isFormOpen && (
        <DrawerWrapper
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingDeal(null);
          }}
          title={editingDeal ? 'Edit Deal' : 'Create Deal'}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingDeal(null);
                }}
                className="w-[213px] h-[44px] border border-[#D0D5DD] text-[#344054] rounded-[8px] hover:bg-gray-50 transition font-medium text-[16px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="deal-form"
                className="w-[213px] h-[44px] bg-[#5948DB] text-white rounded-[8px] hover:bg-[#4a3ea3] transition font-medium text-[16px]"
              >
                Save
              </button>
            </>
          }
        >
          <FormBuilder
            fields={dealsFields}
            initialData={editingDeal || undefined}
            onSubmit={handleSaveDeal}
            formId="deal-form"
          />
        </DrawerWrapper>
      )}
    </PageLayout>
  );
}
