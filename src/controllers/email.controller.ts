import { Request, Response } from "express";
import { EmailService } from "../services/email.service";

export class EmailController {
  private service = new EmailService();

  createEmail = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const { subject, content, recipients } = req.body;

    const email = await this.service.createEmail(entityType, entityId, subject, content, recipients);
    res.status(201).json(email);
  };

  getEmails = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);

    const emails = await this.service.getEmails(entityType, entityId);
    res.json(emails);
  };

  getEmailById = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const emailId = Number(req.params.emailId);

    const email = await this.service.getEmailById(entityType, entityId, emailId);
    if (!email) return res.status(404).json({ message: "Email not found" });

    res.json(email);
  };

  updateEmail = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const emailId = Number(req.params.emailId);
    const updates = req.body;

    const updated = await this.service.updateEmail(entityType, entityId, emailId, updates);
    if (!updated) return res.status(404).json({ message: "Email not found" });

    res.json(updated);
  };

  deleteEmail = async (req: Request, res: Response) => {
    const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
    const entityId = Number(req.params.entityId);
    const emailId = Number(req.params.emailId);

    await this.service.deleteEmail(entityType, entityId, emailId);
    res.json({ message: "Email deleted successfully" });
  };
}