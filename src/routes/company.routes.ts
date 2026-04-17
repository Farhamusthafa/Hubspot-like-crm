import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { CompanyController } from "../controllers/company.controller";

const router = Router();

router.post("/", verifyToken, CompanyController.create);
router.get("/", verifyToken, CompanyController.getAll);
router.get("/:id", verifyToken, CompanyController.getById);
router.patch("/:id", verifyToken, CompanyController.update);
router.delete("/:id", verifyToken, CompanyController.delete);



export default router;