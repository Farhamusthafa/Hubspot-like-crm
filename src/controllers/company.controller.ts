import { Request, Response } from "express";
import { CompanyService } from "../services/company.service";
import Company from "../models/company.model";

export class CompanyController {
  static async create(req: Request, res: Response) {
    try {
      const company = await CompanyService.create(req.body);
      res.status(201).json(company);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const companies = await CompanyService.getAll(req.query);
      res.json(companies);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }


  static async getById(req: Request, res: Response) {
    try {
      const company = await CompanyService.getById(Number(req.params.id));
      if (!company) return res.status(404).json({ message: "Company not found" });
      res.json(company);
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      await CompanyService.update(Number(req.params.id), req.body);
      res.json({ message: "Company updated successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await CompanyService.delete(Number(req.params.id));
      res.json({ message: "Company deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }
}