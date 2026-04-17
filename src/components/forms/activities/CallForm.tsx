'use client';

import React from 'react';
import { ChevronDown, Calendar, Clock, Phone, Loader2 } from 'lucide-react';
import { Control, UseFormRegister, Controller, useWatch } from 'react-hook-form';
import { RichTextEditor } from './RichTextEditor';
import { ActivityService } from '@/components/services/activityService';
import { useSnackbar } from 'notistack';

interface CallFormProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: any;
  entityData?: any;
}

export const CallForm: React.FC<CallFormProps> = ({ control, register, errors, entityData }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isCalling, setIsCalling] = React.useState(false);
  const connectedTo = useWatch({ control, name: 'connectedTo' });

  const handleMakeCall = async () => {
    const phoneNumber = entityData?.phone || connectedTo || 'Unknown';
    setIsCalling(true);
    try {
      const result = await ActivityService.makeCall(phoneNumber);
      enqueueSnackbar(result.message, { variant: 'success' });
    } catch (err: any) {
      enqueueSnackbar(err.message || "Failed to make call", { variant: 'error' });
    } finally {
      setIsCalling(false);
    }
  };

  const inputClass = "w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-700 outline-none focus:border-[#5948DB] appearance-auto transition-all";
  const errorInputClass = "border-red-500 focus:border-red-500";
  const labelClass = "block text-[13px] font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      {/* Make Call Button Section */}
      <div className="bg-[#F5F3FF] p-4 rounded-2xl border border-[#7B61FF]/20 mb-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[14px] font-bold text-gray-900">Initiate Outbound Call</p>
            <p className="text-[12px] text-gray-500">Call {entityData?.phone || connectedTo || 'customer'} via backend VOIP</p>
          </div>
          <button
            type="button"
            disabled={isCalling}
            onClick={handleMakeCall}
            className="flex items-center gap-2 px-4 py-2 bg-[#5948DB] text-white rounded-xl font-bold text-[13px] hover:bg-[#4b3cc2] transition-all disabled:opacity-70 shadow-lg shadow-indigo-100"
          >
            {isCalling ? <Loader2 size={16} className="animate-spin" /> : <Phone size={16} />}
            {isCalling ? 'Calling...' : 'Make Call'}
          </button>
        </div>
      </div>

      {/* Connected To Field */}
      <div>
        <label className={labelClass}>Connected <span className="text-red-500">*</span></label>
        <input
          type="text"
          className={`${inputClass} ${errors.connectedTo ? errorInputClass : ''}`}
          placeholder="Jane Cooper"
          {...register('connectedTo')}
        />
        {errors.connectedTo && <p className="text-xs text-red-500 mt-1">{errors.connectedTo.message as string}</p>}
      </div>

      {/* Call Outcome Field */}
      <div>
        <label className={labelClass}>Call Outcome <span className="text-red-500">*</span></label>
        <div className="relative">
          <select
            className={`${inputClass} ${errors.outcome ? errorInputClass : ''}`}
            {...register('outcome')}
          >
            <option value="">Choose</option>
            <option value="connected">Connected</option>
            <option value="no-answer">No Answer</option>
            <option value="busy">Busy</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
        </div>
        {errors.outcome && <p className="text-xs text-red-500 mt-1">{errors.outcome.message as string}</p>}
      </div>

      {/* Date and Time Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Date <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="date"
              className={`${inputClass} ${errors.date ? errorInputClass : ''} cursor-pointer hide-native-picker appearance-auto`}
              {...register('date')}
              onClick={(e) => e.currentTarget.showPicker()}
            />
            <Calendar size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message as string}</p>}
        </div>

        <div>
          <label className={labelClass}>Time <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="time"
              className={`${inputClass} ${errors.time ? errorInputClass : ''} cursor-pointer hide-native-picker appearance-auto`}
              {...register('time')}
              onClick={(e) => e.currentTarget.showPicker()}
            />
            <Clock size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
          {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time.message as string}</p>}
        </div>
      </div>

      {/* Note Field with Rich Text Editor */}
      <div className="w-full">
        <Controller
          name="description"
          control={control}
          render={({ field: { onChange, value } }) => (
            <RichTextEditor
              value={value || ''}
              onChange={onChange}
              label="Note"
              required={false}
              placeholder="Enter"
              error={errors.description?.message as string}
            />
          )}
        />
      </div>
    </div>
  );
};
