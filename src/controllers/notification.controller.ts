import { Request, Response } from "express";
import {
    getUserNotifications,
    markNotificationAsRead,
    clearUserNotifications,
    createNotification
} from "../services/notification.service";

export class NotificationController {
    static async getAll(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const notifications = await getUserNotifications(userId);
            res.status(200).json(notifications);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    static async markRead(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const notificationId = Number(req.params.id);
            const notification = await markNotificationAsRead(notificationId, userId);
            res.status(200).json(notification);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    static async clearAll(req: any, res: Response) {
        try {
            const userId = req.user.id;
            const result = await clearUserNotifications(userId);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
