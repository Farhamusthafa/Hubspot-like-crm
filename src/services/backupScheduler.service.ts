import { backupService } from '../services/backup.service';
import { DataValidationService } from '../services/dataValidation.service';

export class BackupScheduler {
  private backupInterval: NodeJS.Timeout | null = null;
  private integrityCheckInterval: NodeJS.Timeout | null = null;

  // Start automated backups
  startAutomatedBackups() {
    console.log('🕐 Starting automated backup scheduler...');

    // Create full backup every 24 hours
    this.backupInterval = setInterval(async () => {
      try {
        console.log('📦 Creating scheduled full backup...');
        const backupFile = await backupService.createFullBackup();
        console.log(`✅ Scheduled backup created: ${backupFile}`);
        
        // Clean old backups
        await backupService.cleanOldBackups();
        console.log('🗑️ Old backups cleaned up');
      } catch (error) {
        console.error('❌ Scheduled backup failed:', error);
      }
    }, 24 * 60 * 60 * 1000); // 24 hours

    // Create incremental backup every hour
    const incrementalInterval = setInterval(async () => {
      try {
        console.log('📦 Creating scheduled incremental backup...');
        const backupFile = await backupService.createIncrementalBackup();
        console.log(`✅ Incremental backup created: ${backupFile}`);
      } catch (error) {
        console.error('❌ Incremental backup failed:', error);
      }
    }, 60 * 60 * 1000); // 1 hour

    // Perform data integrity check every 6 hours
    this.integrityCheckInterval = setInterval(async () => {
      try {
        console.log('🔍 Performing scheduled data integrity check...');
        const result = await DataValidationService.performDataIntegrityCheck();
        
        if (result.isValid) {
          console.log('✅ Data integrity check passed');
        } else {
          console.error('❌ Data integrity issues found:', result.issues);
          
          // Create emergency backup if issues found
          console.log('🚨 Creating emergency backup due to integrity issues...');
          await backupService.createFullBackup();
        }
      } catch (error) {
        console.error('❌ Data integrity check failed:', error);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    console.log('✅ Automated backup scheduler started');
    console.log('📅 Full backups: Every 24 hours');
    console.log('📅 Incremental backups: Every hour');
    console.log('📅 Integrity checks: Every 6 hours');
  }

  // Stop automated backups
  stopAutomatedBackups() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
      console.log('⏹️ Automated backups stopped');
    }

    if (this.integrityCheckInterval) {
      clearInterval(this.integrityCheckInterval);
      this.integrityCheckInterval = null;
      console.log('⏹️ Integrity checks stopped');
    }
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.backupInterval !== null,
      fullBackupInterval: '24 hours',
      incrementalBackupInterval: '1 hour',
      integrityCheckInterval: '6 hours'
    };
  }

  // Create immediate backup
  async createImmediateBackup(type: 'full' | 'incremental' = 'full') {
    try {
      console.log(`📦 Creating immediate ${type} backup...`);
      
      const backupFile = type === 'full' 
        ? await backupService.createFullBackup()
        : await backupService.createIncrementalBackup();
      
      console.log(`✅ Immediate ${type} backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      console.error(`❌ Immediate ${type} backup failed:`, error);
      throw error;
    }
  }

  // Perform immediate integrity check
  async performImmediateIntegrityCheck() {
    try {
      console.log('🔍 Performing immediate data integrity check...');
      const result = await DataValidationService.performDataIntegrityCheck();
      
      if (result.isValid) {
        console.log('✅ Data integrity check passed');
      } else {
        console.error('❌ Data integrity issues found:', result.issues);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Data integrity check failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const backupScheduler = new BackupScheduler();
