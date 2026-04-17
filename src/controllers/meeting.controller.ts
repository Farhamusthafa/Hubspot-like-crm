import { Request, Response } from "express";
import { MeetingService } from "../services/meeting.service";

export class MeetingController {
    private service = new MeetingService();

    createMeeting = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const meeting = await this.service.createMeeting(entityType, entityId, req.body);
        res.status(201).json(meeting);
    };

    getMeetings = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const meetings = await this.service.getMeetings(entityType, entityId);
        res.json(meetings);
    };

    getMeetingById = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const meetingId = Number(req.params.meetingId);

        const meeting = await this.service.getMeetingById(entityType, entityId, meetingId);
        if (!meeting) return res.status(404).json({ message: "Meeting not found" });

        res.json(meeting);
    };

    updateMeeting = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const meetingId = Number(req.params.meetingId);

        const updated = await this.service.updateMeeting(entityType, entityId, meetingId, req.body);
        if (!updated) return res.status(404).json({ message: "Meeting not found" });

        res.json(updated);
    };

    deleteMeeting = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const meetingId = Number(req.params.meetingId);

        await this.service.deleteMeeting(entityType, entityId, meetingId);
        res.json({ message: "Meeting deleted successfully" });
    };
}
