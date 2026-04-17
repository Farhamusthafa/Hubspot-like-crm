import { sequelize } from "./config/db";
import { User } from "./models/user.model";
import bcrypt from "bcryptjs";

async function checkAndCreateUser() {
  try {
    console.log("Checking existing users...");
    
    // Check if any users exist
    const users = await User.findAll();
    console.log("Found users:", users.length);
    
    if (users.length === 0) {
      console.log("No users found. Creating test user...");
      
      // Create a test user
      const hashedPassword = await bcrypt.hash("password123", 10);
      const testUser = await User.create({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: hashedPassword,
        phone: "1234567890",
        companyName: "Test Company",
        industryType: "Technology",
        countryRegion: "US",
        gender: "other",
        emailNotifications: true,
        twoFactorAuth: false,
        publicProfile: false,
        role: "user",
        resetOtp: null,
        resetOtpExpiry: null,
        profileImage: null,
      });
      
      console.log("Test user created:", testUser.email);
      console.log("Login credentials:");
      console.log("Email: test@example.com");
      console.log("Password: password123");
    } else {
      console.log("Existing users:");
      users.forEach(user => {
        console.log(`- ${user.email} (${user.role})`);
      });
    }
    
    await sequelize.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkAndCreateUser();
