import { Request, Response } from "express";
import { User } from "./models/user.model";
import bcrypt from "bcryptjs";

export const createTestUser = async (req: Request, res: Response) => {
  try {
    console.log("Creating test user...");

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: "test@example.com" } });
    if (existingUser) {
      return res.json({ message: "Test user already exists", user: { email: "test@example.com", password: "password123" } });
    }

    // Create test user
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

    console.log("Test user created successfully");
    res.json({
      message: "Test user created successfully",
      credentials: {
        email: "test@example.com",
        password: "password123"
      }
    });
  } catch (error: any) {
    console.error("Error creating test user:", error);
    res.status(500).json({ message: error.message });
  }
};
