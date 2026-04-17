import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {

}

export const Checkbox: React.FC<CheckboxProps> = ({ className, ...props }) => {
    return (
        <div className="relative flex items-center">
            <input
                type="checkbox"
                className={`peer appearance-none w-[18px] h-[18px] rounded-md bg-white checked:bg-[#5948DB] transition-all cursor-pointer ${className}`}
                style={{
                    borderWidth: '1.5px',
                    borderColor: '#9CA3AF',
                    borderStyle: 'solid',
                }}
                {...props}
            />
            <svg
                className="absolute w-3 h-3 left-[3px] pointer-events-none hidden peer-checked:block text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    );
};
