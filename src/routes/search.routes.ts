import { Router } from "express";
import { SearchController } from "../controllers/search.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken);

router.get("/", SearchController.globalSearch);

export default router;
