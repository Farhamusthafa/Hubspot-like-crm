"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from '../common/Checkbox';
import { ClickableName } from '../common/ClickableName';

export interface ColumnDef<T = any> {
    key: string;
    label: string;
    render?: (row: T) => React.ReactNode;
    className?: string;
}

export interface FilterDef {
    key: string;
    label: string;
    type: 'select' | 'date';
    options?: { value: string; label: string }[];
    getValue?: (item: any) => string;
}

interface DataTableProps<T extends { id: string }> {
    columns: ColumnDef<T>[];
    data: T[];
    filters?: FilterDef[];
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
    onAdd?: () => void; // Callback to open create form
    nameColumn?: string; // Which column should be clickable name
    detailRoute?: string; // Base route for detail pages, e.g., '/dashboard/leads'
    emptyMessage?: string; // Message to show when no data
    getRowClassName?: (item: T) => string;
}

export function DataTable<T extends { id: string }>({
    columns,
    data,
    filters = [],
    onEdit,
    onDelete,
    onAdd,
    nameColumn,
    detailRoute,
    emptyMessage = "No data found",
    getRowClassName
}: DataTableProps<T>) {
    const router = useRouter();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filterValues, setFilterValues] = useState<Record<string, string>>({});

    // Apply filters
    const filteredData = data.filter(item => {
        return filters.every(filter => {
            const filterValue = filterValues[filter.key];
            if (!filterValue) return true;

            if (filter.type === 'date') {
                const itemValue = filter.getValue ? filter.getValue(item) : (item as any)[filter.key];
                return new Date(itemValue).toLocaleDateString('en-CA') === filterValue;
            } else {
                const itemValue = filter.getValue ? filter.getValue(item) : (item as any)[filter.key];
                // return itemValue === filterValue;
                //added for company filter by leads
                if (Array.isArray(itemValue)) {
                return itemValue.includes(filterValue);
                }

                return itemValue === filterValue;
            }
        });
    });

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredData.length && filteredData.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredData.map(item => item.id));
        }
    };

    const toggleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(i => i !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilterValues(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full bg-white rounded-b-xl border-x border-t border-gray-200 flex flex-col">
            {/* Filters */}
            {filters.length > 0 && (
                <div className="w-full px-[33px] pt-[24px] pb-[14px] flex flex-wrap gap-3 bg-white border-t border-gray-100">
                    {filters.map(filter => (
                        <div key={filter.key} className="relative">
                            {filter.type === 'select' ? (
                                <select
                                    value={filterValues[filter.key] || ''}
                                    onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                    className="px-4 py-[10px] border border-gray-200 rounded-lg text-gray-700 font-inter text-[14px] font-[400] bg-white outline-none w-44 appearance-none"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                                        backgroundPosition: 'right 0.75rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em'
                                    }}
                                >
                                    <option value="">{filter.label}</option>
                                    {filter.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <div className="relative w-48">
                                    <input
                                        type={filterValues[filter.key] ? "date" : "text"}
                                        value={filterValues[filter.key] || ''}
                                        onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                                        onFocus={(e) => (e.target.type = "date")}
                                        onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                                        placeholder={filter.label}
                                        className="px-4 py-[10px] border border-gray-200 rounded-lg text-gray-700 font-inter text-[14px] font-[400] bg-white outline-none w-full placeholder:text-gray-400"
                                        style={{
                                            paddingRight: '2.5rem',
                                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'/%3E%3C/svg%3E")`,
                                            backgroundPosition: 'right 0.75rem center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: '1.25em 1.25em'
                                        }}
                                    />
                                    <style jsx>{`
                                        input[type="date"]::-webkit-calendar-picker-indicator {
                                            opacity: 0;
                                            position: absolute;
                                            right: 0;
                                            width: 100%;
                                            height: 100%;
                                            cursor: pointer;
                                        }
                                    `}</style>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Table */}
            <div className="w-full px-8 pb-6 bg-white flex flex-col flex-1">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#5948DB] text-white sticky top-0 z-10">
                            <tr>
                                <th className="px-5 py-3.5 text-left first:rounded-tl-lg">
                                    <div className="relative flex items-center">
                                        <input
                                            type="checkbox"
                                            className="peer appearance-none w-[18px] h-[18px] border border-white rounded-md bg-[#5948DB] checked:bg-[#4a3ea3] transition-all cursor-pointer"
                                            checked={selectedItems.length > 0 && selectedItems.length === filteredData.length}
                                            onChange={toggleSelectAll}
                                        />
                                        <svg className="absolute w-3 h-3 left-[3px] pointer-events-none hidden peer-checked:block text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                    </div>
                                </th>
                                {columns.map(col => (
                                    <th key={col.key} className={`px-5 py-3.5 font-lexend text-[13px] font-[400] leading-[20px] uppercase tracking-wider text-left ${col.className || ''}`}>
                                        {col.label}
                                    </th>
                                ))}
                                <th className="px-5 py-3.5 font-lexend text-[13px] font-[400] leading-[20px] uppercase tracking-wider text-center last:rounded-tr-lg">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredData.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 2} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2">
                                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                                            </div>
                                            <p className="text-[#667085] font-lexend text-[16px] font-[500]">{emptyMessage}</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item.id} className={`hover:bg-gray-50/50 transition border-b border-gray-100 ${getRowClassName ? getRowClassName(item) : ''}`}>
                                        <td className="px-5 py-3.5 whitespace-nowrap">
                                            <Checkbox
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => toggleSelectItem(item.id)}
                                            />
                                        </td>
                                        {columns.map(col => {
                                            const isNameColumn = nameColumn && col.key === nameColumn;
                                            const cellContent = col.render ? col.render(item) : (item as any)[col.key];

                                            return (
                                                <td key={col.key} className={`px-5 py-3.5 whitespace-nowrap ${col.className || ''}`}>
                                                    {isNameColumn && detailRoute ? (
                                                        <ClickableName
                                                            name={cellContent as string}
                                                            onClick={() => router.push(`${detailRoute}/${item.id}`)}
                                                        />
                                                    ) : (
                                                        <div className="text-[14px] font-lexend font-[400] text-[#374151]">
                                                            {cellContent}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        <td className="px-5 py-3.5 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center justify-center gap-3">
                                                <button type="button" onClick={() => onEdit(item)} className="hover:opacity-80 transition-opacity p-1" title="Edit">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25Z" fill="#5948DB" /><path d="M20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="#5948DB" /><rect x="10" y="11" width="4" height="1.5" rx="0.75" transform="rotate(-45 10 11)" fill="white" /></svg>
                                                </button>
                                                <button type="button" onClick={() => onDelete(item.id)} className="hover:opacity-80 transition-opacity p-1" title="Delete">
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19Z" fill="#FF4444" /><path d="M19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="#FF4444" /><rect x="9" y="10" width="1.5" height="8" rx="0.75" fill="white" /><rect x="13.5" y="10" width="1.5" height="8" rx="0.75" fill="white" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
