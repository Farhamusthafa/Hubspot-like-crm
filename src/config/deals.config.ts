import { ModuleButton } from '@/components/module/ModuleHeader';

/**
 * Interface for Deals configuration
 */
export interface DealsConfig {
  title: string;
  searchPlaceholder: string;
  buttons: ModuleButton[];
}

/**
 * Create deals config with strict typing
 */
export const createDealsConfig = (handlers: {
  onImport: () => void;
  onCreate: () => void;
}): DealsConfig => ({
  title: 'Deals',
  searchPlaceholder: 'Search phone, name, city',
  buttons: [
    {
      id: 'import-deals',
      label: 'Import',
      variant: 'secondary' as const, // Fixes "Type string is not assignable"
      onClick: handlers.onImport,
    },
    {
      id: 'create-deal',
      label: 'Create',
      variant: 'primary' as const, // Fixes "Type string is not assignable"
      onClick: handlers.onCreate,
    },
  ],
});