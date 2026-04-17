'use client';

import React from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { Control, UseFormRegister, Controller } from 'react-hook-form';
import { RichTextEditor } from './RichTextEditor';

interface MeetingFormProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: any;
}

export const MeetingForm: React.FC<MeetingFormProps> = ({ control, register, errors }) => {
  const inputClass = "w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-700 outline-none focus:border-[#5948DB] appearance-auto transition-all";
  const errorInputClass = "border-red-500 focus:border-red-500";
  const labelClass = "block text-[13px] font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      {/* Title Field */}
      <div>
        <label className={labelClass}>Title <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          placeholder="Meeting Title" 
          className={`${inputClass} ${errors.title ? errorInputClass : ''}`}
          {...register('title')}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
      </div>

      {/* Date Field */}
      <div>
        <label className={labelClass}>Date <span className="text-red-500">*</span></label>
        <div className="relative">
          <input 
            type="date" 
            className={`${inputClass} ${errors.date ? errorInputClass : ''} cursor-pointer hide-native-picker appearance-auto`}
            {...register('date')}
            onClick={(e) => e.currentTarget.showPicker()}
          />
          <Calendar size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none " />
        </div>
        {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date.message as string}</p>}
      </div>

      {/* Time and Duration Row */}
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className={labelClass}>Duration</label>
          <div className="relative">
            <select 
              className={inputClass}
              {...register('duration')}
            >
              <option value="">Choose</option>  
              <option value="15">15 mins</option>
              <option value="30">30 mins</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Attendees Select */}
      <div>
        <label className={labelClass}>Attendees</label>
        <div className="relative">
          <select 
            className={inputClass}
            {...register('attendees')}
          >
            <option value="">Choose</option>
            <option value="maria">Maria Johnson</option>
            <option value="jane">Jane Cooper</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Location Select */}
      <div>
        <label className={labelClass}>Location</label>
        <div className="relative">
          <select 
            className={inputClass}
            {...register('location')}
          >
            <option value="">Choose</option>  
            <option value="meet">Google Meet</option>
            <option value="zoom">Zoom</option>
            <option value="in-person">In Person</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Reminder Select */}
      <div>
        <label className={labelClass}>Reminder</label>
        <div className="relative">
          <select 
            className={inputClass}
            {...register('reminder')}
          >
            <option value="">Choose</option>
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
          </select>
          <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
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
              placeholder="Enter meeting notes..."
              error={errors.description?.message as string}
            />
          )}
        />
      </div>
    </div>
  );
};
