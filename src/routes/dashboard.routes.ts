import { Router } from "express";
import { DashboardController } from "../controllers/dashboard.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.get("/kpis", DashboardController.getKPIs);
router.get("/sales-report", DashboardController.getSalesReport);
router.get("/conversion", DashboardController.getConversion);
router.get("/team-performance", DashboardController.getTeamPerformance);
router.get("/metrics", DashboardController.getDashboardMetrics);

export default router;
