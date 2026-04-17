"use client";

import { useSnackbar } from 'notistack';
import { useState, useRef, useEffect } from 'react';
import { ModuleHeader } from '@/components/module';
import { createTicketsConfig } from '@/config';
import { PageLayout } from '@/components/shared/PageLayout';
import { DataTable, FilterDef } from '@/components/shared/DataTable';
import { ticketsColumns } from '@/components/tickets/tickets.columns';
import { Ticket } from '@/app/types/tickettypes';
import CreateTicketModal from '@/components/modals/CreateTicketModal';
import { getTickets, createTicket, updateTicket, deleteTicket } from '@/lib/api';
import { ImportButton } from '@/components/common/ImportDialog';
import { useSearch } from '@/context/SearchContext';
import SearchInput from '@/components/module/SearchInput';
import Pagination from '@/components/module/Pagination';

export default function TicketsPage() {
  const { enqueueSnackbar } = useSnackbar();
  const { searchQuery, setSearchQuery, searchFilter } = useSearch();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch tickets from API on component mount
  useEffect(() => {
    fetchTickets();
  }, []);

  const handleEditTicket = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleDeleteTicket = async (id: string) => {
    try {
      await deleteTicket(Number(id));
      setTickets(prev => prev.filter(t => t.id !== id));
      enqueueSnackbar("Ticket deleted successfully", { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete ticket', { variant: 'error' });
    }
  };

  const handleSaveTicket = async (data: any) => {
    console.log('handleSaveTicket called with data:', data);
    try {
      const ticketData = {
        title: data.title || 'New Ticket',
        status: data.status || 'New',
        priority: data.priority || 'Medium',
        source: data.source || 'Email',
        owner: data.owner || 'N/A'
      };
      console.log('Prepared ticketData:', ticketData);

      if (editingTicket) {
        console.log('Updating existing ticket:', editingTicket.id);
        await updateTicket(Number(editingTicket.id), ticketData);
        setTickets(prev => prev.map(t =>
          t.id === editingTicket.id
            ? { ...t, ...ticketData, updatedAt: new Date().toISOString() }
            : t
        ));
        enqueueSnackbar("Ticket updated successfully", { variant: 'success' });
      } else {
        console.log('Creating new ticket');
        const newTicket = await createTicket(ticketData);
        console.log('Ticket created in backend:', newTicket);

        // Format ticket to match frontend interface, similar to leads
        const formattedTicket = {
          id: newTicket.id?.toString() || Date.now().toString(),
          title: newTicket.title || ticketData.title,
          status: newTicket.status || ticketData.status,
          priority: newTicket.priority || ticketData.priority,
          source: newTicket.source || ticketData.source,
          owner: newTicket.owner || ticketData.owner,
          createdAt: newTicket.createdAt || new Date().toISOString()
        };
        console.log('Formatted ticket for UI:', formattedTicket);
        setTickets(prev => [formattedTicket, ...prev]);

        // Fallback: Refresh tickets list to ensure UI sync
        setTimeout(async () => {
          try {
            const refreshedTickets = await getTickets();
            const formattedRefreshed = refreshedTickets.map((ticket: any) => ({
              id: ticket.id.toString(),
              title: ticket.title,
              status: ticket.status,
              priority: ticket.priority,
              source: ticket.source,
              owner: ticket.owner,
              createdAt: ticket.createdAt
            }));
            setTickets(formattedRefreshed);
          } catch (error) {
            console.error('Failed to refresh tickets:', error);
          }
        }, 1000);

        enqueueSnackbar("Ticket created successfully", { variant: 'success' });
      }

      setIsModalOpen(false);
      setEditingTicket(null);
    } catch (error: any) {
      console.error('Error in handleSaveTicket:', error);
      enqueueSnackbar(error.message || 'Failed to save ticket', { variant: 'error' });
    }
  };

  const handleImport = () => {
    // This will be handled by the ImportButton component
    console.log('Import clicked');
  };

  const handleImportSuccess = (count: number) => {
    enqueueSnackbar(`${count} tickets imported successfully`, { variant: 'success' });
    // Refresh tickets list
    fetchTickets();
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to fetch tickets', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("Importing:", file.name);
  };

  const headerConfig = createTicketsConfig({
    onImport: handleImport,
    onCreate: () => {
      setEditingTicket(null);
      setIsModalOpen(true);
    },
  });

  // Search and Filter Logic
  const getTicketsFilters = (tickets: Ticket[]): FilterDef[] => [
    {
      key: 'status',
      label: 'Ticket Status',
      type: 'select',
      getValue: (item: any) => item.status,
      options: tickets.length > 0 ? Array.from(new Set(tickets.map(t => t.status))).map(s => ({ value: s, label: s })) : [
        { value: 'Waiting on contact', label: 'Waiting on contact' },
        { value: 'Waiting on us', label: 'Waiting on us' },
        { value: 'New', label: 'New' },
        { value: 'Closed', label: 'Closed' }
      ]
    },
    {
      key: 'owner',
      label: 'Ticket Owner',
      type: 'select',
      getValue: (item: any) => item.owner,
      options: tickets.length > 0 ? Array.from(new Set(tickets.map(t => t.owner))).map(o => ({ value: o, label: o })) : []
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      getValue: (item: any) => item.priority,
      options: tickets.length > 0 ? Array.from(new Set(tickets.map(t => t.priority))).map(p => ({ value: p, label: p })) : [
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
      getValue: (item: any) => item.source,
      options: tickets.length > 0 ? Array.from(new Set(tickets.map(t => t.source))).map(s => ({ value: s, label: s })) : [
        { value: 'Chat', label: 'Chat' },
        { value: 'Email', label: 'Email' },
        { value: 'Phone', label: 'Phone' }
      ]
    },
    {
      key: 'createdAt',
      label: 'Created Date',
      type: 'date'
    }
  ];

  const ticketsFilters = getTicketsFilters(tickets);

  const filteredTicketsList = tickets.filter(ticket => {
    if (searchFilter !== 'All' && searchFilter !== 'Tickets') return false;

    return (
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.owner.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Mock pagination: show all tickets only on page 1
  const paginatedTickets = filteredTicketsList.slice((currentPage - 1) * 10, currentPage * 10);

  return (
    <PageLayout>
      <div className="flex flex-col gap-1">
        <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={onFileChange} />

        <div className="flex flex-row items-center justify-between w-full bg-white rounded-t-xl border-x border-t border-gray-200 px-8 py-5">
          <h3 className="font-bold text-[24px] text-[#101828] tracking-tight">Tickets</h3>
          <div className="flex items-center gap-3">
            <ImportButton
              entityType="ticket"
              entityName="Ticket"
              onImportSuccess={handleImportSuccess}
            />
            <button
              onClick={() => {
                setEditingTicket(null);
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
              placeholder="Search tickets"
              value={searchQuery}
              onChange={setSearchQuery}
            />
            {Math.ceil(filteredTicketsList.length / 10) > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(filteredTicketsList.length / 10)}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>

        <DataTable
          columns={ticketsColumns}
          data={paginatedTickets}
          filters={ticketsFilters}
          onEdit={handleEditTicket}
          onDelete={handleDeleteTicket}
          onAdd={() => {
            setEditingTicket(null);
            setIsModalOpen(true);
          }}
          nameColumn="title"
          detailRoute="/dashboard/tickets"
          emptyMessage="No tickets found"
        />
      </div>

      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTicket(null);
        }}
        onSave={handleSaveTicket}
        initialData={editingTicket || undefined}
      />
    </PageLayout>
  );
}
