import { sequelize } from '../config/db';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up() {
  try {
    await sequelize.getQueryInterface().addColumn('deals', 'leadId', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    console.log('✅ Added leadId column to deals table');
  } catch (error) {
    console.error('❌ Failed to add leadId column:', error);
    throw error;
  }
}

export async function down() {
  try {
    await sequelize.getQueryInterface().removeColumn('deals', 'leadId');
    console.log('✅ Removed leadId column from deals table');
  } catch (error) {
    console.error('❌ Failed to remove leadId column:', error);
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
// npx ts-node src/migrations/addLeadIdToDeals.ts to run migrations