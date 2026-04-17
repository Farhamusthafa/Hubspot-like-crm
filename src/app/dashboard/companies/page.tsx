"use client";

import { useSnackbar } from 'notistack';
import { useState, useRef, useEffect } from 'react';
import { ModuleHeader } from '@/components/module';
import { createCompaniesConfig } from '@/config';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { companiesColumns } from '@/components/companies/companies.columns';
import { Company } from '@/app/types/companytypes';
import CreateCompanyModal from '@/components/modals/CreateCompanyModal';
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/lib/api';
import { ImportButton } from '@/components/common/ImportDialog';
import { useSearch } from '@/context/SearchContext';
import SearchInput from '@/components/module/SearchInput';
import Pagination from '@/components/module/Pagination';

export default function CompaniesPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { searchFilter } = useSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = useState('');
 
  const totalPages = 156;

  // Fetch companies from API on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setIsModalOpen(true);
  };

  const handleDeleteCompany = async (id: string) => {
    try {
      await deleteCompany(Number(id));
      setCompanies(prev => prev.filter(c => c.id !== id));
      enqueueSnackbar("Company deleted successfully", { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete company', { variant: 'error' });
    }
  };

  const handleSaveCompany = async (data: any) => {
    console.log('handleSaveCompany called with data:', data);
    try {
      const companyData = {
        name: data.name || 'New Company',
        owner: data.owner || 'N/A',
        phone: data.phone || '',
        industry: data.industry || 'Other',
        city: data.city || '',
        country: data.country || '',
        type: data.type || 'Private',
        employees: data.employees || '',
        revenue: data.revenue || '',
        domain: data.domain || ''
      };
      console.log('Prepared companyData:', companyData);

      if (editingCompany) {
        console.log('Updating existing company:', editingCompany.id);
        await updateCompany(Number(editingCompany.id), companyData);
        setCompanies(prev => prev.map(c =>
          c.id === editingCompany.id
            ? { ...c, ...companyData, updatedAt: new Date().toISOString() }
            : c
        ));
        enqueueSnackbar("Company updated successfully", { variant: 'success' });
      } else {
        console.log('Creating new company');
        const newCompany = await createCompany(companyData);
        console.log('Company created in backend:', newCompany);

        // Format the company to match frontend interface, similar to leads
        const formattedCompany = {
          id: newCompany.id?.toString() || Date.now().toString(),
          name: newCompany.name || companyData.name,
          owner: newCompany.ownerName || newCompany.owner || companyData.owner,
          phone: newCompany.phone || companyData.phone || '',
          industry: newCompany.industry || companyData.industry,
          city: newCompany.city || companyData.city || '',
          country: newCompany.country || companyData.country || '',
          createdAt: newCompany.createdAt || new Date().toISOString(),
          status: newCompany.status || 'New',
          domain: newCompany.domain || companyData.domain || '',
          employees: newCompany.employees || companyData.employees || '',
          revenue: newCompany.revenue || companyData.revenue || '',
          type: newCompany.type || companyData.type || 'Private'
        };
        console.log('Formatted company for UI:', formattedCompany);
        setCompanies(prev => [formattedCompany, ...prev]);

        // Fallback: Refresh companies list to ensure UI sync
        setTimeout(async () => {
          try {
            const refreshedCompanies = await getCompanies();
            const formattedRefreshed = refreshedCompanies.map((company: any) => ({
              id: company.id.toString(),
              name: company.name,
              owner: company.ownerName || company.owner,
              phone: company.phone || '',
              industry: company.industry,
              city: company.city || '',
              country: company.country || '',
              createdAt: company.createdAt,
              status: company.status || 'New',
              domain: company.domain || '',
              employees: company.employees || '',
              revenue: company.revenue || '',
              type: company.type || 'Private'
            }));
            setCompanies(formattedRefreshed);
          } catch (error) {
            console.error('Failed to refresh companies:', error);
          }
        }, 1000);

        enqueueSnackbar("Company created successfully", { variant: 'success' });
      }

      setIsModalOpen(false);
      setEditingCompany(null);
    } catch (error: any) {
      console.error('Error in handleSaveCompany:', error);
      enqueueSnackbar(error.message || 'Failed to save company', { variant: 'error' });
    }
  };

  const handleImportClick = () => {
    // This will be handled by the ImportButton component
    console.log('Import clicked');
  };


  const handleImportSuccess = (count: number) => {
    enqueueSnackbar(`${count} companies imported successfully`, { variant: 'success' });
    // Refresh companies list
    fetchCompanies();
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to fetch companies', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("Importing Companies:", file.name);
  };

  const headerConfig = createCompaniesConfig({
    onImport: handleImportClick,
    onCreate: () => {
      setEditingCompany(null);
      setIsModalOpen(true);
    },
  });

  // Dynamic filters based on companies data
  const getCompaniesFilters = (companies: Company[]): FilterDef[] => [
    {
      key: 'industry',
      label: 'Industry',
      type: 'select',
      getValue: (item: any) => item.industry,
      options: companies.length > 0 ? Array.from(new Set(companies.map(c => c.industry))).map(i => ({ value: i, label: i })) : []
    },
    {
      key: 'city',
      label: 'City',
      type: 'select',
      getValue: (item: any) => item.city,
      options: companies.length > 0 ? Array.from(new Set(companies.map(c => c.city))).filter(Boolean).map(c => ({ value: c, label: c })) : []
    },
    {
      key: 'country',
      label: 'Country',
      type: 'select',
      getValue: (item: any) => item.country,
      options: companies.length > 0 ? Array.from(new Set(companies.map(c => c.country))).filter(Boolean).map(c => ({ value: c, label: c })) : []
    },
    
     {
  key: 'status',
  label: 'Lead Status',
  type: 'select',
  getValue: (item: any) =>
  item.companyLeads?.map((l: any) => l.status) || [],
  options: [
    { value: 'New', label: 'New' },
    { value: 'Open', label: 'Open' },
    { value: 'Inprogress', label: 'In Progress' },
    { value: 'Contacted', label: 'Contacted' },
    { value: 'Qualified', label: 'Qualified' },
    { value: 'Converted', label: 'Converted' },
    { value: 'Lost', label: 'Lost' }
  ]
}
,
    {
      key: 'createdAt',
      label: 'Created Date',
      type: 'date'
    }
  ];

  // Search and Filter Logic
  const companiesFilters = getCompaniesFilters(companies);

  const filteredCompaniesList = companies.filter(company => {
    if (searchFilter !== 'All' && searchFilter !== 'Companies') return false;
    
    return (
      company.name.toLowerCase().includes((localSearch ).toLowerCase()) ||
      company.phone.toLowerCase().includes((localSearch ).toLowerCase()) ||
      company.city.toLowerCase().includes((localSearch).toLowerCase())
    );
  });

  // Mock pagination: show all companies only on page 1
  const paginatedCompanies = filteredCompaniesList.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <PageLayout>
      <div className="flex flex-col gap-1">
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
        />

        <div className="flex flex-row items-center justify-between w-full bg-white rounded-t-xl border-x border-t border-gray-200 px-8 py-5">
          <h3 className="font-bold text-[24px] text-[#101828] tracking-tight">Companies</h3>
          <div className="flex items-center gap-3">
            <ImportButton
              entityType="company"
              entityName="Company"
              onImportSuccess={handleImportSuccess}
            />
            <button
              onClick={() => {
                setEditingCompany(null);
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
              placeholder="Search name, phone, city"
              value={localSearch}
              onChange={setLocalSearch}
            />
            {Math.ceil(filteredCompaniesList.length / 10) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredCompaniesList.length / 10)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        <DataTable
          columns={companiesColumns}
          data={paginatedCompanies}
          filters={companiesFilters}
          onEdit={handleEditCompany}
          onDelete={handleDeleteCompany}
          onAdd={() => {
            setEditingCompany(null);
            setIsModalOpen(true);
          }}
          nameColumn="name"
          detailRoute="/dashboard/companies"
          emptyMessage="No companies found"
        />
      </div>

      <CreateCompanyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCompany(null);
        }}
        onSave={handleSaveCompany}
        initialData={editingCompany || undefined}
      />
    </PageLayout>
  );
}
