import z from 'zod';

export const userRegisterSchema = z.object({
    name : z.string().trim().min(3,"Name must be at least 3 characters long").max(50,"Name must be at most 50 characters long"),
    email : z.string().trim().email("Must be a valid email address"),
    password : z.string().trim().min(6,"Password must be at least 6 characters long").max(50,"Password must be at most 50 characters long"),
})

export const userLoginSchema = z.object({
    email : z.string().trim().email("Must be a valid email address"),
    password : z.string().trim().min(6,"Password must be at least 6 characters long").max(50,"Password must be at most 50 characters long"),
})