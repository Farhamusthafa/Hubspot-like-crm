import { ModuleButton } from '@/components/module/ModuleHeader';

// 1. Add this interface so it can be exported
export interface CompaniesConfig {
  title: string;
  searchPlaceholder: string;
  buttons: ModuleButton[];
}

export const createCompaniesConfig = (handlers: {
  onImport: () => void;
  onCreate: () => void;
}): CompaniesConfig => ({ // 2. Add the type here
  title: 'Companies',
  searchPlaceholder: 'Search phone, name, city',
  buttons: [
    {
      id: 'import-companies',
      label: 'Import',
      variant: 'secondary' as const, // 3. Add 'as const' here
      onClick: handlers.onImport,
    },
    {
      id: 'create-company',
      label: 'Create',
      variant: 'primary' as const, // 3. Add 'as const' here
      onClick: handlers.onCreate,
    },
  ],
});