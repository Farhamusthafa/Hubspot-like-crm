'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from '@/app/types/usertypes';
import { useSnackbar } from 'notistack';

const UserSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters").regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number").optional(),
  phone: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
  industryType: z.string().nullable().optional(),
  countryRegion: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  role: z.enum(['Admin', 'User']),
  status: z.enum(['Active', 'Disabled']),
  emailNotifications: z.boolean(),
  twoFactorAuth: z.boolean(),
  publicProfile: z.boolean(),
});

type UserFormValues = z.infer<typeof UserSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  initialData?: User | null;
}

export default function UserModal({ isOpen, onClose, onSave, initialData }: UserModalProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormValues>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      companyName: '',
      industryType: '',
      countryRegion: '',
      gender: '',
      role: 'User',
      status: 'Active',
      emailNotifications: true,
      twoFactorAuth: false,
      publicProfile: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setProfilePreview(initialData.profileImage);
        reset({
          firstName: initialData.firstName,
          lastName: initialData.lastName,
          email: initialData.email,
          phone: initialData.phone || '',
          companyName: initialData.companyName || '',
          industryType: initialData.industryType || '',
          countryRegion: initialData.countryRegion || '',
          gender: initialData.gender || '',
          role: initialData.role,
          status: initialData.status,
          emailNotifications: initialData.emailNotifications ?? true,
          twoFactorAuth: initialData.twoFactorAuth ?? false,
          publicProfile: initialData.publicProfile ?? true,
          password: '',
        });
      } else {
        setProfilePreview(null);
        reset({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          phone: '',
          companyName: '',
          industryType: '',
          countryRegion: '',
          gender: '',
          role: 'User',
          status: 'Active',
          emailNotifications: true,
          twoFactorAuth: false,
          publicProfile: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the actual file for upload
      setProfileFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setProfilePreview(null);
    setProfileFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: UserFormValues) => {
    // Validate password for new users
    if (!initialData && !data.password) {
      enqueueSnackbar('Password is required for new users', { variant: 'error' });
      return;
    }

    try {
      // For now, don't send profile picture to test basic update
      const updateData = { ...data };
      if (profileFile) {
        // TODO: Handle profile picture upload separately
        console.log('Profile picture selected but not uploaded yet:', profileFile.name);
        delete updateData.profilePicture;
      }

      await onSave?.(updateData);
      onClose();
    } catch (error) {
      // Don't close modal if save fails, let parent handle error
      console.error('Save failed:', error);
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
        style={{ width: '600px' }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-[#111827]">
            {initialData ? 'Edit User' : 'Create User'}
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

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form id="user-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Profile Image Section */}
            <div className="flex items-center gap-5 pb-2">
              <div className="relative group">
                {profilePreview ? (
                  <img src={profilePreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-indigo-50" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold border-2 border-indigo-50 leading-none">
                    {initialData ? (initialData.firstName.charAt(0) + initialData.lastName.charAt(0)) : '?'}
                  </div>
                )}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Profile Photo</h4>
                <p className="text-xs text-gray-500 mb-2">Recommended: 800x800 px</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Update Photo
                  </button>
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="text-xs font-semibold text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                  {...register('firstName')}
                />
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                <input
                  type="text"
                  className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                  {...register('lastName')}
                />
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Email *</label>
                <input
                  type="email"
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                  {...register('email')}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  {...register('phone')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Password {!initialData && '*'}</label>
                <input
                  type="password"
                  placeholder={initialData ? "Leave blank to keep current" : "Enter password"}
                  className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm transition-all shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500`}
                  {...register('password')}
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                {!initialData && (
                  <p className="text-xs text-gray-500">
                    Password must contain: 6+ chars, 1 uppercase, 1 lowercase, 1 number
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-all shadow-sm bg-white"
                  {...register('gender')}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  {...register('companyName')}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Industry Type</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  {...register('industryType')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Country/Region</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  {...register('countryRegion')}
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Role *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  {...register('role')}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-gray-700">Status *</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                  {...register('status')}
                >
                  <option value="Active">Active</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>

            {/* Settings Section */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">User Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive system updates via email</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer" {...register('emailNotifications')} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Two Factor Authentication</p>
                    <p className="text-xs text-gray-500">Add an extra layer of security</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer" {...register('twoFactorAuth')} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Public Profile</p>
                    <p className="text-xs text-gray-500">Make profile visible to others</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded cursor-pointer" {...register('publicProfile')} />
                </div>
              </div>
            </div>
          </form>
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
            type="submit"
            form="user-form"
            className="flex-1 px-4 py-2.5 bg-[#5948DB] rounded-lg text-sm font-medium text-white hover:bg-[#4838b8] shadow-sm transition-colors"
          >
            {initialData ? 'Update User' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
}
