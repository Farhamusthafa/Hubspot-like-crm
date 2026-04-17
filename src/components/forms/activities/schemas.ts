import { z } from 'zod';

export const NoteSchema = z.object({
    description: z.string().min(1, 'Note content is required').max(5000, 'Note is too long'),
});

export const EmailSchema = z.object({
    to: z.string().min(1, 'Recipient is required').email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject cannot exceed 200 characters'),
    body: z.string().min(1, 'Body content is required'),
});

export const CallSchema = z.object({
    connectedTo: z.string().min(1, 'Contact name is required'),
    outcome: z.string().min(1, 'Please select an outcome'),
    date: z.string().optional(),
    time: z.string().optional(),
    description: z.string().optional(),
});

export const TaskSchema = z.object({
    title: z.string().min(1, 'Task title is required').max(100, 'Title is too long'),
    dueDate: z.string().min(1, 'Due date is required'),
    time: z.string().optional(),
    priority: z.enum(['Low', 'Medium', 'High']).optional(),
    assignedTo: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
});

export const MeetingSchema = z.object({
    title: z.string().min(1, 'Meeting title is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    attendees: z.string().optional(), // Ideally array of emails
    location: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
});

export type NoteFormValues = z.infer<typeof NoteSchema>;
export type EmailFormValues = z.infer<typeof EmailSchema>;
export type CallFormValues = z.infer<typeof CallSchema>;
export type TaskFormValues = z.infer<typeof TaskSchema>;
export type MeetingFormValues = z.infer<typeof MeetingSchema>;
