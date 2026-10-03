import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";
import { prisma } from '../lib/prisma';

export const authenticateToken = async(req:Request , res : Response , next : NextFunction) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET || "secret");
        if (typeof decoded === "string") {
            return res.status(403).json({ message: "Invalid token payload." });
        }
        const user = await prisma.user.findUnique({where : {id : decoded.id}})
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }

        req.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };
        next();
    }
    catch(error){
        console.error("Error in authenticateToken:", error);
        return res.status(403).json({ message: "Invalid token." });
    }
}