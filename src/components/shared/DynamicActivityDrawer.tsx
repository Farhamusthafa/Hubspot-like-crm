'use client';

import React, { useMemo, useEffect } from 'react';
import { useForm, Control, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSnackbar } from 'notistack';
import { email, z } from 'zod';

import { NoteForm } from '@/components/forms/activities/NoteForm';
import { EmailForm } from '@/components/forms/activities/EmailForm';
import { CallForm } from '@/components/forms/activities/CallForm';
import { TaskForm } from '@/components/forms/activities/TaskForm';
import { MeetingForm } from '@/components/forms/activities/MeetingForm';
import { ActivityDrawer } from './ActivityDrawer';

import {
  NoteSchema,
  EmailSchema,
  CallSchema,
  TaskSchema,
  MeetingSchema
} from '@/components/forms/activities/schemas';

export type ActivityType = 'note' | 'email' | 'call' | 'task' | 'meeting';

interface DynamicActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activityType: ActivityType;
  entityData?: any;
  onSave?: (formData: any) => void;
  isSaving?: boolean;
}

export const DynamicActivityDrawer: React.FC<DynamicActivityDrawerProps> = ({
  isOpen,
  onClose,
  activityType,
  entityData,
  onSave,
  isSaving = false
}) => {
  const { enqueueSnackbar } = useSnackbar();
  // Determine relevant schema
  const schema = useMemo(() => {
    switch (activityType) {
      case 'note': return NoteSchema;
      case 'email': return EmailSchema;
      case 'call': return CallSchema;
      case 'task': return TaskSchema;
      case 'meeting': return MeetingSchema;
      default: return z.any();
    }
  }, [activityType]);

  // Initialize Form
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  // Reset form when drawer opens or type changes
  useEffect(() => {
    if (isOpen) {
      let defaultValues: any = {};

      switch (activityType) {
        case 'email':
          defaultValues = { to: '', subject: '', body: '' };
          break;
        case 'note':
          defaultValues = { description: '' };
          break;
        case 'call':
          defaultValues = { connectedTo: entityData?.name || '', outcome: '', date: '', time: '', description: '' };
          break;
        case 'task':
          defaultValues = { title: '', dueDate: '', time: '', taskType: '', priority: '', description: '' };
          break;
        case 'meeting':
          defaultValues = { title: '', date: '', time: '', attendees: '', location: '', reminder: '', duration: '', description: '' };
          break;
      }
      reset(defaultValues);
    }
  }, [isOpen, activityType, entityData, reset]);

  const handleValidSubmit = (data: any) => {
    console.log('Valid submission:', activityType, data);
    onSave?.(data);
    enqueueSnackbar(`${activityType.charAt(0).toUpperCase() + activityType.slice(1)} created successfully!`, { variant: 'success' });
    onClose();
  };

  const handleValidationFailed = (errors: FieldErrors) => {
    console.error("Validation failed", errors);
    enqueueSnackbar("Please check required fields", { variant: 'error' });
  };

  const handleSaveClick = () => {
    handleSubmit(handleValidSubmit, handleValidationFailed)();
  };

  const handleClose = () => {
    reset(); // Clear form
    onClose();
  };

  if (!isOpen) return null;

  const getFormTitle = () => {
    switch (activityType) {
      case 'note': return 'Create Note';
      case 'email': return 'New Email';
      case 'call': return 'Make a Phone Call';
      case 'task': return 'Create Task';
      case 'meeting': return 'Schedule Meeting';
      default: return 'Activity';
    }
  };

  // Render Email as modal
  if (activityType === 'email') {
    return (
      <EmailForm
        control={control}
        register={register}
        handleSubmit={handleSubmit}
        errors={errors}
        isOpen={isOpen}
        onClose={handleClose}
        onSave={handleValidSubmit}
        isSaving={isSaving}
        setValue={setValue}
        // selectedEntityEmail={email.recipients || [] } // 👈 pass here

      />
    );
  }

  // Render other forms
  return (
    <ActivityDrawer
      isOpen={isOpen}
      onClose={handleClose}
      title={getFormTitle()}
      onSave={handleSaveClick}
      isLoading={isSaving}
    >
      {isOpen && activityType === 'note' && (
        <NoteForm control={control} errors={errors} />
      )}

      {isOpen && activityType === 'call' && (
        <CallForm control={control} register={register} errors={errors} entityData={entityData} />
      )}

      {isOpen && activityType === 'task' && (
        <TaskForm control={control} register={register} errors={errors} />
      )}

      {isOpen && activityType === 'meeting' && (
        <MeetingForm control={control} register={register} errors={errors} />
      )}

    </ActivityDrawer>
  );
};