import { sequelize } from '../config/db';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up() {
  try {
    await sequelize.getQueryInterface().addColumn('Activities', 'recipients', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log('✅ Added recipients column to activities table');
  } catch (error) {
    console.error('❌ Failed to add recipients column to activities:', error);
    throw error;
  }
}

export async function down() {
  try {
    await sequelize.getQueryInterface().removeColumn('leads', 'assignedTo');
    console.log('✅ Removed recipients column from activities table');
  } catch (error) {
    console.error('❌ Failed to remove recipients column :', error);
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
