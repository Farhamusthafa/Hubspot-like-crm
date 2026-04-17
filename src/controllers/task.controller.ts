import { Request, Response } from "express";
import { TaskService } from "../services/task.service";

export class TaskController {
    private service = new TaskService();

    createTask = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const task = await this.service.createTask(entityType, entityId, req.body);
        res.status(201).json(task);
    };

    getTasks = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const tasks = await this.service.getTasks(entityType, entityId);
        res.json(tasks);
    };

    getTaskById = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const taskId = Number(req.params.taskId);

        const task = await this.service.getTaskById(entityType, entityId, taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        res.json(task);
    };

    updateTask = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const taskId = Number(req.params.taskId);

        const updated = await this.service.updateTask(entityType, entityId, taskId, req.body);
        if (!updated) return res.status(404).json({ message: "Task not found" });

        res.json(updated);
    };

    deleteTask = async (req: Request, res: Response) => {
        const entityType = req.params.entityType as string;
        const entityId = Number(req.params.entityId);
        const taskId = Number(req.params.taskId);

        await this.service.deleteTask(entityType, entityId, taskId);
        res.json({ message: "Task deleted successfully" });
    };
}
