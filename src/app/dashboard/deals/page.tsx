"use client";

import { useSnackbar } from 'notistack';
import { useState, useRef, useEffect } from 'react';
import { ModuleHeader } from '@/components/module';
import { createDealsConfig } from '@/config';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { dealsColumns } from '@/components/deals/deals.columns';
import { Deal } from '@/app/types/dealtypes';
import CreateDealModal from '@/components/modals/CreateDealModal';
import { getDeals, createDeal, updateDeal, deleteDeal } from '@/lib/api';
import { ImportButton } from '@/components/common/ImportDialog';
import { useSearch } from '@/context/SearchContext';
import SearchInput from '@/components/module/SearchInput';
import Pagination from '@/components/module/Pagination';
//import { getOwnerName } from '@/lib/api'; // 🔥 Import the new function to fetch owner name
export default function DealsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { searchFilter } = useSearch();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localSearch, setLocalSearch] = useState('');

  const totalPages = 156;

  // Fetch deals from API on component mount
  useEffect(() => {
    fetchDeals();
  }, []);

  const handleEditDeal = (deal: Deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleDeleteDeal = async (id: string) => {
    try {
      await deleteDeal(Number(id));
      setDeals(prev => prev.filter(d => d.id !== id));
      enqueueSnackbar("Deal deleted successfully", { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete deal', { variant: 'error' });
    }
  };

  const handleSaveDeal = async (data: any) => {
    console.log('handleSaveDeal called with data:', data);
    try {
      const dealData = {
        name: data.name || 'New Deal',
        stage: data.stage || 'Appointment Scheduled',
        closeDate: data.closeDate || new Date().toISOString().split('T')[0],
        owner: data.owner || 0,
        //ownerName: await getOwnerName(data.owner), // 🔥 Fetch owner name for the deal
        ownerName: data.ownerName || 'N/A', // Use provided ownerName or fallback 
        amount: parseFloat(data.amount) || 0,
        leadId: data.leadId // 🔥 ADD THIS LINE
      };
      fetchDeals(); // Refresh the list to get the latest data, including owner names
      console.log('Prepared dealData:', dealData);

      if (editingDeal) {
        console.log('Updating existing deal:', editingDeal.id);
        await updateDeal(Number(editingDeal.id), dealData);
        setDeals(prev => prev.map(d =>
          d.id === editingDeal.id
            ? { ...d, ...dealData, updatedAt: new Date().toISOString() }
            : d
        ));
        enqueueSnackbar("Deal updated successfully", { variant: 'success' });
      } else {
        console.log('Creating new deal');
        const newDeal = await createDeal(dealData);
        console.log('Deal created in backend:', newDeal);

        // Format deal to match frontend interface, similar to leads
        const formattedDeal = {
          id: newDeal.id?.toString() || Date.now().toString(),
          name: newDeal.name || dealData.name,
          stage: newDeal.stage || dealData.stage,
          closeDate: newDeal.closeDate || dealData.closeDate,
          owner: newDeal.owner || dealData.owner,
          //ownerName:newDeal.ownerName,
          ownerName:newDeal.dealowner?.firstName + ' ' + newDeal.dealowner?.lastName || dealData.ownerName, // Use provided ownerName or fallback
          amount: newDeal.amount || dealData.amount,
          createdAt: newDeal.createdAt || new Date().toISOString()
        };
        console.log('Formatted deal for UI:', formattedDeal);
        setDeals(prev => [formattedDeal, ...prev]);

        // Fallback: Refresh deals list to ensure UI sync
        setTimeout(async () => {
          try {
            const refreshedDeals = await getDeals();
            const formattedRefreshed = refreshedDeals.map((deal: any) => ({
              id: deal.id.toString(),
              name: deal.name,
              stage: deal.stage,
              closeDate: deal.closeDate,
              owner: deal.owner,
              amount: deal.amount,
              createdAt: deal.createdAt
            }));
            setDeals(formattedRefreshed);
          } catch (error) {
            console.error('Failed to refresh deals:', error);
             throw error; 
          }
        }, 1000);

        enqueueSnackbar("Deal created successfully", { variant: 'success' });
      }

      setIsModalOpen(false);
      setEditingDeal(null);
    } catch (error: any) {
      console.error('Error in handleSaveDeal:', error);  
      enqueueSnackbar(error.message || 'Failed to save deal', { variant: 'error' });
    throw error; 
    }
  };

  const handleImport = () => {
    // This will be handled by the ImportButton component
    console.log('Import clicked');
  };

  const handleImportSuccess = (count: number) => {
    enqueueSnackbar(`${count} deals imported successfully`, { variant: 'success' });
    fetchDeals();
  };

const fetchDeals = async () => {
  try {
    setLoading(true);
    const dealsData = await getDeals();

    if (!Array.isArray(dealsData)) {
      setDeals([]);
      return;
    }

//     // Use Promise.all with try/catch per deal
//     const formattedDeals = await Promise.all(
//       dealsData.map(async (deal: any) => {
//         let ownerName = "N/A"; // fallback
//         try {
//           ownerName = await getOwnerName(deal.owner);
//         } catch (err) {
//           console.error(`Failed to fetch owner for deal ${deal.id}:`, err);
//         }

//         return {
//           id: deal.id?.toString() || Date.now().toString(),
//           name: deal.name || 'New Deal',
//           stage: deal.stage || 'Appointment Scheduled',
//           closeDate: deal.closeDate || new Date().toISOString().split('T')[0],
//           owner: deal.owner || 0,
//           ownerName,
//           amount: deal.amount || 0,
//           createdAt: deal.createdAt || new Date().toISOString(),
//         };
//       })
//     );

//     setDeals(formattedDeals);
//   } catch (error: any) {
//     console.error('Error fetching deals:', error);
//     setDeals([]); // fallback
//   } finally {
//     setLoading(false);
//   }
// };

    // map directly without extra API calls
    const formattedDeals = dealsData.map((deal: any) => ({
      id: deal.id?.toString() || Date.now().toString(),
      name: deal.name || 'New Deal',
      stage: deal.stage || 'Appointment Scheduled',
      closeDate: deal.closeDate || new Date().toISOString().split('T')[0],
      owner: deal.owner || 0,
      ownerName: deal.dealowner?.firstName + ' ' + deal.dealowner?.lastName || 'N/A', // ✅ no extra request
      amount: deal.amount || 0,
      createdAt: deal.createdAt || new Date().toISOString(),
    }));

    setDeals(formattedDeals);
  } catch (error: any) {
    console.error('Error fetching deals:', error);
    setDeals([]); // fallback
  } finally {
    setLoading(false);
  }
};
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("Importing:", file.name);
  };

  const headerConfig = createDealsConfig({
    onImport: handleImport,
    onCreate: () => {
      setEditingDeal(null);
      setIsModalOpen(true);
    },
  });

  // Search and Filter Logic
  const getDealsFilters = (deals: Deal[]): FilterDef[] => [
    {
      key: 'stage',
      label: 'Deal Stage',
      type: 'select',
      getValue: (item: any) => item.stage,
      options: deals.length > 0 ? Array.from(new Set(deals.map(d => d.stage))).map(s => ({ value: s, label: s })) : []
    },
    {
      key: 'ownerName',
      label: 'Deal Owner',
      type: 'select',
      getValue: (item: any) => item.ownerName,
     options: deals.length > 0 ? Array.from(new Set(deals.map(d => d.ownerName))).map(o => ({ value: o, label: o })) : []
    },
    {
      key: 'closeDate',
      label: 'Close Date',
      type: 'date'
    }
  ];

  const dealsFilters = getDealsFilters(deals);

  const filteredDealsList = deals.filter(deal => {
    if (searchFilter !== 'All' && searchFilter !== 'Deals') return false;

    return (
      deal.name.toLowerCase().includes(localSearch.toLowerCase()) 
      ||
      deal.ownerName.toLowerCase().includes(localSearch.toLowerCase())
    );
  });

  // Mock pagination: show all deals only on page 1
  const paginatedDeals = filteredDealsList.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <PageLayout>
      <div className="flex flex-col gap-1">
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={onFileChange} />

        <div className="flex flex-row items-center justify-between w-full bg-white rounded-t-xl border-x border-t border-gray-200 px-8 py-5">
          <h3 className="font-bold text-[24px] text-[#101828] tracking-tight">Deals</h3>
          <div className="flex items-center gap-3">
            <ImportButton
              entityType="deal"
              entityName="Deal"
              onImportSuccess={handleImportSuccess}
            />
            <button
              onClick={() => {
                setEditingDeal(null);
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
              placeholder="Search deals"
              value={localSearch}
              onChange={setLocalSearch}
            />
            {Math.ceil(filteredDealsList.length / 10) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredDealsList.length / 10)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        <DataTable
          columns={dealsColumns}
          data={paginatedDeals}
          filters={dealsFilters}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
          onAdd={() => {
            setEditingDeal(null);
            setIsModalOpen(true);
          }}
          nameColumn="name"
          detailRoute="/dashboard/deals"
          emptyMessage="No deals found"
        />
      </div>

      <CreateDealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingDeal(null);
        }}
        onSave={handleSaveDeal}
        initialData={editingDeal || undefined}
      />

      {/* Hidden file input for import functionality */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept=".csv,.xlsx,.xls"
        style={{ display: 'none' }}
      />
    </PageLayout>
  );
}
