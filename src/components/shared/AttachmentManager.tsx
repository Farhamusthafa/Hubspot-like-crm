'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  Download,
  Trash2,
  Eye,
  UploadCloud,
  Loader2
} from 'lucide-react';
import { uploadAttachment, getAttachments, downloadAttachment, deleteAttachment } from '@/lib/api';
import { useSnackbar } from 'notistack';

interface Attachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: number;
  createdAt: string;
  updatedAt: string;
  uploading?: boolean;
  progress?: number;
}

interface AttachmentManagerProps {
  entityType: string;
  entityId: number;
}

export const AttachmentManager: React.FC<AttachmentManagerProps> = ({ entityType, entityId }) => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Load existing attachments
  useEffect(() => {
    const loadAttachments = async () => {
      console.log('Loading attachments for:', entityType, entityId);

      // Check if user is logged in
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);

      if (!token) {
        console.log('No token found - user not logged in');
        return;
      }

      try {
        console.log('Calling getAttachments API...');
        const data = await getAttachments(entityType, entityId);
        console.log('Attachments loaded:', data);
        setAttachments(data || []);
      } catch (error: any) {
        console.error('Error loading attachments:', error);
        enqueueSnackbar(error.message || 'Failed to load attachments', { variant: 'error' });
      }
    };

    if (entityType && entityId) {
      loadAttachments();
    }
  }, [entityType, entityId]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileType = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    return 'file';
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    console.log('Uploading files:', files.length);
    const token = localStorage.getItem('token');
    console.log('Token exists for upload:', !!token);

    if (!token) {
      enqueueSnackbar('Please log in to upload files', { variant: 'error' });
      return;
    }

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      console.log('Processing file:', file.name, file.size, file.type);

      const id = Math.random().toString(36).substr(2, 9);
      const newAttachment: Attachment = {
        id,
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        path: '',
        uploadedBy: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploading: true,
        progress: 0
      };

      // Add to list with uploading state
      setAttachments(prev => [newAttachment, ...prev]);

      try {
        console.log('Uploading file to server...');
        // Upload file
        const uploadedAttachment = await uploadAttachment(entityType, entityId, file);
        console.log('Upload successful:', uploadedAttachment);

        // Replace the uploading attachment with the real one
        setAttachments(prev => prev.map(a =>
          a.id === id
            ? { ...uploadedAttachment, uploading: false, progress: 100 }
            : a
        ));

        enqueueSnackbar(`${file.name} uploaded successfully`, { variant: 'success' });
      } catch (error: any) {
        console.error('Upload error:', error);
        // Remove the failed upload
        setAttachments(prev => prev.filter(a => a.id !== id));

        // Handle authentication errors specifically
        if (error.message.includes('Authentication error') || error.message.includes('session invalid')) {
          enqueueSnackbar('Session expired. Please login again.', { variant: 'warning' });
          // Redirect to login after a short delay
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        } else {
          enqueueSnackbar(error.message || `Failed to upload ${file.name}`, { variant: 'error' });
        }
      }
    }
  };

  const removeAttachment = async (attachment: Attachment) => {
    try {
      await deleteAttachment(parseInt(attachment.id));
      setAttachments(prev => prev.filter(a => a.id !== attachment.id));
      enqueueSnackbar('Attachment deleted successfully', { variant: 'success' });
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to delete attachment', { variant: 'error' });
    }
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      await downloadAttachment(parseInt(attachment.id));
    } catch (error: any) {
      enqueueSnackbar(error.message || 'Failed to download attachment', { variant: 'error' });
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon size={18} className="text-emerald-500" />;
      case 'pdf': return <FileText size={18} className="text-rose-500" />;
      default: return <FileIcon size={18} className="text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all duration-300
          ${isDragging
            ? 'border-[#5948DB] bg-indigo-50/50 scale-[0.98]'
            : 'border-gray-200 hover:border-[#5948DB] hover:bg-gray-50'
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3 text-center">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300
            ${isDragging ? 'bg-[#5948DB] text-white scale-110 shadow-lg shadow-indigo-200' : 'bg-indigo-50 text-[#5948DB] group-hover:scale-110'}
          `}>
            <UploadCloud size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG or PDF (max. 10MB)</p>
          </div>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
        {attachments.map((file) => (
          <div
            key={file.id}
            className="group relative flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all animate-in slide-in-from-top-2 duration-300"
          >
            {/* Type Icon / Preview */}
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 transition-colors">
              {file.uploading ? (
                <Loader2 size={18} className="text-indigo-500 animate-spin" />
              ) : (
                getFileIcon(getFileType(file.mimeType))
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-[13px] font-medium text-gray-800 truncate" title={file.originalName}>
                  {file.originalName}
                </p>
                {!file.uploading && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(file)}
                      className="p-1 hover:text-indigo-600 transition-colors"
                      title="Download"
                    >
                      <Download size={14} />
                    </button>
                    <button className="p-1 hover:text-blue-600 transition-colors" title="Preview">
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => removeAttachment(file)}
                      className="p-1 hover:text-rose-600 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {file.uploading ? (
                <div className="mt-1.5">
                  <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                    <div
                      className="bg-[#5948DB] h-full rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1 font-medium">{file.progress}% uploaded</p>
                </div>
              ) : (
                <p className="text-[11px] text-gray-500 font-medium lowercase">
                  {getFileType(file.mimeType)} • {formatFileSize(file.size)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
