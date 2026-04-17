import { Router } from "express";
import { ImportController } from "../controllers/import.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { csvUpload } from "../middleware/upload.middleware";

const router = Router();
const importController = new ImportController();

// Import CSV data for different entities
router.post("/:entityType", verifyToken, csvUpload.single("file"), importController.importCsv.bind(importController));

// Download CSV template for different entities
router.get("/template/:entityType", verifyToken, importController.getImportTemplate.bind(importController));

// List all stored import files
router.get("/files", verifyToken, importController.getImportFiles.bind(importController));

// Download a specific stored import file
router.get("/files/:filename", verifyToken, importController.downloadImportFile.bind(importController));

export default router;
