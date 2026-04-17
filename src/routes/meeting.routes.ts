import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { MeetingController } from "../controllers/meeting.controller";

export const createEntityMeetingsRouter = () => {
    const router = Router({ mergeParams: true });
    const controller = new MeetingController();

    router.use(verifyToken); // Add authentication middleware

    router.post("/", controller.createMeeting);
    router.get("/", controller.getMeetings);
    router.get("/:meetingId", controller.getMeetingById);
    router.patch("/:meetingId", controller.updateMeeting);
    router.delete("/:meetingId", controller.deleteMeeting);

    return router;
};
