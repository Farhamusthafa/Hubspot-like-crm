import React from 'react';

interface DetailsLayoutProps {
    title: string;
    id: string;
    children?: React.ReactNode;
}

export const DetailsLayout: React.FC<DetailsLayoutProps> = ({ title, id, children }) => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            <p className="mb-4">ID: {id}</p>
            {children}
        </div>
    );
};
