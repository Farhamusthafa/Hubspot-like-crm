import { Router } from "express";
import * as controller from "../controllers/auth.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";
import { createTestUser } from "../create-test-user";
import { sendEmail } from "../utils/sendEmail";

const router = Router();

// AUTH
router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/forgot-password", controller.forgotPassword);
router.post("/verify-otp", controller.verifyOtp);
router.post("/reset-password", controller.resetPassword);

// EMAIL
router.post("/send-email", verifyToken, async (req, res) => {
  try {
    const { to, subject, content } = req.body;

    if (!to || !subject || !content) {
      return res.status(400).json({ message: "To, subject, and content are required" });
    }

    // Convert single email to array if needed
    const recipients = Array.isArray(to) ? to : [to];

    await sendEmail(recipients, subject, content);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

// TEST ENDPOINT - Create test user
router.post("/create-test-user", createTestUser);

// ADMIN CRUD
router.post("/users", verifyToken, isAdmin, controller.createUser);
router.get("/users", verifyToken, isAdmin, controller.getAllUsers);
router.get("/users/:id", verifyToken, isAdmin, controller.getUserById);
router.put("/users/:id", verifyToken, isAdmin, controller.updateUser);
router.delete("/users/:id", verifyToken, isAdmin, controller.deleteUser);

// PROFILE
router.get("/profile", verifyToken, controller.getProfile);
router.put("/edit-profile", verifyToken, controller.updateProfile);
router.put("/change-password", verifyToken, controller.changePassword);

router.put(
  "/profile/photo",
  verifyToken,
  upload.single("image"),
  controller.uploadProfilePhoto
);

export default router;