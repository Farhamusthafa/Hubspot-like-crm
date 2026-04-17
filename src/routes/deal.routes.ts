import { Router } from "express";
import { DealController } from "../controllers/deal.controller";
import { verifyToken } from "../middleware/auth.middleware";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.use(verifyToken);

router.post("/", DealController.create);
router.get("/", DealController.getAll);
router.get("/:id", DealController.getById);
router.patch("/:id", DealController.update);
router.delete("/:id", DealController.delete);
router.post("/import", upload.single('file'), DealController.importDeals);

export default router;
