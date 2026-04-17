import { Router } from "express";
import { ActivityController } from "../controllers/activity.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();
const controller = new ActivityController();

// ✅ Create Activity
// POST /activities
router.post("/", verifyToken, controller.createActivity);

// ✅ Get Activities (with filters)
// GET /activities?entityType=lead&entityId=1&type=email
router.get("/", verifyToken, controller.getActivities);

// ✅ Get Single Activity
// GET /activities/:id
router.get("/:id", verifyToken, controller.getActivityById);

// ✅ Update Activity
// PUT /activities/:id
router.put("/:id", verifyToken, controller.updateActivity);

// ✅ Delete Activity
// DELETE /activities/:id
router.delete("/:id", verifyToken, controller.deleteActivity);

export default router;