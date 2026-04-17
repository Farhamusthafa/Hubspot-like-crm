import { Request, Response } from "express";
import { CallService } from "../services/call.service";

export class CallController {
    private service = new CallService();

    createCall = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const call = await this.service.createCall(entityType, entityId, req.body);
        res.status(201).json(call);
    };

    getCalls = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const calls = await this.service.getCalls(entityType, entityId);
        res.json(calls);
    };

    getCallById = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const callId = Number(req.params.callId);

        const call = await this.service.getCallById(entityType, entityId, callId);
        if (!call) return res.status(404).json({ message: "Call not found" });

        res.json(call);
    };

    updateCall = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const callId = Number(req.params.callId);

        const updated = await this.service.updateCall(entityType, entityId, callId, req.body);
        if (!updated) return res.status(404).json({ message: "Call not found" });

        res.json(updated);
    };

    deleteCall = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const callId = Number(req.params.callId);

        await this.service.deleteCall(entityType, entityId, callId);
        res.json({ message: "Call deleted successfully" });
    };
}
