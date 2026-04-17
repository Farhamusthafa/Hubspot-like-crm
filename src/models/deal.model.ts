import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./user.model";
import { Lead } from "./lead.model";
import Company from "./company.model";

export type DealWithOwner = Deal & {
  dealowner?: { id: number; name: string } | null;
};
export class Deal extends Model {
  public id!: number;
  public name!: string;
  public stage!: string;
  public closeDate!: Date;
  public owner!: number;
  public amount!: number;
  //public lead?: Lead //optional association to Lead
  public companyId?: number;
  public leadId?: number
}

Deal.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    stage: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    closeDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    owner: {
      type: DataTypes.INTEGER,
      allowNull: false,
        references: {
        model: User, // table name
        key: "id",
      },
    },

      companyId: {
        type: DataTypes.INTEGER,
        allowNull: true,
         references: {
        model: Company, // table name
        key: "id",
      },
    },

    leadId: {
      type: DataTypes.INTEGER,
      allowNull: true,
        references: {
        model: Lead, // table name
        key: "id",
      },
    },

    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "deals",
    timestamps: true, // createdAt & updatedAt
  }
);

export default Deal;