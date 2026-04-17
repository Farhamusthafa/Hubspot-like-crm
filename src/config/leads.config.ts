/**
 * Leads Module Configuration
 * 
 * Defines the header configuration and actions for the Leads page.
 * Used to initialize ModuleHeader component with module-specific settings.
 */

import { ModuleButton } from '@/components/module/ModuleHeader';

export interface LeadsConfig {
  title: string;
  searchPlaceholder: string;
  buttons: ModuleButton[];
}

/**
 * Create default leads config with callback handlers
 * 
 * @param handlers - Object containing handler functions for module actions
 * @returns LeadsConfig object ready to be passed to ModuleHeader
 */
export const createLeadsConfig = (handlers: {
  onImport: () => void;
  onCreate: () => void;
}): LeadsConfig => ({
  title: 'Leads',
  searchPlaceholder: 'Search phone, name, email',
  buttons: [
    {
      id: 'import-leads',
      label: 'Import',
      variant: 'secondary',
      onClick: handlers.onImport,
    },
    {
      id: 'create-lead',
      label: 'Create',
      variant: 'primary',
      onClick: handlers.onCreate,
    },
  ],
});

/**
 * Example usage in a component:
 * 
 * const leadsConfig = createLeadsConfig({
 *   onImport: () => console.log('Import clicked'),
 *   onCreate: () => console.log('Create clicked'),
 * });
 * 
 * <ModuleHeader
 *   {...leadsConfig}
 *   searchValue={search}
 *   onSearchChange={setSearch}
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={setCurrentPage}
 * />
 */
