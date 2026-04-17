'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DetailPageLeft } from '@/components/shared/DetailPageLeft';
import { DynamicDetailPage } from '@/components/shared/DynamicDetailPage';
import { Deal } from '@/app/types/dealtypes';
import { useSnackbar } from 'notistack';
import { getDealById, updateDeal } from '@/lib/api';
import { ActivityType } from '@/components/shared/DynamicActivityDrawer';
//import { getOwnerName } from '@/lib/api'; // 🔥 Import the new function to fetch owner name

export default function DealDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [deal, setDeal] = useState<Deal | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');
          const [activityType, setActivityType] = useState<ActivityType | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawer = (type: ActivityType) => {
  setActivityType(type);
  setIsDrawerOpen(true);
};
    const handleSave = async (updatedDeal: Deal) => {
      try {
        console.log("Saving to backend:", updatedDeal);
    
        await updateDeal(Number(updatedDeal.id), updatedDeal); // 🔥 API CALL
    
        setDeal(updatedDeal); // update UI
    
        enqueueSnackbar('Deal updated successfully!', { variant: 'success' });
    
      } catch (error: any) {
        enqueueSnackbar('Failed to update deal', { variant: 'error' });
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

        const fetchDeal = async () => {
            try {
                setLoading(true);
                console.log('Looking for deal with ID:', id);
                const dealData = await getDealById(Number(id));
                console.log('Found deal:', dealData);

                // Convert backend data to frontend format
                const formattedDeal = {
                    id: dealData.id.toString(),
                    name: dealData.name || 'Unknown Deal',
                    stage: dealData.stage || 'Appointment Scheduled',
                    closeDate: dealData.closeDate || new Date().toISOString().split('T')[0],
                    owner: dealData.owner || 0,
                    //ownerName: await getOwnerName(dealData.owner), // 🔥 Fetch owner name
                    ownerName: dealData.dealowner?.name || 'N/A', // Use provided ownerName or fallback
                    amount: dealData.amount || 0,
                    createdAt: dealData.createdAt || new Date().toISOString()
                };

                setDeal(formattedDeal);
            } catch (error: any) {
                console.error('Failed to fetch deal:', error);
                enqueueSnackbar(error.message || 'Failed to fetch deal', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchDeal();
    }, [id, enqueueSnackbar]);

    const handleBack = () => {
        router.push('/dashboard/deals');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!deal) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Deal not found</h1>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Deals
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <DetailPageLeft type="deal" data={deal} onBack={handleBack} onSave={handleSave} onActionClick={openDrawer}/>
            <div className="flex-1">
                <DynamicDetailPage
                    entityType="deal"
                    entityData={deal}
                    drawerActivityType={activityType}        // controlled drawer activity type
      externalIsDrawerOpen={isDrawerOpen}              // controlled drawer open state
  onExternalDrawerClose={() => setIsDrawerOpen(false)}  // callback to close drawer
  onExternalActivityClick={openDrawer}
                /> 
            </div>
        </div>
    );
}