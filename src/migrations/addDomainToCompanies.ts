import { sequelize } from '../config/db';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up() {
  try {
    await sequelize.getQueryInterface().addColumn('companies', 'domain', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    console.log('✅ Added domain column to companies table');
  } catch (error) {
    console.error('❌ Failed to add domain column:', error);
    throw error;
  }
}

export async function down() {
  try {
    await sequelize.getQueryInterface().removeColumn('companies', 'domain');
    console.log('✅ Removed domain column from companies table');
  } catch (error) {
    console.error('❌ Failed to remove domain column:', error);
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
