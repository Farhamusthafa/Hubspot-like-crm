import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { BaseEntity } from "./base.model";

export class Meeting extends BaseEntity {
    public title!: string;
    public description!: string | null;
    public date!: Date;
    public duration!: string;
    public attendees!: string;
}

Meeting.init(
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
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        attendees: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: "meetings",
        timestamps: true,
    }
);

export default Meeting;
