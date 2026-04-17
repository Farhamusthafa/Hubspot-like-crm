'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSnackbar } from 'notistack';
import { mockCompanies, mockDeals } from '../services/mockDataService';

const TicketSchema = z.object({
  title: z.string().min(1, "Ticket Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.string().min(1, "Ticket Status is required"),
  source: z.string().min(1, "Source is required"),
  priority: z.string().min(1, "Priority is required"),
  owner: z.string().min(1, "Ticket Owner is required"),
  companyId: z.string().optional(),
  dealId: z.string().optional(),
});

type TicketFormValues = z.infer<typeof TicketSchema>;

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  editedDetailsOnly?: boolean;
  statusOnly?: boolean;
}

export default function CreateTicketModal({ isOpen, onClose, onSave, initialData, editedDetailsOnly, statusOnly }: CreateTicketModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TicketFormValues>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      title: '',
      description: '',
      status: '',
      source: '',
      priority: '',
      owner: '',
      companyId: '',
      dealId: ''
    },
  });

  const selectedCompany = watch('companyId');
  const selectedDeal = watch('dealId');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          title: '',
          description: '',
          status: '',
          source: '',
          priority: '',
          owner: '',
          companyId: '',
          dealId: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: TicketFormValues) => {
    onSave?.(data);
    const message = initialData ? "Ticket updated successfully!" : "Ticket created successfully!";
    enqueueSnackbar(message, { variant: 'success' });
    onClose();
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
            {statusOnly ? 'Update Ticket Status' : (initialData ? 'Edit Ticket' : 'Create Ticket')}
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
                {/* Ticket Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Ticket Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter" 
                    className={`w-full px-3 py-2.5 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                    {...register('title')}
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Enter" 
                    className={`w-full px-3 py-2.5 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400 resize-none`}
                    {...register('description')}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
              </>
            )}

            {/* Ticket Status and Source Grid */}
            <div className={`grid ${(statusOnly || editedDetailsOnly) ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Ticket Status <span className="text-red-500">*</span>
                </label>
                <select 
                  className={`w-full px-3 py-2.5 border ${errors.status ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                  {...register('status')}
                >
                  <option value="">Choose</option>
                  <option value="New">New</option>
                  <option value="Waiting on contact">Waiting on contact</option>
                  <option value="Waiting on us">Waiting on us</option>
                  <option value="Closed">Closed</option>
                </select>
                {errors.status && <p className="text-xs text-red-500">{errors.status.message}</p>}
              </div>

              {!statusOnly && (
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Source <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className={`w-full px-3 py-2.5 border ${errors.source ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                    {...register('source')}
                  >
                    <option value="">Choose</option>
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="Chat">Chat</option>
                  </select>
                  {errors.source && <p className="text-xs text-red-500">{errors.source.message}</p>}
                </div>
              )}
            </div>

            {/* Priority */}
            {!statusOnly && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Priority <span className="text-red-500">*</span>
                </label>
                <select 
                  className={`w-full px-3 py-2.5 border ${errors.priority ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                  {...register('priority')}
                >
                  <option value="">Choose</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Critical">Critical</option>
                </select>
                {errors.priority && <p className="text-xs text-red-500">{errors.priority.message}</p>}
              </div>
            )}

            {!statusOnly && !editedDetailsOnly && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <select 
                    className={`w-full px-3 py-2.5 border ${errors.companyId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer ${selectedDeal ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                    {...register('companyId')}
                    disabled={!!selectedDeal}
                  >
                    <option value="">Choose</option>
                    {mockCompanies.map(company => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                  {errors.companyId && <p className="text-xs text-red-500">{errors.companyId.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Deal
                  </label>
                  <select 
                    className={`w-full px-3 py-2.5 border ${errors.dealId ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer ${selectedCompany ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`}
                    {...register('dealId')}
                    disabled={!!selectedCompany}
                  >
                    <option value="">Choose</option>
                    {mockDeals.map(deal => (
                      <option key={deal.id} value={deal.id}>{deal.name}</option>
                    ))}
                  </select>
                  {errors.dealId && <p className="text-xs text-red-500">{errors.dealId.message}</p>}
                </div>
              </div>
            )}

            {!statusOnly && (
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Ticket Owner <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Enter" 
                  className={`w-full px-3 py-2.5 border ${errors.owner ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                  {...register('owner')}
                />
                {errors.owner && <p className="text-xs text-red-500">{errors.owner.message}</p>}
              </div>
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