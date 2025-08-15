import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

export const imageUpload = async (
  file: Express.Multer.File,
  folder: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        quality: "auto",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result.secure_url);
        else reject(new Error("Upload failed"));
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};
