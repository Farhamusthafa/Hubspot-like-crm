'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DetailPageLeft } from '@/components/shared/DetailPageLeft';
import { DynamicDetailPage } from '@/components/shared/DynamicDetailPage';
import { Lead } from '@/app/types/leadtypes';
import { useSnackbar } from 'notistack';
import CreateDealModal from '@/components/modals/CreateDealModal';
import { getLeadById, convertLead,updateLead, getUserByid } from '@/lib/api';
import { ActivityType } from '@/components/shared/DynamicActivityDrawer';
import { ownerDocument } from '@mui/material';
// Removed local mockLeads, now using shared service

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [lead, setLead] = useState<Lead | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');
    const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [activityType, setActivityType] = useState<ActivityType | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawer = (type: ActivityType) => {
  setActivityType(type);
  setIsDrawerOpen(true);
};
    const handleConvertClick = async () => {
        try {
            setIsConvertModalOpen(true);
        } catch (error: any) {
            enqueueSnackbar(error.message || 'Failed to convert lead', { variant: 'error' });
        }
    };

    const handleSave = async (updatedLead: Lead) => {
  try {
    console.log("Saving to backend:", updatedLead);

    await updateLead(Number(updatedLead.id), updatedLead); // 🔥 API CALL

    setLead(updatedLead); // update UI

    enqueueSnackbar('Lead updated successfully!', { variant: 'success' });

  } catch (error: any) {
    enqueueSnackbar('Failed to update lead', { variant: 'error' });
  }
};

    const handleSaveDeal = async (data: any) => {
        try {
            console.log('Converting lead to deal:', data);
            if (lead) {
                // Call the backend API to convert lead to deal
                const result = await convertLead(parseInt(id), data);

                // Update lead status to Qualified/Converted locally
                setLead({ ...lead, status: 'Qualified' });

                enqueueSnackbar('Lead converted to deal successfully!', { variant: 'success' });
                setIsConvertModalOpen(false);

                // Navigate to the new deal page
                if (result.deal && result.deal.id) {
                    setTimeout(() => {
                        router.push(`/dashboard/deals/${result.deal.id}`);
                    }, 1000);
                } else {
                    // Fallback to deals list if no deal ID returned
                    setTimeout(() => {
                        router.push('/dashboard/deals');
                    }, 1000);
                }
            }
        } catch (error: any) {
            console.error('Error converting lead:', error);
            enqueueSnackbar(error.message || 'Failed to convert lead', { variant: 'error' });
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

        const fetchLead = async () => {
            try {
                setLoading(true);
                console.log('Looking for lead with ID:', id);
                const leadData = await getLeadById(Number(id));
                console.log('Found lead:', leadData);
                const assignedToName=await getUserByid(Number(leadData.assignedTo|| 0)).then(user => user.firstName + ' ' + user.lastName).catch(() => 'Unassigned');
                // Convert backend data to frontend format
                const formattedLead = {
                    id: leadData.id.toString(),
                    name: leadData.name,
                    email: leadData.email,
                    phone: leadData.phone,
                    company: leadData.company,
                    jobTitle: leadData.jobTitle,
                    status: leadData.status,
                    value: leadData.value,
                    source: leadData.source,
                    assignedTo: assignedToName || leadData.assignedTo,
                    lastContact: leadData.lastContact,
                    createdAt: leadData.createdAt,
                    updatedAt: leadData.updatedAt
                };

                setLead(formattedLead);
            } catch (error: any) {
                console.error('Failed to fetch lead:', error);
                enqueueSnackbar(error.message || 'Failed to fetch lead', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchLead();
    }, [id]);

    const handleBack = () => {
        router.push('/dashboard/leads');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!lead) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Lead not found</h1>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Leads
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <DetailPageLeft type="lead" data={lead} onBack={handleBack} onSave={handleSave} onActionClick={openDrawer}  />
            <div className="flex-1">
                <DynamicDetailPage
                     entityType="lead"
  entityData={lead}
  showConvertButton={lead.status === "Qualified"}
  onConvert={handleConvertClick}
  drawerActivityType={activityType}        // controlled drawer activity type
      externalIsDrawerOpen={isDrawerOpen}              // controlled drawer open state
  onExternalDrawerClose={() => setIsDrawerOpen(false)}  // callback to close drawer
  onExternalActivityClick={openDrawer}    
                />
            </div>

            {lead && (
                <CreateDealModal
                    isOpen={isConvertModalOpen}
                    onClose={() => setIsConvertModalOpen(false)}
                    onSave={handleSaveDeal}
                    isConvert={true}
                    initialData={{
                        name: `${lead.name} Deal`,
                        owner: lead.assignedTo,
                        leadId: lead.id,
                        stage: 'Qualification',
                        amount: '0',
                        closeDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
                        priority: 'medium'
                    }}
                />
            )}
        </div>
    );
}