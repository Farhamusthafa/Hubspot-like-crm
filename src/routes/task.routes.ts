import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { TaskController } from "../controllers/task.controller";

export const createEntityTasksRouter = () => {
    const router = Router({ mergeParams: true });
    const controller = new TaskController();

    router.use(verifyToken); // Add authentication middleware

    router.post("/", controller.createTask);
    router.get("/", controller.getTasks);
    router.get("/:taskId", controller.getTaskById);
    router.patch("/:taskId", controller.updateTask);
    router.delete("/:taskId", controller.deleteTask);

    return router;
};
