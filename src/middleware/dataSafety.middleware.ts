import { Request, Response, NextFunction } from 'express';
import { sequelize } from '../config/db';

// Data safety middleware for backup and validation
export const dataSafetyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Skip for non-modifying operations
  if (['GET', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  try {
    // Create backup before destructive operations
    if (['DELETE', 'PUT'].includes(req.method)) {
      await createDataBackup(req);
    }

    // Validate data integrity for write operations
    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      await validateDataIntegrity(req);
    }

    next();
  } catch (error) {
    console.error('Data safety middleware error:', error);
    res.status(500).json({ 
      message: 'Data safety check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create data backup before destructive operations
const createDataBackup = async (req: Request) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {
      timestamp,
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      user: (req as any).user?.id || 'anonymous'
    };

    // Store backup in database (you could also store in files)
    console.log(`📦 Data backup created for ${req.method} ${req.url}`, backupData);
    
    // TODO: Store backups in a dedicated backup table or file system
    // For now, we'll just log it
  } catch (error) {
    console.error('Failed to create data backup:', error);
  }
};

// Validate data integrity
const validateDataIntegrity = async (req: Request) => {
  try {
    // Check if required fields are present and valid
    const { body } = req;
    
    if (!body || typeof body !== 'object') {
      throw new Error('Invalid request body');
    }

    // Validate email format for user operations
    if (req.url.includes('/users') && body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        throw new Error('Invalid email format');
      }
    }

    // Validate password strength for user creation
    if (req.url.includes('/users') && req.method === 'POST' && body.password) {
      if (body.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
    }

    // Validate role enum values
    if (body.role && !['Admin', 'User'].includes(body.role)) {
      throw new Error('Invalid role. Must be Admin or User');
    }

    // Validate status enum values
    if (body.status && !['Active', 'Disabled'].includes(body.status)) {
      throw new Error('Invalid status. Must be Active or Disabled');
    }

    console.log('✅ Data integrity validation passed');
  } catch (error) {
    console.error('❌ Data integrity validation failed:', error);
    throw error;
  }
};

// Database connection health check
export const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection healthy');
    
    // Test basic query
    await sequelize.query('SELECT 1');
    console.log('✅ Database query test passed');
    
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
};

// Emergency data backup function
export const emergencyBackup = async () => {
  try {
    const timestamp = new Date().toISOString();
    
    // Backup all users
    const users = await sequelize.query('SELECT * FROM users', {
      type: 'SELECT'
    });
    
    const backup = {
      timestamp,
      users,
      totalUsers: users.length
    };
    
    // Save backup to file (in production, use proper backup storage)
    const fs = require('fs');
    const path = require('path');
    const backupDir = path.join(__dirname, '../../backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    const backupFile = path.join(backupDir, `emergency-backup-${timestamp.replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
    
    console.log(`🚨 Emergency backup created: ${backupFile}`);
    return backupFile;
  } catch (error) {
    console.error('❌ Emergency backup failed:', error);
    throw error;
  }
};

// Data recovery function
export const recoverData = async (backupFile: string) => {
  try {
    const fs = require('fs');
    const backup = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    
    console.log(`🔄 Recovering data from backup: ${backupFile}`);
    console.log(`Backup timestamp: ${backup.timestamp}`);
    console.log(`Users in backup: ${backup.totalUsers}`);
    
    // In a real recovery scenario, you would restore the data
    // For now, we'll just validate the backup
    if (backup.users && Array.isArray(backup.users)) {
      console.log('✅ Backup data validated');
      return backup;
    } else {
      throw new Error('Invalid backup format');
    }
  } catch (error) {
    console.error('❌ Data recovery failed:', error);
    throw error;
  }
};

// Data sanitization middleware
export const sanitizeData = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Remove potentially harmful content
    if (req.body) {
      // Sanitize string fields to prevent XSS
      const sanitizeString = (str: string) => {
        return str
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      };

      // Recursively sanitize object
      const sanitizeObject = (obj: any): any => {
        if (typeof obj === 'string') {
          return sanitizeString(obj);
        } else if (Array.isArray(obj)) {
          return obj.map(sanitizeObject);
        } else if (obj && typeof obj === 'object') {
          const sanitized: any = {};
          for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
          }
          return sanitized;
        }
        return obj;
      };

      req.body = sanitizeObject(req.body);
    }

    next();
  } catch (error) {
    console.error('Data sanitization error:', error);
    next();
  }
};
