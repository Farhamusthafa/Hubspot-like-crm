'use client';

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSnackbar } from "notistack";
import { getAllUsers } from "@/lib/api";
import { useState } from "react";
import { User } from "@/app/types/usertypes";

// Define Zod Schema
const LeadSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  phone: z.string().min(1, "Phone Number is required"),
  company: z.string().min(1, "Company is required"),
  jobTitle: z.string().optional(),
  assignedTo: z.string().optional(),
  status: z.string().optional(),
});

type LeadFormValues = z.infer<typeof LeadSchema>;

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: any;
  editedDetailsOnly?: boolean;
  statusOnly?: boolean;
}

export default function CreateLeadModal({ isOpen, onClose, onSave, initialData, editedDetailsOnly, statusOnly }: CreateLeadModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [users, setUsers] = useState<User[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      assignedTo: "",
      status: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          jobTitle: "",
          assignedTo: "",
          status: "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

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

  const onSubmit = (data: LeadFormValues) => {
    onSave?.(data);
    // const message = initialData ? "Lead updated successfully!" : "Lead created successfully!";
    // enqueueSnackbar(message, { variant: 'success' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[1px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-lg w-full flex">
        <div className="flex-1 flex flex-col bg-white shadow-2xl h-full animate-slide-in-right">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              {statusOnly ? 'Update Status' : (initialData ? "Edit Lead" : "Create Lead")}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-5">

              {!statusOnly && (
                <>
                  {/* First & Last Name Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter"
                        className={`w-full px-3 py-2.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all`}
                        {...register("firstName")}
                      />
                      {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Enter"
                        className={`w-full px-3 py-2.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all`}
                        {...register("lastName")}
                      />
                      {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter"
                      className={`w-full px-3 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all placeholder:text-gray-400`}
                      {...register("email")}
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="flex">
                      <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="Enter"
                        className={`flex-1 px-3 py-2.5 border ${errors.phone ? 'border-red-500 border-l' : 'border-gray-300'} rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all`}
                        {...register("phone")}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                  </div>

                  {/* Company */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">
                      Company <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter"
                      className={`w-full px-3 py-2.5 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all`}
                      {...register("company")}
                    />
                    {errors.company && <p className="text-xs text-red-500">{errors.company.message}</p>}
                  </div>

                  {/* Job Title */}
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input
                      type="text"
                      placeholder="Enter"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] transition-all"
                      {...register("jobTitle")}
                    />
                  </div>

                  {/* Contact Owner */}
                  {!editedDetailsOnly && (
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Contact Owner</label>
                      <select
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white cursor-pointer"
                        {...register("assignedTo")}
                      >
                        {users.map((user: any) => (
                         <option key={user.id} value={user.id}>
                          {user.firstName} {user.lastName}
                         </option>
                          ))}
                        {/* <option value="">Choose</option>
                        <option value="1">Jhon Doe</option>
                        <option value="2">Jane Smith</option>
                        <option value="3">Robert Johnson</option>
                        <option value="4">Mary Williams</option>
                        <option value="5">David Brown</option> */}
                      </select>
                    </div>
                  )}
                </>
              )}

              {/* Lead Status */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Lead Status</label>
                <select
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5948DB]/20 focus:border-[#5948DB] bg-white cursor-pointer"
                  {...register("status")}
                >
                  <option value="">Choose</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Open">Open</option>
                  <option value="Inprogress">Inprogress</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 px-6 py-5 border-t border-gray-100 bg-white">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className="flex-1 px-4 py-2.5 bg-[#5948DB] rounded-lg text-sm font-medium text-white hover:bg-[#4838b8] shadow-sm transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}