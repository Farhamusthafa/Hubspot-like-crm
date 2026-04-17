import { sequelize } from '../config/db';
import fs from 'fs';
import path from 'path';

export class BackupService {
  private backupDir: string;

  constructor() {
    this.backupDir = path.join(__dirname, '../../backups');
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${this.backupDir}`);
    }
  }

  // Create full database backup
  async createFullBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `full-backup-${timestamp}.json`);

      console.log('📦 Creating full database backup...');

      // Backup all tables
      const [users] = await sequelize.query('SELECT * FROM users');
      
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: {
          users: users
        },
        metadata: {
          totalUsers: Array.isArray(users) ? users.length : 0,
          backupType: 'full',
          createdBy: 'system'
        }
      };

      fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
      console.log(`✅ Full backup created: ${backupFile}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Failed to create full backup:', error);
      throw error;
    }
  }

  // Create incremental backup (only changed data)
  async createIncrementalBackup(): Promise<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(this.backupDir, `incremental-backup-${timestamp}.json`);

      console.log('📦 Creating incremental backup...');

      // Get users created/updated in the last hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const [recentUsers] = await sequelize.query(
        'SELECT * FROM users WHERE createdAt > ? OR updatedAt > ?',
        {
          replacements: [oneHourAgo, oneHourAgo],
          type: 'SELECT'
        }
      );

      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        tables: {
          users: recentUsers
        },
        metadata: {
          totalUsers: Array.isArray(recentUsers) ? recentUsers.length : 0,
          backupType: 'incremental',
          timeRange: {
            from: oneHourAgo.toISOString(),
            to: new Date().toISOString()
          },
          createdBy: 'system'
        }
      };

      fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
      console.log(`✅ Incremental backup created: ${backupFile}`);
      
      return backupFile;
    } catch (error) {
      console.error('❌ Failed to create incremental backup:', error);
      throw error;
    }
  }

  // List all available backups
  listBackups(): Array<{ filename: string; size: string; date: string }> {
    try {
      const files = fs.readdirSync(this.backupDir);
      const backups = files
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(this.backupDir, file);
          const stats = fs.statSync(filePath);
          return {
            filename: file,
            size: `${(stats.size / 1024).toFixed(2)} KB`,
            date: stats.mtime.toISOString()
          };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return backups;
    } catch (error) {
      console.error('❌ Failed to list backups:', error);
      return [];
    }
  }

  // Restore from backup
  async restoreFromBackup(backupFile: string): Promise<void> {
    try {
      console.log(`🔄 Restoring from backup: ${backupFile}`);
      
      const filePath = path.join(this.backupDir, backupFile);
      const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Validate backup format
      if (!backupData.tables || !backupData.tables.users) {
        throw new Error('Invalid backup format');
      }

      console.log(`📊 Backup contains ${backupData.tables.users.length} users`);

      // Start transaction
      const transaction = await sequelize.transaction();

      try {
        // Clear existing data (be careful with this in production!)
        console.log('⚠️  Clearing existing users table...');
        await sequelize.query('DELETE FROM users', { transaction });

        // Restore users
        console.log('🔄 Restoring users...');
        for (const user of backupData.tables.users) {
          await sequelize.query(`
            INSERT INTO users (
              id, firstName, lastName, email, password, phone, companyName, 
              industryType, countryRegion, gender, emailNotifications, 
              twoFactorAuth, publicProfile, role, status, resetOtp, 
              resetOtpExpiry, profileImage, createdAt, updatedAt
            ) VALUES (
              :id, :firstName, :lastName, :email, :password, :phone, :companyName,
              :industryType, :countryRegion, :gender, :emailNotifications,
              :twoFactorAuth, :publicProfile, :role, :status, :resetOtp,
              :resetOtpExpiry, :profileImage, :createdAt, :updatedAt
            )
          `, {
            replacements: user,
            transaction
          });
        }

        // Commit transaction
        await transaction.commit();
        console.log('✅ Data restored successfully');
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    } catch (error) {
      console.error('❌ Failed to restore from backup:', error);
      throw error;
    }
  }

  // Clean old backups (keep only last 10)
  async cleanOldBackups(): Promise<void> {
    try {
      const backups = this.listBackups();
      
      if (backups.length > 10) {
        const backupsToDelete = backups.slice(10);
        
        console.log(`🗑️  Cleaning up ${backupsToDelete.length} old backups...`);
        
        for (const backup of backupsToDelete) {
          const filePath = path.join(this.backupDir, backup.filename);
          fs.unlinkSync(filePath);
          console.log(`🗑️  Deleted: ${backup.filename}`);
        }
      }
    } catch (error) {
      console.error('❌ Failed to clean old backups:', error);
    }
  }

  // Get backup statistics
  getBackupStats(): { totalBackups: number; totalSize: string; oldest: string; newest: string } {
    try {
      const backups = this.listBackups();
      const totalSize = backups.reduce((sum, backup) => {
        return sum + parseFloat(backup.size);
      }, 0);

      return {
        totalBackups: backups.length,
        totalSize: `${totalSize.toFixed(2)} KB`,
        oldest: backups.length > 0 ? backups[backups.length - 1].date : 'N/A',
        newest: backups.length > 0 ? backups[0].date : 'N/A'
      };
    } catch (error) {
      console.error('❌ Failed to get backup stats:', error);
      return {
        totalBackups: 0,
        totalSize: '0 KB',
        oldest: 'N/A',
        newest: 'N/A'
      };
    }
  }
}

// Export singleton instance
export const backupService = new BackupService();
