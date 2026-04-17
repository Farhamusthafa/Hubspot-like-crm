import { User } from '../models/user.model';

export class DataValidationService {
  // Validate user data
  static validateUserData(userData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields validation
    const requiredFields = ['firstName', 'lastName', 'email', 'password'];
    for (const field of requiredFields) {
      if (!userData[field] || userData[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    }

    // Email validation
    if (userData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        errors.push('Invalid email format');
      }
    }

    // Password validation
    if (userData.password) {
      if (userData.password.length < 6) {
        errors.push('Password must be at least 6 characters long');
      }
      if (!/(?=.*[a-z])/.test(userData.password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(userData.password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(userData.password)) {
        errors.push('Password must contain at least one number');
      }
    }

    // Phone validation (optional)
    if (userData.phone && userData.phone.trim() !== '') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(userData.phone)) {
        errors.push('Invalid phone number format');
      }
    }

    // Role validation
    if (userData.role && !['Admin', 'User'].includes(userData.role)) {
      errors.push('Invalid role. Must be Admin or User');
    }

    // Status validation
    if (userData.status && !['Active', 'Disabled'].includes(userData.status)) {
      errors.push('Invalid status. Must be Active or Disabled');
    }

    // Name validation
    if (userData.firstName && userData.firstName.length > 50) {
      errors.push('First name must be less than 50 characters');
    }
    if (userData.lastName && userData.lastName.length > 50) {
      errors.push('Last name must be less than 50 characters');
    }

    // Company name validation (optional)
    if (userData.companyName && userData.companyName.length > 100) {
      errors.push('Company name must be less than 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sanitize user data
  static sanitizeUserData(userData: any): any {
    const sanitized: any = {};

    // Sanitize string fields
    const sanitizeString = (str: string): string => {
      return str
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    };

    // Sanitize each field
    if (userData.firstName) {
      sanitized.firstName = sanitizeString(userData.firstName);
    }
    if (userData.lastName) {
      sanitized.lastName = sanitizeString(userData.lastName);
    }
    if (userData.email) {
      sanitized.email = sanitizeString(userData.email).toLowerCase();
    }
    if (userData.password) {
      sanitized.password = userData.password; // Don't sanitize password
    }
    if (userData.phone) {
      sanitized.phone = sanitizeString(userData.phone);
    }
    if (userData.companyName) {
      sanitized.companyName = sanitizeString(userData.companyName);
    }
    if (userData.industryType) {
      sanitized.industryType = sanitizeString(userData.industryType);
    }
    if (userData.countryRegion) {
      sanitized.countryRegion = sanitizeString(userData.countryRegion);
    }
    if (userData.gender) {
      sanitized.gender = sanitizeString(userData.gender);
    }
    if (userData.role) {
      sanitized.role = userData.role; // Enum, no sanitization needed
    }
    if (userData.status) {
      sanitized.status = userData.status; // Enum, no sanitization needed
    }

    // Handle boolean fields
    sanitized.emailNotifications = Boolean(userData.emailNotifications);
    sanitized.twoFactorAuth = Boolean(userData.twoFactorAuth);
    sanitized.publicProfile = Boolean(userData.publicProfile);

    return sanitized;
  }

  // Check for duplicate email
  static async checkDuplicateEmail(email: string, excludeId?: number): Promise<boolean> {
    try {
      const whereClause: any = { email: email.toLowerCase() };
      if (excludeId) {
        whereClause.id = { [require('sequelize').Op.ne]: excludeId };
      }

      const existingUser = await User.findOne({ where: whereClause });
      return !!existingUser;
    } catch (error) {
      console.error('Error checking duplicate email:', error);
      return false;
    }
  }

  // Validate user update data
  static validateUpdateData(userData: any, userId: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // For updates, password is optional
    const requiredFields = ['firstName', 'lastName', 'email'];
    for (const field of requiredFields) {
      if (!userData[field] || userData[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    }

    // If password is provided, validate it
    if (userData.password && userData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    // Other validations
    const validation = this.validateUserData(userData);
    errors.push(...validation.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Data integrity check
  static async performDataIntegrityCheck(): Promise<{
    isValid: boolean;
    issues: string[];
    stats: any
  }> {
    const issues: string[] = [];
    const stats = {
      totalUsers: 0,
      activeUsers: 0,
      adminUsers: 0,
      usersWithInvalidEmail: 0,
      usersWithWeakPassword: 0
    };

    try {
      // Get all users
      const users = await User.findAll();
      stats.totalUsers = users.length;

      for (const user of users) {
        // Check active users
        if (user.status === 'Active') {
          stats.activeUsers++;
        }

        // Check admin users
        if (user.role === 'Admin') {
          stats.adminUsers++;
        }

        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
          issues.push(`User ${user.id} has invalid email: ${user.email}`);
          stats.usersWithInvalidEmail++;
        }

        // Check password strength (for new users, we can't check existing hashed passwords)
        // This would be more relevant during user creation/update
      }

      // Check for duplicate emails
      const emails = users.map(u => u.email.toLowerCase());
      const uniqueEmails = new Set(emails);
      if (emails.length !== uniqueEmails.size) {
        issues.push('Duplicate emails found in database');
      }

      // Check if there's at least one admin
      if (stats.adminUsers === 0) {
        issues.push('No admin users found in database');
      }

      return {
        isValid: issues.length === 0,
        issues,
        stats
      };
    } catch (error) {
      console.error('Data integrity check failed:', error);
      issues.push('Data integrity check failed due to system error');
      return {
        isValid: false,
        issues,
        stats
      };
    }
  }

  // Generate data report
  static async generateDataReport(): Promise<any> {
    try {
      const users = await User.findAll();

      const report = {
        timestamp: new Date().toISOString(),
        summary: {
          totalUsers: users.length,
          activeUsers: users.filter(u => u.status === 'Active').length,
          disabledUsers: users.filter(u => u.status === 'Disabled').length,
          adminUsers: users.filter(u => u.role === 'Admin').length,
          regularUsers: users.filter(u => u.role === 'User').length
        },
        usersByRole: {
          Admin: users.filter(u => u.role === 'Admin').length,
          User: users.filter(u => u.role === 'User').length
        },
        usersByStatus: {
          Active: users.filter(u => u.status === 'Active').length,
          Disabled: users.filter(u => u.status === 'Disabled').length
        },
        recentUsers: users
          .sort((a, b) => new Date((b as any).createdAt || 0).getTime() - new Date((a as any).createdAt || 0).getTime())
          .slice(0, 5)
          .map(u => ({
            id: u.id,
            name: `${u.firstName} ${u.lastName}`,
            email: u.email,
            role: u.role,
            status: u.status,
            createdAt: (u as any).createdAt
          }))
      };

      return report;
    } catch (error) {
      console.error('Failed to generate data report:', error);
      throw error;
    }
  }
}
