import { nanoid } from "nanoid";
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { redis } from "../lib/redis";


export const createShortUrl = async (req: Request, res: Response) => {
    try {
        const { url, slug } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized. User not authenticated." });
        }

        const existingRecord = await prisma.url.findUnique({
            where: {
                originalUrl_userId: {
                    originalUrl: url,
                    userId: req.user.id,
                },
            },
        })

        if (existingRecord) {
            return res.status(200).json({ message: "Url fetched successfully", newRec: existingRecord });
        }
        if (slug) {
            const existingShortUrl = await prisma.url.findUnique({
                where: { shortId: slug },
            });
            if (existingShortUrl) {
                return res.status(400).json({ message: "Custom url already exists" });
            }

            // const shortUrl = await Url.create({
            //     shortId: slug,
            //     originalUrl: url,
            //     user: req.user.id
            // })

            const shortUrl = await prisma.url.create({ data: { shortId: slug, originalUrl: url, userId: req.user.id } })
            return res.status(200).json({ message: "Url generate successfully", newRec: shortUrl });
        }


        const shortId: string = nanoid(8);
        // const newRec = await Url.create({
        //     shortId,
        //     originalUrl: url,
        //     userId: req.user.id
        // });

        const newRec = await prisma.url.create({
            data: {
                shortId,
                originalUrl: url,
                userId: req.user.id
            }
        })

        return res.status(200).json({ message: "Url generate successfully", newRec });
    } catch (error) {
        console.log("Error while creating short url", error);
        return res.status(500).json({ message: "Internal Server error" });
    }
}

// Helper: Buffer click in Redis RAM with automatic fallback to Postgres
const recordClick = (shortId: string) => {
    redis.hincrby("clicks:buffer", shortId, 1).catch((err) => {
        console.warn("⚠️ Redis click buffer failed, falling back to DB:", err);
        prisma.url.update({
            where: { shortId },
            data: { clicks: { increment: 1 } },
        }).catch((e) => console.error("DB click increment error:", e));
    });
};

export const getRedirectUrl = async (req: Request, res: Response) => {
    try {
        const { shortId } = req.params;
        const cacheKey = `url:${shortId}`;

        // 1. Try reading from Redis cache first
        try {
            const cachedOriginalUrl = await redis.get(cacheKey);
            if (cachedOriginalUrl) {
                // Buffer click in Redis RAM (0.1ms, zero disk write)
                recordClick(shortId);

                console.log(`🚀 [CACHE HIT] Redirecting /${shortId} from Redis`);
                return res.redirect(cachedOriginalUrl);
            }
        } catch (error) {
            console.warn("⚠️ Redis read failed, falling back to database:", error);
        }

        // 2. Cache Miss: Query PostgreSQL
        const record = await prisma.url.findUnique({
            where: { shortId },
        });

        if (!record) {
            return res.status(404).json({ message: "Short url not found" });
        }

        // 3. Cache in Redis for 24 hours (86,400 seconds)
        try {
            await redis.set(cacheKey, record.originalUrl, "EX", 86400);
            console.log(`💾 [CACHE MISS] Fetched /${shortId} from DB and cached in Redis`);
        } catch (error) {
            console.warn("⚠️ Redis write failed:", error);
        }

        // 4. Buffer click in Redis RAM and redirect
        recordClick(shortId);

        return res.redirect(record.originalUrl);

    } catch (error) {
        console.error("Error while redirecting URL:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getAllLinks = async (req: Request, res: Response) => {
    try {
        const { user } = req;
        const page = Math.max(1, Number(req.query.page) || 1)
        const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
        const startIdx: number = (page - 1) * limit;

        if (!user) {
            return res.status(401).json({ message: "Unauthorized. User not authenticated." });
        }

        const [links, total] = await Promise.all([
            prisma.url.findMany({
                where: { userId: user.id },
                orderBy: { createdAt: "desc" },
                skip: startIdx,
                take: limit,
            }),
            prisma.url.count({
                where: { userId: user.id },
            }),
        ])

        const totalPages = Math.ceil(total / limit);
        return res.status(200).json({
            links,
            pagination: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });

    } catch (error: unknown) {
        console.error("Error fetching all the links:", error);

        return res.status(500).json({
            message: "Internal Server error",
        });
    }
}

export const deleteLink = async (req: Request, res: Response) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized. User not authenticated."
            });
        }

        const linkId = Number(req.params.id);

        if (Number.isNaN(linkId)) {
            return res.status(400).json({
                message: "Invalid link ID"
            });
        }

        // 1. Find the link to verify ownership and grab its shortId
        const link = await prisma.url.findFirst({
            where: {
                id: linkId,
                userId: user.id
            },
            select: { shortId: true }
        });

        if (!link) {
            return res.status(404).json({
                message: "Link not found or you do not have permission to delete it"
            });
        }

        // 2. Delete from PostgreSQL
        await prisma.url.delete({
            where: { id: linkId }
        });

        // 3. Invalidate Redis Cache (Kill the Zombie!) & remove pending clicks
        try {
            await redis.del(`url:${link.shortId}`);
            await redis.hdel("clicks:buffer", link.shortId);
            console.log(`🗑️ [CACHE INVALIDATED] Removed url:${link.shortId} from Redis`);
        } catch (cacheErr) {
            console.warn("⚠️ Failed to delete key from Redis:", cacheErr);
        }

        return res.status(200).json({
            message: "Link deleted successfully"
        });

    } catch (error: unknown) {
        console.error("Error deleting link:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};