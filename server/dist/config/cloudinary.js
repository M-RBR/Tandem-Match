"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
require("dotenv/config");
const configureCloudinary = () => {
    if (!process.env.CLOUD_NAME ||
        !process.env.CLOUD_APIKEY ||
        !process.env.CLOUD_SECRET) {
        throw new Error("Missing Cloudinary configuration in environment variables");
    }
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_APIKEY,
        api_secret: process.env.CLOUD_SECRET,
        secure: true,
    });
    console.log("Cloudinary configured successfully");
};
exports.default = configureCloudinary;
