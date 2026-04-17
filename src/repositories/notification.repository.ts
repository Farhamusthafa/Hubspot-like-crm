import { Notification } from "../models/notification.model";

export class NotificationRepository {
    async findByUserId(userId: number) {
        return await Notification.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
    }

    async markAsRead(id: number, userId: number) {
        const notification = await Notification.findOne({
            where: { id, userId }
        });
        if (!notification) return null;
        return await notification.update({ read: true });
    }

    async clearAll(userId: number) {
        return await Notification.destroy({
            where: { userId }
        });
    }

    async create(data: any) {
        return await Notification.create(data);
    }
}
