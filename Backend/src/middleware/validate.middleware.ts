import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateZodSchema = (schema : ZodSchema) => {
    return (req:Request , res:Response , next : NextFunction) => {
        try{
            const result = schema.safeParse(req.body);
            if (!result.success) {
                return res.status(400).json({ message: "Invalid request data", errors: result.error.issues });
            }
            next();
        }
        catch(error){
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}