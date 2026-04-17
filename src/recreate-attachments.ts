import { sequelize } from "./config/db";
import { User } from "./models/user.model";
import { Attachment } from "./models/attachment.model";

async function recreateAttachments() {
  try {
    console.log("Recreating attachments table...");
    
    // Check if user with ID 1 exists
    const user1 = await User.findByPk(1);
    if (!user1) {
      console.log("Creating default user with ID 1...");
      await User.create({
        id: 1,
        name: "Default User",
        email: "default@example.com",
        password: "password123", // This should be hashed in production
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Default user created successfully!");
    } else {
      console.log("User with ID 1 already exists");
    }

    // Recreate the attachments table
    await Attachment.sync({ force: true });
    console.log("Attachments table recreated successfully!");
    
    await sequelize.close();
    console.log("Recreation completed!");
  } catch (error) {
    console.error("Recreation failed:", error);
  }
}

recreateAttachments();
