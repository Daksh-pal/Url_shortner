import express from "express";
import { createShortUrl, deleteLink, getAllLinks, getRedirectUrl } from "../controllers/shortUrl.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validateZodSchema } from "../middleware/validate.middleware";
import { createShortUrlSchema } from "../zod/shortUrlValidation";

const router = express.Router()

router.post("/api/create", authenticateToken, validateZodSchema(createShortUrlSchema), createShortUrl);
router.get("/r/:shortId", getRedirectUrl);
router.get("/api/links", authenticateToken, getAllLinks);
router.delete("/api/links/:id", authenticateToken, deleteLink);

export default router;