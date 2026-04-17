import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { TicketController } from "../controllers/tickets.controller";

const router = Router();

router.use(verifyToken);

router.post("/", TicketController.create);
router.get("/", TicketController.getAll);
router.get("/:id", TicketController.getById);
router.patch("/:id", TicketController.update);
router.delete("/:id", TicketController.delete);

export default router;