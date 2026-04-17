import React from 'react';

interface PageLayoutProps {
    children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-full bg-gray-50 flex flex-col">
            {children}
        </div>
    );
};
