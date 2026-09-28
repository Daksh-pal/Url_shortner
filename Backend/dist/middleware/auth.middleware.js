"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = async (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        if (typeof decoded === "string") {
            return res.status(403).json({ message: "Invalid token payload." });
        }
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Error in authenticateToken:", error);
        return res.status(403).json({ message: "Invalid token." });
    }
};
exports.authenticateToken = authenticateToken;
