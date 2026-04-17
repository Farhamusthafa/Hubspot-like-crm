"use client";

import { useSnackbar } from 'notistack';
import { useState, useRef, useEffect } from 'react';
import { ModuleHeader } from '@/components/module';
import { createLeadsConfig } from '@/config';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { leadsColumns } from '@/components/leads/leads.columns';
import { Lead } from '@/app/types/leadtypes';
import CreateLeadModal from '@/components/modals/CreateLeadModal';
import { getLeads, createLead, updateLead, deleteLead } from '@/lib/api';
import { ImportButton } from '@/components/common/ImportDialog';
import { useSearch } from '@/context/SearchContext';
import SearchInput from '@/components/module/SearchInput';
import Pagination from '@/components/module/Pagination';

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
      { value: 'Lost', label: 'Lost' },
      { value: 'Qualified', label: 'Qualified' }
    ]
  },
  {
    key: 'createdAt',
    label: 'Created Date',
    type: 'date'
  }
];

export default function LeadsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { searchQuery, setSearchQuery, searchFilter } = useSearch();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  // Fetch leads from API on component mount
  useEffect(() => {
    fetchLeads();
  }, []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditLead = (lead: Lead) => {
    // Split the name into firstName and lastName for the form
    const nameParts = lead.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const leadWithSplitName = {
      ...lead,
      firstName,
      lastName
    };

    setEditingLead(leadWithSplitName);
    setIsModalOpen(true);
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await deleteLead(Number(id));
      setLeads(prev => prev.filter(l => l.id !== id));
      enqueueSnackbar("Lead deleted successfully", { variant: 'success' });
    fetchLeads();
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete lead', { variant: 'error' });
    }
  };

  const handleSaveLead = async (data: any) => {
    try {
      const leadData = {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        phone: data.phone || '',
        company: data.company || 'N/A',
        jobTitle: data.jobTitle,
        status: data.status || 'New',
        assignedTo: data.assignedTo || 'Salesperson',
        value: 0,
        source: 'Website'
      };
        fetchLeads();

      if (editingLead) {
        await updateLead(Number(editingLead.id), leadData);
        const fullName = `${leadData.firstName} ${leadData.lastName}`.trim();
        setLeads(prev => prev.map(l =>
          l.id === editingLead.id
            ? { ...l, name: fullName, updatedAt: new Date().toISOString() }
            : l
        ));
        enqueueSnackbar("Lead updated successfully", { variant: 'success' });
      } else {
        const newLead = await createLead(leadData);
        setLeads(prev => [newLead, ...prev]);
        enqueueSnackbar("Lead created successfully", { variant: 'success' });
      
      }
      fetchLeads();
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to save lead', { variant: 'error' });
    }
  };

  const handleImport = () => {
    // This will be handled by the ImportButton component
    console.log('Import clicked');
  };

  const handleImportSuccess = (count: number) => {
    enqueueSnackbar(`${count} leads imported successfully`, { variant: 'success' });
    fetchLeads(); // Refresh the leads list
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      // Convert backend data to frontend format
      const formattedLeads = data.map((lead: any) => ({
        id: lead.id.toString(),
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        company: lead.company,
        jobTitle: lead.jobTitle,
        status: lead.status,
        value: lead.value,
        source: lead.source,
        assignedTo: lead.assignedToName || lead.assignedTo,
        lastContact: lead.lastContact,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt
      }));
      setLeads(formattedLeads);
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to fetch leads', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("Importing:", file.name);
  };

  const headerConfig = createLeadsConfig({
    onImport: handleImport,
    onCreate: () => {
      setEditingLead(null);
      setIsModalOpen(true);
    },
  });

  // Search and Filter Logic
  const filteredLeads = leads.filter(lead => {
    // If Global Category filter is not 'All' or 'Leads', hide all leads
    if (searchFilter !== 'All' && searchFilter !== 'Leads') return false;

    return (
      lead.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      lead.email.toLowerCase().includes(localSearch.toLowerCase()) ||
      lead.phone.toLowerCase().includes(localSearch.toLowerCase()) 
   ) 
  });

  // Mock pagination: show all leads only on page 1
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <PageLayout>
      <div className="flex flex-col gap-1">
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={onFileChange} />

        <div className="flex flex-row items-center justify-between w-full bg-white rounded-t-xl border-x border-t border-gray-200 px-8 py-5">
          <h3 className="font-bold text-[24px] text-[#101828] tracking-tight">Leads</h3>
          <div className="flex items-center gap-3">
            <ImportButton
              entityType="lead"
              entityName="Lead"
              onImportSuccess={handleImportSuccess}
            />
            <button
              onClick={() => {
                setEditingLead(null);
                setIsModalOpen(true);
              }}
              className="px-8 py-2.5 text-[15px] font-semibold bg-[#5948DB] text-white rounded-lg hover:bg-[#4838b8] transition-colors"
            >
              Create
            </button>
          </div>
        </div>

        <div className="flex flex-col w-full bg-white border-x border-b border-gray-200 rounded-b-xl overflow-hidden">
          <div className="px-8 py-4 border-b border-gray-100 flex items-center justify-between">
            <SearchInput
              placeholder="Search phone , name, email"
              value={localSearch}
              onChange={setLocalSearch}
            />
            {Math.ceil(filteredLeads.length / 10) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredLeads.length / 10)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        <DataTable
          columns={leadsColumns}
          data={paginatedLeads}
          filters={leadsFilters}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
          onAdd={() => {
            setEditingLead(null);
            setIsModalOpen(true);
          }}
          nameColumn="name"
          detailRoute="/dashboard/leads"
          emptyMessage="No leads found"
          getRowClassName={(item) => item.status === 'Qualified' ? 'bg-orange-50/30' : ''}
        />
      </div>

      <CreateLeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }}
        onSave={handleSaveLead}
        initialData={editingLead ? {
          ...editingLead,
          firstName: editingLead.name.split(' ')[0] || '',
          lastName: editingLead.name.split(' ').slice(1).join(' ') || '',
        } : undefined}
      />
    </PageLayout>
  );
}
