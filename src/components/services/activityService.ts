'use client';

// Simulation of actual API service
export const ActivityService = {
    saveActivity: async (activity: any) => {
        // Simulate network latency
        await new Promise(resolve => setTimeout(resolve, 800));
        return {
            ...activity,
            id: Math.random().toString(36).substr(2, 9),
            savedAt: new Date().toISOString()
        };
    },

    searchActivities: async (query: string) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        return []; // Logic would filter data on server
    },

    getAttachments: async (entityId: string) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [];
    },

    makeCall: async (phoneNumber: string) => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (Math.random() > 0.1) {
            return { success: true, message: `Call initiated to ${phoneNumber}` };
        }
        throw new Error("Failed to initiate call. Service unavailable.");
    }
};
