import { Deal } from "../models/deal.model";
import { Lead } from "../models/lead.model";
import { User } from "../models/user.model";

export class DealRepository {

  async create(data: any,companyId:number) {
    return await Deal.create({...data,companyId:companyId});
  }

  async findAll(companyId?: number) {
    return await Deal.findAll({
       include: [
            {
              model: Lead,
              as: "lead",
              where: companyId ? { companyId } : undefined, // ✅ filter here
              required: true, // ✅ important (INNER JOIN)
            }, 
             {
      model: User,
      as: 'dealowner',  // make sure association is correct
      attributes: ['id', 'firstName', 'lastName']
    }        
          ],
      order: [["createdAt", "DESC"]],
    });
  }

  async findById(id: number) {
    return await Deal.findByPk(id);
  }

  async update(id: number, data: any) {
    const deal = await Deal.findByPk(id);
    if (!deal) return null;

    return await deal.update(data);
  }

  async delete(id: number) {
    const deal = await Deal.findByPk(id);
    if (!deal) return null;
    await deal.destroy();
    return true;
  }
}