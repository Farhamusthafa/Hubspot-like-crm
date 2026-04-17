import { where } from "sequelize";
import Company from "../models/company.model";
import { Lead } from "../models/lead.model";

export class LeadRepository {
    async create(data: any,companyId:number) {
        return await Lead.create({...data,companyId:companyId});
    }

    async findById(id: number) {
        return await Lead.findByPk(id);
    }

    async findAll(companyId?: number) {
        return await Lead.findAll({
            include:[
                {model:Company,
                as:"leadcompany",
                attributes:["id", "name"]}            
            ],
            where: companyId ? { companyId } : undefined,
            order: [['createdAt', 'DESC']]
        });
    }

    async update(id: number, data: any) {
        const lead = await Lead.findByPk(id);
        if (!lead) return null;
        return await lead.update(data);
    }

    async delete(id: number) {
        const lead = await Lead.findByPk(id);
        if (!lead) return null;
        await lead.destroy();
        return true;
    }
}
