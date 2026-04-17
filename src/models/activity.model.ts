import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

export class Activity extends Model {

public type!: "note" | "email" | "call" | "task" | "meeting";
public title?: string;

public subject?: string;
public description?: string
public body?: string;
public status!: "logged" | "sent" | "failed" | "pending" | "scheduled" | "completed" | "created"

public entityType!: string;
public entityId!: string;
// public relatedLeadId?: string;
// public relatedDealId?: string;
// public relatedCompanyId?: string;
// public relatedTicketId?: string;
public recipients?: string[];
public recipientName?: string;
public createdBy!: string;
public createdAt!: Date;
public updatedAt!: Date;
}             

Activity.init(
  {
    type: {
      type: DataTypes.ENUM("note", "email", "call", "task", "meeting"),
      allowNull: false,
    },
  title: DataTypes.STRING,        // for task / meeting
  subject: DataTypes.STRING,      // for email
   description: DataTypes.TEXT,    // for note / call / task
  body: DataTypes.TEXT,           // for email body
recipients: {
  type: DataTypes.STRING, // or TEXT if multiple emails
},
recipientName: DataTypes.STRING,
status: {
  type: DataTypes.ENUM(
    "Logged",       // email created
    "Sent",
    "Failed",
    "Pending",      // task
    "Scheduled",    // meeting
    "Completed",    // call
    "Created"       // note
  ),
  allowNull: false
},
  entityType: DataTypes.STRING,
  entityId: DataTypes.STRING
  ,
    // attachments: {
    //   type: DataTypes.JSON, // array of attachment URLs or IDs
    //   allowNull: true,
    // },

    // Relations
    // relatedLeadId: DataTypes.STRING,
    // relatedDealId: DataTypes.STRING,
    // relatedCompanyId: DataTypes.STRING,
    // relatedTicketId: DataTypes.STRING,

    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Activity",
  }
);
