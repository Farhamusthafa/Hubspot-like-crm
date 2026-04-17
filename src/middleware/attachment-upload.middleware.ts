import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/attachments/";
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const uploadAttachment = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for attachments - be more permissive
    // Only block potentially dangerous files
    const dangerousTypes = [
      'application/x-msdownload',
      'application/x-msdos-program',
      'application/x-ms-shortcut',
      'application/x-sh',
      'application/x-shar',
      'application/x-tar',
      'application/x-bzip',
      'application/x-bzip2',
      'application/x-7z-compressed',
      'application/x-rar',
      'application/exe',
      'application/x-exe',
      'application/dmg',
      'application/x-apple-diskimage',
      'application/x-msdownload',
    ];

    if (dangerousTypes.includes(file.mimetype)) {
      cb(new Error(`File type ${file.mimetype} is not allowed for security reasons`));
    } else {
      cb(null, true);
    }
  },
});
