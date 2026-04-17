"use client";

import { useRef } from 'react';
import { Mail } from 'lucide-react';

export interface FieldDef {
    key: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'select' | 'date' | 'number';
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
    icon?: 'email' | 'phone';
    min?: number;
    step?: number;
}

interface FormBuilderProps {
    fields: FieldDef[];
    initialData?: Record<string, any>;
    onSubmit: (data: Record<string, any>) => void;
    formId: string;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
    fields,
    initialData = {},
    onSubmit,
    formId,
}) => {
    const formDataRef = useRef<Record<string, any>>(initialData || {});

    const handleChange = (key: string, value: any) => {
        formDataRef.current[key] = value;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formDataRef.current);
    };

    const renderField = (field: FieldDef, index: number) => {
        const commonInputClasses = "w-full h-[44px] px-3.5 border border-[#D0D5DD] rounded-[8px] focus:outline-none focus:ring-1 focus:ring-[#5948DB] focus:border-[#5948DB] placeholder:text-[#667085] text-[#101828] text-[14px]";

        switch (field.type) {
            case 'email':
                return (
                    <div className="relative">
                        {field.icon === 'email' && (
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#667085]">
                                <Mail size={20} />
                            </span>
                        )}
                        <input
                            type="email"
                            name={field.key}
                            autoFocus={index === 0}
                            required={field.required}
                            defaultValue={formDataRef.current[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={`${commonInputClasses} ${field.icon === 'email' ? 'pl-11' : ''}`}
                            placeholder={field.placeholder || 'Enter'}
                        />
                    </div>
                );

            case 'tel':
                return (
                    <div className="relative flex items-center">
                        {field.icon === 'phone' && (
                            <div className="absolute left-3.5 flex items-center gap-1.5 cursor-pointer max-h-[44px]">
                                <img 
                                    src="https://flagcdn.com/w40/us.png" 
                                    alt="US Flag" 
                                    className="w-[20px] h-[14px] object-cover rounded-[1px]" 
                                />
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="#667085" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="h-[20px] w-[1px] bg-[#D0D5DD] ml-0.5"></div>
                            </div>
                        )}
                        <input
                            type="tel"
                            name={field.key}
                            autoFocus={index === 0}
                            required={field.required}
                            defaultValue={formDataRef.current[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            className={`${commonInputClasses} ${field.icon === 'phone' ? 'pl-[76px]' : ''}`}
                            placeholder={field.placeholder || 'Enter'}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div className="relative">
                        <select
                            name={field.key}
                            autoFocus={index === 0}
                            defaultValue={formDataRef.current[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            required={field.required}
                            className={`${commonInputClasses} appearance-none bg-white`}
                        >
                            <option value="" className="text-[#667085]">{field.placeholder || 'Choose'}</option>
                            {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                );

            case 'date':
                return (
                    <input
                        type="date"
                        name={field.key}
                        autoFocus={index === 0}
                        required={field.required}
                        defaultValue={formDataRef.current[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={commonInputClasses}
                    />
                );

            case 'number':
                return (
                    <input
                        type="number"
                        name={field.key}
                        autoFocus={index === 0}
                        required={field.required}
                        min={field.min}
                        step={field.step}
                        defaultValue={formDataRef.current[field.key] || ''}
                        onChange={(e) => handleChange(field.key, parseFloat(e.target.value) || 0)}
                        className={commonInputClasses}
                        placeholder={field.placeholder || '0'}
                    />
                );

            default:
                return (
                    <input
                        type="text"
                        name={field.key}
                        autoFocus={index === 0}
                        required={field.required}
                        defaultValue={formDataRef.current[field.key] || ''}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className={commonInputClasses}
                        placeholder={field.placeholder || 'Enter'}
                    />
                );
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field, index) => (
                <div key={field.key}>
                    <label className="block text-[14px] font-medium text-[#344054] mb-1.5">
                        {field.label} {field.required && <span className="text-[#FF3B30]">*</span>}
                    </label>
                    {renderField(field, index)}
                </div>
            ))}
        </form>
    );
};
