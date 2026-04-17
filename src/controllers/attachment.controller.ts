import { Request, Response } from "express";
import { Attachment } from "../models/attachment.model";
import { uploadAttachment } from "../middleware/attachment-upload.middleware";
import path from "path";
import fs from "fs";

export class AttachmentController {
  static async upload(req: Request, res: Response) {
    try {
      const { entityType, entityId } = req.params;
      const uploadedBy = (req as any).user?.id || null; // Default to null to avoid foreign key issues

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const attachment = await Attachment.create({
        entityType,
        entityId: parseInt(entityId as string),
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        uploadedBy,
      });

      res.status(201).json(attachment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async getByEntity(req: Request, res: Response) {
    try {
      const { entityType, entityId } = req.params;

      const attachments = await Attachment.findAll({
        where: {
          entityType,
          entityId: parseInt(entityId as string),
        },
        order: [['createdAt', 'DESC']],
      });

      res.status(200).json(attachments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async download(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const attachment = await Attachment.findByPk(parseInt(id as string));
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }

      const filePath = path.resolve(attachment.path);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      res.download(filePath, attachment.originalName);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const attachment = await Attachment.findByPk(parseInt(id as string));
      if (!attachment) {
        return res.status(404).json({ message: "Attachment not found" });
      }

      // Delete file from filesystem
      const filePath = path.resolve(attachment.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete record from database
      await attachment.destroy();

      res.status(200).json({ message: "Attachment deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
