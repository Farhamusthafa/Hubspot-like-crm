import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { Lead } from "./lead.model";

export class Ticket extends Model {
    public id!: number;
    public title!: string;
    public description!: string | null;
    public status!: 'Waiting on contact' | 'Waiting on us' | 'New' | 'Closed';
    public source!: 'Chat' | 'Email' | 'Phone';
    public priority!: 'High' | 'Medium' | 'Low' | 'Critical';
    public companyName!: string | null;
    public dealName!: string | null;
    public owner!: string | null;
    public lead!:Lead
    public createdAt!: Date;
    public updatedAt!: Date;
}

Ticket.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.TEXT },
        status: {
            type: DataTypes.ENUM('Waiting on contact', 'Waiting on us', 'New', 'Closed'),
            defaultValue: 'New',
        },
        source: {
            type: DataTypes.ENUM('Chat', 'Email', 'Phone'),
        },
        priority: {
            type: DataTypes.ENUM('High', 'Medium', 'Low', 'Critical'),
            defaultValue: 'Medium',
        },
        companyName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dealName: {
            type: DataTypes.STRING,
            allowNull: true,
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
        tableName: "tickets",
        timestamps: true
    }
);