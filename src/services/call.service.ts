import { BaseRepository } from "../repositories/base.repository";
import { Call } from "../models/call.model";

export class CallService {
    private repo = new BaseRepository<Call>(Call);

    createCall(entityType: string, entityId: number, data: any) {
        return this.repo.create({ entityType, entityId, ...data });
    }

    getCalls(entityType: string, entityId: number) {
        return this.repo.findByEntity(entityType, entityId);
    }

    getCallById(entityType: string, entityId: number, callId: number) {
        return this.repo.findById(entityType, entityId, callId);
    }

    updateCall(entityType: string, entityId: number, callId: number, data: any) {
        return this.repo.update(entityType, entityId, callId, data);
    }

    deleteCall(entityType: string, entityId: number, callId: number) {
        return this.repo.delete(entityType, entityId, callId);
    }
}
