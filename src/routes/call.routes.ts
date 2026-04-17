import { Router } from "express";
import { CallController } from "../controllers/call.controller";

export const createEntityCallsRouter = () => {
    const router = Router({ mergeParams: true });
    const controller = new CallController();

    router.post("/", controller.createCall);
    router.get("/", controller.getCalls);
    router.get("/:callId", controller.getCallById);
    router.patch("/:callId", controller.updateCall);
    router.delete("/:callId", controller.deleteCall);

    return router;
};
