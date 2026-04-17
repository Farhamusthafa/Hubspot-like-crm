import { sequelize } from "./config/db";
import { Attachment } from "./models/attachment.model";

async function testDatabase() {
  try {
    console.log("Testing database connection...");
    await sequelize.authenticate();
    console.log("Database connection successful!");

    console.log("Testing Attachment model...");
    await Attachment.sync({ force: true });
    console.log("Attachment table created successfully!");

    // Test creating an attachment
    const testAttachment = await Attachment.create({
      entityType: 'lead',
      entityId: 1,
      filename: 'test.pdf',
      originalName: 'test.pdf',
      mimeType: 'application/pdf',
      size: 1024,
      path: '/uploads/test.pdf',
      uploadedBy: 1,
    });
    console.log("Test attachment created:", testAttachment.toJSON());

    // Test reading attachments
    const attachments = await Attachment.findAll();
    console.log("Found attachments:", attachments.length);

    await sequelize.close();
    console.log("Database test completed!");
  } catch (error) {
    console.error("Database test failed:", error);
  }
}

testDatabase();
