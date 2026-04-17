'use client';

import React, { useRef } from 'react';
import { ChevronDown, Paperclip, Link2, Smile, Image as ImageIcon, Trash2, X, Type, List, ListOrdered, Loader2 } from 'lucide-react';
import { Control, UseFormRegister, UseFormHandleSubmit, Controller } from 'react-hook-form';
import { RichTextEditor, RichTextEditorRef } from './RichTextEditor';
import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';

interface EmailFormProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  setValue: UseFormSetValue<any>;   // ✅ ADD THIS
  errors: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  isSaving?: boolean;
  selectedEntityEmail?: string;
}

export const EmailForm: React.FC<EmailFormProps> = ({ 
  control, register, handleSubmit,setValue,selectedEntityEmail, errors, isOpen, onClose, onSave, isSaving = false
}) => {
  const editorRef = useRef<RichTextEditorRef>(null);
  useEffect(() => {
  if (selectedEntityEmail) {
    setValue('to', selectedEntityEmail);
  }
}, [selectedEntityEmail, setValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
      <div className="flex flex-col w-[90%] max-w-[640px] bg-white rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Strictly Old UI */}
        <div className="flex items-center justify-between px-8 py-2.5 bg-[#5948DB] text-white">
          <span className="text-[13px] font-medium">New Email</span>
          <button type="button" onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Inputs - Strictly Old UI (Placeholders only) */}
        <div className="flex flex-col bg-white">
          <div className="flex items-center px-8 py-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Recipients"
              autoComplete="off"
              className="flex-1 outline-none text-[13px] py-1 placeholder-gray-400"
              {...register('to')}
            />
            <div className="flex gap-2 text-[11px] text-gray-400">
              <button type="button" className="hover:underline hover:text-[#5948DB] transition-colors">Cc</button>
              <button type="button" className="hover:underline hover:text-[#5948DB] transition-colors">Bcc</button>
            </div>
          </div>
          {errors.to && <p className="px-8 text-xs text-red-500 mt-1">{errors.to.message as string}</p>}

          <div className="px-8 py-2 border-b border-gray-100">
            <input
              type="text"
              placeholder="Subject"
              className="w-full outline-none text-[13px] py-1 placeholder-gray-400"
              {...register('subject')}
            />
          </div>
          {errors.subject && <p className="px-8 text-xs text-red-500 mt-1">{errors.subject.message as string}</p>}
        </div>

        <Controller
          name="body"
          control={control}
          render={({ field: { onChange, value } }) => (
              <RichTextEditor 
                ref={editorRef}
                value={value || ''}
                onChange={onChange}
                placeholder="Body Text"
                hideToolbar={true}
                className="flex-1 min-h-[400px]"
              />
          )}
        />
        
        {/* Validation Error for Body */}
        {errors.body && <p className="px-8 text-xs text-red-500 mb-2">{errors.body.message as string}</p>}

        {/* Bottom Toolbar & Send - Strictly Old UI */}
        <div className="flex items-center justify-between px-8 py-3 border-t border-gray-50 bg-white">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="flex shadow-sm rounded">
                <button 
                  type="button"
                  onClick={handleSubmit(onSave)}
                  disabled={isSaving}
                  className="bg-[#5948DB] text-white px-5 py-1.5 rounded-l text-[13px] font-medium hover:bg-[#4b3cc2] transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : 'Send'}
                </button>
                <button type="button" className="bg-[#5948DB] text-white px-2 py-1.5 rounded-r text-[13px] font-medium hover:bg-[#4b3cc2] transition-colors">
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-gray-400 ml-4">
              <button 
                type="button" 
                onClick={() => editorRef.current?.execCommand('bold')} 
                className="hover:text-gray-600 transition-colors" 
                title="Bold"
              >
                <Type size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => editorRef.current?.execCommand('insertUnorderedList')} 
                className="hover:text-gray-600 transition-colors" 
                title="Bullet List"
              >
                <List size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => editorRef.current?.execCommand('insertOrderedList')} 
                className="hover:text-gray-600 transition-colors" 
                title="Numbered List"
              >
                <ListOrdered size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => editorRef.current?.insertFile()} 
                className="hover:text-gray-600 transition-colors" 
                title="Attach File"
              >
                <Paperclip size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => editorRef.current?.insertLink()} 
                className="hover:text-gray-600 transition-colors" 
                title="Add Link"
              >
                <Link2 size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => editorRef.current?.toggleEmoji()} 
                className="hover:text-gray-600 transition-colors" 
                title="Emojis"
              >
                <Smile size={18} />
              </button>
              <button 
                type="button" 
                onClick={() => editorRef.current?.insertImage()} 
                className="hover:text-gray-600 transition-colors" 
                title="Insert Image"
              >
                <ImageIcon size={18} />
              </button>
            </div>
          </div>

          <button 
            type="button" 
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            onClick={onClose}
            title="Discard"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
