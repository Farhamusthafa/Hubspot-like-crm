import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service";

export class DashboardController {
    static async getKPIs(req: Request, res: Response) {
        try {
            const stats = await DashboardService.getKPIs((req as any).user);
            res.status(200).json(stats);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getSalesReport(req: Request, res: Response) {
        try {
            const report = await DashboardService.getSalesReport((req as any).user);
            res.status(200).json(report);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getConversion(req: Request, res: Response) {
        try {
            const data = await DashboardService.getConversionData((req as any).user);
            res.status(200).json(data);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async getTeamPerformance(req: Request, res: Response) {
        try {
            if ((req as any).user.role !== "Admin" && (req as any).user.role !== "admin") {
                return res.status(403).json({ message: "Access denied" });
            }
            const performance = await DashboardService.getTeamPerformance();
            res.status(200).json(performance);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // New combined dashboard metrics endpoint
    static async getDashboardMetrics(req: Request, res: Response) {
        try {
            const user = (req as any).user;

            // Get all dashboard data in parallel
            const [kpis, salesReport, conversionData, teamPerformance] = await Promise.all([
                DashboardService.getKPIs(user),
                DashboardService.getSalesReport(user),
                DashboardService.getConversionData(user),
                user.role === "Admin" || user.role === "admin"
                    ? DashboardService.getTeamPerformance()
                    : Promise.resolve([])
            ]);

            const metrics = {
                kpis,
                salesReport,
                conversionData,
                teamPerformance,
                lastUpdated: new Date().toISOString()
            };

            res.status(200).json(metrics);
        } catch (error: any) {
            console.error('Dashboard metrics error:', error);
            res.status(500).json({ message: error.message });
        }
    }
}
