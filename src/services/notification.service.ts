import { NotificationRepository } from "../repositories/notification.repository";

const notificationRepo = new NotificationRepository();

// Function-based notification service methods
export const getUserNotifications = async (userId: number) => {
    return await notificationRepo.findByUserId(userId);
};

export const markNotificationAsRead = async (id: number, userId: number) => {
    const notification = await notificationRepo.markAsRead(id, userId);
    if (!notification) throw new Error("Notification not found");
    return notification;
};

export const clearUserNotifications = async (userId: number) => {
    await notificationRepo.clearAll(userId);
    return { message: "All notifications cleared" };
};

export const createNotification = async (data: {
    userId: number;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error'
}) => {
    return await notificationRepo.create(data);
};
