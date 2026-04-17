import { Router } from "express";
import { LeadController } from "../controllers/lead.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken); // Protect all lead routes

router.post("/", LeadController.create);
router.get("/", LeadController.getAll);
router.get("/:id", LeadController.getById);
router.patch("/:id", LeadController.update);
router.delete("/:id", LeadController.delete);
router.post("/:id/convert", LeadController.convert);

export default router;
