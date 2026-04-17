import { Request, Response } from "express";
import { LeadService } from "../services/lead.service";

export class LeadController {
    static async create(req: Request, res: Response) {
        try {
            console.log((req as any).user.companyId);
            const lead = await LeadService.createLead(req.body,(req as any).user.companyId);
            res.status(201).json(lead);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const companyId = ( req as any).user.companyId || 0;
            const leads = await LeadService.getAllLeads(companyId);
            res.status(200).json(leads);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const lead = await LeadService.getLeadById(Number(req.params.id));
            res.status(200).json(lead);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const lead = await LeadService.updateLead(Number(req.params.id), req.body);
            res.status(200).json(lead);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const result = await LeadService.deleteLead(Number(req.params.id));
            res.status(200).json(result);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async convert(req: Request, res: Response) {
        try {
            const result = await LeadService.convertLead(Number(req.params.id), req.body);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}
