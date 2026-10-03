import { Request, Response } from 'express';
import { User } from '../model/user.Model';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client/extension';
import { prisma } from '../lib/prisma';

export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        // const existingUser = await User.findOne({ email });
        const existingUser = await prisma.user.findUnique({where : {email}});
        if (existingUser) {
            return res.status(409).json({ message: "User with this email already exists" });
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({data : {name , email , password : encryptedPassword}});

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({where : { email }});

        if (!user) {
            return res.status(401).json({ message: "Invalid email address" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" })
        }

        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "1d" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24
        });
        return res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in logoutUser:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getMe = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    const { id, name, email } = req.user;
    return res.status(201).json({ user: { id, name, email } })
}