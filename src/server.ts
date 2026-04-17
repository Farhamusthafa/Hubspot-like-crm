import app from "./app";
import { sequelize } from "./config/db";
import { backupService } from "./services/backup.service";
import { backupScheduler } from "./services/backupScheduler.service";
import { checkDatabaseHealth } from "./middleware/dataSafety.middleware";

const PORT = process.env.PORT || 5000;

// Initialize server with data safety measures
async function initializeServer() {
  try {
    // Check database health first
    console.log('🔍 Checking database health...');
    const isHealthy = await checkDatabaseHealth();

    if (!isHealthy) {
      console.error('❌ Database health check failed. Server startup aborted.');
      process.exit(1);
    }

    // Sync database (safe mode - preserve existing data)
    console.log('🔄 Syncing database...');
    await sequelize.sync({ force: false });
    console.log("✅ Database connected and synced");

    // Create initial backup if no backups exist
    console.log('📦 Checking for existing backups...');
    const existingBackups = await backupService.listBackups();

    if (existingBackups.length === 0) {
      console.log('📦 Creating initial backup...');
      const initialBackup = await backupService.createFullBackup();
      console.log(`✅ Initial backup created: ${initialBackup}`);
    } else {
      console.log(`📦 Found ${existingBackups.length} existing backups`);
    }

    // Start automated backup scheduler
    console.log('🕐 Starting backup scheduler...');
    backupScheduler.startAutomatedBackups();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
      console.log('📊 Data Safety Features Enabled:');
      console.log('  - Automated backups (every 24 hours)');
      console.log('  - Incremental backups (every hour)');
      console.log('  - Data integrity checks (every 6 hours)');
      console.log('  - Input validation and sanitization');
      console.log('  - Admin protection (cannot delete last admin)');
      console.log('  - Emergency backup on data issues');

      // Display backup statistics
      const stats = backupService.getBackupStats();
      console.log(`📈 Backup Statistics:`);
      console.log(`  - Total backups: ${stats.totalBackups}`);
      console.log(`  - Total size: ${stats.totalSize}`);
      console.log(`  - Newest: ${stats.newest}`);
      console.log(`  - Oldest: ${stats.oldest}`);
    });

  } catch (error) {
    console.error('❌ Failed to initialize server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');

  // Stop backup scheduler
  backupScheduler.stopAutomatedBackups();

  // Create final backup
  try {
    console.log('📦 Creating final backup before shutdown...');
    await backupService.createFullBackup();
    console.log('✅ Final backup created');
  } catch (error) {
    console.error('❌ Failed to create final backup:', error);
  }

  // Close database connection
  try {
    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Failed to close database:', error);
  }

  console.log('👋 Server shut down complete');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
  console.error('💥 Uncaught exception:', error);

  try {
    console.log('🚨 Creating emergency backup...');
    await backupService.createFullBackup();
    console.log('✅ Emergency backup created');
  } catch (backupError) {
    console.error('❌ Emergency backup failed:', backupError);
  }

  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  console.error('💥 Unhandled promise rejection:', reason);

  try {
    console.log('🚨 Creating emergency backup...');
    await backupService.createFullBackup();
    console.log('✅ Emergency backup created');
  } catch (backupError) {
    console.error('❌ Emergency backup failed:', backupError);
  }

  process.exit(1);
});

// Start the server
initializeServer();