import { sequelize } from '../config/db';
import fs from 'fs';
import path from 'path';

// Import all models to ensure they are registered
import '../models/lead.model';
import '../models/company.model';
import '../models/deal.model';
import '../models/ticket.model';
import '../models/note.model';
import '../models/task.model';
import '../models/meeting.model';
import '../models/email.model';
import '../models/call.model';
import '../models/user.model';
import '../models/attachment.model';

export const backupDatabase = async () => {
  try {
    console.log('Starting database backup...');

    // Get all models
    const models = sequelize.models;
    const backupData: any = {};

    // Backup each model's data
    for (const modelName in models) {
      const model = models[modelName];
      if (model.tableName && model.tableName !== 'sequelize') {
        const records = await model.findAll({ raw: true });
        backupData[model.tableName] = records;
        console.log(`Backed up ${records.length} records from ${model.tableName}`);
      }
    }

    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Save backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`);

    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    console.log(`Database backup saved to: ${backupFile}`);

    return backupFile;
  } catch (error) {
    console.error('Database backup failed:', error);
    throw error;
  }
};

export const restoreDatabase = async (backupFile: string) => {
  try {
    console.log('Starting database restore...');

    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    const models = sequelize.models;

    // Restore each model's data
    for (const tableName in backupData) {
      const records = backupData[tableName];
      const model = Object.values(models).find((m: any) => m.tableName === tableName);

      if (model && records.length > 0) {
        // Clear existing data
        await model.destroy({ where: {}, force: true });

        // Restore data
        await model.bulkCreate(records);
        console.log(`Restored ${records.length} records to ${tableName}`);
      }
    }

    console.log('Database restore completed successfully');
  } catch (error) {
    console.error('Database restore failed:', error);
    throw error;
  }
};
