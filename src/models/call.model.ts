import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { BaseEntity } from "./base.model";

export class Call extends BaseEntity {
    public subject!: string;
    public duration!: string | null;
    public description!: string | null;
    public outcome!: string;
}

Call.init(
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
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        outcome: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "calls",
        timestamps: true,
    }
);

export default Call;
