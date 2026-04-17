import { Request, Response } from "express";
import { TicketService } from "../services/tickets.service";

export class TicketController {
    static async create(req: Request, res: Response) {
        try {
            const ticket = await TicketService.create(req.body);
            res.status(201).json(ticket);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
               
    static async getAll(req: Request, res: Response) {
        try {
            const tickets = await TicketService.getAll(req.query);
            res.json(tickets);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const ticket = await TicketService.getById(Number(req.params.id));
            if (!ticket) return res.status(404).json({ message: "Ticket not found" });
            res.json(ticket);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            await TicketService.update(Number(req.params.id), req.body);
            res.json({ message: "Ticket updated successfully" });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            await TicketService.delete(Number(req.params.id));
            res.json({ message: "Ticket deleted successfully" });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}