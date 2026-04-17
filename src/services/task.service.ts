import { BaseRepository } from "../repositories/base.repository";
import { Task } from "../models/task.model";

export class TaskService {
    private repo = new BaseRepository<Task>(Task);

    createTask(entityType: string, entityId: number, data: any) {
        return this.repo.create({ entityType, entityId, ...data });
    }

    getTasks(entityType: string, entityId: number) {
        return this.repo.findByEntity(entityType, entityId);
    }

    getTaskById(entityType: string, entityId: number, taskId: number) {
        return this.repo.findById(entityType, entityId, taskId);
    }

    updateTask(entityType: string, entityId: number, taskId: number, data: any) {
        return this.repo.update(entityType, entityId, taskId, data);
    }

    deleteTask(entityType: string, entityId: number, taskId: number) {
        return this.repo.delete(entityType, entityId, taskId);
    }
}
