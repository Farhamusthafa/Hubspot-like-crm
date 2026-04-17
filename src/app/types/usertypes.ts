export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'Admin' | 'User'; // Support both formats
  status: 'Active' | 'Disabled';
  createdAt: string;
  profileImage?: string;
  phone?: string;
  companyName?: string;
  industryType?: string;
  countryRegion?: string;
  gender?: string;
  emailNotifications?: boolean;
  twoFactorAuth?: boolean;
  publicProfile?: boolean;
}
