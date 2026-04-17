import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { RichTextEditor } from './RichTextEditor';

interface NoteFormProps {
  control: Control<any>;
  errors: any;
}

export const NoteForm: React.FC<NoteFormProps> = ({ control, errors }) => {
  return (
    <div className="w-full">
      <Controller
        name="description"
        control={control}
        render={({ field: { onChange, value } }) => (
          <RichTextEditor 
            value={value || ''}
            onChange={onChange}
            label="Note"
            required={true}
            placeholder="Enter note details..."
            error={errors.description?.message as string}
          />
        )}
      />
    </div>
  );
};
