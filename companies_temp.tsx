"use client";

import { useState } from 'react';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { DrawerWrapper } from '@/components/shared/DrawerWrapper';
import { FormBuilder } from '@/components/shared/FormBuilder';
import { companiesColumns } from '@/components/companies/companies.columns';
import { companiesFields } from '@/components/companies/companies.fields';
import { Company } from '@/app/types/companytypes';

const initialCompanies: Company[] = [
  { id: '1', name: 'ClientEdge', owner: 'Jane Cooper', phone: '078 542 8505', industry: 'Legal Services', city: 'Toronto', country: 'Canada', createdAt: '2025-04-08T14:55:00', status: 'New' },
  { id: '2', name: 'Refinitiv', owner: 'Wade Warren', phone: '077 546 8785', industry: 'Healthcare', city: 'Amsterdam', country: 'Netherlands', createdAt: '2025-04-08T14:55:00', status: 'Contacted' },
  { id: '3', name: 'TrustSphere', owner: 'Brooklyn Simmons', phone: '070 4531 9507', industry: 'Real Estate', city: 'Bangalore', country: 'India', createdAt: '2025-04-08T14:55:00', status: 'Open' },
  { id: '4', name: 'SolvTrail', owner: 'Leslie Alexander', phone: '078 8242 3534', industry: 'Financial Advisory', city: 'Zurich', country: 'Switzerland', createdAt: '2025-04-08T14:55:00', status: 'Inprogress' },
  { id: '5', name: 'PipeLogic', owner: 'Jenny Wilson', phone: '079 8761 9681', industry: 'Retail & E-commerce', city: 'Austin', country: 'U.S.A.', createdAt: '2025-04-08T14:55:00', status: 'Won' },
  { id: '6', name: 'SyncHub', owner: 'Guy Hawkins', phone: '078 5432 8505', industry: 'Logistics & Supply Chain', city: 'Dubai', country: 'UAE', createdAt: '2025-04-08T14:55:00', status: 'Lost' },
  { id: '7', name: 'LeadLogic', owner: 'Robert Fox', phone: '077 546 8785', industry: 'Marketing Agencies', city: 'Singapore', country: 'Singapore', createdAt: '2025-04-08T14:55:00', status: 'New' },
  { id: '8', name: 'Engageware', owner: 'Cameron Williamson', phone: '078 8242 3534', industry: 'Education Technology', city: 'Cape Town', country: 'South Africa', createdAt: '2025-04-08T14:55:00', status: 'Open' },
];

const companiesFilters: FilterDef[] = [
  {
    key: 'industry',
    label: 'Industry',
    type: 'select',
    getValue: (item) => item.industry,
    options: Array.from(new Set(initialCompanies.map(c => c.industry))).map(i => ({ value: i, label: i }))
  },
  {
    key: 'city',
    label: 'City',
    type: 'select',
    getValue: (item) => item.city,
    options: Array.from(new Set(initialCompanies.map(c => c.city))).map(c => ({ value: c, label: c }))
  },
  {
    key: 'country',
    label: 'Country',
    type: 'select',
    getValue: (item) => item.country,
    options: Array.from(new Set(initialCompanies.map(c => c.country))).map(c => ({ value: c, label: c }))
  },
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

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsFormOpen(true);
  };

  const handleDeleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  const handleSaveCompany = (data: any) => {
    if (editingCompany) {
      setCompanies(prev => prev.map(c =>
        c.id === editingCompany.id ? { ...c, ...data } : c
      ));
    } else {
      const newCompany: Company = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      setCompanies(prev => [newCompany, ...prev]);
    }
    setIsFormOpen(false);
    setEditingCompany(null);
  };

  return (
    <PageLayout>
      <DataTable
        columns={companiesColumns}
        data={companies}
        filters={companiesFilters}
        onEdit={handleEditCompany}
        onDelete={handleDeleteCompany}
        onAdd={() => setIsFormOpen(true)}
        nameColumn="name"
        detailRoute="/dashboard/companies"
      />

      {isFormOpen && (
        <DrawerWrapper
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingCompany(null);
          }}
          title={editingCompany ? 'Edit Company' : 'Create Company'}
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setIsFormOpen(false);
                  setEditingCompany(null);
                }}
                className="w-[213px] h-[44px] border border-[#D0D5DD] text-[#344054] rounded-[8px] hover:bg-gray-50 transition font-medium text-[16px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="company-form"
                className="w-[213px] h-[44px] bg-[#5948DB] text-white rounded-[8px] hover:bg-[#4a3ea3] transition font-medium text-[16px]"
              >
                Save
              </button>
            </>
          }
        >
          <FormBuilder
            fields={companiesFields}
            initialData={editingCompany || undefined}
            onSubmit={handleSaveCompany}
            formId="company-form"
          />
        </DrawerWrapper>
      )}
    </PageLayout>
  );
}
