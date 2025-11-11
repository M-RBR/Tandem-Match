"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageDelete = exports.imageUpload = void 0;
const cloudinary_1 = require("cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const imageUpload = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: folder,
            quality: "auto",
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        }, (error, result) => {
            if (error)
                reject(error);
            else if (result)
                resolve(result.secure_url);
            else
                reject(new Error("Upload failed"));
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
});
exports.imageUpload = imageUpload;
const imageDelete = (imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const urlParts = imageUrl.split("/");
        const uploadIndex = urlParts.indexOf("upload");
        if (uploadIndex === -1) {
            throw new Error("Invalid Cloudinary URL");
        }
        const pathAfterVersion = urlParts.slice(uploadIndex + 2).join("/");
        const publicId = pathAfterVersion.replace(/\.[^/.]+$/, "");
        yield cloudinary_1.v2.uploader.destroy(publicId);
        console.log(`Successfully deleted image: ${publicId}`);
    }
    catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw error;
    }
});
exports.imageDelete = imageDelete;
