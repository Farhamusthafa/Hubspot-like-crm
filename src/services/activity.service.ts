import { Activity } from "../models/activity.model";
import { Attachment } from "../models/attachment.model";
import { Deal } from "../models/deal.model";
import { Lead } from "../models/lead.model";
import { Ticket } from "../models/ticket.model";
import { EmailService } from "./email.service";
import Company from "../models/company.model";

type EntityType = "lead" | "deal" | "company" | "ticket";
type ActivityType = "note" | "email" | "call" | "task" | "meeting";

export class ActivityService {

  private emailService = new EmailService();

  /**
   * Ensure activity belongs to exactly ONE entity
   */

  /**
   * Create Activity with Type Switch
   */


async createActivity(data: any) {

  if (!data.entityType || !data.entityId) {
    throw new Error("entityType and entityId are required");
  }

  switch (data.type as ActivityType) {

    case "email":
      data.status = "Logged";

      try {
        await this.handleEmailActivity(data);
        data.status = "Sent";
      } catch (error) {
        data.status = "Failed";
      }
      break;

    case "task":
      data.status = "Pending";
      break;

    case "meeting":
      data.status = "Scheduled";
      break;

    case "call":
      data.status = "Completed";
      break;

    case "note":
      data.status = "Created";
      break;

    default:
      throw new Error("Invalid activity type");
  }

  return await Activity.create(data);
}
  /**
   * Universal Get Activities
   */

  private async handleEmailActivity(data: any) {

  let recipientEmail: string | string[] | null = null;
  let recipientName: string | null = null;

  // ✅ priority: frontend input
if (data.to) {
  recipientEmail = data.to;
} else {
  // fallback to auto-detection

  switch (data.entityType) {

    case "lead":
      const lead = await Lead.findByPk(data.entityId);
      recipientEmail = lead?.email || null;
      recipientName = lead?.name || null;
      console.log("📧 Sending email to:", recipientEmail,recipientName);
      break;

    case "deal":
      const deal = await Deal.findByPk(data.entityId, {
     include: [{ model: Lead, as: 'lead' }]
    });
      recipientName = deal?.name || null;
      recipientEmail = deal?.lead?.email || null;
      break;

    case "company":
      const company = await Company.findByPk(data.entityId, {
       include: [Lead]
        });
      if (!company) {
       throw new Error("Company not found");
      }
      recipientName = company?.name || null;
      recipientEmail = company.leads?.map(l => l.email).filter(Boolean) || [];
      break;

    case "ticket":
    const ticket = await Ticket.findByPk(data.entityId, {
     include: [{ model: Lead, as: 'lead' }]
    });
     recipientName = ticket?.title || null;
     recipientEmail = ticket?.lead?.email || null;
      break;
  }
}

  if (!recipientEmail) {
    throw new Error("Recipient email not found");
  }

  // const attachments = await Attachment.findAll({
  //   where: { activityId: data.activityId }
  // });

// 👇 assign recipients
 // ✅ 3. ALWAYS convert to array
  const recipients = Array.isArray(recipientEmail)
    ? recipientEmail
    : [recipientEmail];
     // ✅ assign to data (IMPORTANT)
  data.recipientName = recipientName || "client";
  data.recipients = recipients.join(", ");

  // ✅ modify body BEFORE sending
  data.body = `<p>Hi ${data.recipientName},</p>` + data.body;


  console.log("📧 Final recipients:", recipients);


  await this.emailService.sendEmail({
    to: recipients,
    subject: data.subject,
    body: data.body,
    recipientName:recipientName
    // attachments: attachments.map(file => ({
    //   filename: file.fileName,
    //   path: file.fileUrl
    //}))
  });
  

}


 async getActivities(
  entityType: EntityType,
  entityId: string,
  activityType?: string,
  companyId?: number
) {

  if (!entityType || !entityId) {
    throw new Error("entityType and entityId required");
  }

  let whereCondition: any = {
    entityType,
    entityId,
    //companyId
  };

  if (activityType) {
    whereCondition.type = activityType;
  }

  return await Activity.findAll({
    where: whereCondition,
    //include: [Attachment],
    order: [["createdAt", "DESC"]],
  });
}

  async getActivityById(id: string) {
    return await Activity.findByPk(id, 
      //{include: [Attachment],}
    );
  }

  async updateActivity(id: string, data: any) {
    await Activity.update(data, { where: { id } });
    return await this.getActivityById(id);
  }

  async deleteActivity(id: string) {
    return await Activity.destroy({ where: { id } });
  }
  }