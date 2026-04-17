import { Company } from "../models/company.model";
import { Lead } from "../models/lead.model";

export class CompanyRepository {
  async create(data: any) {
    return await Company.create(data);
  }

  async findAll(filters: any = {}) {

  const { status, ...companyFilters } = filters;

  return await Company.findAll({
    where: companyFilters,   // filters for company fields
    include: [
      {
        model: Lead,
        as: "companyLeads",
        attributes: ["status"],
        where: status ? { status } : undefined, // filter by lead status
        required: !!status // ensures join only when filtering
      }
    ],
    order: [["createdAt", "DESC"]],
  });
}


  

//  async findAll(filters: any = {}) {
//   return await Company.findAll({
//     where: filters,
//     include: [
//       {
//         model: Lead,
//          as: "companyLeads",
//         attributes: ["status"]
//       }
//     ],
//     order: [["createdAt", "DESC"]],
//   });
// }

  async findById(id: number) {
    return await Company.findByPk(id);
  }

  async update(id: number, data: any) {
    return await Company.update(data, { where: { id } });
  }

  async delete(id: number) {
    return await Company.destroy({ where: { id } });
  }
}