import { sequelize } from '../config/db';
import { QueryInterface, DataTypes } from 'sequelize';

export async function up() {
  try {
    await sequelize.getQueryInterface().addColumn('users', 'companyId', {
      type: DataTypes.INTEGER,
      allowNull: true,
    });
    console.log('✅ Added companyId column to users table');
  } catch (error) {
    console.error('❌ Failed to add companyId column:', error);
    throw error;
  }
}

export async function down() {
  try {
    await sequelize.getQueryInterface().removeColumn('users', 'companyId');
    console.log('✅ Removed companyId column from users table');
  } catch (error) {
    console.error('❌ Failed to remove companyId column:', error);
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
