'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSnackbar } from 'notistack';

const CompanySchema = z.object({
  name: z.string().min(1, "Company Name is required"),
  owner: z.string().min(1, "Company Owner is required"),
  industry: z.string().min(1, "Industry is required"),
  type: z.string().min(1, "Type is required"),
  phone: z.string().min(1, "Phone Number is required"),
  city: z.string().optional(),
  country: z.string().optional(),
  employees: z.string().optional(),
  revenue: z.string().optional(),
  domain: z.string().optional(),
});

type CompanyFormValues = z.infer<typeof CompanySchema>;

interface CreateCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  editedDetailsOnly?: boolean;
  statusOnly?: boolean;
}

export default function CreateCompanyModal({ isOpen, onClose, onSave, initialData, editedDetailsOnly, statusOnly }: CreateCompanyModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      name: '',
      owner: '',
      industry: '',
      type: '',
      city: '',
      country: '',
      employees: '',
      revenue: '',
      phone: '',
      domain: ''
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: '',
          owner: '',
          industry: '',
          type: '',
          city: '',
          country: '',
          employees: '',
          revenue: '',
          phone: '',
          domain: ''
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: CompanyFormValues) => {
    console.log('Form submitted with data:', data);
    onSave?.(data);
    // Don't close here - let parent handle closing after successful save
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
            {statusOnly ? 'Update Industry/Type' : (initialData ? 'Edit Company' : 'Create Company')}
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
                {/* Company Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter"
                    className={`w-full px-3 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                    {...register('name')}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                {/* Company Domain Name */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Domain Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter (e.g., example.com)"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400"
                    {...register('domain')}
                  />
                </div>

                {/* Company Owner */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Owner <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter"
                    className={`w-full px-3 py-2.5 border ${errors.owner ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                    {...register('owner')}
                  />
                  {errors.owner && <p className="text-xs text-red-500">{errors.owner.message}</p>}
                </div>
              </>
            )}

            {/* Industry & Type Grid */}
            <div className={`grid ${(statusOnly || editedDetailsOnly) ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Industry <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2.5 border ${errors.industry ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                  {...register('industry')}
                >
                  <option value="">Choose</option>
                  <option value="Technology">Technology</option>
                  <option value="Finance">Finance</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Legal service">Legal service</option>
                </select>
                {errors.industry && <p className="text-xs text-red-500">{errors.industry.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  className={`w-full px-3 py-2.5 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white appearance-none cursor-pointer`}
                  {...register('type')}
                >
                  <option value="">Choose</option>
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Non-Profit">Non-Profit</option>
                </select>
                {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
              </div>
            </div>

            {!statusOnly && (
              <>
                {/* City & Country Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      placeholder="Enter"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all"
                      {...register('city')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Country/Region</label>
                    <input
                      type="text"
                      placeholder="Enter"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all"
                      {...register('country')}
                    />
                  </div>
                </div>

                {/* Employees & Revenue Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">No of Employees</label>
                    <input
                      type="text"
                      placeholder="Enter"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all"
                      {...register('employees')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>
                    <input
                      type="text"
                      placeholder="Enter"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all"
                      {...register('revenue')}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors">
                      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="16" rx="2" fill="white" />
                        <g>
                          <rect y="0" width="24" height="5.33" fill="#FF9933" />
                          <rect y="5.33" width="24" height="5.33" fill="white" />
                          <rect y="10.66" width="24" height="5.33" fill="#138808" />
                        </g>
                      </svg>
                      <span className="ml-2 text-gray-400 text-[10px]">▼</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter"
                      className={`flex-1 px-3 py-2.5 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all`}
                      {...register('phone')}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
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
};