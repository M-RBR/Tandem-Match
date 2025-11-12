"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const users_1 = __importDefault(require("./routes/users"));
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("./middlewares/jwt");
const cloudinary_1 = __importDefault(require("./config/cloudinary"));
const messages_1 = __importDefault(require("./routes/messages"));
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({
    extended: true,
}));
// image upload
app.use((0, cors_1.default)());
(0, cloudinary_1.default)();
// app.use("/", express.static("documentation")); // why is this here?
app.use("/images", express_1.default.static("uploads")); // change this to not have local upload?
app.use(jwt_1.testingMiddleware);
app.post("/testing", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/users", users_1.default);
app.use("/api/messages", messages_1.default); // ADDED FOR CHAT/MESSAGES
app.use("/*splat", (req, res) => res.status(404).json({ error: "Endpoint not found." }));
if (!process.env.MONGO_URI) {
    throw new Error("no mongo uri");
}
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => {
    app.listen(port, () => {
        console.log("Connection to MongoDB established, and server is running on http://localhost: " +
            port);
    });
})
    .catch((err) => console.log(err));
