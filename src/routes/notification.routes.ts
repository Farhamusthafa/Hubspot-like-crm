import { Router } from "express";
import { NotificationController } from "../controllers/notification.controller";
import { createNotification } from "../services/notification.service";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.get("/", NotificationController.getAll);
router.put("/:id/read", NotificationController.markRead);
router.delete("/clear", NotificationController.clearAll);

// Temporary test endpoint - remove in production
router.post("/test", async (req: any, res) => {
    try {
        const userId = req.user.id;
        const notification = await createNotification({
            userId,
            title: 'Test Notification',
            message: 'This is a test notification from the backend API',
            type: 'info'
        });
        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
