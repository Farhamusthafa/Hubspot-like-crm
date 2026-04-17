import React from 'react';

interface StatusBadgeProps {
    status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Open':
                return 'bg-emerald-100 text-emerald-700';
            case 'Inprogress':
                return 'bg-amber-100 text-amber-700';
            case 'Qualified':
                return 'bg-orange-100 text-orange-700';
            case 'Won':
                return 'bg-emerald-100 text-emerald-800';
            case 'Lost':
                return 'bg-rose-100 text-rose-700';
            case 'New':
            case 'Contacted':
                return 'bg-blue-100 text-blue-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <button
            type="button"
            className={`w-[80px] py-2 rounded-lg text-[13px] font-medium transition-all hover:opacity-80 flex justify-center items-center mx-auto ${getStatusStyles(
                status
            )}`}
        >
            {status}
        </button>
    );
};
