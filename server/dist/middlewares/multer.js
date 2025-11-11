"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMulterResponse = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.memoryStorage(); // using momory storage instead of disk storage; images are uploaded directly on Cloudinary
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        files: 1,
        fileSize: 5 * 1024 * 1024, // equals 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const fileExt = path_1.default.extname(file.originalname).toLowerCase();
        const allowedTypes = [".jpg", ".jpeg", ".png"];
        if (!allowedTypes.includes(fileExt)) {
            req.fileValidationError = "Only image files (jpg, jpeg, png) are allowed";
            return cb(null, false); // consider adding check for MIME types as well to identify a file’s true format, not just its extension
        }
        cb(null, true);
    },
});
const handleMulterResponse = (req, res, next) => {
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
exports.handleMulterResponse = handleMulterResponse;
