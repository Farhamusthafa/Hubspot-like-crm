import { Request, Response } from "express";
import fs from "fs";
import { ImportService } from "../services/import.service";
import { Company } from "../models/company.model";
import { Lead } from "../models/lead.model";
import { Deal } from "../models/deal.model";
import { Ticket } from "../models/ticket.model";

export class ImportController {
  private service = new ImportService();

  async importCsv(req: Request, res: Response) {
    try {
      const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";
      const user = (req as any).user;
      const ownerName = user.name || user.email || `User ${user.id}`;
      const file = req.file;

      if (!file) throw new Error("CSV file required");

      let model: any;

      switch (entityType) {
        case "company":
          model = Company;
          break;
        case "lead":
          model = Lead;
          break;
        case "deal":
          model = Deal;
          break;
        case "ticket":
          model = Ticket;
          break;
        default:
          return res.status(400).json({ message: "Invalid module" });
      }

      const result = await this.service.importFromCsv(
        file.path,
        model,
        entityType,
        ownerName
      );

      // File is kept in backend storage - no deletion
      console.log(`Imported file stored at: ${file.path}`);

      const message = typeof result === 'object' ? result.message : `${result} ${entityType} records imported successfully`;
      const count = typeof result === 'object' ? result.successCount : result;

      res.json({
        message,
        count,
        entityType,
        fileName: file.filename,
        filePath: file.path,
        ...(typeof result === 'object' && { details: result })
      });

    } catch (error: any) {
      console.error("Import error:", error);

      // File is kept even on error for debugging purposes
      if (req.file) {
        console.log(`File kept at: ${req.file.path} despite import error`);
      }

      res.status(500).json({ message: error.message });
    }
  }

  async getImportTemplate(req: Request, res: Response) {
    try {
      const entityType = req.params.entityType as "company" | "lead" | "deal" | "ticket";

      let template: string = '';

      switch (entityType) {
        case "lead":
          template = 'name,email,phone,company,jobTitle,status,value,source,assignedTo\n';
          template += 'John Doe,john@example.com,555-1234,ACME Corp,Manager,New,5000,Website,admin@example.com\n';
          break;
        case "company":
          template = 'name,industry,type,phone,city,country,employees,revenue,domain\n';
          template += 'ACME Corp,Technology,Private,555-1234,New York,USA,100,1000000,acme.com\n';
          break;
        case "deal":
          template = 'name,stage,amount,closeDate,priority,associatedLead\n';
          template += 'ACME Deal,Qualification,50000,2024-03-15,high,1\n';
          break;
        case "ticket":
          template = 'title,description,status,priority,source\n';
          template += 'Login Issue,User cannot login to system,New,high,Email\n';
          break;
        default:
          return res.status(400).json({ message: "Invalid module" });
      }

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${entityType}-template.csv"`);
      res.send(template);

    } catch (error: any) {
      console.error("Template error:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getImportFiles(req: Request, res: Response) {
    try {
      const fs = require('fs');
      const path = require('path');

      const csvDir = path.join(process.cwd(), 'uploads', 'csv');

      // Check if directory exists
      if (!fs.existsSync(csvDir)) {
        return res.json({ files: [] });
      }

      // Read directory contents
      const files = fs.readdirSync(csvDir)
        .filter((file: string) => file.endsWith('.csv'))
        .map((file: string) => {
          const filePath = path.join(csvDir, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            path: filePath,
            size: stats.size,
            createdAt: stats.birthtime,
            modifiedAt: stats.mtime
          };
        })
        .sort((a: any, b: any) => b.createdAt - a.createdAt); // Most recent first

      res.json({ files });

    } catch (error: any) {
      console.error("Error listing import files:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async downloadImportFile(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const path = require('path');

      if (!filename || typeof filename !== 'string' || !filename.endsWith('.csv')) {
        return res.status(400).json({ message: "Invalid filename" });
      }

      const filePath = path.join(process.cwd(), 'uploads', 'csv', filename);
      const fs = require('fs');

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
      }

      // Send file
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.sendFile(filePath);

    } catch (error: any) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: error.message });
    }
  }
}
