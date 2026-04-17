import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import Company from "./company.model";
import { Lead } from "./lead.model";

export class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public phone!: string | null;
  public companyName!: string | null;
  public companyId!: number | null;
  //  public leadId?: number;
  public industryType!: string | null;
  public countryRegion!: string | null;
  public gender!: string | null;
  public emailNotifications!: boolean;
  public twoFactorAuth!: boolean;
  public publicProfile!: boolean;
  public role!: "Admin" | "User";
  public status!: "Active" | "Disabled";
  public resetOtp!: string | null;
  public resetOtpExpiry!: Date | null;
  public profileImage!: string | null;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,

    phone: DataTypes.STRING,
    companyName: DataTypes.STRING,
    industryType: DataTypes.STRING,
    countryRegion: DataTypes.STRING,
    gender: DataTypes.STRING,

    emailNotifications: { type: DataTypes.BOOLEAN, defaultValue: true },
    twoFactorAuth: { type: DataTypes.BOOLEAN, defaultValue: false },
    publicProfile: { type: DataTypes.BOOLEAN, defaultValue: true },

    role: {
      type: DataTypes.ENUM("Admin", "User"),
      defaultValue: "User",
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Company,
        key: "id",
      },
    },
    // leadId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: Lead,
    //     key: "id",
    //   },  
    // },
    status: {
      type: DataTypes.ENUM("Active", "Disabled"),
      defaultValue: "Active",
    },

    resetOtp: {
      
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetOtpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "users",
  }
);