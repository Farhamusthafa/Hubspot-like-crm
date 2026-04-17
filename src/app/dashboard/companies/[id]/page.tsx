'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DetailPageLeft } from '@/components/shared/DetailPageLeft';
import { DynamicDetailPage } from '@/components/shared/DynamicDetailPage';
import { Company } from '@/app/types/companytypes';
import { ActivityType } from '@/components/shared/DynamicActivityDrawer';
import { useSnackbar } from 'notistack';
import { getCompanyById, updateCompany } from '@/lib/api';

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [company, setCompany] = useState<Company | null>(null);
    const [loading, setLoading] = useState(true);
    const [id, setId] = useState<string>('');
      const [activityType, setActivityType] = useState<ActivityType | null>(null);
const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawer = (type: ActivityType) => {
  setActivityType(type);
  setIsDrawerOpen(true);
};
const handleSave = async (updatedCompany: Company) => {
  try {
    console.log("Saving to backend:", updatedCompany);

    await updateCompany(Number(updatedCompany.id), updatedCompany); // 🔥 API CALL

    setCompany(updatedCompany); // update UI

    enqueueSnackbar('Company updated successfully!', { variant: 'success' });

  } catch (error: any) {
    enqueueSnackbar('Failed to update company', { variant: 'error' });
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

        const fetchCompany = async () => {
            try {
                setLoading(true);
                console.log('Looking for company with ID:', id);
                const companyData = await getCompanyById(Number(id));
                console.log('Found company:', companyData);

                // Convert backend data to frontend format
                const formattedCompany = {
                    id: companyData.id.toString(),
                    name: companyData.name,
                    owner: companyData.ownerName || companyData.owner,
                    phone: companyData.phone || '',
                    industry: companyData.industry,
                    city: companyData.city || '',
                    country: companyData.country || '',
                    createdAt: companyData.createdAt,
                    status: companyData.status || 'New',
                    domain: companyData.domain || '',
                    employees: companyData.employees || '',
                    revenue: companyData.revenue || '',
                    type: companyData.type || 'Private'
                };

                setCompany(formattedCompany);
            } catch (error: any) {
                console.error('Failed to fetch company:', error);
                enqueueSnackbar(error.message || 'Failed to fetch company', { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [id, enqueueSnackbar]);

    const handleBack = () => {
        router.push('/dashboard/companies');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h1>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Companies
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex">
            <DetailPageLeft type="company" data={company} onBack={handleBack} onSave={handleSave} onActionClick={openDrawer}  />
            <div className="flex-1">
                <DynamicDetailPage
                    entityType="company"
                    entityData={company}
                      drawerActivityType={activityType}        // controlled drawer activity type
      externalIsDrawerOpen={isDrawerOpen}              // controlled drawer open state
  onExternalDrawerClose={() => setIsDrawerOpen(false)}  // callback to close drawer
  onExternalActivityClick={openDrawer}
                />
            </div>
        </div>
    );
}