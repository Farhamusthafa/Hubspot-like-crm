import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/"; // default

    // Choose folder based on route first, then file type
    if (req.baseUrl.includes("profile") || req.originalUrl.includes("profile")) folder = "uploads/profile";
    else if (file.mimetype.startsWith("image/")) folder = "uploads/images";
    else if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) folder = "uploads/csv";
    else if (file.mimetype === "application/pdf" || file.mimetype === "application/zip" || file.mimetype === "application/x-zip-compressed") folder = "uploads/files";

    // Make sure folder exists
    const fullPath = path.join(process.cwd(), folder);
    fs.mkdirSync(fullPath, { recursive: true });

    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const csvUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed"));
    }
  },
});