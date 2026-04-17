import { Lead } from "../models/lead.model";
import { Deal } from "../models/deal.model";
import { User } from "../models/user.model";
import { Op, fn, col, literal } from "sequelize";
import { sequelize } from "../config/db";

export class DashboardService {
    static async getKPIs(currentUser: any) {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const where: any = {};
            if (currentUser.role !== "Admin" && currentUser.role !== "admin") {
                where.assignedToId = currentUser.id;
            }

            // Get total leads
            const totalLeads = await Lead.count({ where });

            // Get active leads (not won or lost)
            const activeDeals = await Lead.count({
                where: {
                    ...where,
                    status: { [Op.in]: ['New', 'Contacted', 'Open', 'Inprogress', 'Qualified'] }
                }
            });

            // Get closed deals (won leads)
            const closedDeals = await Lead.count({
                where: {
                    ...where,
                    status: 'Won'
                }
            });

            // Monthly revenue from won leads this month
            const monthlyRevenueResult = await Lead.sum('value', {
                where: {
                    ...where,
                    status: 'Won',
                    createdAt: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            });

            const monthlyRevenue = monthlyRevenueResult || 0;

            return {
                totalLeads,
                activeDeals,
                closedDeals,
                monthlyRevenue
            };
        } catch (error) {
            console.error('Error in getKPIs:', error);
            // Return default values on error
            return {
                totalLeads: 0,
                activeDeals: 0,
                closedDeals: 0,
                monthlyRevenue: 0
            };
        }
    }

    static async getSalesReport(currentUser: any) {
        try {
            const where: any = {};
            if (currentUser.role !== "Admin" && currentUser.role !== "admin") {
                where.assignedToId = currentUser.id;
            }

            const currentYear = new Date().getFullYear();
            const startOfYear = new Date(`${currentYear}-01-01`);

            // Use raw SQL query for better compatibility
            const query = `
                SELECT 
                    EXTRACT(MONTH FROM "createdAt")::integer as month,
                    EXTRACT(YEAR FROM "createdAt")::integer as year,
                    SUM("value") as "totalValue",
                    SUM(CASE WHEN status = 'Won' THEN "value" ELSE 0 END) as "wonValue"
                FROM "leads"
                WHERE "createdAt" >= :startOfYear
                ${currentUser.role !== "Admin" && currentUser.role !== "admin" ? 'AND "assignedToId" = :userId' : ''}
                GROUP BY EXTRACT(MONTH FROM "createdAt"), EXTRACT(YEAR FROM "createdAt")
                ORDER BY EXTRACT(YEAR FROM "createdAt"), EXTRACT(MONTH FROM "createdAt")
            `;

            const replacements: any = { startOfYear };
            if (currentUser.role !== "Admin" && currentUser.role !== "admin") {
                replacements.userId = currentUser.id;
            }

            const monthlyData = await sequelize.query(query, {
                replacements,
                type: 'SELECT'
            });

            return monthlyData.map((item: any) => ({
                month: parseInt(item.month),
                year: parseInt(item.year),
                totalValue: parseFloat(item.totalValue || 0),
                wonValue: parseFloat(item.wonValue || 0)
            }));
        } catch (error) {
            console.error('Error in getSalesReport:', error);
            return [];
        }
    }

    static async getConversionData(currentUser: any) {
        try {
            const where: any = {};
            if (currentUser.role !== "Admin" && currentUser.role !== "admin") {
                where.assignedToId = currentUser.id;
            }

            const total = await Lead.count({ where });
            if (total === 0) return [];

            const statuses = ['Contacted', 'Qualified', 'Open', 'Inprogress', 'Won', 'Lost'];
            const counts = await Lead.findAll({
                attributes: ['status', [fn('count', col('id')), 'count']],
                where,
                group: ['status']
            });

            const conversion = statuses.map(s => {
                const found: any = counts.find((c: any) => c.status === s);
                const count = found ? parseInt(found.get('count') as string) : 0;
                return {
                    label: s,
                    count,
                    percent: Math.round((count / total) * 100)
                };
            });

            return conversion;
        } catch (error) {
            console.error('Error in getConversionData:', error);
            return [];
        }
    }

    static async getTeamPerformance() {
        try {
            // Get all users with their lead counts and revenue
            const users = await User.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'role']
            });

            const performance = await Promise.all(
                users.map(async (user) => {
                    const userWhere = { assignedToId: user.id };

                    const totalLeads = await Lead.count({ where: userWhere });
                    const wonLeads = await Lead.count({
                        where: { ...userWhere, status: 'Won' }
                    });
                    const revenue = await Lead.sum('value', {
                        where: { ...userWhere, status: 'Won' }
                    }) || 0;

                    return {
                        id: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role,
                        totalLeads,
                        wonLeads,
                        revenue: parseFloat(revenue.toString())
                    };
                })
            );

            // Sort by revenue (highest first)
            return performance.sort((a, b) => b.revenue - a.revenue);
        } catch (error) {
            console.error('Error in getTeamPerformance:', error);
            return [];
        }
    }

    // New method to get deals data
    static async getDealsData(currentUser: any) {
        try {
            const where: any = {};
            if (currentUser.role !== "Admin" && currentUser.role !== "admin") {
                // For deals, we might need to filter by owner or assigned user
                // This depends on how deals are associated with users
            }

            const totalDeals = await Deal.count({ where });

            const activeDeals = await Deal.count({
                where: {
                    ...where,
                    stage: { [Op.notIn]: ['Closed Won', 'Closed Lost', 'Won', 'Lost'] }
                }
            });

            const closedDeals = await Deal.count({
                where: {
                    ...where,
                    stage: { [Op.in]: ['Closed Won', 'Won'] }
                }
            });

            // Monthly revenue from deals
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

            const monthlyRevenueResult = await Deal.sum('amount', {
                where: {
                    ...where,
                    stage: { [Op.in]: ['Closed Won', 'Won'] },
                    closeDate: {
                        [Op.between]: [startOfMonth, endOfMonth]
                    }
                }
            });

            const monthlyRevenue = monthlyRevenueResult || 0;

            return {
                totalDeals,
                activeDeals,
                closedDeals,
                monthlyRevenue
            };
        } catch (error) {
            console.error('Error in getDealsData:', error);
            return {
                totalDeals: 0,
                activeDeals: 0,
                closedDeals: 0,
                monthlyRevenue: 0
            };
        }
    }
}
