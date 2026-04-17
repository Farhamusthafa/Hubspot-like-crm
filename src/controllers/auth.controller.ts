import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { UserRepository } from "../repositories/user.repository";

const repo = new UserRepository();

//  ADMIN CREATES USER
export const createUser = async (req: any, res: Response) => {
  try {
    const user = await AuthService.register(req.body, true);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// SELF REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// export const login = async (req: Request, res: Response) => {
//   try {
//     const data = await AuthService.login(req.body.email, req.body.password);
//     res.json(data);
//   } catch (err: any) {
//     res.status(401).json({ message: err.message });
//   }
// };
export const login = async (req: Request, res: Response) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const data = await AuthService.login(req.body.email, req.body.password);
    res.json(data);
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    res.status(401).json({ message: err.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const token = await AuthService.forgotPassword(req.body.email);
    res.json({ message: "Reset link generated", token });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.verifyOtp(req.body.email, req.body.otp);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const data = await AuthService.resetPassword(
      req.body.email,
      req.body.otp,
      req.body.password
    );
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// 🔹 ADMIN CRUD
//  ADMIN CRUD
export const getAllUsers = async (_: Request, res: Response) => {
  const users = await repo.findAll();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await repo.findById(Number(req.params.id));
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  await repo.update(Number(req.params.id), req.body);
  res.json({ message: "Updated" });
};

export const deleteUser = async (req: Request, res: Response) => {
  await repo.delete(Number(req.params.id));
  res.json({ message: "Deleted" });
};

//  PROFILE
export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const user = await AuthService.updateProfile(req.user.id, req.body);
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const data = await AuthService.changePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// UPLOAD PROFILE PHOTO
export const uploadProfilePhoto = async (req: any, res: Response) => {
  try {
    console.log("Upload request received");
    console.log("Files:", req.files);
    console.log("File:", req.file);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user.id;
    const filename = req.file.filename;

    console.log("User ID:", userId);
    console.log("Filename:", filename);

    const user = await AuthService.updateProfilePhoto(userId, filename);

    res.json({
      message: "Profile photo updated",
      user,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};