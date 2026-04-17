import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./user.model";

export class Notification extends Model {
    public id!: number;
    public userId!: number;
    public title!: string;
    public message!: string;
    public type!: 'info' | 'success' | 'warning' | 'error';
    public read!: boolean;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Notification.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id',
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('info', 'success', 'warning', 'error'),
            defaultValue: 'info',
        },
        read: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize,
        tableName: "notifications",
    }
);

User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });
