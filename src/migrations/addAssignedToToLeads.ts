import { sequelize } from '../config/db';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up() {
  try {
    await sequelize.getQueryInterface().addColumn('leads', 'assignedTo', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log('✅ Added assignedTo column to leads table');
  } catch (error) {
    console.error('❌ Failed to add assignedTo column:', error);
    throw error;
  }
}

export async function down() {
  try {
    await sequelize.getQueryInterface().removeColumn('leads', 'assignedTo');
    console.log('✅ Removed assignedTo column from leads table');
  } catch (error) {
    console.error('❌ Failed to remove assignedTo column:', error);
    throw error;
  }
}

// Run the migration directly
if (require.main === module) {
  up().then(() => {
    console.log('Migration completed successfully');
    process.exit(0);
  }).catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
}
// npx ts-node src/migrations/addEmailRecipients.ts to run migrations