




import bcrypt from "bcryptjs";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../utils/generateToken";
import { sendOtpEmail } from "../utils/sendEmail";
import { User } from "../models/user.model";
import Company from "../models/company.model";

const repo = new UserRepository();

export class AuthService {

  //  REGISTER
  static async register(data: any, isAdmin: boolean = false) {

    const existing = await repo.findByEmail(data.email);
    if (existing) throw new Error("Email already exists");

    data.password = await bcrypt.hash(data.password, 10);

    // Set role BEFORE creating user
    data.role = isAdmin ? "Admin" : "User";

    const company = await Company.findOne({ where: { name: data.companyName } });
    
    const name = data.firstName + " " + data.lastName;
    const user = await repo.create(data,name,company?.id || 0);
    

    return {
      user,
      token: generateToken(user.id, name, user.role, company?.id || 0),
    };
  }

  //  LOGIN (THIS IS MISSING IN YOUR FILE)
  // static async login(email: string, password: string) {

  //   const user = await repo.findByEmail(email);
  //   if (!user) throw new Error("Invalid credentials");

  //   const isMatch = await bcrypt.compare(password, user.password);
  //   if (!isMatch) throw new Error("Invalid credentials");

  //   return {
  //     user,
  //     token: generateToken(user.id, user.role),
  //   };

  // }
  static async login(email: string, password: string) {

    const user = await repo.findByEmail(email);
    if (!user) throw new Error("Invalid credentials");

    if (!user.password) {
      throw new Error("Password not set for this user");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    return {
      user,
      token: generateToken(user.id, this.name, user.role, user.companyId || 0),
    };
  }




  //  FORGOT PASSWORD (OTP SEND)
  static async forgotPassword(email: string) {

    const user = await repo.findByEmail(email);
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);

    return { message: "OTP sent to email" };
  }

  // //  VERIFY OTP

  static async verifyOtp(email: string, otp: string) {

    const user = await repo.findByEmail(email);
    if (!user) throw new Error("User not found");

    // console.log("DB OTP:", user.resetOtp);
    // console.log("Entered OTP:", otp);
    console.log("Expiry:", user.resetOtpExpiry);
    console.log("Now:", new Date());

    if (user.resetOtp?.trim() !== otp.trim())
      throw new Error("Invalid OTP");

    if (user.resetOtpExpiry! < new Date())
      throw new Error("OTP expired");

    return { message: "OTP verified" };
  }


  //  RESET PASSWORD
  static async resetPassword(email: string, otp: string, newPassword: string) {

    const user = await repo.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (user.resetOtp !== otp)
      throw new Error("Invalid OTP");

    if (user.resetOtpExpiry! < new Date())
      throw new Error("OTP expired");

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    return { message: "Password reset successful" };
  }

  //  GET PROFILE
  static async getProfile(userId: number) {
    const user = await repo.findById(userId);
    if (!user) throw new Error("User not found");
    return user;
  }

  //  UPDATE PROFILE
  static async updateProfile(userId: number, data: any) {
    const user = await repo.findById(userId);
    if (!user) throw new Error("User not found");

    // Remove fields that shouldn't be updated through this method
    delete data.password;
    delete data.role;
    delete data.id;

    await user.update(data);
    return user;
  }

  //  UPDATE PROFILE PHOTO
  static async updateProfilePhoto(userId: number, filename: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
    }

    await user.update({ profileImage: filename });

    return user;
  }

  //  CHANGE PASSWORD
  static async changePassword(userId: number, currentPass: string, newPass: string) {
    const user = await repo.findById(userId);
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) throw new Error("Current password incorrect");

    user.password = await bcrypt.hash(newPass, 10);
    await user.save();
    return { message: "Password updated successfully" };
  }


}


