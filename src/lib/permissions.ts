// User role-based access control system

export type UserRole = 'Admin' | 'User';

export interface UserPermissions {
  canViewAllUsers: boolean;
  canCreateUsers: boolean;
  canUpdateUsers: boolean;
  canDeleteUsers: boolean;
  canViewAllLeads: boolean;
  canCreateLeads: boolean;
  canUpdateOwnLeads: boolean;
  canDeleteOwnLeads: boolean;
  canDeleteOtherLeads: boolean;
  canViewAllDeals: boolean;
  canCreateDeals: boolean;
  canUpdateOwnDeals: boolean;
  canDeleteOwnDeals: boolean;
  canDeleteOtherDeals: boolean;
  canAddActivities: boolean;
  canViewPerformanceReport: boolean;
  canAccessAdminDashboard: boolean;
  canChangeSystemSettings: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  Admin: {
    canViewAllUsers: true,
    canCreateUsers: true,
    canUpdateUsers: true,
    canDeleteUsers: true,
    canViewAllLeads: true,
    canCreateLeads: true,
    canUpdateOwnLeads: true,
    canDeleteOwnLeads: true,
    canDeleteOtherLeads: true,
    canViewAllDeals: true,
    canCreateDeals: true,
    canUpdateOwnDeals: true,
    canDeleteOwnDeals: true,
    canDeleteOtherDeals: true,
    canAddActivities: true,
    canViewPerformanceReport: true,
    canAccessAdminDashboard: true,
    canChangeSystemSettings: true,
  },
  User: {
    canViewAllUsers: false,
    canCreateUsers: false,
    canUpdateUsers: false,
    canDeleteUsers: false,
    canViewAllLeads: false,
    canCreateLeads: true,
    canUpdateOwnLeads: true,
    canDeleteOwnLeads: true,
    canDeleteOtherLeads: false,
    canViewAllDeals: false,
    canCreateDeals: true,
    canUpdateOwnDeals: true,
    canDeleteOwnDeals: true,
    canDeleteOtherDeals: false,
    canAddActivities: true,
    canViewPerformanceReport: true,
    canAccessAdminDashboard: false,
    canChangeSystemSettings: false,
  },
};

export class PermissionsService {
  private static getUserRole(): UserRole | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.role as UserRole;
    } catch {
      return null;
    }
  }

  private static getUserId(): string | null {
    if (typeof window === 'undefined') return null;
    
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      const user = JSON.parse(userStr);
      return user.id;
    } catch {
      return null;
    }
  }

  static getPermissions(): UserPermissions {
    const role = this.getUserRole();
    if (!role) {
      // Default to least privileged if no role is found
      return ROLE_PERMISSIONS.User;
    }
    return ROLE_PERMISSIONS[role];
  }

  static isAdmin(): boolean {
    return this.getUserRole() === 'Admin';
  }

  static isNormalUser(): boolean {
    return this.getUserRole() === 'User';
  }

  static can(permission: keyof UserPermissions): boolean {
    const permissions = this.getPermissions();
    return permissions[permission];
  }

  static canAccessRoute(route: string): boolean {
    const permissions = this.getPermissions();
    
    // Admin-only routes
    const adminRoutes = ['/dashboard/users', '/admin'];
    if (adminRoutes.some(adminRoute => route.startsWith(adminRoute))) {
      return permissions.canAccessAdminDashboard;
    }
    
    // All authenticated users can access these routes
    const userRoutes = ['/dashboard', '/leads', '/deals', '/activities', '/profile'];
    if (userRoutes.some(userRoute => route.startsWith(userRoute))) {
      return true;
    }
    
    return false;
  }

  static canViewUserData(userId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can view all users
    if (permissions.canViewAllUsers) {
      return true;
    }
    
    // Users can only view their own data
    return currentUserId === userId;
  }

  static canUpdateUserData(userId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can update all users
    if (permissions.canUpdateUsers) {
      return true;
    }
    
    // Users can only update their own data
    return currentUserId === userId;
  }

  static canDeleteUserData(userId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can delete all users
    if (permissions.canDeleteUsers) {
      return true;
    }
    
    // Users cannot delete other users (including themselves)
    return false;
  }

  static canViewLeadData(leadOwnerId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can view all leads
    if (permissions.canViewAllLeads) {
      return true;
    }
    
    // Users can only view their own leads
    return currentUserId === leadOwnerId;
  }

  static canUpdateLeadData(leadOwnerId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can update all leads
    if (permissions.canViewAllLeads) {
      return true;
    }
    
    // Users can only update their own leads
    return currentUserId === leadOwnerId;
  }

  static canDeleteLeadData(leadOwnerId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can delete all leads
    if (permissions.canDeleteOtherLeads) {
      return true;
    }
    
    // Users can only delete their own leads
    return currentUserId === leadOwnerId && permissions.canDeleteOwnLeads;
  }

  static canViewDealData(dealOwnerId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can view all deals
    if (permissions.canViewAllDeals) {
      return true;
    }
    
    // Users can only view their own deals
    return currentUserId === dealOwnerId;
  }

  static canUpdateDealData(dealOwnerId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can update all deals
    if (permissions.canViewAllDeals) {
      return true;
    }
    
    // Users can only update their own deals
    return currentUserId === dealOwnerId;
  }

  static canDeleteDealData(dealOwnerId: string): boolean {
    const currentUserId = this.getUserId();
    const permissions = this.getPermissions();
    
    // Admin can delete all deals
    if (permissions.canDeleteOtherDeals) {
      return true;
    }
    
    // Users can only delete their own deals
    return currentUserId === dealOwnerId && permissions.canDeleteOwnDeals;
  }
}

// React hook for permissions
export const usePermissions = () => {
  return {
    permissions: PermissionsService.getPermissions(),
    isAdmin: PermissionsService.isAdmin(),
    isNormalUser: PermissionsService.isNormalUser(),
    can: (permission: keyof UserPermissions) => PermissionsService.can(permission),
    canAccessRoute: (route: string) => PermissionsService.canAccessRoute(route),
    canViewUserData: (userId: string) => PermissionsService.canViewUserData(userId),
    canUpdateUserData: (userId: string) => PermissionsService.canUpdateUserData(userId),
    canDeleteUserData: (userId: string) => PermissionsService.canDeleteUserData(userId),
    canViewLeadData: (leadOwnerId: string) => PermissionsService.canViewLeadData(leadOwnerId),
    canUpdateLeadData: (leadOwnerId: string) => PermissionsService.canUpdateLeadData(leadOwnerId),
    canDeleteLeadData: (leadOwnerId: string) => PermissionsService.canDeleteLeadData(leadOwnerId),
    canViewDealData: (dealOwnerId: string) => PermissionsService.canViewDealData(dealOwnerId),
    canUpdateDealData: (dealOwnerId: string) => PermissionsService.canUpdateDealData(dealOwnerId),
    canDeleteDealData: (dealOwnerId: string) => PermissionsService.canDeleteDealData(dealOwnerId),
  };
};
