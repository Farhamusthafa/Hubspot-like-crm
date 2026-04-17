import { LeadRepository } from "../repositories/lead.repository";
import { Deal } from "../models/deal.model";

const leadRepository = new LeadRepository();

export class LeadService {
    static async createLead(data: any,companyId:number) {
        return await leadRepository.create(data,companyId);
    }

    static async getAllLeads(companyId: number) {
        return await leadRepository.findAll(companyId);
    }

    static async getLeadById(id: number) {
        const lead = await leadRepository.findById(id);
        if (!lead) throw new Error("Lead not found");
        return lead;
    }

    static async updateLead(id: number, data: any) {
        const lead = await leadRepository.update(id, data);
        if (!lead) throw new Error("Lead not found");
        return lead;
    }

    static async deleteLead(id: number) {
        const success = await leadRepository.delete(id);
        if (!success) throw new Error("Lead not found");
        return { message: "Lead deleted successfully" };
    }

    static async convertLead(id: number, dealData: any) {
        const lead = await leadRepository.findById(id);
        if (!lead) throw new Error("Lead not found");

        const deal = await Deal.create({
            name: dealData.name || `${lead.name} Deal`,
            stage: dealData.stage || 'Qualification',
            closeDate: dealData.closeDate || new Date(new Date().setMonth(new Date().getMonth() + 1)),
            owner: dealData.owner || lead.assignedTo,
            amount: dealData.amount || 0
        });

        await lead.update({ status: "Converted" })

        return { deal, lead };
    }
}
