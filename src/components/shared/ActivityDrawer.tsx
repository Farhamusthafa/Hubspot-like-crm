'use client';
import React from 'react';
import { X, Trash2, ChevronDown, Type, Paperclip, Link2, Smile, Image as ImageIcon, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave: () => void;
  isLoading?: boolean;
  type?: 'drawer' | 'modal';
  variant?: 'default' | 'email';
}

export const ActivityDrawer: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSave, 
  isLoading = false,
  type = 'drawer',
  variant = 'default'
}) => {
  if (!isOpen) return null;

  const isEmail = variant === 'email';
  const isModal = type === 'modal' || isEmail;

  return (
    <div className={`fixed inset-0 z-[100] flex ${isModal ? 'items-center justify-center p-4' : 'justify-end'}`}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      {/* Container Panel */}
      <div className={`relative bg-white shadow-2xl flex flex-col animate-in duration-300 ${
        isModal 
          ? 'w-full max-w-[640px] rounded-xl overflow-hidden zoom-in-95' 
          : 'w-full max-w-[507px] h-full slide-in-from-right'
      }`}>
        
        {/* Header */}
        <div className={`px-8 py-4 flex justify-between items-center ${
          isEmail ? 'bg-[#5948DB] text-white' : 'border-b border-gray-100 text-gray-900'
        }`}>
          <h2 className="text-lg font-bold">{title}</h2>
          <button 
            type="button" 
            onClick={onClose} 
            className={`${isEmail ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </div>

        {/* Footer Buttons */}
        {isEmail ? (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-white">
            <div className="flex items-center gap-4">
               {/* Send Button with Dropdown */}
               <div className="flex">
                  <button 
                    onClick={onSave}
                    disabled={isLoading}
                    className="bg-[#5948DB] text-white px-6 py-2 rounded-l-lg font-medium hover:bg-[#4a3bc4] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Send'}
                  </button>
                 <button className="bg-[#5948DB] text-white px-2 py-2 rounded-r-lg border-l border-white/20 hover:bg-[#4a3bc4]">
                   <ChevronDown size={20} />
                 </button>
               </div>
               
               {/* Icons */}
               <div className="flex items-center gap-4 text-gray-400">
                 <button type="button" className="hover:text-gray-600"><Type size={20} /></button>
                 <button type="button" className="hover:text-gray-600"><Paperclip size={20} /></button>
                 <button type="button" className="hover:text-gray-600"><Link2 size={20} /></button>
                 <button type="button" className="hover:text-gray-600"><Smile size={20} /></button>
                 <button type="button" className="hover:text-gray-600"><ImageIcon size={20} /></button>
               </div>
            </div>
            
            <button type="button" className="text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 size={20} />
            </button>
          </div>
        ) : (
          <div className="p-6 border-t border-gray-100 flex gap-4 bg-white">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="button"
              onClick={onSave}
              disabled={isLoading}
              className="flex-1 py-3 bg-[#5948DB] text-white rounded-xl font-medium hover:bg-[#4a3bc4] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
