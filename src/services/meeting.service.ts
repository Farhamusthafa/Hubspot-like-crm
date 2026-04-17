import { BaseRepository } from "../repositories/base.repository";
import { Meeting } from "../models/meeting.model";

export class MeetingService {
    private repo = new BaseRepository<Meeting>(Meeting);

    createMeeting(entityType: string, entityId: number, data: any) {
        return this.repo.create({ entityType, entityId, ...data });
    }

    getMeetings(entityType: string, entityId: number) {
        return this.repo.findByEntity(entityType, entityId);
    }

    getMeetingById(entityType: string, entityId: number, meetingId: number) {
        return this.repo.findById(entityType, entityId, meetingId);
    }

    updateMeeting(entityType: string, entityId: number, meetingId: number, data: any) {
        return this.repo.update(entityType, entityId, meetingId, data);
    }

    deleteMeeting(entityType: string, entityId: number, meetingId: number) {
        return this.repo.delete(entityType, entityId, meetingId);
    }
}
