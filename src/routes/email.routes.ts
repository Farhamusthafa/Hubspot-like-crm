import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { EmailController } from "../controllers/email.controller";

export const createEntityEmailsRouter = () => {
  const router = Router({ mergeParams: true });
  const controller = new EmailController();

  router.use(verifyToken); // Add authentication middleware

  router.post("/", controller.createEmail);
  router.get("/", controller.getEmails);
  router.get("/:emailId", controller.getEmailById);
  router.patch("/:emailId", controller.updateEmail);
  router.delete("/:emailId", controller.deleteEmail);

  return router;

};