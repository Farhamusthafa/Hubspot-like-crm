import React from 'react';

interface ClickableNameProps {
    name: string;
    onClick?: () => void;
    className?: string;
}

export const ClickableName: React.FC<ClickableNameProps> = ({ name, onClick, className = '' }) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`text-[15px] font-lexend font-[400] text-gray-900 cursor-pointer hover:text-gray-600 transition ${className}`}
        >
            {name}
        </button>
    );
};
