import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { BaseEntity } from "./base.model";

export class Email extends BaseEntity {
  public subject!: string;
  public content!: string;
  public recipients!: string[];
  public sentAt?: Date;
}

Email.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    entityType: { type: DataTypes.ENUM("company", "lead", "deal", "ticket"), allowNull: false },
    entityId: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: false },
    recipients: { type: DataTypes.JSON, allowNull: false }, // array of emails
    sentAt: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    tableName: "emails",
    timestamps: true,
  }
);

export default Email;