import { Router } from "express";
import { AttachmentController } from "../controllers/attachment.controller";
import { uploadAttachment } from "../middleware/attachment-upload.middleware";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.use(verifyToken); // Protect all attachment routes

// Upload attachment for an entity
router.post("/:entityType/:entityId/upload", 
  uploadAttachment.single('file'), 
  AttachmentController.upload
);

// Get all attachments for an entity
router.get("/:entityType/:entityId", AttachmentController.getByEntity);

// Download attachment
router.get("/download/:id", AttachmentController.download);

// Delete attachment
router.delete("/:id", AttachmentController.delete);

export default router;
