'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DetailPageLeft } from '@/components/shared/DetailPageLeft';
import { DynamicDetailPage } from '@/components/shared/DynamicDetailPage';
import { Ticket } from '@/app/types/tickettypes';
import { useSnackbar } from 'notistack';
import { getTicketById, updateTicket } from '@/lib/api';
import { ActivityType } from '@/components/shared/DynamicActivityDrawer';

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');
     const [activityType, setActivityType] = useState<ActivityType | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
        const openDrawer = (type: ActivityType) => {
      setActivityType(type);
      setIsDrawerOpen(true);
    };
        const handleSave = async (updatedTicket: Ticket) => {
          try {
            console.log("Saving to backend:", updatedTicket);
        
            await updateTicket(Number(updatedTicket.id), updatedTicket); // 🔥 API CALL
        
            setTicket(updatedTicket); // update UI
        
            enqueueSnackbar('Ticket updated successfully!', { variant: 'success' });
        
          } catch (error: any) {
            enqueueSnackbar('Failed to update ticket', { variant: 'error' });
          }
        };
    
    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };
        getParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchTicket = async () => {
            try {
                setLoading(true);
                console.log('Looking for ticket with ID:', id);
                const ticketData = await getTicketById(Number(id));
                console.log('Found ticket:', ticketData);

                // Convert backend data to frontend format
                const formattedTicket = {
                    id: ticketData.id.toString(),
                    title: ticketData.title || 'Unknown Ticket',
                    status: ticketData.status || 'New',
                    priority: ticketData.priority || 'Medium',
                    source: ticketData.source || 'Email',
                    owner: ticketData.owner || 'N/A',
                    createdAt: ticketData.createdAt || new Date().toISOString()
                };

                setTicket(formattedTicket);
            } catch (error: any) {
                console.error('Failed to fetch ticket:', error);
                enqueueSnackbar(error.message || 'Failed to fetch ticket', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchTicket();
    }, [id, enqueueSnackbar]);

    const handleBack = () => {
        router.push('/dashboard/tickets');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket not found</h1>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <DetailPageLeft type="ticket" data={ticket} onBack={handleBack} onSave={handleSave} onActionClick={openDrawer} />
            <div className="flex-1">
                <DynamicDetailPage
                    entityType="ticket"
                    entityData={ticket}
                                        drawerActivityType={activityType}        // controlled drawer activity type
      externalIsDrawerOpen={isDrawerOpen}              // controlled drawer open state
  onExternalDrawerClose={() => setIsDrawerOpen(false)}  // callback to close drawer
  onExternalActivityClick={openDrawer}
                />
            </div>
        </div>
    );
}