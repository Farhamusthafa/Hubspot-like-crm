import { ModuleButton } from '@/components/module/ModuleHeader';

/**
 * Interface for Tickets configuration
 */
export interface TicketsConfig {
  title: string;
  searchPlaceholder: string;
  buttons: ModuleButton[];
}

/**
 * Create tickets config with strict typing
 */
export const createTicketsConfig = (handlers: {
  onImport: () => void;
  onCreate: () => void;
}): TicketsConfig => ({
  title: 'Tickets',
  searchPlaceholder: 'Search phone, name, city',
  buttons: [
    {
      id: 'import-tickets',
      label: 'Import',
      variant: 'secondary' as const,
      onClick: handlers.onImport,
    },
    {
      id: 'create-ticket',
      label: 'Create',
      variant: 'primary' as const,
      onClick: handlers.onCreate,
    },
  ],
});