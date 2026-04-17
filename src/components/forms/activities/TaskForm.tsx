'use client';

import React from 'react';
import { Calendar, Clock, ChevronDown } from 'lucide-react';
import { Control, UseFormRegister, Controller } from 'react-hook-form';
import { RichTextEditor } from './RichTextEditor';

interface TaskFormProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: any;
}

export const TaskForm: React.FC<TaskFormProps> = ({ control, register, errors }) => {
  const inputClass = "w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-[14px] text-gray-700 outline-none focus:border-[#5948DB] appearance-auto transition-all";
  const errorInputClass = "border-red-500 focus:border-red-500";
  const labelClass = "block text-[13px] font-medium text-gray-700 mb-1.5";

  return (
    <div className="flex flex-col gap-5">
      {/* Task Name */}
      <div>
        <label className={labelClass}>Task Name <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          placeholder="Enter task name" 
          className={`${inputClass} ${errors.title ? errorInputClass : ''}`}
          {...register('title')}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message as string}</p>}
      </div>

      {/* Date and Time Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Due Date <span className="text-red-500">*</span></label>
          <div className="relative">
            <input
              type="date"
              className={`${inputClass} ${errors.dueDate ? errorInputClass : ''} cursor-pointer hide-native-picker appearance-auto`}
              {...register('dueDate')}
              onClick={(e) => e.currentTarget.showPicker()}
            />
            <Calendar size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
          {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate.message as string}</p>}
        </div>
        <div>
          <label className={labelClass}>Time</label>
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

      {/* Task Type and Priority Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Task Type</label>
          <div className="relative">
            <select 
              className={`${inputClass} ${errors.taskType ? errorInputClass : ''}`}
              {...register('taskType')}
            >
              <option value="">Choose</option>
              <option value="todo">To-do</option>
              <option value="followup">Follow up</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelClass}>Priority</label>
          <div className="relative">
            <select 
              className={`${inputClass} ${errors.priority ? errorInputClass : ''}`}
              {...register('priority')}
            >
              <option value="">Choose</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Note Area with Rich Text Editor */}
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
              placeholder="Enter details..."
              error={errors.description?.message as string}
            />
          )}
        />
      </div>
    </div>
  );
};
