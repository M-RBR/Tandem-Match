import { NextFunction, Request, Response } from "express";
import multer from "multer";
import path from "path";

declare global {
  namespace Express {
    interface Request {
      multerError?: string;
      fileValidationError?: string;
    }
  }
}

const storage = multer.memoryStorage(); // using momory storage instead of disk storage; images are uploaded directly on Cloudinary

export const upload = multer({
  storage: storage,
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // equals 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const allowedTypes = [".jpg", ".jpeg", ".png"];

    if (!allowedTypes.includes(fileExt)) {
      req.fileValidationError = "Only image files (jpg, jpeg, png) are allowed";
      return cb(null, false); // consider adding check for MIME types as well to identify a file’s true format, not just its extension
    }
    cb(null, true);
  },
});

export const handleMulterResponse = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.fileValidationError) {
    return res.status(400).json({
      error: req.fileValidationError,
      details: {
        allowedTypes: ["jpg", "jpeg", "png"],
        maxSize: "5MB",
      },
    });
  }
  next();
};
