import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
//'New' | 'Contacted' | 'Open' | 'Inprogress' | 'Converted' | 'Lost' | 'Qualified'
interface LeadAttributes {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  companyId?: number;
  jobTitle?: string;
  status: string;
  value?: number;
  source?: string;
  assignedTo?: string;
  assignedToId?: number;
  lastContact?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface LeadCreationAttributes extends Optional<LeadAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

export class Lead extends Model<LeadAttributes, LeadCreationAttributes> implements LeadAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public phone?: string;
  public company?: string;
  public companyId?: number;
  public jobTitle?: string;
  public status!: string;
  public value?: number;
  public source?: string;
  public assignedTo?: string;
  public assignedToId?: number;
  public lastContact?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lead.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
        companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'New',
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedToId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    lastContact: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Lead',
    tableName: 'leads',
    timestamps: true,
  }
);
