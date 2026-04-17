/**
 * Module Components Barrel Export
 * 
 * Provides convenient exports for all module-related components.
 * Import from '@/components/module' instead of individual files.
 */

export { default as ModuleHeader } from './ModuleHeader';
export type { ModuleHeaderProps, ModuleButton } from './ModuleHeader';

export { default as SearchInput } from './SearchInput';
export type { SearchInputProps } from './SearchInput';

export { default as Pagination } from './Pagination';
export type { PaginationProps } from './Pagination';

/**
 * Usage Examples:
 * 
 * // Import everything you need from one place
 * import ModuleHeader, { SearchInput, Pagination } from '@/components/module';
 * import type { ModuleHeaderProps, ModuleButton } from '@/components/module';
 */
