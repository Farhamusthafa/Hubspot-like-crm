import { Request, Response } from "express";
import { Lead } from "../models/lead.model";
import { User } from "../models/user.model";
import { Company } from "../models/company.model";
import { Deal } from "../models/deal.model";
import { Ticket } from "../models/ticket.model";
import { Op } from "sequelize";

export class SearchController {
    static async globalSearch(req: Request, res: Response) {
        try {
            const { query } = req.query;
            if (!query || typeof query !== 'string') {
                return res.status(400).json({ message: "Search query is required" });
            }

            const searchTerm = `%${query}%`;

            // Search Leads
            const leads = await Lead.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: searchTerm } },
                        { email: { [Op.iLike]: searchTerm } },
                        { company: { [Op.iLike]: searchTerm } },
                        { jobTitle: { [Op.iLike]: searchTerm } },
                    ]
                },
                limit: 5
            });

            // Search Users (as Contacts)
            const users = await User.findAll({
                where: {
                    [Op.or]: [
                        { firstName: { [Op.iLike]: searchTerm } },
                        { lastName: { [Op.iLike]: searchTerm } },
                        { email: { [Op.iLike]: searchTerm } },
                    ]
                },
                limit: 5
            });

            // Search Companies
            const companies = await Company.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: searchTerm } },
                        { phone: { [Op.iLike]: searchTerm } },
                    ]
                },
                limit: 5
            });

            // Search Deals
            const deals = await Deal.findAll({
                where: {
                    [Op.or]: [
                        { name: { [Op.iLike]: searchTerm } },
                        { owner: { [Op.iLike]: searchTerm } },
                    ]
                },
                limit: 5
            });

            // Search Tickets
            const tickets = await Ticket.findAll({
                where: {
                    [Op.or]: [
                        { title: { [Op.iLike]: searchTerm } },
                        { description: { [Op.iLike]: searchTerm } },
                    ]
                },
                limit: 5
            });

            // Grouping results 
            const results = {
                leads: leads.map(l => ({
                    id: l.id,
                    title: l.name,
                    subtitle: l.company,
                    type: 'lead',
                    metadata: l.status
                })),
                contacts: users.map(u => ({
                    id: u.id,
                    title: `${u.firstName} ${u.lastName}`,
                    subtitle: u.email,
                    type: 'contact',
                    metadata: u.role
                })),
                companies: companies.map(c => ({
                    id: c.id,
                    title: c.name,
                    subtitle: c.industry,
                    type: 'company',
                    metadata: c.status
                })),
                deals: deals.map(d => ({
                    id: d.id,
                    title: d.name,
                    subtitle: d.owner,
                    type: 'deal',
                    metadata: d.stage
                })),
                tickets: tickets.map(t => ({
                    id: t.id,
                    title: t.title,
                    subtitle: t.owner,
                    type: 'ticket',
                    metadata: t.status
                })),
                emails: []
            };

            res.status(200).json(results);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
