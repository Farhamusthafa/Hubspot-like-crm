import Email from "../models/email.model";
import { BaseRepository } from "../repositories/base.repository";
import { sendEmail } from "../utils/sendEmail";
import nodemailer from "nodemailer";

export class EmailService {
  private repo = new BaseRepository<Email>(Email);

   private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendEmail(data: {
    to: string | string[];
    subject: string;
    body: string;
    recipientName: string | null ;
    //  attachments?: any[];
  }) {

    
    await this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: data.to,
      subject: data.subject,
      html: data.body,
    });
     console.log("🚀 sendEmail called", data.to, data.subject ,data.body,data.recipientName);
    return true;
  }




  async createEmail(entityType: string, entityId: number, subject: string, content: string, recipients: string[]) {
    // First, save the email to the database
    const emailRecord = await this.repo.create({ entityType, entityId, subject, content, recipients });

    try {
      // Then, actually send the email
      await sendEmail(recipients, subject, content);

      // Update the email record to mark as sent
      await this.repo.update(entityType, entityId, emailRecord.id, {
        sentAt: new Date()
      });

      console.log(`Email successfully sent to ${recipients.join(', ')}`);
      return emailRecord;
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Still return the email record even if sending failed
      // You might want to add a 'status' field to track sent/failed emails
      return emailRecord;
    }
  }

  getEmails(entityType: string, entityId: number) {
    return this.repo.findByEntity(entityType, entityId);
  }

  getEmailById(entityType: string, entityId: number, id: number) {
    return this.repo.findById(entityType, entityId, id);
  }

  updateEmail(entityType: string, entityId: number, id: number, updates: Partial<Email>) {
    return this.repo.update(entityType, entityId, id, updates);
  }

  deleteEmail(entityType: string, entityId: number, id: number) {
    return this.repo.delete(entityType, entityId, id);
  }
}