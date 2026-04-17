import { CompanyRepository } from "../repositories/company.repository";

const repo = new CompanyRepository();

export class CompanyService {
  static async create(data: any) {
    return await repo.create(data);
  }

  static async getAll(filters: any) {
    return await repo.findAll(filters);
  }

  static async getById(id: number) {
    return await repo.findById(id);
  }

  static async update(id: number, data: any) {
    return await repo.update(id, data);
  }

  static async delete(id: number) {
    return await repo.delete(id);
  }
}