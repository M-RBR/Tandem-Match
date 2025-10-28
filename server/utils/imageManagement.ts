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

export const imageDelete = async (imageUrl: string): Promise<void> => {
  try {
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) {
      throw new Error("Invalid Cloudinary URL");
    }

    const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");
    const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "");

    await cloudinary.uploader.destroy(publicId);
    console.log(`Successfully deleted image: ${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw error;
  }
};
