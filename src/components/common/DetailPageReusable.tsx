'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  IconButton,
} from '@mui/material';
import { 
  ChevronLeft, 
  Copy, 
  Edit3, 
  ChevronDown,
  Layout,
  Mail,
  Phone,
  CheckSquare,
  Calendar
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import { Lead } from '@/app/types/leadtypes';
import { Deal } from '@/app/types/dealtypes';
import { Ticket } from '@/app/types/tickettypes';
import { Company } from '@/app/types/companytypes';
import { EntityType, entityConfigs, getActionButtons } from './entityConfig';
import { DynamicActivityDrawer as ActivityDrawer, ActivityType } from '@/components/shared/DynamicActivityDrawer';

interface DetailPageReusableProps {
  type: EntityType;
  data: Lead | Deal | Ticket | Company;
  onBack: () => void;
}

export const DetailPageReusable: React.FC<DetailPageReusableProps> = ({ type, data, onBack }) => {
  const { enqueueSnackbar } = useSnackbar();
  const config = entityConfigs[type];
  const actionButtons = getActionButtons();
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [currentActivityType, setCurrentActivityType] = useState<ActivityType>('note');

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'NoteAltOutlined':
        return <Edit3 size={18} />;
      case 'EmailOutlined':
        return <Mail size={18} />;
      case 'CallOutlined':
        return <Phone size={18} />;
      case 'TaskAltOutlined':
        return <CheckSquare size={18} />;
      case 'EventOutlined':
        return <Calendar size={18} />;
      default:
        return <Edit3 size={18} />;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    enqueueSnackbar('Copied to clipboard!', { variant: 'success' });
  };

  const handleActionClick = (actionType: string) => {
    const activityMap: Record<string, ActivityType> = {
      'Note': 'note',
      'Email': 'email',
      'Call': 'call',
      'Task': 'task',
      'Meeting': 'meeting',
    };

    const activity = activityMap[actionType];
    if (activity) {
      setCurrentActivityType(activity);
      setIsActivityDrawerOpen(true);
    }
  };

  const handleActivityDrawerClose = () => {
    setIsActivityDrawerOpen(false);
  };

  return (
    <Box sx={{ width: 320, p: 2 }}>
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6 group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[17px] font-bold text-[#344054]">
          {type.charAt(0).toUpperCase() + type.slice(1)}s
        </span>
      </button>

      {/* Entity header */}
      <Stack direction="row" spacing={2} mb={3}>
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: '#E0E0E0',
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Layout size={32} className="text-gray-400" />
        </Box>
        <Box sx={{ pt: 0.5 }}>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1D2939' }}>
            {config.getTitle(data)}
          </Typography>
          <Typography sx={{ fontSize: 16, color: '#667085', mb: 0.5 }}>
             {(data as any).jobTitle || (type === 'company' ? (data as Company).industry : 'Salesperson')}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ fontSize: 15, color: '#667085' }}>
              {(data as any).email}
            </Typography>
            <button 
              onClick={() => handleCopy((data as any).email)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Copy size={14} className="text-[#5948DB]" />
            </button>
          </Stack>
        </Box>
      </Stack>

      {/* Action Row */}
      <div className="bg-[#F9FAFB] p-1.5 rounded-2xl border border-gray-100 mb-6 mt-6">
        <div className="flex justify-between items-center gap-1">
          {actionButtons.map((item) => (
            <div key={item.label} className="flex flex-col items-center flex-1">
              <button
                onClick={() => handleActionClick(item.label)}
                className="w-11 h-11 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-[#5948DB] hover:bg-gray-50 hover:border-indigo-200 transition-all shadow-sm mb-1.5"
              >
                {getIconComponent(item.icon)}
              </button>
              <span className="text-[11px] font-bold text-gray-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 w-[calc(100%+32px)] ml-[-16px] mb-6" />

      {/* About Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <ChevronDown size={20} className="text-[#5948DB]" />
          <span className="text-[16px] font-bold text-[#344054]">
            About this {type}
          </span>
        </div>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-[#5948DB]">
          <Edit3 size={18} />
        </button>
      </div>

      {/* About Sections Fields */}
      <div className="space-y-5">
        {config.getAboutSections(data).map((section) => (
          <div key={section.label}>
            <p className="text-[13px] font-medium text-[#667085] mb-1">{section.label}</p>
            <p className="text-[15px] font-bold text-[#1D2939]">{section.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Drawer */}
      <ActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={handleActivityDrawerClose}
        activityType={currentActivityType}
        entityData={data}
      />
    </Box>
  );
};