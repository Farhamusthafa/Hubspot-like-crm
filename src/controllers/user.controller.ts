import { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { DataValidationService } from '../services/dataValidation.service';
import { backupService } from '../services/backup.service';
import { UserRepository } from '../repositories/user.repository';


export class UserController {
  
  // Get all users
  static async getAllUsers(req: Request, res: Response) {
    try {
      // if (!req.query.companyId) {
      //  return res.status(400).json({ message: "companyId is required" });
      // }
      const companyId = req.query.companyId?Number(req.query.companyId): undefined;
      const userRepository = new UserRepository();
      const users = await userRepository.findAll(companyId);
      res.json(users);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  }

  // Get user by ID
  static async getUserById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  }

  // Create user
  static async createUser(req: Request, res: Response) {
    try {
      // Validate input data
      const validation = DataValidationService.validateUserData(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Sanitize input data
      const sanitizedData = DataValidationService.sanitizeUserData(req.body);

      // Check for duplicate email
      const emailExists = await DataValidationService.checkDuplicateEmail(sanitizedData.email);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const { password, ...userData } = sanitizedData;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        ...userData,
        password: hashedPassword
      });

      // Log user creation
      console.log(`✅ User created: ${user.email} (${user.role})`);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toJSON();
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      console.error('Failed to create user:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  }

  // Update user
  static async updateUser(req: Request, res: Response) {
    try {
      const userId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);

      // Validate input data
      const validation = DataValidationService.validateUpdateData(req.body, userId);
      if (!validation.isValid) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Sanitize input data
      const sanitizedData = DataValidationService.sanitizeUserData(req.body);

      // Check for duplicate email (excluding current user)
      const emailExists = await DataValidationService.checkDuplicateEmail(sanitizedData.email, userId);
      if (emailExists) {
        return res.status(400).json({ message: 'Email already exists' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const { password, ...updateData } = sanitizedData;

      // Hash password if provided
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await user.update(updateData);

      // Log user update
      console.log(`✅ User updated: ${user.email}`);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toJSON();
      res.json(userWithoutPassword);
    } catch (error: any) {
      console.error('Failed to update user:', error);
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email already exists' });
      }
      res.status(500).json({ message: 'Failed to update user' });
    }
  }

  // Delete user
  static async deleteUser(req: Request, res: Response) {
    try {
      console.log('🗑️ Delete user request received:', {
        params: req.params,
        user: (req as any).user,
        headers: req.headers
      });

      const userId = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
      console.log('🗑️ Parsed userId:', userId);

      if (isNaN(userId)) {
        console.log('🗑️ Invalid userId format');
        return res.status(400).json({ message: 'Invalid user ID format' });
      }

      const user = await User.findByPk(userId);
      console.log('🗑️ Found user:', user ? { id: user.id, email: user.email, role: user.role } : null);

      if (!user) {
        console.log('🗑️ User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent deletion of the last admin
      if (user.role === 'Admin') {
        const adminCount = await User.count({ where: { role: 'Admin' } });
        console.log('🗑️ Admin count:', adminCount);
        if (adminCount <= 1) {
          console.log('🗑️ Cannot delete last admin');
          return res.status(400).json({
            message: 'Cannot delete the last admin user'
          });
        }
      }

      // Create backup before deletion (commented out for debugging)
      // await backupService.createIncrementalBackup();

      const userEmail = user.email;
      await user.destroy();
      console.log('🗑️ User destroyed successfully:', userEmail);

      // Log user deletion
      console.log(`🗑️ User deleted: ${userEmail}`);

      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      console.error('🗑️ Failed to delete user:', error);
      console.error('🗑️ Error stack:', error.stack);
      res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
  }

  // Toggle user status
  static async toggleUserStatus(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent disabling the last admin
      if (user.role === 'Admin' && user.status === 'Active') {
        const activeAdminCount = await User.count({
          where: { role: 'Admin', status: 'Active' }
        });
        if (activeAdminCount <= 1) {
          return res.status(400).json({
            message: 'Cannot disable the last active admin user'
          });
        }
      }

      const newStatus = user.status === 'Active' ? 'Disabled' : 'Active';
      await user.update({ status: newStatus });

      // Log status change
      console.log(`🔄 User status changed: ${user.email} -> ${newStatus}`);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user.toJSON();
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Failed to toggle user status:', error);
      res.status(500).json({ message: 'Failed to toggle user status' });
    }
  }

  // Data integrity check endpoint
  static async dataIntegrityCheck(req: Request, res: Response) {
    try {
      const result = await DataValidationService.performDataIntegrityCheck();
      res.json(result);
    } catch (error) {
      console.error('Data integrity check failed:', error);
      res.status(500).json({ message: 'Data integrity check failed' });
    }
  }

  // Generate data report
  static async generateDataReport(req: Request, res: Response) {
    try {
      const report = await DataValidationService.generateDataReport();
      res.json(report);
    } catch (error) {
      console.error('Failed to generate data report:', error);
      res.status(500).json({ message: 'Failed to generate data report' });
    }
  }

  // Create backup
  static async createBackup(req: Request, res: Response) {
    try {
      const backupFile = await backupService.createFullBackup();
      res.json({
        message: 'Backup created successfully',
        backupFile
      });
    } catch (error) {
      console.error('Failed to create backup:', error);
      res.status(500).json({ message: 'Failed to create backup' });
    }
  }

  // List backups
  static async listBackups(req: Request, res: Response) {
    try {
      const backups = backupService.listBackups();
      const stats = backupService.getBackupStats();
      res.json({ backups, stats });
    } catch (error) {
      console.error('Failed to list backups:', error);
      res.status(500).json({ message: 'Failed to list backups' });
    }
  }
}
