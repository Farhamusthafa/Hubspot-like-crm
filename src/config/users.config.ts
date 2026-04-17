import { ModuleButton } from '@/components/module/ModuleHeader';

export interface UsersConfig {
  title: string;
  searchPlaceholder: string;
  buttons: ModuleButton[];
}

interface CreateUsersConfigProps {
  onCreate: () => void;
  onImport?: () => void;
}

export const createUsersConfig = ({ onCreate, onImport }: CreateUsersConfigProps): UsersConfig => ({
  title: 'User Management',
  searchPlaceholder: 'Search by name or email...',
  buttons: [
    ...(onImport ? [{
      id: 'import-users',
      label: 'Import',
      variant: 'secondary' as const,
      onClick: onImport,
    }] : []),
    {
      id: 'create-user',
      label: '+ Create User',
      variant: 'primary' as const,
      onClick: onCreate,
    },
  ],
});
