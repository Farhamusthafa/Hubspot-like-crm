import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DrawerWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    width?: string;
}

export const DrawerWrapper: React.FC<DrawerWrapperProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    width = '507px'
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden font-lexend">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-[1px] transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Container */}
            <div
                className="relative bg-white shadow-2xl flex flex-col h-full animate-slide-in-right border-l border-gray-100"
                style={{ width }}
            >
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#F2F4F7] flex items-center justify-between shrink-0">
                    <h2 className="text-[20px] font-semibold text-[#101828]">
                        {title}
                    </h2>
                    <button onClick={onClose} className="text-[#667085] hover:text-gray-800 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 pt-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-8 py-6 border-t border-[#F2F4F7] flex justify-center gap-4 bg-white shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
