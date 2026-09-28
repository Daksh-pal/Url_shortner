"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const user_Model_1 = require("../model/user.Model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await user_Model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }
        const newUser = await user_Model_1.User.create({
            name,
            email,
            password
        });
        const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 1000 * 60 * 5
        });
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    }
    catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await user_Model_1.User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 5
    });
    return res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
    });
};
exports.loginUser = loginUser;
