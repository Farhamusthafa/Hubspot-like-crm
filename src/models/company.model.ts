import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { Lead } from "./lead.model";

export class Company extends Model {
  public id!: number;
  public name!: string;
  public industry!: 'Technology' | 'Finance' | 'Healthcare' | 'Education' | 'Legal service';
  public type!: 'Public' | 'Private' | 'Government' | 'Non-Profit';
 // public status!: 'New' | 'Contacted' | 'Open' | 'Inprogress' | 'Won' | 'Lost' | 'Qualified';
  public domain?: string | null;
  public city!: string | null;
  public country!: string | null;
  public employees!: number | null;
  public annualRevenue!: number | null;
  public phone!: string;
  public owner!: string | null;
  public leads!: Lead[];
  public createdAt!: Date;
  public updatedAt!: Date;
}

Company.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    industry: {
      type: DataTypes.ENUM('Technology', 'Finance', 'Healthcare', 'Education', 'Legal service'),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('Public', 'Private', 'Government', 'Non-Profit'),
      allowNull: false,
    },
    // status: {
    //   type: DataTypes.ENUM('New', 'Contacted', 'Open', 'Inprogress', 'Won', 'Lost', 'Qualified'),
    //   allowNull: false,
    //   defaultValue: 'New',
    // },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    domain: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    employees: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    annualRevenue: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "companies",
    timestamps: true,
  }
);

export default Company;
