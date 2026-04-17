import { Ticket } from "../models/ticket.model";
import { User } from "../models/user.model";

export class TicketRepository {
    async create(data: any) {
        return await Ticket.create(data);
    }

    async findAll(filters: any = {}) {
        return await Ticket.findAll({
            where: filters,
            order: [["createdAt", "DESC"]],
        });
    }

    async findById(id: number) {
        return await Ticket.findByPk(id);
    }

    async update(id: number, data: any) {
        return await Ticket.update(data, { where: { id } });
    }

    async delete(id: number) {
        return await Ticket.destroy({ where: { id } });
    }
}