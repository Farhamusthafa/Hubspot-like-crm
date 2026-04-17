'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import { PermissionsService } from '@/lib/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: keyof import('@/lib/permissions').UserPermissions;
  adminOnly?: boolean;
  redirectTo?: string;
  showWarning?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  adminOnly = false,
  redirectTo = '/dashboard',
  showWarning = true,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthorization = () => {
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

      if (!token || !userStr) {
        router.push('/login');
        return;
      }

      // Check admin-only access
      if (adminOnly && !PermissionsService.isAdmin()) {
        if (showWarning) {
          enqueueSnackbar('⚠️ Access Denied: This feature is only available for administrators', {
            variant: 'warning',
            autoHideDuration: 4000,
          });
        }
        router.push(redirectTo);
        return;
      }

      // Check specific permission
      if (requiredPermission && !PermissionsService.can(requiredPermission)) {
        if (showWarning) {
          const permissionMessages: Record<string, string> = {
            canViewAllUsers: '⚠️ Access Denied: You cannot view user management',
            canCreateUsers: '⚠️ Access Denied: You cannot create users',
            canUpdateUsers: '⚠️ Access Denied: You cannot update users',
            canDeleteUsers: '⚠️ Access Denied: You cannot delete users',
            canViewAllLeads: '⚠️ Access Denied: You cannot view all leads',
            canDeleteOtherLeads: '⚠️ Access Denied: You cannot delete other users\' leads',
            canViewAllDeals: '⚠️ Access Denied: You cannot view all deals',
            canDeleteOtherDeals: '⚠️ Access Denied: You cannot delete other users\' deals',
            canAccessAdminDashboard: '⚠️ Access Denied: Admin dashboard access required',
            canChangeSystemSettings: '⚠️ Access Denied: System settings access required',
          };

          const message = permissionMessages[requiredPermission] || '⚠️ Access Denied: You do not have permission to access this feature';

          enqueueSnackbar(message, {
            variant: 'warning',
            autoHideDuration: 4000,
          });
        }
        router.push(redirectTo);
        return;
      }

      setIsAuthorized(true);
    };

    checkAuthorization();
  }, [router, requiredPermission, adminOnly, redirectTo, showWarning, enqueueSnackbar]);

  if (isAuthorized === null) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
};

// Higher-order component for protecting pages
export const withProtection = (
  Component: React.ComponentType,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) => {
  return function ProtectedComponent(props: any) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};
