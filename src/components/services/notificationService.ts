'use client';

import { getNotifications, markNotificationAsRead, clearAllNotifications } from '@/lib/api';

export interface Notification {
    id: number;
    title: string;
    message: string;
    read: boolean;
    type: 'info' | 'success' | 'warning' | 'error';
    createdAt: string;
}

export const NotificationService = {
    getNotifications: async (): Promise<Notification[]> => {
        try {
            const notifications = await getNotifications();
            return notifications.map((notif: any) => ({
                id: notif.id,
                title: notif.title,
                message: notif.message,
                read: notif.read,
                type: notif.type,
                createdAt: notif.createdAt,
                time: formatTime(notif.createdAt)
            }));
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
            return [];
        }
    },

    markAsRead: async (id: number) => {
        try {
            await markNotificationAsRead(id);
            return { success: true };
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
            return { success: false };
        }
    },

    clearAll: async () => {
        try {
            await clearAllNotifications();
            return { success: true };
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            return { success: false };
        }
    }
};

// Helper function to format time
function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
}
