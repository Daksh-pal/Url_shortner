import express from 'express';
import { loginUser, registerUser, logoutUser, getMe } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { validateZodSchema } from '../middleware/validate.middleware';
import { userLoginSchema, userRegisterSchema } from '../zod/userValidation';
const router = express.Router();

router.post("/register",validateZodSchema(userRegisterSchema) , registerUser);
router.post("/login",validateZodSchema(userLoginSchema), loginUser);
router.post("/logout", logoutUser);

router.get("/me", authenticateToken, getMe);

export default router;