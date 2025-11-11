"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
const jwt_1 = require("../middlewares/jwt");
const multer_1 = require("../middlewares/multer");
const router = express_1.default.Router();
// test route
router.get("/test", (req, res) => {
    res.send("User routes are working");
});
// auth routes
router.post("/register", users_1.register);
router.post("/login", users_1.login);
// protected get routes
router.get("/me", jwt_1.jwtAuth, users_1.getActiveUser);
router.get("/", jwt_1.jwtAuth, users_1.getAllUsers);
router.get("/matches", jwt_1.jwtAuth, users_1.getMatches);
router.get("/:id", jwt_1.jwtAuth, users_1.getUserById);
// profile update route iwth image upload
router.post("/update/:_id", jwt_1.jwtAuth, multer_1.upload.single("image"), multer_1.handleMulterResponse, users_1.updateUser);
// profile delete route
router.delete("/delete/:_id", jwt_1.jwtAuth, users_1.deleteUser);
// routes for liking/disliking profiles
router.post("/add-like", jwt_1.jwtAuth, users_1.addLike);
router.post("/add-dislike", jwt_1.jwtAuth, users_1.addDislike);
exports.default = router;
