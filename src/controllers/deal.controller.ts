import { Request, Response } from "express";
import { DealService } from "../services/deal.service";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({ dest: "uploads/" });

export class DealController {
  static async create(req: Request, res: Response) {
    try {
      const deal = await DealService.create(req.body,(  req as any).user.companyId);
      res.status(201).json(deal);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const companyId = (req as any).user.companyId || 0;
      const deals = await DealService.getAll(companyId);
      res.status(200).json(deals);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const deal = await DealService.getById(Number(req.params.id));
      res.status(200).json(deal);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updatedDeal = await DealService.update(
        Number(req.params.id),
        req.body
      );
      res.status(200).json(updatedDeal);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await DealService.delete(Number(req.params.id));
      res.status(200).json(result);
    } catch (err: any) {
      res.status(404).json({ message: err.message });
    }
  }

  static async importDeals(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await DealService.importFromFile(req.file.path);
      res.status(200).json({
        message: "Deals imported successfully",
        imported: result.imported,
        errors: result.errors
      });
    } catch (err: any) {
      console.error('Import error:', err);
      res.status(400).json({ message: err.message });
    }
  }
}

export const importDeals = upload.single('file');