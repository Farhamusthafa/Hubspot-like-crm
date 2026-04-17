import { Deal } from "../models/deal.model";
import * as fs from 'fs';
import csv from 'csv-parser';
import { User } from "../models/user.model";
import { DealRepository } from "../repositories/deal.repository";

export class DealService {
    private static dealRepository = new DealRepository();
    static async create(data: any,companyId:number) {
        return await this.dealRepository.create(data,companyId);
    }

    static async getAll(companyId: number) {
        return await this.dealRepository.findAll(companyId);
    }

    static async getById(id: number) {
        const deal = await this.dealRepository.findById(id);
        if (!deal) throw new Error("Deal not found");
        return deal;
    }

    static async update(id: number, data: any) {
        const deal = await this.dealRepository.update(id, data);
        if (!deal) throw new Error("Deal not found");
        return await deal.update(data);
    }

    static async delete(id: number) {
        const deal = await this.dealRepository.delete(id);
        if (!deal) throw new Error("Deal not found");
        return { message: "Deal deleted successfully" };
    }

    static async importFromFile(filePath: string) {
        const results: any[] = [];
        const errors: any[] = [];
        let imported = 0;

        return new Promise<{ imported: number; errors: any[] }>((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data: any) => {
                    results.push(data);
                })
                .on('end', async () => {
                    try {
                        // Process each row and create deals
                        for (const row of results) {
                            try {
                                // Map CSV columns to deal fields
                                const dealData = {
                                    name: row['Deal Name'] || row['name'] || '',
                                    stage: row['Stage'] || row['stage'] || 'Appointment Scheduled',
                                    closeDate: row['Close Date'] || row['closeDate'] || new Date().toISOString().split('T')[0],
                                    owner: row['Owner'] || row['owner'] || 'N/A',
                                    amount: parseFloat(row['Amount'] || row['amount'] || '0')
                                };

                                await Deal.create(dealData);
                                imported++;
                            } catch (error: any) {
                                errors.push({
                                    row: results.indexOf(row) + 1,
                                    error: error.message,
                                    data: row
                                });
                            }
                        }

                        // Clean up uploaded file
                        fs.unlinkSync(filePath);

                        resolve({ imported, errors });
                    } catch (error: any) {
                        reject(error);
                    }
                })
                .on('error', (error: any) => {
                    reject(error);
                });
        });
    }
}
