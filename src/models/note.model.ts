import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { BaseEntity, EntityType } from "./base.model";

export class Note extends BaseEntity {
  public content!: string;
}


Note.init(
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
      type: DataTypes.INTEGER, // Postgres does NOT support UNSIGNED
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "notes",
    timestamps: true,
  }
);

export default Note;