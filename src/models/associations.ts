import { User } from "./user.model";
import { Lead } from "./lead.model";
import { Attachment } from "./attachment.model";
import Company from "./company.model";
import Deal from "./deal.model";
import {Ticket } from "./ticket.model";

export const setupAssociations = () => {
    // User - Lead Association
    User.hasMany(Lead, { foreignKey: 'assignedToId', as: 'leads' });
    Lead.belongsTo(User, { foreignKey: 'assignedToId', as: 'assignedUser' });

    // User - Attachment Association
    User.hasMany(Attachment, { foreignKey: 'uploadedBy', as: 'attachments' });
    Attachment.belongsTo(User, { foreignKey: 'uploadedBy', as: 'uploader' });

    Company.hasMany(Lead, { foreignKey: 'companyId', as: 'companyLeads' });
    Lead.belongsTo(Company, { foreignKey: 'companyId', as: 'leadcompany' });
    // // We can add more as needed

    Company.hasMany(User, { foreignKey: 'companyId', as: 'companyUsers' });
    User.belongsTo(Company, { foreignKey: 'companyId', as: 'usercompany' });

    User.hasMany(Deal, {
  foreignKey: "owner",
  as: "deals",//must be plural
});

Deal.belongsTo(User, {
  foreignKey: "owner",
  as: "dealowner",//must be singular
});

  // Deal model
Deal.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead'  });

// Lead model
Lead.hasMany(Deal, { foreignKey: 'leadId' , as: 'deals' });

Deal.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });
Company.hasMany(Deal, { foreignKey: 'companyId', as: 'deals' });  

Ticket.belongsTo(Lead, { foreignKey: 'leadId', as: 'lead' });
Lead.hasMany(Ticket, { foreignKey: 'leadId' , as: 'ticket' });

};
