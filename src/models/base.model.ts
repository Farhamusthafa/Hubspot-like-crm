import { Model } from "sequelize";

export type EntityType = "company" | "lead" | "deal" | "ticket" ;

export class BaseEntity extends Model {
  public id!: number;
  public entityType!: EntityType;
  public entityId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}