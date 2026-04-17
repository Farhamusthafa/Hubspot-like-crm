import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { BaseEntity, EntityType } from "./base.model";

export class Attachment extends BaseEntity {
  public filename!: string;
  public originalName!: string;
  public mimeType!: string;
  public size!: number;
  public path!: string;
  public uploadedBy!: number;
}

Attachment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    entityType: {
      type: DataTypes.ENUM("company", "lead", "deal", "ticket"),
      allowNull: false,
    },
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: true, // Make it nullable to avoid foreign key constraint issues
      defaultValue: null, // Set default to null to avoid foreign key issues
    },
  },
  {
    sequelize,
    tableName: "attachments",
    timestamps: true,
  }
);

export default Attachment;
