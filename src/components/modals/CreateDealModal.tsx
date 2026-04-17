'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSnackbar } from 'notistack';
import { get } from 'http';
import { getAllUsers, getLeads } from '@/lib/api';
import { User } from '@/app/types/usertypes';
//import { mockLeads } from '../services/mockDataService';

const DealSchema = z.object({
  name: z.string().min(1, "Deal Name is required"),
  stage: z.string().min(1, "Deal Stage is required"),
  amount: z.string().min(1, "Amount is required"),
  owner: z.string().optional(),
  closeDate: z.string().min(1, "Close Date is required"),
  priority: z.string().min(1, "Priority is required"),
  leadId: z.string().optional(),
});

type DealFormValues = z.infer<typeof DealSchema>;

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  editedDetailsOnly?: boolean;
  statusOnly?: boolean;
  isConvert?: boolean;
}

export default function CreateDealModal({ isOpen, onClose, onSave, initialData, editedDetailsOnly, statusOnly, isConvert }: CreateDealModalProps) {
  const [leads, setLeads] = React.useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
useEffect(() => {
  const fetchLeads = async () => {
    try {
      const response = await getLeads(); // ✅ no .then
      console.log("LEADS:", response);

      setLeads(response); // ✅ should be array
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  if (isOpen) fetchLeads();
}, [isOpen]);
 //to fetch users in assigned to dropdownbutton
  useEffect(() => {
   const fetchUsers = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      const companyId = storedUser.companyId;

      const data = await getAllUsers(companyId);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  };

  fetchUsers();
}, []);

  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DealFormValues>({
    resolver: zodResolver(DealSchema),
    defaultValues: {
      name: '',
      stage: '',
      amount: '',
      owner: '',
      closeDate: '',
      priority: '',
      leadId: ''
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: '',
          stage: '',
          amount: '',
          owner: '',
          closeDate: '',
          priority: '',
          leadId: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit =async (data: DealFormValues) => {
    try{
    const payload = {
      ...data,
      //amount: Number(data.amount),
      leadId: data.leadId ? Number(data.leadId) : null, // ✅ important
    };

    await onSave?.(payload);
    //const message = initialData ? "Deal updated successfully!" : "Deal created successfully!";
    onClose();
      } catch (error: any) {
    // parent will handle error
  }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" 
        onClick={onClose} 
      />
      
      {/* Drawer Container */}
      <div 
        className="relative bg-white shadow-2xl animate-slide-in-right flex flex-col h-full"
        style={{ width: '507px' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#111827]">
            {isConvert ? 'Convert Lead to Deal' : (statusOnly ? 'Update Deal Stage' : (initialData ? 'Edit Deal' : 'Create Deal'))}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-5">
            
            {!statusOnly && (
              <>
                {/* Deal Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Deal Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter" 
                    className={`w-full px-3 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                    {...register('name')}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>
              </>
            )}

            {/* Deal Stage */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Deal Stage <span className="text-red-500">*</span>
              </label>
              <select 
                className={`w-full px-3 py-2.5 border ${errors.stage ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                {...register('stage')}
              >
                <option value="">Choose</option>
                <option value="Prospecting">Prospecting</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Presentation Scheduled">Presentation Scheduled</option>
              </select>
              {errors.stage && <p className="text-xs text-red-500">{errors.stage.message}</p>}
            </div>

            {!statusOnly && (
              <>
                {/* Amount */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="number" 
                    placeholder="Enter" 
                    className={`w-full px-3 py-2.5 border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                    {...register('amount')}
                  />
                  {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
                </div>

                {/* Associated Lead */}
                {!editedDetailsOnly && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Associated Lead
                    </label>
                    <select 
                      className={`w-full px-3 py-2.5 border ${errors.leadId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                      {...register('leadId')}
                    >
                      <option value="">Choose</option>
                      <option value="">None</option> {/* ✅ important */}
                       {/* {Array.isArray(leads) && leads.length > 0 ? (
    leads.map((lead: any) => (
      <option key={lead.id} value={lead.id}>
        {lead.name}
      </option>
    ))
  ) : (
    <option disabled>No leads available</option>
  )} */}
                      {leads?.map((lead: any) => (
  <option key={lead.id} value={lead.id}>
    {lead.name}
  </option>
))}
                  
                    </select>
                    {errors.leadId && <p className="text-xs text-red-500">{errors.leadId.message}</p>}
                  </div>
                )}

                {/* Deal Owner
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Deal Owner <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter" 
                    className={`w-full px-3 py-2.5 border ${errors.owner ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                    {...register('owner')}
                  /> */}
                   {/* Deal Owner */}
                  {!editedDetailsOnly && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Deal Owner</label>
                      <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white cursor-pointer"
                        {...register("owner")}
                      >
                        {users.map((user: any) => (
                         <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                         </option>
                          ))}
                          </select>
                  {errors.owner && <p className="text-xs text-red-500">{errors.owner.message}</p>}
                </div>
              )}

                {/* Close Date & Priority Grid */}
                <div className={`grid ${editedDetailsOnly ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                  {!editedDetailsOnly && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Close Date <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="date" 
                        className={`w-full px-3 py-2.5 border ${errors.closeDate ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all cursor-pointer`}
                        {...register('closeDate')}
                      />
                      {errors.closeDate && <p className="text-xs text-red-500">{errors.closeDate.message}</p>}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select 
                      className={`w-full px-3 py-2.5 border ${errors.priority ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                      {...register('priority')}
                    >
                      <option value="">Choose</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                    {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 px-6 py-5 border-t border-gray-100 bg-white shrink-0 mt-auto">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex-1 px-4 py-2.5 bg-[#5948DB] rounded-lg text-sm font-medium text-white hover:bg-[#4838b8] shadow-sm transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}