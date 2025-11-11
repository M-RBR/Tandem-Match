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
exports.testingMiddleware = exports.jwtAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
const jwtAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error("JWT_SECRET not defined in environment / check env");
        return res.status(500).json({ error: "Server configuration error" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        const user = yield users_1.default.findById(decoded.sub)
            .select("-password")
            .lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.user = user; // added "unknown" as suggested by TS because of error: "// added this because of the error: Conversion of type 'Document<unknown, {}, { createdAt: NativeDate; updatedAt: NativeDate; } & { email: string; password: string; spoken_languages: DocumentArray<{ name: string; code: string; level: string; }, Subdocument<...> & { ...; }>; ... 7 more ...; image?: string | ... 1 more ... | undefined; }, {}> & { ...; } & { ...; } & { ...;...' to type 'UserDocument' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.
        // Types of property 'matches' are incompatible.
        //  Type 'ObjectId[]' is missing the following properties from type 'Array<ObjectId>': $pop, $shift, addToSet, isMongooseArray, and 5 more.""
        next();
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
});
exports.jwtAuth = jwtAuth;
// extra log for debugging, review later
const testingMiddleware = (req, _res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
};
exports.testingMiddleware = testingMiddleware;
