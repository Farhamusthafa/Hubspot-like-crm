import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { BaseEntity } from "./base.model";

export class Task extends BaseEntity {
    public title!: string;
    public description!: string | null;
    public dueDate!: Date;
    public priority!: "Low" | "Medium" | "High";
    public status!: "Upcoming" | "Completed" | "Overdue";
}

Task.init(
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
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        priority: {
            type: DataTypes.ENUM("Low", "Medium", "High"),
            defaultValue: "Medium",
        },
        status: {
            type: DataTypes.ENUM("Upcoming", "Completed", "Overdue"),
            defaultValue: "Upcoming",
        },
    },
    {
        sequelize,
        tableName: "tasks",
        timestamps: true,
    }
);

export default Task;
